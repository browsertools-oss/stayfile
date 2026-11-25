import { describe, test, expect } from 'vitest';
import { readJpegMeta, stripJpeg, readTiff } from '../src/lib/exif';

const u16le = (n: number) => [n & 0xff, (n >> 8) & 0xff];
const u32le = (n: number) => [n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >> 24) & 0xff];
const u16be = (n: number) => [(n >> 8) & 0xff, n & 0xff];

function ascii(s: string): number[] {
  return Array.from(s, (c) => c.charCodeAt(0)).concat(0);
}

function pad4(v: number[]): number[] {
  const out = v.slice();
  while (out.length < 4) out.push(0);
  return out;
}

function entry(tag: number, type: number, count: number, value: number[]): number[] {
  return [...u16le(tag), ...u16le(type), ...u32le(count), ...pad4(value)];
}

/** A little-endian TIFF block: Make, Model, Orientation 6, DateTimeOriginal and GPS. */
function makeTiff(): number[] {
  const make = ascii('TestCam');
  const date = ascii('2026:11:20 10:30:00');

  const IFD0_AT = 8;
  const IFD0_SIZE = 2 + 5 * 12 + 4;
  const EXIF_AT = IFD0_AT + IFD0_SIZE;
  const EXIF_SIZE = 2 + 1 * 12 + 4;
  const GPS_AT = EXIF_AT + EXIF_SIZE;
  const GPS_SIZE = 2 + 4 * 12 + 4;
  const DATA_AT = GPS_AT + GPS_SIZE;

  const makeAt = DATA_AT;
  const dateAt = makeAt + make.length;
  const latAt = dateAt + date.length;
  const lonAt = latAt + 24;

  const ifd0 = [
    ...u16le(5),
    ...entry(0x010f, 2, make.length, u32le(makeAt)),
    ...entry(0x0110, 2, 3, [0x54, 0x31, 0x00]), // "T1\0"
    ...entry(0x0112, 3, 1, u16le(6)),
    ...entry(0x8769, 4, 1, u32le(EXIF_AT)),
    ...entry(0x8825, 4, 1, u32le(GPS_AT)),
    ...u32le(0),
  ];
  const exif = [...u16le(1), ...entry(0x9003, 2, date.length, u32le(dateAt)), ...u32le(0)];
  const gps = [
    ...u16le(4),
    ...entry(0x0001, 2, 2, [0x4e, 0x00]), // "N\0"
    ...entry(0x0002, 5, 3, u32le(latAt)),
    ...entry(0x0003, 2, 2, [0x57, 0x00]), // "W\0"
    ...entry(0x0004, 5, 3, u32le(lonAt)),
    ...u32le(0),
  ];
  const lat = [...u32le(37), ...u32le(1), ...u32le(46), ...u32le(1), ...u32le(30), ...u32le(1)];
  const lon = [...u32le(122), ...u32le(1), ...u32le(25), ...u32le(1), ...u32le(10), ...u32le(1)];

  return [0x49, 0x49, ...u16le(42), ...u32le(IFD0_AT), ...ifd0, ...exif, ...gps, ...make, ...date, ...lat, ...lon];
}

function seg(marker: number, payload: number[]): number[] {
  return [0xff, marker, ...u16be(payload.length + 2), ...payload];
}

function makeJpeg(): Uint8Array {
  const app0 = seg(0xe0, [0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00]);
  const exif = seg(0xe1, [0x45, 0x78, 0x69, 0x66, 0x00, 0x00, ...makeTiff()]);
  const xmp = seg(0xe1, [...ascii('http://ns.adobe.com/xap/1.0/'), ...ascii('<x:xmpmeta/>')]);
  const iptc = seg(0xed, [0x00, 0x00]);
  const icc = seg(0xe2, [...ascii('ICC_PROFILE'), 1, 1, 0, 0]);
  const com = seg(0xfe, ascii('a comment'));
  const dqt = seg(0xdb, [0x00, 0x00]);
  const sos = [0xff, 0xda, ...u16be(8), 0x01, 0x01, 0x00, 0x00, 0x3f, 0x00];
  const scan = [0x12, 0x34, 0x56, 0x78];
  return new Uint8Array([
    0xff, 0xd8,
    ...app0, ...exif, ...xmp, ...iptc, ...icc, ...com, ...dqt,
    ...sos, ...scan,
    0xff, 0xd9,
  ]);
}

function latin1(b: Uint8Array): string {
  let s = '';
  for (const c of b) s += String.fromCharCode(c);
  return s;
}

function sosOffset(b: Uint8Array): number {
  let i = 2;
  while (i + 1 < b.length) {
    if (b[i] !== 0xff) return -1;
    let j = i + 1;
    while (j < b.length && b[j] === 0xff) j++;
    const m = b[j];
    if (m === 0xda) return i;
    if ((m >= 0xd0 && m <= 0xd7) || m === 0x01) {
      i = j + 1;
      continue;
    }
    if (j + 2 >= b.length) return -1;
    i = j + 1 + (b[j + 1] * 256 + b[j + 2]);
  }
  return -1;
}

function hasMarker(b: Uint8Array, marker: number): boolean {
  let i = 2;
  while (i + 1 < b.length) {
    if (b[i] !== 0xff) return false;
    let j = i + 1;
    while (j < b.length && b[j] === 0xff) j++;
    const m = b[j];
    if (m === marker) return true;
    if (m === 0xda) return false;
    if ((m >= 0xd0 && m <= 0xd7) || m === 0x01) {
      i = j + 1;
      continue;
    }
    if (j + 2 >= b.length) return false;
    i = j + 1 + (b[j + 1] * 256 + b[j + 2]);
  }
  return false;
}

describe('readTiff', () => {
  test('reads make, model, date and GPS from a bare TIFF block', () => {
    const t = readTiff(new Uint8Array(makeTiff()), 0);
    expect(t.make).toBe('TestCam');
    expect(t.model).toBe('T1');
    expect(t.taken).toBe('2026:11:20 10:30:00');
    expect(t.orientation).toBe(6);
    expect(t.gps).toEqual({ lat: 37.775, lon: -122.419444 });
  });
});

describe('readJpegMeta', () => {
  test('reads camera, date and location and names every block it finds', () => {
    const meta = readJpegMeta(makeJpeg());
    expect(meta.make).toBe('TestCam');
    expect(meta.model).toBe('T1');
    expect(meta.taken).toBe('2026:11:20 10:30:00');
    expect(meta.orientation).toBe(6);
    expect(meta.gps).toEqual({ lat: 37.775, lon: -122.419444 });
    expect(meta.found).toContain('EXIF (camera, date, location)');
    expect(meta.found).toContain('XMP (editing and location data)');
    expect(meta.found).toContain('IPTC (captions, author)');
    expect(meta.found).toContain('Comment');
    expect(meta.found).toContain('Color profile (kept)');
  });
});

describe('stripJpeg', () => {
  test('removes the data blocks but keeps the image bytes', () => {
    const input = makeJpeg();
    const { bytes, removed } = stripJpeg(input);
    const text = latin1(bytes);
    expect(text.includes('TestCam')).toBe(false);
    expect(text.includes('a comment')).toBe(false);
    expect(text.includes('http://ns.adobe.com')).toBe(false);
    expect(removed).toContain('EXIF (camera, date, location)');
    expect(removed).toContain('XMP (editing and location data)');
    expect(removed).toContain('IPTC (captions, author)');
    expect(removed).toContain('Comment');
    expect(removed).not.toContain('Color profile (kept)');

    const after = readJpegMeta(bytes);
    expect(after.gps).toBeUndefined();
    expect(after.make).toBeUndefined();
    expect(after.orientation).toBe(6);
    expect(after.found).toContain('Color profile (kept)');

    expect(Array.from(bytes.slice(sosOffset(bytes)))).toEqual(Array.from(input.slice(sosOffset(input))));
  });

  test('keeps no APP1 at all when the rotation tag is not kept', () => {
    const { bytes } = stripJpeg(makeJpeg(), false);
    expect(hasMarker(bytes, 0xe1)).toBe(false);
    expect(readJpegMeta(bytes).orientation).toBeUndefined();
  });

  test('broken input never throws', () => {
    const full = makeJpeg();
    const half = full.slice(0, Math.floor(full.length / 2));
    expect(() => readJpegMeta(half)).not.toThrow();
    expect(() => stripJpeg(half)).not.toThrow();
    const random = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(readJpegMeta(random).found).toEqual([]);
    expect(() => stripJpeg(random)).not.toThrow();
    expect(() => readJpegMeta(new Uint8Array(0))).not.toThrow();
    expect(() => stripJpeg(new Uint8Array(0))).not.toThrow();
  });
});
