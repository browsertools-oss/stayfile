import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { GUIDES } from '../src/site';

const GUIDES_DIR = join(process.cwd(), 'src/pages/guides');

// Strip frontmatter and tags, then count words of the guide's own text.
function bodyOf(src: string): string {
  return src
    .replace(/^---[\s\S]*?---/, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

describe('guides', () => {
  test('every GUIDES entry has a finished page on disk', () => {
    for (const g of GUIDES) {
      expect(existsSync(join(GUIDES_DIR, g.slug, 'index.astro')), g.slug).toBe(true);
    }
  });

  for (const g of GUIDES) {
    describe(g.slug, () => {
      const src = existsSync(join(GUIDES_DIR, g.slug, 'index.astro'))
        ? readFileSync(join(GUIDES_DIR, g.slug, 'index.astro'), 'utf8')
        : '';

      test('title is 60 characters or fewer', () => {
        expect(g.title.length).toBeLessThanOrEqual(60);
      });

      test('body has at least 700 words', () => {
        const words = bodyOf(src).split(' ').filter(Boolean);
        expect(words.length).toBeGreaterThanOrEqual(700);
      });

      test('exactly one h1', () => {
        expect((src.match(/<h1[\s>]/g) || []).length).toBe(1);
      });
    });
  }
});
