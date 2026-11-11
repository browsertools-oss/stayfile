// Headless browser check for the tool pages. Not part of the build.
// Serves dist/ on a scratch port, opens each page in chromium, uploads fixture
// files, runs the action and reports console errors and the result line.
// Usage: node scripts/browser-check.mjs [slug ...]   (no args = all checks)
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const scratch = join(root, '.scratch');
const fixtures = join(scratch, 'fixtures');
const dl = join(scratch, 'dl');

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.wasm': 'application/wasm', '.svg': 'image/svg+xml', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.gif': 'image/gif', '.ico': 'image/x-icon', '.xml': 'text/xml', '.txt': 'text/plain', '.woff2': 'font/woff2',
};

const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = join(dist, p);
    if (p.endsWith('/')) file = join(file, 'index.html');
    else if (!extname(p) && existsSync(file + '.html')) file = file + '.html';
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404); res.end('not found');
  }
});

await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
const base = `http://127.0.0.1:${port}`;

// ---- Fixtures -------------------------------------------------------------
await mkdir(fixtures, { recursive: true });
await mkdir(dl, { recursive: true });

const { PDFDocument, StandardFonts } = await import('@cantoo/pdf-lib');
const pdf = await PDFDocument.create();
const font = await pdf.embedFont(StandardFonts.Helvetica);
for (const line of ['Page one', 'Page two', 'Page three']) {
  const page = pdf.addPage([300, 400]);
  page.drawText(line, { x: 40, y: 340, size: 24, font });
}
await writeFile(join(fixtures, 'sample.pdf'), await pdf.save());

const XLSX = (await import('xlsx')).default ?? (await import('xlsx'));
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['name', 'zip'], ['Ada', '02134'], ['Bob', '07030']]), 'Orders');
XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['note'], ['second tab']]), 'Notes');
await writeFile(join(fixtures, 'sample.xlsx'), XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));

await writeFile(join(fixtures, 'sample.csv'), 'name,zip\nAda,02134\nBob,07030\n');
await writeFile(join(fixtures, 'sample.json'), JSON.stringify([{ name: 'Ada', zip: '02134' }, { name: 'Bob', zip: '07030' }]));
// 1x1 transparent GIF
await writeFile(join(fixtures, 'sample.gif'), Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));

// Raster images via a canvas in headless chromium.
const browser = await puppeteer.launch({
  executablePath: process.env.CHROMIUM || '/usr/bin/chromium',
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
{
  const page = await browser.newPage();
  await page.goto(await (async () => base)(), { waitUntil: 'domcontentloaded' }).catch(() => {});
  for (const [name, mime, quality] of [['sample.png', 'image/png'], ['sample.jpg', 'image/jpeg', 0.92], ['sample.webp', 'image/webp', 0.92], ['sample.avif', 'image/avif', 0.7]]) {
    const dataUrl = await page.evaluate(async (m, q) => {
      const c = document.createElement('canvas');
      c.width = 96; c.height = 72;
      const ctx = c.getContext('2d');
      const grad = ctx.createLinearGradient(0, 0, 96, 72);
      grad.addColorStop(0, '#2266aa'); grad.addColorStop(1, '#ee8833');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, 96, 72);
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(48, 36, 18, 0, 7); ctx.fill();
      return c.toDataURL(m, q);
    }, mime, quality);
    const b64 = dataUrl.split(',')[1];
    if (!b64 || b64.length < 100) { console.log(`fixture ${name}: encoder did not produce output, skipping it`); continue; }
    await writeFile(join(fixtures, name), Buffer.from(b64, 'base64'));
  }
  await page.close();
}

// ---- Checks ----------------------------------------------------------------
const F = (n) => join(fixtures, n);
const checks = [
  { slug: '/', name: 'home' },
  { slug: '/merge-pdf/', fixtures: [F('sample.pdf'), F('sample.pdf')], click: 'Merge PDFs', expect: 'Merged' },
  { slug: '/split-pdf/', fixtures: [F('sample.pdf')], ranges: '1, 3', click: 'Split PDF', expect: 'Made' },
  { slug: '/extract-pages-from-pdf/', fixtures: [F('sample.pdf')], ranges: '1-2', click: 'Extract pages', expect: 'Saved' },
  { slug: '/remove-pages-from-pdf/', fixtures: [F('sample.pdf')], ranges: '2', click: 'Remove pages', expect: 'Removed' },
  { slug: '/rotate-pdf/', fixtures: [F('sample.pdf')], click: 'Turn right', expect: 'Rotated' },
  { slug: '/pdf-to-jpg/', fixtures: [F('sample.pdf')], click: 'Convert to JPG', expect: 'Made' },
  { slug: '/pdf-to-png/', fixtures: [F('sample.pdf')], click: 'Convert to PNG', expect: 'Made' },
  { slug: '/png-to-pdf/', fixtures: [F('sample.png')], click: 'Make PDF', expect: 'Made' },
  { slug: '/jpg-to-pdf/', fixtures: [F('sample.jpg')], click: 'Make PDF', expect: 'Made' },
  { slug: '/webp-to-pdf/', fixtures: [F('sample.webp')], click: 'Make PDF', expect: 'Made' },
  { slug: '/excel-to-csv/', fixtures: [F('sample.xlsx')], click: 'Download', expect: '' },
  { slug: '/excel-to-json/', fixtures: [F('sample.xlsx')], click: 'Download', expect: '' },
  { slug: '/json-to-excel/', fixtures: [F('sample.json')], click: 'Download', expect: '' },
  { slug: '/csv-to-json/', fixtures: [F('sample.csv')], click: 'Download', expect: '' },
  { slug: '/json-to-csv/', fixtures: [F('sample.json')], click: 'Download', expect: '' },
  { slug: '/csv-to-excel/', fixtures: [F('sample.csv')], click: 'Download', expect: '' },
  { slug: '/excel-to-csv/', name: 'load-only repeat guard', skip: true },
  { slug: '/compress-image/', fixtures: [F('sample.jpg')], click: 'Save', expect: '' },
  { slug: '/resize-image/', fixtures: [F('sample.png')], click: 'Save', expect: '' },
  { slug: '/jpg-to-png/', fixtures: [F('sample.jpg')], click: 'Save', expect: '' },
  { slug: '/png-to-jpg/', fixtures: [F('sample.png')], click: 'Save', expect: '' },
  { slug: '/webp-to-png/', fixtures: [F('sample.webp')], click: 'Save', expect: '' },
  { slug: '/png-to-webp/', fixtures: [F('sample.png')], click: 'Save', expect: '' },
  { slug: '/jpg-to-webp/', fixtures: [F('sample.jpg')], click: 'Save', expect: '' },
  { slug: '/webp-to-jpg/', fixtures: [F('sample.webp')], click: 'Save', expect: '' },
  { slug: '/gif-to-png/', fixtures: [F('sample.gif')], click: 'Save', expect: '' },
  { slug: '/avif-to-jpg/', fixtures: [F('sample.avif')], click: 'Save', expect: '' },
  { slug: '/jpg-to-avif/', fixtures: [F('sample.jpg')], click: 'Save', expect: '' },
  { slug: '/heic-to-jpg/', name: 'heic-to-jpg (load only, no HEIC fixture)' },
  { slug: '/heic-to-png/', name: 'heic-to-png (load only, no HEIC fixture)' },
].filter((c) => !c.skip);

const only = process.argv.slice(2);
const results = [];
for (const check of checks) {
  if (only.length && !only.some((s) => check.slug.includes(s))) continue;
  const name = check.name ?? check.slug;
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  try {
    const client = await page.createCDPSession();
    await client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: dl }).catch(() => {});
    await page.goto(base + check.slug, { waitUntil: 'load', timeout: 30000 });
    await page.waitForSelector('#drop, .tool', { timeout: 10000 });
    if (check.fixtures) {
      const input = await page.$('#file');
      await input.uploadFile(...check.fixtures);
      if (check.ranges != null) {
        await page.waitForSelector('#ranges', { visible: true, timeout: 10000 });
        await page.$eval('#ranges', (el, v) => { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); }, check.ranges);
      }
      if (check.click) {
        const clicked = await page.evaluate((label) => {
          const btns = [...document.querySelectorAll('[data-run], #go')];
          const btn = btns.find((b) => b.textContent.includes(label)) ?? btns.find((b) => b.id === 'go');
          if (!btn) return false;
          btn.click();
          return true;
        }, check.click);
        if (!clicked) errors.push(`button "${check.click}" not found`);
        else {
          await page.waitForFunction(
            () => { const d = document.getElementById('done'), e = document.getElementById('err'); return (d && !d.hidden) || (e && !e.hidden); },
            { timeout: 60000 },
          ).catch(() => errors.push('timed out waiting for a result'));
        }
      }
      const outcome = await page.evaluate(() => {
        const d = document.getElementById('done'), e = document.getElementById('err');
        if (e && !e.hidden) return 'error: ' + e.textContent;
        if (d && !d.hidden) return 'done: ' + d.textContent.trim().slice(0, 120);
        return 'no result shown';
      });
      results.push({ name, ok: errors.length === 0 && !outcome.startsWith('error') && outcome !== 'no result shown', outcome, errors });
    } else {
      results.push({ name, ok: errors.length === 0, outcome: 'loaded', errors });
    }
  } catch (e) {
    results.push({ name, ok: false, outcome: 'exception: ' + (e.message ?? e).slice(0, 140), errors });
  }
  await page.close();
}
await browser.close();
server.close();

let failed = 0;
for (const r of results) {
  if (!r.ok) failed++;
  console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}  ->  ${r.outcome}${r.errors.length ? '  console: ' + r.errors.join(' | ').slice(0, 300) : ''}`);
}
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
