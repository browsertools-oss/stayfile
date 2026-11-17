import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { GUIDES, PAGES } from '../src/site';

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

      test('internal hrefs point at existing pages', () => {
        const pageSlugs = new Set(PAGES.map((p) => p.slug));
        const guideSlugs = new Set(GUIDES.map((g) => g.slug));
        // Code samples in <pre> are illustrative (link tags, example URLs), not links to pages.
        const markup = src.replace(/<pre[\s\S]*?<\/pre>/g, ' ');
        const hrefs = [...markup.matchAll(/href="(\/[^"#?]*)[^"]*"/g)].map((m) => m[1]);
        for (const href of hrefs) {
          if (href === '/' || href === '/guides/') continue; // home and guides index
          if (href.startsWith('/guides/')) {
            const g = href.replace(/^\/guides\//, '').replace(/\/$/, '');
            expect(guideSlugs.has(g), `${g.slug}: href "${href}" is not a guide`).toBe(true);
            continue;
          }
          const slug = href.replace(/^\//, '').replace(/\/$/, '').split('/')[0];
          expect(pageSlugs.has(slug), `${g.slug}: href "${href}" is not a page slug`).toBe(true);
        }
      });
    });
  }

  test('every /guides/<slug> directory is a GUIDES entry', () => {
    if (!existsSync(GUIDES_DIR)) return;
    const guideSlugs = new Set(GUIDES.map((g) => g.slug));
    for (const entry of readdirSync(GUIDES_DIR, { withFileTypes: true })) {
      if (entry.isDirectory()) expect(guideSlugs.has(entry.name), `guide folder "${entry.name}" has no GUIDES entry`).toBe(true);
    }
  });
});
