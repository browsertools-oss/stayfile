import { describe, expect, it } from 'vitest';
import { shapes } from '../src/lib/silhouettes';
import { PAGES } from '../src/site';

describe('silhouettes', () => {
  it('every tool page has a shape of its own', () => {
    for (const p of PAGES) {
      expect(shapes[p.slug], `missing silhouette for ${p.slug}`).toBeDefined();
      expect(shapes[p.slug].length).toBeGreaterThan(0);
    }
  });

  it('no shape draws an empty path', () => {
    for (const [slug, layers] of Object.entries(shapes)) {
      for (const layer of layers) {
        for (const d of [...layer.fill, ...layer.cut, ...(layer.ink ?? [])]) {
          expect(d.trim().length, `empty path in ${slug}`).toBeGreaterThan(0);
        }
        for (const t of layer.tilt ?? []) expect(t.d.trim().length, `empty tilt path in ${slug}`).toBeGreaterThan(0);
      }
    }
  });
});
