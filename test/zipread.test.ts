import { describe, test, expect } from 'vitest';
import { zipSync, unzipSync } from 'fflate';
import { bytesSource, listZip, readEntry, zip64Extra, zipWriter } from '../src/lib/zipread';

const enc = new TextEncoder();
const dec = new TextDecoder();

function sample(comment?: string): Uint8Array {
  return zipSync(
    {
      'activities.csv': [enc.encode('Activity ID,Activity Name\n1,Morning Run\n'), { level: 0 }],
      'activities/1.fit.gz': [new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]), { level: 6 }],
      'activities/': [new Uint8Array(0), { level: 0 }],
    },
    comment ? { comment } : undefined,
  );
}

const put64 = (b: Uint8Array, p: number, v: number) => {
  let lo = v % 2 ** 32;
  let hi = Math.floor(v / 2 ** 32);
  for (let i = 0; i < 4; i++) {
    b[p + i] = lo & 0xff;
    lo = Math.floor(lo / 256);
    b[p + 4 + i] = hi & 0xff;
    hi = Math.floor(hi / 256);
  }
};

describe('listZip and readEntry', () => {
  test('lists the files and reads stored and deflated entries', async () => {
    const src = bytesSource(sample());
    const entries = await listZip(src);
    expect(entries.map((e) => e.name)).toEqual(['activities.csv', 'activities/1.fit.gz']);

    const csv = entries.find((e) => e.name === 'activities.csv')!;
    expect(csv.method).toBe(0);
    expect(csv.size).toBe(enc.encode('Activity ID,Activity Name\n1,Morning Run\n').length);
    expect(dec.decode(await readEntry(src, csv))).toBe('Activity ID,Activity Name\n1,Morning Run\n');

    const fit = entries.find((e) => e.name === 'activities/1.fit.gz')!;
    expect(fit.size).toBe(8);
    expect(Array.from(await readEntry(src, fit))).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  test('a zip with a 100-byte comment still lists', async () => {
    const entries = await listZip(bytesSource(sample('x'.repeat(100))));
    expect(entries.map((e) => e.name)).toEqual(['activities.csv', 'activities/1.fit.gz']);
  });

  test('random bytes are not a zip', async () => {
    const b = new Uint8Array(500);
    for (let i = 0; i < b.length; i++) b[i] = (i * 53 + 7) % 256;
    await expect(listZip(bytesSource(b))).rejects.toThrow('This is not a zip file.');
  });
});

describe('zip64Extra', () => {
  const extra = new Uint8Array(28);
  extra[0] = 0x01;
  extra[1] = 0x00;
  extra[2] = 24;
  extra[3] = 0;
  put64(extra, 4, 10);
  put64(extra, 12, 4294967298);
  put64(extra, 20, 300);

  test('returns the three values in order', () => {
    expect(zip64Extra(extra, { size: true, comp: true, offset: true })).toEqual({
      size: 10,
      comp: 4294967298,
      offset: 300,
    });
  });

  test('with only offset needed the first value is the offset', () => {
    expect(zip64Extra(extra, { size: false, comp: false, offset: true })).toEqual({ offset: 10 });
  });
});

describe('zipWriter', () => {
  test('makes a zip and renames a duplicate name', async () => {
    const w = zipWriter();
    w.add('a.gpx', enc.encode('one'));
    w.add('a.gpx', enc.encode('two'));
    expect(w.count()).toBe(2);
    const blob = w.finish();
    expect(blob.type).toBe('application/zip');
    const out = unzipSync(new Uint8Array(await blob.arrayBuffer()));
    expect(Object.keys(out).sort()).toEqual(['a (2).gpx', 'a.gpx']);
    expect(dec.decode(out['a.gpx'])).toBe('one');
    expect(dec.decode(out['a (2).gpx'])).toBe('two');
  });
});
