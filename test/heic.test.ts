import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { isHeic, decodeHeic, HEIF_VERSION, type LibHeif } from '../src/lib/heic';

async function lib(): Promise<LibHeif> {
  // Same file the site serves from /vendor/libheif/.
  const m = await import('libheif-js/libheif-wasm/libheif-bundle.mjs');
  const mod = m.default();
  await mod.ready;
  return mod;
}

describe('heic', () => {
  it('spots HEIC files by type or name', () => {
    expect(isHeic({ name: 'IMG_0001.HEIC', type: '' })).toBe(true);
    expect(isHeic({ name: 'photo.heif', type: '' })).toBe(true);
    expect(isHeic({ name: 'photo', type: 'image/heic' })).toBe(true);
    expect(isHeic({ name: 'photo.jpg', type: 'image/jpeg' })).toBe(false);
    expect(isHeic({ name: 'heic-notes.txt', type: 'text/plain' })).toBe(false);
  });

  it('serves the installed libheif-js version', () => {
    const pkg = JSON.parse(readFileSync('node_modules/libheif-js/package.json', 'utf8'));
    expect(HEIF_VERSION).toBe(pkg.version);
  });

  it('decodes a real HEIC to RGBA pixels', async () => {
    const px = await decodeHeic(await lib(), new Uint8Array(readFileSync('test/fixtures/sample.heic')));
    expect(px.width).toBe(64);
    expect(px.height).toBe(48);
    expect(px.data.length).toBe(64 * 48 * 4);
    // Fixture is a gradient: red rises left to right, green top to bottom, blue ~128, fully opaque.
    const at = (x: number, y: number) => [...px.data.slice((y * 64 + x) * 4, (y * 64 + x) * 4 + 4)];
    const [r0, , b0, a0] = at(2, 2), [r1, g1] = at(60, 44);
    expect(a0).toBe(255);
    expect(r1 - r0).toBeGreaterThan(150);
    expect(g1).toBeGreaterThan(150);
    expect(Math.abs(b0 - 128)).toBeLessThan(20);
  });

  it('rejects files that are not HEIC', async () => {
    await expect(decodeHeic(await lib(), new TextEncoder().encode('not an image'))).rejects.toThrow(/could not be read/);
  });
});
