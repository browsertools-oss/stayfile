// Builds FIT bytes by hand so the tests need no fixture files.
export interface F {
  num: number;
  size: number;
  type: number;
}

export function definition(
  local: number,
  global: number,
  fields: F[],
  o: { be?: boolean; dev?: number[] } = {},
): number[] {
  const be = !!o.be;
  const out = [0x40 | (local & 0x0f) | (o.dev ? 0x20 : 0), 0, be ? 1 : 0];
  out.push(be ? (global >> 8) & 0xff : global & 0xff, be ? global & 0xff : (global >> 8) & 0xff);
  out.push(fields.length);
  for (const f of fields) out.push(f.num, f.size, f.type);
  if (o.dev) {
    out.push(o.dev.length);
    for (const size of o.dev) out.push(0, size, 0);
  }
  return out;
}

export function data(
  local: number,
  fields: F[],
  values: number[],
  o: { be?: boolean; dev?: number[] } = {},
): number[] {
  const be = !!o.be;
  const out = [local & 0x0f];
  fields.forEach((f, i) => {
    const buf = new Uint8Array(f.size);
    const dv = new DataView(buf.buffer);
    const v = values[i];
    const signed = f.type === 0x01 || f.type === 0x83 || f.type === 0x85;
    if (f.size === 1) {
      if (signed) dv.setInt8(0, v);
      else dv.setUint8(0, v);
    } else if (f.size === 2) {
      if (signed) dv.setInt16(0, v, !be);
      else dv.setUint16(0, v, !be);
    } else {
      if (signed) dv.setInt32(0, v, !be);
      else dv.setUint32(0, v, !be);
    }
    out.push(...buf);
  });
  for (const size of o.dev ?? []) for (let i = 0; i < size; i++) out.push(0);
  return out;
}

export function file(records: number[], headerSize = 14): Uint8Array {
  const out = new Uint8Array(headerSize + records.length + 2);
  out[0] = headerSize;
  const n = records.length;
  out[4] = n & 0xff;
  out[5] = (n >> 8) & 0xff;
  out[6] = (n >> 16) & 0xff;
  out[7] = (n >> 24) & 0xff;
  out.set([0x2e, 0x46, 0x49, 0x54], 8); // ".FIT"
  out.set(records, headerSize);
  return out;
}

export const t253: F = { num: 253, size: 4, type: 0x86 };
export const latF: F = { num: 0, size: 4, type: 0x85 };
export const lonF: F = { num: 1, size: 4, type: 0x85 };
export const eleF: F = { num: 2, size: 2, type: 0x84 };
export const hrF: F = { num: 3, size: 1, type: 0x02 };
export const recordFields = [t253, latF, lonF, eleF, hrF];

export const fitSeconds = Math.round(Date.UTC(2026, 10, 20, 10, 30) / 1000) - 631065600;
export const deg = (d: number) => Math.round((d * 2 ** 31) / 180);

/** Three records with position, altitude and heart rate. */
export function recordFile(): Uint8Array {
  return file([
    ...definition(0, 20, recordFields),
    ...data(0, recordFields, [fitSeconds, deg(37.775), deg(-122.419444), 2562, 140]),
    ...data(0, recordFields, [fitSeconds + 1, deg(37.776), deg(-122.4194), 2565, 141]),
    ...data(0, recordFields, [fitSeconds + 2, deg(37.777), deg(-122.4193), 2568, 142]),
  ]);
}
