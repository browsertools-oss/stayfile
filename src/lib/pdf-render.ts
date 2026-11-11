// Draws PDF pages to JPG or PNG with pdf.js. Loaded with a dynamic import from the PDF tool page only,
// so the library and its worker are downloaded when someone converts a file, not on every page.
// Everything runs in the browser; the bytes never leave the device.

/** Render small JPEGs of each page for a preview strip. Caps at maxPages; the count always reports the real total. */
export async function pdfThumbnails(
  bytes: Uint8Array,
  maxPages = 48,
): Promise<{ pages: string[]; total: number }> {
  const pdfjs = await import('pdfjs-dist');
  const workerSrc = (await import('pdfjs-dist/build/pdf.worker.mjs?url')).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

  const doc = await pdfjs.getDocument({ data: bytes, isEvalSupported: false }).promise;
  try {
    const total = doc.numPages;
    const n = Math.min(total, maxPages);
    const pages: string[] = [];
    for (let i = 1; i <= n; i++) {
      const page = await doc.getPage(i);
      const unit = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: 84 / unit.width });
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('This browser could not draw the page.');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport, canvas }).promise;
      pages.push(canvas.toDataURL('image/jpeg', 0.72));
      page.cleanup();
      canvas.width = canvas.height = 0;
    }
    return { pages, total };
  } finally {
    await doc.destroy();
  }
}

import { textItemsToString } from './text';

/** Pull the text out of each page, in reading order, pages separated by a blank line. */
export async function pdfToText(bytes: Uint8Array): Promise<{ text: string; pages: number; empty: boolean }> {
  const pdfjs = await import('pdfjs-dist');
  const workerSrc = (await import('pdfjs-dist/build/pdf.worker.mjs?url')).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

  const doc = await pdfjs.getDocument({ data: bytes, isEvalSupported: false }).promise;
  try {
    const parts: string[] = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const items = content.items
        .filter((it) => 'str' in it)
        .map((it) => ({ str: (it as { str: string }).str, hasEOL: (it as { hasEOL?: boolean }).hasEOL }));
      parts.push(textItemsToString(items));
      page.cleanup();
    }
    const text = parts.join('\n\n').trim();
    return { text, pages: doc.numPages, empty: text.length === 0 };
  } finally {
    await doc.destroy();
  }
}

/** Render each page of a PDF to a JPG or PNG, one Uint8Array per page, in page order. */
export async function pdfToImages(
  bytes: Uint8Array,
  dpi: number,
  format: 'jpg' | 'png',
  onPage?: (page: number, total: number) => void,
): Promise<Uint8Array[]> {
  const pdfjs = await import('pdfjs-dist');
  const workerSrc = (await import('pdfjs-dist/build/pdf.worker.mjs?url')).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

  const doc = await pdfjs.getDocument({ data: bytes, isEvalSupported: false }).promise;
  const out: Uint8Array[] = [];
  try {
    for (let i = 1; i <= doc.numPages; i++) {
      onPage?.(i, doc.numPages);
      const page = await doc.getPage(i);
      const viewport = page.getViewport({ scale: dpi / 72 });
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('This browser could not draw the page. Try a smaller resolution.');
      // JPG has no transparency, so paint white first. Otherwise blank areas come out black.
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport, canvas }).promise;
      const mime = format === 'png' ? 'image/png' : 'image/jpeg';
      const blob: Blob = await new Promise((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error(`Could not save a page as ${format.toUpperCase()}.`))), mime, 0.92),
      );
      out.push(new Uint8Array(await blob.arrayBuffer()));
      page.cleanup();
      canvas.width = canvas.height = 0; // release the canvas memory before the next page
    }
  } finally {
    await doc.destroy();
  }
  return out;
}
