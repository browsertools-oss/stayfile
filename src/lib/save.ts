// Browser download helpers. Files are handed to the browser as object URLs; nothing is sent anywhere.
import { zipSync } from 'fflate';

export function save(data: Blob | Uint8Array, name: string, type = 'application/octet-stream') {
  const blob = data instanceof Blob ? data : new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/** Zip without re-compressing (PDFs and images are already compressed). Duplicate names get " (2)". */
export async function zip(files: { name: string; data: Blob | Uint8Array }[]): Promise<Uint8Array> {
  const out: Record<string, [Uint8Array, { level: 0 }]> = {};
  for (const f of files) {
    let name = f.name;
    for (let i = 2; out[name]; i++) name = f.name.replace(/(\.[^.]+)?$/, ` (${i})$1`);
    const bytes = f.data instanceof Blob ? new Uint8Array(await f.data.arrayBuffer()) : f.data;
    out[name] = [bytes, { level: 0 }];
  }
  return zipSync(out);
}

export const baseName = (n: string) => n.replace(/\.[^./\\]+$/, '') || 'file';
