// HEIC/HEIF (iPhone photo) support. libheif-js (LGPL-3.0) is served as a separate, unmodified file
// under /vendor/libheif/ (copied there by scripts/vendor.mjs) and only fetched when a HEIC file is decoded.

export const HEIF_VERSION = '1.23.5';
export const HEIF_URL = `/vendor/libheif/${HEIF_VERSION}/libheif-bundle.mjs`;

const HEIC_TYPES = new Set(['image/heic', 'image/heif', 'image/heic-sequence', 'image/heif-sequence']);

/** True for .heic/.heif files. Browsers outside Apple often leave the MIME type empty, so the name counts too. */
export function isHeic(file: { name?: string; type?: string }): boolean {
  return HEIC_TYPES.has((file.type || '').toLowerCase()) || /\.(heic|heif)$/i.test(file.name || '');
}

/** Minimal shape of the libheif module we use. */
export interface LibHeif {
  HeifDecoder: new () => { decode(buf: Uint8Array): HeifImage[] };
}
interface HeifImage {
  get_width(): number;
  get_height(): number;
  display(img: { data: Uint8ClampedArray; width: number; height: number }, cb: (r: unknown) => void): void;
  free?(): void;
}

export interface Pixels { data: Uint8ClampedArray; width: number; height: number }

/** Decode the primary image of a HEIC file to RGBA pixels. */
export function decodeHeic(lib: LibHeif, buf: Uint8Array): Promise<Pixels> {
  let images: HeifImage[];
  try {
    images = new lib.HeifDecoder().decode(buf);
  } catch {
    images = [];
  }
  if (!images.length) return Promise.reject(new Error('This HEIC file could not be read. It may be damaged.'));
  const img = images[0];
  const width = img.get_width(), height = img.get_height();
  const out = { data: new Uint8ClampedArray(width * height * 4), width, height };
  return new Promise((resolve, reject) => {
    img.display(out, (r) => {
      images.forEach((i) => i.free?.());
      r ? resolve(out) : reject(new Error('This HEIC file could not be decoded.'));
    });
  });
}

let lib: Promise<LibHeif> | undefined;
/** Browser only: fetch and start libheif once, on first use. */
export function loadHeif(): Promise<LibHeif> {
  lib ??= import(/* @vite-ignore */ HEIF_URL).then(async (m) => {
    const mod = m.default();
    await mod.ready;
    return mod as LibHeif;
  });
  lib.catch(() => (lib = undefined));
  return lib;
}
