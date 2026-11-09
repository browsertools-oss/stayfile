// Draws PDF pages to JPG with pdf.js. Loaded with a dynamic import from the PDF tool page only,
// so the library and its worker are downloaded when someone converts a file, not on every page.
// Everything runs in the browser; the bytes never leave the device.

/** Render each page of a PDF to a JPG, one Uint8Array per page, in page order. */
export async function pdfToJpgs(
  bytes: Uint8Array,
  dpi: number,
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
      const blob: Blob = await new Promise((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not save a page as JPG.'))), 'image/jpeg', 0.92),
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
