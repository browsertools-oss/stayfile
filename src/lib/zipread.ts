// Read a zip without loading it whole: only the end of the file, the central
// directory, and each wanted entry. A dropped archive never leaves the device.
import { Zip, ZipDeflate, inflateSync } from 'fflate';

export interface ByteSource {
  size: number;
  read(offset: number, length: number): Promise<Uint8Array>;
}

export function fileSource(f: Blob): ByteSource {
  return {
    size: f.size,
    read: async (offset, length) => new Uint8Array(await f.slice(offset, offset + length).arrayBuffer()),
  };
}

export function bytesSource(b: Uint8Array): ByteSource {
  return {
    size: b.length,
    read: async (offset, length) => b.slice(offset, offset + length),
  };
}

export interface ZipEntry {
  name: string;
  method: number;
  compSize: number;
  size: number;
  offset: number;
}

const u16 = (b: Uint8Array, p: number) => b[p] + b[p + 1] * 256;
const u32 = (b: Uint8Array, p: number) => b[p] + b[p + 1] * 256 + b[p + 2] * 65536 + b[p + 3] * 16777216;
const u64 = (b: Uint8Array, p: number) => u32(b, p) + u32(b, p + 4) * 2 ** 32;

const sig = (b: Uint8Array, p: number, a: number, c: number) =>
  b[p] === 0x50 && b[p + 1] === 0x4b && b[p + 2] === a && b[p + 3] === c;

/** Pull the 8-byte ZIP64 values for the fields that were 0xFFFFFFFF. */
export function zip64Extra(
  extra: Uint8Array,
  need: { size: boolean; comp: boolean; offset: boolean },
): { size?: number; comp?: number; offset?: number } {
  let p = 0;
  while (p + 4 <= extra.length) {
    const id = u16(extra, p);
    const len = u16(extra, p + 2);
    const start = p + 4;
    if (id === 0x0001) {
      let q = start;
      const out: { size?: number; comp?: number; offset?: number } = {};
      const take = () => {
        if (q + 8 > start + len || q + 8 > extra.length) return undefined;
        const v = u64(extra, q);
        q += 8;
        return v;
      };
      if (need.size) out.size = take();
      if (need.comp) out.comp = take();
      if (need.offset) out.offset = take();
      return out;
    }
    p = start + len;
  }
  return {};
}

/** List the files in a zip. Folder entries are left out. */
export async function listZip(src: ByteSource): Promise<ZipEntry[]> {
  const tailLen = Math.min(src.size, 65557);
  if (tailLen < 22) throw new Error('This is not a zip file.');
  const tailStart = src.size - tailLen;
  const tail = await src.read(tailStart, tailLen);
  let idx = -1;
  for (let i = tail.length - 22; i >= 0; i--) {
    if (sig(tail, i, 0x05, 0x06, 0, 0)) {
      idx = i;
      break;
    }
  }
  if (idx < 0) throw new Error('This is not a zip file.');
  const endOff = tailStart + idx;
  let count = u16(tail, idx + 10);
  let cdSize = u32(tail, idx + 12);
  let cdOff = u32(tail, idx + 16);

  if (count === 0xffff || cdSize === 0xffffffff || cdOff === 0xffffffff) {
    if (endOff < 20) throw new Error('This is not a zip file.');
    const loc = await src.read(endOff - 20, 20);
    if (!sig(loc, 0, 0x06, 0x07, 0, 0)) throw new Error('This is not a zip file.');
    const z64Off = u64(loc, 8);
    const z64 = await src.read(z64Off, 56);
    if (!sig(z64, 0, 0x06, 0x06, 0, 0)) throw new Error('This is not a zip file.');
    count = u64(z64, 32);
    cdSize = u64(z64, 40);
    cdOff = u64(z64, 48);
  }

  const cd = await src.read(cdOff, cdSize);
  const out: ZipEntry[] = [];
  let p = 0;
  for (let i = 0; i < count && p + 46 <= cd.length; i++) {
    if (!sig(cd, p, 0x01, 0x02, 0, 0)) break;
    const method = u16(cd, p + 10);
    let compSize = u32(cd, p + 20);
    let size = u32(cd, p + 24);
    const nameLen = u16(cd, p + 28);
    const extraLen = u16(cd, p + 30);
    const commentLen = u16(cd, p + 32);
    let offset = u32(cd, p + 42);
    const name = new TextDecoder().decode(cd.subarray(p + 46, p + 46 + nameLen));
    if (size === 0xffffffff || compSize === 0xffffffff || offset === 0xffffffff) {
      const extra = cd.subarray(p + 46 + nameLen, p + 46 + nameLen + extraLen);
      const v = zip64Extra(extra, {
        size: size === 0xffffffff,
        comp: compSize === 0xffffffff,
        offset: offset === 0xffffffff,
      });
      if (v.size !== undefined) size = v.size;
      if (v.comp !== undefined) compSize = v.comp;
      if (v.offset !== undefined) offset = v.offset;
    }
    if (!name.endsWith('/')) out.push({ name, method, compSize, size, offset });
    p += 46 + nameLen + extraLen + commentLen;
  }
  return out;
}

/** Read and decompress one entry. */
export async function readEntry(src: ByteSource, e: ZipEntry): Promise<Uint8Array> {
  const h = await src.read(e.offset, 30);
  if (!sig(h, 0, 0x03, 0x04, 0, 0)) throw new Error('This is not a zip file.');
  const nameLen = u16(h, 26);
  const extraLen = u16(h, 28);
  const data = await src.read(e.offset + 30 + nameLen + extraLen, e.compSize);
  if (e.method === 0) return data;
  if (e.method === 8) return inflateSync(data);
  throw new Error('Unsupported compression');
}

/** Build a zip as files are added, so a large output is not held twice. */
export function zipWriter(): { add(name: string, data: Uint8Array): void; finish(): Blob; count(): number } {
  const chunks: Uint8Array[] = [];
  const used = new Set<string>();
  const z = new Zip((err, chunk) => {
    if (err) throw err;
    chunks.push(chunk);
  });
  let n = 0;
  return {
    add(name, data) {
      let unique = name;
      for (let i = 2; used.has(unique); i++) unique = name.replace(/(\.[^.]+)?$/, ` (${i})$1`);
      used.add(unique);
      const f = new ZipDeflate(unique, { level: 6 });
      z.add(f);
      f.push(data, true);
      n++;
    },
    finish() {
      z.end();
      return new Blob(chunks as BlobPart[], { type: 'application/zip' });
    },
    count: () => n,
  };
}
