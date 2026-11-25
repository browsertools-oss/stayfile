/**
 * Read and remove photo metadata from JPEG files, in the browser.
 * Plain TypeScript: the image data is never decoded or re-encoded.
 */

export interface PhotoMeta {
  make?: string;
  model?: string;
  software?: string;
  taken?: string;
  orientation?: number;
  gps?: { lat: number; lon: number };
  found: string[];
}

type TiffMeta = Omit<PhotoMeta, 'found'>;

const EXIF_SIG = 'Exif\u0000\u0000';
const XMP_SIG = 'http://ns.adobe.com/xap/1.0/\u0000';
const ICC_SIG = 'ICC_PROFILE';

function startsWithAscii(b: Uint8Array, off: number, s: string): boolean {
  if (off < 0 || off + s.length > b.length) return false;
  for (let i = 0; i < s.length; i++) if (b[off + i] !== s.charCodeAt(i)) return false;
  return true;
}

function u16(b: Uint8Array, o: number, le: boolean): number {
  if (o < 0 || o + 2 > b.length) return -1;
  return le ? b[o] | (b[o + 1] << 8) : (b[o] << 8) | b[o + 1];
}

function u32(b: Uint8Array, o: number, le: boolean): number {
  if (o < 0 || o + 4 > b.length) return -1;
  if (le) return (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0;
  return ((b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3]) >>> 0;
}

function ascii(b: Uint8Array, off: number, len: number): string {
  let s = '';
  for (let i = 0; i < len; i++) {
    const o = off + i;
    if (o >= b.length) break;
    const c = b[o];
    if (c === 0) break;
    s += String.fromCharCode(c);
  }
  return s.trim();
}

function rational(b: Uint8Array, off: number, le: boolean): number {
  const n = u32(b, off, le);
  const d = u32(b, off + 4, le);
  if (n < 0 || d <= 0) return 0;
  return n / d;
}

interface Field {
  off: number;
  len: number;
}

/** Where an IFD entry's value lives inside the file. */
function field(b: Uint8Array, start: number, entry: number, le: boolean, unit: number): Field | null {
  const count = u32(b, entry + 4, le);
  if (count < 0) return null;
  const size = count * unit;
  if (size <= 4) {
    if (entry + 8 + size > b.length) return null;
    return { off: entry + 8, len: size };
  }
  const rel = u32(b, entry + 8, le);
  if (rel < 0) return null;
  const off = start + rel;
  if (off < 0 || off + size > b.length) return null;
  return { off, len: size };
}

/** Byte offsets of each 12-byte entry in an IFD, within bounds. */
function entries(b: Uint8Array, start: number, ifdRel: number, le: boolean): number[] {
  const ifd = start + ifdRel;
  const n = u16(b, ifd, le);
  if (n < 0) return [];
  const max = Math.min(n, Math.floor((b.length - ifd - 2) / 12));
  const out: number[] = [];
  for (let k = 0; k < max; k++) out.push(ifd + 2 + k * 12);
  return out;
}

function asciiTag(b: Uint8Array, start: number, e: number, le: boolean): string {
  const f = field(b, start, e, le, 1);
  if (!f) return '';
  return ascii(b, f.off, f.len);
}

function rationals(b: Uint8Array, start: number, e: number, le: boolean): number[] | null {
  const f = field(b, start, e, le, 8);
  if (!f) return null;
  const out: number[] = [];
  for (let i = 0; i + 8 <= f.len; i += 8) out.push(rational(b, f.off + i, le));
  return out;
}

const round6 = (v: number) => Math.round(v * 1e6) / 1e6;

function readGps(b: Uint8Array, start: number, ifdRel: number, le: boolean, meta: TiffMeta): void {
  let latRef = '';
  let lonRef = '';
  let lat: number[] | null = null;
  let lon: number[] | null = null;
  for (const e of entries(b, start, ifdRel, le)) {
    const tag = u16(b, e, le);
    const type = u16(b, e + 2, le);
    if (tag === 1 && type === 2) latRef = asciiTag(b, start, e, le);
    else if (tag === 3 && type === 2) lonRef = asciiTag(b, start, e, le);
    else if (tag === 2 && type === 5) lat = rationals(b, start, e, le);
    else if (tag === 4 && type === 5) lon = rationals(b, start, e, le);
  }
  if (!lat || !lon || lat.length < 3 || lon.length < 3) return;
  let la = lat[0] + lat[1] / 60 + lat[2] / 3600;
  let lo = lon[0] + lon[1] / 60 + lon[2] / 3600;
  if (latRef.toUpperCase() === 'S') la = -la;
  if (lonRef.toUpperCase() === 'W') lo = -lo;
  if (la === 0 && lo === 0) return;
  meta.gps = { lat: round6(la), lon: round6(lo) };
}

/** Parse a TIFF block (the body of an EXIF APP1, or a PNG eXIf chunk). */
export function readTiff(b: Uint8Array, start: number): TiffMeta {
  const meta: TiffMeta = {};
  try {
    if (start < 0 || start + 8 > b.length) return meta;
    let le: boolean;
    if (b[start] === 0x49 && b[start + 1] === 0x49) le = true;
    else if (b[start] === 0x4d && b[start + 1] === 0x4d) le = false;
    else return meta;
    if (u16(b, start + 2, le) !== 42) return meta;
    const ifd0 = u32(b, start + 4, le);
    if (ifd0 < 0) return meta;

    let dateTime = '';
    let exifIfd = -1;
    let gpsIfd = -1;

    for (const e of entries(b, start, ifd0, le)) {
      const tag = u16(b, e, le);
      const type = u16(b, e + 2, le);
      if (tag === 0x010f && type === 2) meta.make = asciiTag(b, start, e, le);
      else if (tag === 0x0110 && type === 2) meta.model = asciiTag(b, start, e, le);
      else if (tag === 0x0131 && type === 2) meta.software = asciiTag(b, start, e, le);
      else if (tag === 0x0132 && type === 2) dateTime = asciiTag(b, start, e, le);
      else if (tag === 0x0112 && type === 3) {
        const f = field(b, start, e, le, 2);
        if (f && f.len >= 2) meta.orientation = u16(b, f.off, le);
      } else if (tag === 0x8769 && type === 4) {
        const v = u32(b, e + 8, le);
        if (v >= 0) exifIfd = v;
      } else if (tag === 0x8825 && type === 4) {
        const v = u32(b, e + 8, le);
        if (v >= 0) gpsIfd = v;
      }
    }

    if (exifIfd >= 0 && start + exifIfd + 2 <= b.length) {
      for (const e of entries(b, start, exifIfd, le)) {
        const tag = u16(b, e, le);
        const type = u16(b, e + 2, le);
        if (tag === 0x9003 && type === 2) meta.taken = asciiTag(b, start, e, le);
      }
    }
    if (!meta.taken && dateTime) meta.taken = dateTime;
    if (gpsIfd >= 0 && start + gpsIfd + 2 <= b.length) readGps(b, start, gpsIfd, le, meta);
  } catch {
    // Return whatever was read before the bad byte.
  }
  return meta;
}

interface Segment {
  marker: number;
  start: number;
  payload: number;
  end: number;
}

/** Walk the marker segments before the image data. */
function segments(b: Uint8Array): { list: Segment[]; sos: number } {
  const list: Segment[] = [];
  let sos = -1;
  if (b.length < 2 || b[0] !== 0xff || b[1] !== 0xd8) return { list, sos };
  let i = 2;
  while (i + 1 < b.length) {
    if (b[i] !== 0xff) break;
    let j = i + 1;
    while (j < b.length && b[j] === 0xff) j++;
    if (j >= b.length) break;
    const marker = b[j];
    if (marker === 0xda) {
      sos = i;
      break;
    }
    if ((marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) {
      list.push({ marker, start: i, payload: j + 1, end: j + 1 });
      i = j + 1;
      continue;
    }
    if (j + 2 >= b.length) break;
    const len = b[j + 1] * 256 + b[j + 2];
    if (len < 2) break;
    const end = j + 1 + len;
    if (end > b.length) break;
    list.push({ marker, start: i, payload: j + 3, end });
    i = end;
  }
  return { list, sos };
}

/** The name shown to a visitor for a block this code knows. */
function recognised(b: Uint8Array, s: Segment): string {
  if (s.marker === 0xe1) {
    if (startsWithAscii(b, s.payload, EXIF_SIG)) return 'EXIF (camera, date, location)';
    if (startsWithAscii(b, s.payload, XMP_SIG)) return 'XMP (editing and location data)';
  }
  if (s.marker === 0xed) return 'IPTC (captions, author)';
  if (s.marker === 0xfe) return 'Comment';
  if (s.marker === 0xe2 && startsWithAscii(b, s.payload, ICC_SIG)) return 'Color profile (kept)';
  return '';
}

function addFound(list: string[], name: string): void {
  if (name && !list.includes(name)) list.push(name);
}

/** Read the metadata blocks of a JPEG without decoding the pixels. */
export function readJpegMeta(b: Uint8Array): PhotoMeta {
  const meta: PhotoMeta = { found: [] };
  try {
    const { list } = segments(b);
    for (const s of list) {
      const name = recognised(b, s);
      if (name) addFound(meta.found, name);
      if (s.marker === 0xe1 && startsWithAscii(b, s.payload, EXIF_SIG)) {
        const t = readTiff(b, s.payload + EXIF_SIG.length);
        if (t.make) meta.make = t.make;
        if (t.model) meta.model = t.model;
        if (t.software) meta.software = t.software;
        if (t.taken) meta.taken = t.taken;
        if (t.orientation !== undefined) meta.orientation = t.orientation;
        if (t.gps) meta.gps = t.gps;
      }
    }
  } catch {
    // Return whatever was read before the bad byte.
  }
  return meta;
}

/** A 36-byte APP1 holding only the orientation tag, so the photo stays upright. */
function orientationApp1(n: number): number[] {
  return [
    0xff, 0xe1, 0x00, 0x22,
    0x45, 0x78, 0x69, 0x66, 0x00, 0x00,
    0x4d, 0x4d, 0x00, 0x2a, 0x00, 0x00, 0x00, 0x08,
    0x00, 0x01,
    0x01, 0x12, 0x00, 0x03, 0x00, 0x00, 0x00, 0x01, 0x00, n & 0xff, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
  ];
}

/**
 * Copy a JPEG without its metadata blocks. The image data from the start of
 * scan onward is copied byte for byte, so the picture is unchanged.
 */
export function stripJpeg(b: Uint8Array, keepOrientation = true): { bytes: Uint8Array; removed: string[] } {
  const removed: string[] = [];
  try {
    const { list, sos } = segments(b);
    if (!list.length && sos < 0) return { bytes: b, removed };

    const meta = readJpegMeta(b);
    const orientation = meta.orientation ?? 0;
    const keep: Segment[] = [];
    for (const s of list) {
      const drop =
        s.marker === 0xe1 ||
        (s.marker >= 0xe3 && s.marker <= 0xed) ||
        s.marker === 0xef ||
        s.marker === 0xfe;
      if (drop) {
        const name = recognised(b, s) || (s.marker >= 0xe0 && s.marker <= 0xef ? `APP${s.marker - 0xe0}` : '');
        addFound(removed, name);
      } else {
        keep.push(s);
      }
    }

    const out: number[] = [0xff, 0xd8];
    const app1 = keepOrientation && orientation >= 2 && orientation <= 8 ? orientationApp1(orientation) : null;
    const firstApp0 = keep.findIndex((s) => s.marker === 0xe0);
    if (app1 && firstApp0 < 0) out.push(...app1);
    for (let k = 0; k < keep.length; k++) {
      const s = keep[k];
      for (let q = s.start; q < s.end; q++) out.push(b[q]);
      if (app1 && k === firstApp0) out.push(...app1);
    }
    if (sos >= 0) for (let q = sos; q < b.length; q++) out.push(b[q]);
    return { bytes: new Uint8Array(out), removed };
  } catch {
    return { bytes: b, removed };
  }
}
