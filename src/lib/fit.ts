// A small FIT reader: enough to turn a recorded activity into points.
// FIT is a compact binary format from Garmin. Every field is optional, so the
// parser returns whatever it can read and never throws.

export interface FitPoint {
  t?: number; // Unix time in milliseconds
  lat?: number;
  lon?: number;
  ele?: number;
  hr?: number;
  cad?: number;
  dist?: number;
  speed?: number;
  power?: number;
  temp?: number;
}

export interface FitActivity {
  points: FitPoint[];
  sport?: string;
}

const FIT_EPOCH = 631065600; // seconds from 1970-01-01 to 1989-12-31

/** A file whose bytes 8 to 11 are ".FIT". */
export function isFit(b: Uint8Array): boolean {
  return b.length >= 12 && b[8] === 0x2e && b[9] === 0x46 && b[10] === 0x49 && b[11] === 0x54;
}

interface FieldDef {
  num: number;
  size: number;
  type: number;
}

interface Def {
  global: number;
  arch: number; // 0 little endian, 1 big endian
  fields: FieldDef[];
  dev: number[]; // sizes of the developer fields
}

const SPORTS: Record<number, string> = {
  1: 'running',
  2: 'cycling',
  5: 'swimming',
  11: 'walking',
  17: 'hiking',
};

const round7 = (v: number) => Math.round(v * 1e7) / 1e7;

/** Read one value by size and base type. Returns undefined for invalid values. */
function readValue(b: Uint8Array, pos: number, size: number, type: number, le: boolean): number | undefined {
  if (size !== 1 && size !== 2 && size !== 4) return undefined;
  let signed: boolean;
  switch (type) {
    case 0x01: // sint8
    case 0x83: // sint16
    case 0x85: // sint32
      signed = true;
      break;
    case 0x00: // enum
    case 0x02: // uint8
    case 0x0a: // uint8z
    case 0x84: // uint16
    case 0x8b: // uint16z
    case 0x86: // uint32
    case 0x8c: // uint32z
      signed = false;
      break;
    default:
      return undefined;
  }
  const z = type === 0x0a || type === 0x8b || type === 0x8c;
  const dv = new DataView(b.buffer, b.byteOffset + pos, size);
  let v: number;
  if (size === 1) v = signed ? dv.getInt8(0) : dv.getUint8(0);
  else if (size === 2) v = signed ? dv.getInt16(0, le) : dv.getUint16(0, le);
  else v = signed ? dv.getInt32(0, le) : dv.getUint32(0, le);
  const invalid =
    size === 1 ? (signed ? 0x7f : 0xff) : size === 2 ? (signed ? 0x7fff : 0xffff) : signed ? 0x7fffffff : 0xffffffff;
  if (v === invalid || (z && v === 0)) return undefined;
  return v;
}

function makePoint(vals: Map<number, number>): FitPoint {
  const p: FitPoint = {};
  const lat = vals.get(0);
  const lon = vals.get(1);
  if (lat !== undefined) p.lat = round7((lat * 180) / 2 ** 31);
  if (lon !== undefined) p.lon = round7((lon * 180) / 2 ** 31);
  const ele = vals.get(78) ?? vals.get(2);
  if (ele !== undefined) p.ele = ele / 5 - 500;
  const hr = vals.get(3);
  if (hr !== undefined) p.hr = hr;
  const cad = vals.get(4);
  if (cad !== undefined) p.cad = cad;
  const dist = vals.get(5);
  if (dist !== undefined) p.dist = dist / 100;
  const speed = vals.get(73) ?? vals.get(6);
  if (speed !== undefined) p.speed = speed / 1000;
  const power = vals.get(7);
  if (power !== undefined) p.power = power;
  const temp = vals.get(13);
  if (temp !== undefined) p.temp = temp;
  return p;
}

function readData(
  b: Uint8Array,
  pos: number,
  def: Def,
): { next: number; vals: Map<number, number> } | undefined {
  const vals = new Map<number, number>();
  const le = def.arch === 0;
  for (const f of def.fields) {
    if (pos + f.size > b.length) return undefined;
    const v = readValue(b, pos, f.size, f.type, le);
    if (v !== undefined) vals.set(f.num, v);
    pos += f.size;
  }
  for (const size of def.dev) {
    if (pos + size > b.length) return undefined;
    pos += size;
  }
  return { next: pos, vals };
}

/** Parse one FIT file starting at base. Returns the offset after it, or undefined. */
function parseFile(b: Uint8Array, base: number, out: FitActivity, seenSport: { set: boolean }): number | undefined {
  if (base + 12 > b.length || !isFit(b.subarray(base))) return undefined;
  const headerSize = b[base];
  if (headerSize < 12 || base + headerSize > b.length) return undefined;
  const dataSize = b[base + 4] + b[base + 5] * 256 + b[base + 6] * 65536 + b[base + 7] * 16777216;
  let end = base + headerSize + dataSize;
  if (end > b.length) end = b.length;

  const defs = new Map<number, Def>();
  let last = 0; // last FIT timestamp in seconds
  let pos = base + headerSize;

  const noteSport = (def: Def, vals: Map<number, number>) => {
    if (seenSport.set) return;
    const v = def.global === 18 ? vals.get(5) : def.global === 12 ? vals.get(0) : undefined;
    if (v === undefined) return;
    const sport = SPORTS[v];
    if (sport) {
      out.sport = sport;
      seenSport.set = true;
    }
  };

  while (pos < end) {
    const h = b[pos++];
    if (h & 0x80) {
      // Compressed timestamp record.
      const local = (h >> 5) & 0x03;
      const offset = h & 0x1f;
      let ts = (last & ~0x1f) + offset;
      if (offset < (last & 0x1f)) ts += 0x20;
      last = ts;
      const def = defs.get(local);
      if (!def) break;
      const r = readData(b, pos, def);
      if (!r) break;
      pos = r.next;
      if (def.global === 20) {
        const p = makePoint(r.vals);
        p.t = (ts + FIT_EPOCH) * 1000;
        out.points.push(p);
      } else {
        noteSport(def, r.vals);
      }
    } else if (h & 0x40) {
      // Definition message.
      const local = h & 0x0f;
      const dev = (h & 0x20) !== 0;
      pos++; // reserved
      const arch = b[pos++];
      const global = arch === 1 ? (b[pos] << 8) | b[pos + 1] : b[pos] | (b[pos + 1] << 8);
      pos += 2;
      const n = b[pos++];
      const fields: FieldDef[] = [];
      for (let i = 0; i < n; i++) {
        fields.push({ num: b[pos++], size: b[pos++], type: b[pos++] });
      }
      const devSizes: number[] = [];
      if (dev) {
        const d = b[pos++];
        for (let i = 0; i < d; i++) {
          pos++; // field number
          devSizes.push(b[pos++]);
          pos++; // index
        }
      }
      defs.set(local, { global, arch, fields, dev: devSizes });
    } else {
      // Data message.
      const local = h & 0x0f;
      const def = defs.get(local);
      if (!def) break;
      const r = readData(b, pos, def);
      if (!r) break;
      pos = r.next;
      const ts = r.vals.get(253);
      if (ts !== undefined) last = ts;
      if (def.global === 20) {
        const p = makePoint(r.vals);
        if (ts !== undefined) p.t = (ts + FIT_EPOCH) * 1000;
        out.points.push(p);
      } else {
        noteSport(def, r.vals);
      }
    }
  }

  return base + headerSize + dataSize + 2;
}

/** Read a FIT file, including chained files. Never throws. */
export function readFit(b: Uint8Array): FitActivity {
  const out: FitActivity = { points: [] };
  const seenSport = { set: false };
  try {
    let base = 0;
    for (let guard = 0; guard < 1000; guard++) {
      if (base + 12 > b.length || !isFit(b.subarray(base))) break;
      const next = parseFile(b, base, out, seenSport);
      if (next === undefined || next <= base) break;
      base = next;
    }
  } catch {
    // Return the points read before the bad bytes.
  }
  return out;
}

/** Header row plus one row per point, with only the columns that hold data. */
export function fitToCsvRows(a: FitActivity): string[][] {
  const cols: { key: string; has: (p: FitPoint) => boolean; get: (p: FitPoint) => string }[] = [
    {
      key: 'time',
      has: (p) => p.t !== undefined,
      get: (p) => (p.t === undefined ? '' : new Date(p.t).toISOString().replace('.000Z', 'Z')),
    },
    { key: 'latitude', has: (p) => p.lat !== undefined, get: (p) => (p.lat === undefined ? '' : String(p.lat)) },
    { key: 'longitude', has: (p) => p.lon !== undefined, get: (p) => (p.lon === undefined ? '' : String(p.lon)) },
    { key: 'altitude_m', has: (p) => p.ele !== undefined, get: (p) => (p.ele === undefined ? '' : p.ele.toFixed(1)) },
    { key: 'heart_rate', has: (p) => p.hr !== undefined, get: (p) => (p.hr === undefined ? '' : String(p.hr)) },
    { key: 'cadence', has: (p) => p.cad !== undefined, get: (p) => (p.cad === undefined ? '' : String(p.cad)) },
    { key: 'distance_m', has: (p) => p.dist !== undefined, get: (p) => (p.dist === undefined ? '' : p.dist.toFixed(1)) },
    { key: 'speed_m_s', has: (p) => p.speed !== undefined, get: (p) => (p.speed === undefined ? '' : p.speed.toFixed(3)) },
    { key: 'power_w', has: (p) => p.power !== undefined, get: (p) => (p.power === undefined ? '' : String(p.power)) },
    {
      key: 'temperature_c',
      has: (p) => p.temp !== undefined,
      get: (p) => (p.temp === undefined ? '' : String(p.temp)),
    },
  ];
  const use = cols.filter((c) => a.points.some(c.has));
  return [use.map((c) => c.key), ...a.points.map((p) => use.map((c) => c.get(p)))];
}
