// .ico favicon files are a small directory header followed by image payloads.
// Browsers accept PNG payloads inside an .ico, so the icon is packed from PNG bytes
// at 16, 32 and 48 px instead of writing a BMP codec. Everything happens in the browser.

export interface IcoImage {
  width: number; // 1 to 256
  height: number; // 1 to 256
  bytes: Uint8Array;
}

export const ICO_SIZES = [16, 32, 48] as const;

export function packIco(images: IcoImage[]): Uint8Array {
  if (!images.length) throw new Error('An icon needs at least one image.');
  if (images.length > 255) throw new Error('An icon holds at most 255 images.');
  const HEADER = 6;
  const ENTRY = 16;
  let offset = HEADER + ENTRY * images.length;
  const entries = images.map((img) => {
    if (!Number.isInteger(img.width) || !Number.isInteger(img.height) || img.width < 1 || img.height < 1 || img.width > 256 || img.height > 256) {
      throw new Error('Icon images must be between 1 and 256 pixels, with whole pixel sizes.');
    }
    const entry = { w: img.width % 256, h: img.height % 256, size: img.bytes.length, offset };
    offset += img.bytes.length;
    return entry;
  });
  const out = new Uint8Array(offset);
  const view = new DataView(out.buffer);
  view.setUint16(0, 0, true); // reserved, always 0
  view.setUint16(2, 1, true); // 1 = icon (not a cursor)
  view.setUint16(4, images.length, true);
  entries.forEach((e, i) => {
    const p = HEADER + ENTRY * i;
    out[p] = e.w;
    out[p + 1] = e.h;
    out[p + 2] = 0; // colors in palette; 0 for 32-bit images
    out[p + 3] = 0; // reserved
    view.setUint16(p + 4, 1, true); // color planes
    view.setUint16(p + 6, 32, true); // bits per pixel
    view.setUint32(p + 8, e.size, true);
    view.setUint32(p + 12, e.offset, true);
  });
  images.forEach((img, i) => out.set(img.bytes, entries[i].offset));
  return out;
}
