// Static wiring guards: the page builder must reference real pages, and the
// data tools must all carry a Download label in DataTool.astro. These tests
// exist because the same dead-key bug shipped twice (tool ids used where a
// page slug was expected).
import { describe, test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { PAGES } from '../src/site';

const slugs = new Set(PAGES.map((p) => p.slug));
const routeSrc = readFileSync('src/lib/route.ts', 'utf8');
const dataToolSrc = readFileSync('src/components/DataTool.astro', 'utf8');

const block = (name: string) => {
  const m = routeSrc.match(new RegExp(`const ${name}[^{]*\\{([\\s\\S]*?)\\n  \\};`));
  if (!m) throw new Error(`could not find ${name} in route.ts`);
  return m[1];
};

describe('route.ts next-step maps', () => {
  for (const name of ['pdfNext', 'dataNext']) {
    test(`${name} keys are page slugs`, () => {
      const keys = [...block(name).matchAll(/'([a-z0-9-]+)':/g)].map((x) => x[1]);
      expect(keys.length).toBeGreaterThan(0);
      for (const k of keys) expect(slugs.has(k), `${name} key "${k}" is not a page slug`).toBe(true);
    });
    test(`${name} targets are page slugs`, () => {
      const targets = [...block(name).matchAll(/slug: '([a-z0-9-]+)'/g)].map((x) => x[1]);
      expect(targets.length).toBeGreaterThan(0);
      for (const t of targets) expect(slugs.has(t), `${name} target "${t}" is not a page slug`).toBe(true);
    });
  }
  test('IMAGE_OUTPUT holds page slugs', () => {
    const m = routeSrc.match(/const IMAGE_OUTPUT = new Set\(\[([\s\S]*?)\]\)/);
    expect(m).not.toBeNull();
    const entries = [...m![1].matchAll(/'([a-z0-9-]+)'/g)].map((x) => x[1]);
    expect(entries.length).toBeGreaterThan(0);
    for (const e of entries) expect(slugs.has(e), `IMAGE_OUTPUT entry "${e}" is not a page slug`).toBe(true);
  });
});

describe('Chat exports page copy', () => {
  // The page spec asks each chat page for a more section of 150 to 300 words.
  for (const slug of ['whatsapp-chat-to-excel', 'whatsapp-chat-to-pdf']) {
    test(`${slug} more section is 150 to 300 words`, () => {
      const page = PAGES.find((p) => p.slug === slug)!;
      expect(page.more, `${slug} has no more section`).toBeTruthy();
      const words = page.more!.paras.join(' ').split(/\s+/).filter(Boolean);
      expect(words.length).toBeGreaterThanOrEqual(150);
      expect(words.length).toBeLessThanOrEqual(300);
    });
  }
});

describe('DataTool.astro', () => {
  test('every data-family page tool has a Download label', () => {
    // The calendar and contacts pages have their own components.
    const OWN_COMPONENT = new Set(['csv-to-ics', 'ics-to-csv', 'csv-to-vcf', 'vcf-to-csv', 'csv-split', 'csv-merge']);
    const dataTools = new Set(PAGES.filter((p) => p.group === 'Spreadsheets and data').map((p) => p.tool));
    expect(dataTools.size).toBeGreaterThan(0);
    for (const t of dataTools) {
      if (OWN_COMPONENT.has(t)) continue;
      expect(dataToolSrc.includes(`'${t}': 'Download`), `DataTool.astro has no Download label for tool "${t}"`).toBe(true);
    }
  });
});
