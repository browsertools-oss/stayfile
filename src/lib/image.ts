// Image helpers. The math and naming are pure (tested); encode/decode use the browser's canvas,
// with jSquash (Apache-2.0, Squoosh's codecs) for AVIF and for WebP where the browser can't encode it.

import { isHeic, decodeHeic, loadHeif } from './heic';
import { svgIntrinsicSize, clampSize } from './svg';

export type OutType = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif';

export const EXT: Record<OutType, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

export const LOSSY = new Set<OutType>(['image/jpeg', 'image/webp', 'image/avif']);

export function renameTo(name: string, type: OutType, suffix = ''): string {
  const base = name.replace(/\.[^./\\]+$/, '') || 'image';
  return `${base}${suffix}.${EXT[type]}`;
}

export interface ResizeSpec {
  width?: number; // target box; either may be empty
  height?: number;
  percent?: number; // used when set, instead of width/height
  keepAspect?: boolean; // default true
  allowUpscale?: boolean; // default false
}

/** Output size for a resize. Rounds to whole pixels, never below 1. */
export function targetSize(w: number, h: number, s: ResizeSpec): { width: number; height: number } {
  const keep = s.keepAspect ?? true;
  let tw: number, th: number;
  if (s.percent && s.percent > 0) {
    tw = (w * s.percent) / 100;
    th = (h * s.percent) / 100;
  } else if (!s.width && !s.height) {
    tw = w;
    th = h;
  } else if (!keep) {
    tw = s.width || w;
    th = s.height || h;
  } else {
    const sx = s.width ? s.width / w : Infinity;
    const sy = s.height ? s.height / h : Infinity;
    const k = Math.min(sx, sy);
    tw = w * k;
    th = h * k;
  }
  if (!s.allowUpscale && !s.percent && (tw > w || th > h)) {
    const k = Math.min(w / tw, h / th);
    tw *= k;
    th *= k;
  }
  return { width: Math.max(1, Math.round(tw)), height: Math.max(1, Math.round(th)) };
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(n < 10240 ? 1 : 0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

/** "−62%" style change label. */
export function sizeChange(before: number, after: number): string {
  if (!before) return '';
  const pct = Math.round(((after - before) / before) * 100);
  return pct === 0 ? 'same size' : pct < 0 ? `−${-pct}%` : `+${pct}%`;
}

/** Map the shared 0–1 quality slider to jSquash's AVIF scale (0–100, where ~50 is a good photo default). */
export const avifQuality = (q: number) => Math.max(1, Math.min(100, Math.round(q * 100) - 25));

// ---------- browser-only below ----------

/** SVG: drawn onto a canvas at the SVG's own size (or its viewBox), then rasterised. Browsers disagree on
 *  SVG in createImageBitmap, so this path works everywhere. Transparency is kept. */
async function decodeSvg(file: Blob): Promise<ImageBitmap> {
  const intrinsic = svgIntrinsicSize(await file.text());
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('This SVG could not be opened. It may reference fonts or images the browser blocked.'));
      el.src = url;
    });
    const size = clampSize(intrinsic ?? { width: img.naturalWidth || 1024, height: img.naturalHeight || 768 }, 8192);
    const c = document.createElement('canvas');
    c.width = size.width;
    c.height = size.height;
    c.getContext('2d')!.drawImage(img, 0, 0, size.width, size.height);
    return await createImageBitmap(c);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** heic: let HEIC files fall back to libheif when the browser can't open them (Safari can; Chrome and Firefox can't). */
export async function decode(file: Blob, heic = false): Promise<ImageBitmap> {
  if (file.type === 'image/svg+xml' || /\.svg$/i.test((file as File).name ?? '')) return decodeSvg(file);
  try {
    return await createImageBitmap(file);
  } catch {
    if (heic && isHeic(file as File)) {
      const px = await decodeHeic(await loadHeif(), new Uint8Array(await file.arrayBuffer()));
      return createImageBitmap(new ImageData(px.data, px.width, px.height));
    }
    if (isHeic(file as File)) {
      throw new Error('This is an iPhone HEIC photo, and this page does not open HEIC. Use the HEIC to JPG or HEIC to PNG page first.');
    }
    throw new Error('This browser cannot open that image. Try a JPG, PNG, WebP, GIF, AVIF, BMP or ICO file.');
  }
}

/** Draw to a canvas at the given size. Large downscales go in halving steps, which looks much sharper. */
export function draw(src: ImageBitmap | HTMLCanvasElement, width: number, height: number, flatten = false): HTMLCanvasElement {
  let cur: ImageBitmap | HTMLCanvasElement = src;
  let cw = src.width, ch = src.height;
  while (cw / 2 >= width && ch / 2 >= height) {
    cw = Math.round(cw / 2);
    ch = Math.round(ch / 2);
    const c = document.createElement('canvas');
    c.width = cw;
    c.height = ch;
    const x = c.getContext('2d')!;
    x.imageSmoothingQuality = 'high';
    x.drawImage(cur, 0, 0, cw, ch);
    cur = c;
  }
  const c = document.createElement('canvas');
  c.width = width;
  c.height = height;
  const x = c.getContext('2d')!;
  if (flatten) {
    x.fillStyle = '#ffffff';
    x.fillRect(0, 0, width, height);
  }
  x.imageSmoothingQuality = 'high';
  x.drawImage(cur, 0, 0, width, height);
  return c;
}

function toBlob(c: HTMLCanvasElement, type: string, q?: number): Promise<Blob | null> {
  return new Promise((r) => c.toBlob(r, type, q));
}

/** Encode a canvas. quality is 0–1 and ignored for PNG. */
export async function encode(c: HTMLCanvasElement, type: OutType, quality = 0.8): Promise<Blob> {
  if (type === 'image/avif') {
    const { default: enc } = await import('@jsquash/avif/encode.js');
    const data = c.getContext('2d')!.getImageData(0, 0, c.width, c.height);
    // AVIF looks as good as JPEG/WebP at a lower number, so the slider is shifted down to keep files small.
    // Speed 8 trades a little size for much faster encodes; threads are used when the page is cross-origin isolated.
    const buf = await enc(data, { quality: avifQuality(quality), speed: 8 });
    return new Blob([buf], { type });
  }
  const b = await toBlob(c, type, type === 'image/png' ? undefined : quality);
  if (b && b.type === type) return b;
  if (type === 'image/webp') {
    // Safari's canvas can't write WebP; it silently returns PNG.
    const { default: enc } = await import('@jsquash/webp/encode.js');
    const data = c.getContext('2d')!.getImageData(0, 0, c.width, c.height);
    return new Blob([await enc(data, { quality: Math.round(quality * 100) })], { type });
  }
  throw new Error(`This browser cannot save ${EXT[type].toUpperCase()} images.`);
}

/** Full pipeline for one file. JPEG has no transparency, so it gets a white background. */
export async function process(file: Blob, type: OutType, quality: number, size?: ResizeSpec, heic = false): Promise<{ blob: Blob; width: number; height: number; srcWidth: number; srcHeight: number }> {
  const bmp = await decode(file, heic);
  const t = size ? targetSize(bmp.width, bmp.height, size) : { width: bmp.width, height: bmp.height };
  const c = draw(bmp, t.width, t.height, type === 'image/jpeg');
  const blob = await encode(c, type, quality);
  const out = { blob, width: t.width, height: t.height, srcWidth: bmp.width, srcHeight: bmp.height };
  bmp.close();
  return out;
}
