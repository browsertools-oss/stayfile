import { describe, expect, it } from 'vitest';
import { packIco, ICO_SIZES } from '../src/lib/ico';

describe('packIco', () => {
  const png16 = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 1, 2, 3]);
  const png32 = new Uint8Array([9, 8, 7, 6, 5]);

  it('writes a valid icon header and directory', () => {
    const ico = packIco([
      { width: 16, height: 16, bytes: png16 },
      { width: 32, height: 32, bytes: png32 },
    ]);
    const view = new DataView(ico.buffer);
    expect(view.getUint16(0, true)).toBe(0); // reserved
    expect(view.getUint16(2, true)).toBe(1); // icon
    expect(view.getUint16(4, true)).toBe(2); // two images
    // First entry: 16x16, PNG payload right after the directory.
    expect(ico[6]).toBe(16);
    expect(ico[7]).toBe(16);
    expect(ico[8]).toBe(0);
    expect(view.getUint16(10, true)).toBe(1);
    expect(view.getUint16(12, true)).toBe(32);
    expect(view.getUint32(14, true)).toBe(png16.length);
    expect(view.getUint32(18, true)).toBe(6 + 16 * 2);
    // Second entry payload starts after the first image.
    expect(view.getUint32(18 + 16, true)).toBe(6 + 16 * 2 + png16.length);
    expect([...ico.slice(6 + 16 * 2, 6 + 16 * 2 + png16.length)]).toEqual([...png16]);
    expect([...ico.slice(-png32.length)]).toEqual([...png32]);
    expect(ico.length).toBe(6 + 16 * 2 + png16.length + png32.length);
  });

  it('stores 256 as 0 in the directory byte', () => {
    const ico = packIco([{ width: 256, height: 256, bytes: png16 }]);
    expect(ico[6]).toBe(0);
    expect(ico[7]).toBe(0);
  });

  it('offers 16, 32 and 48 px as the default set', () => {
    expect([...ICO_SIZES]).toEqual([16, 32, 48]);
  });

  it('refuses broken input', () => {
    expect(() => packIco([])).toThrow('at least one');
    expect(() => packIco([{ width: 0, height: 16, bytes: png16 }])).toThrow('between 1 and 256');
    expect(() => packIco([{ width: 257, height: 16, bytes: png16 }])).toThrow('between 1 and 256');
    expect(() => packIco([{ width: 16.5, height: 16, bytes: png16 }])).toThrow('whole pixel');
  });
});
