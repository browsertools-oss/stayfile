// Hands files from one page to the next (the home drop zone to a tool, or a result to the next tool).
// They sit in this browser's IndexedDB for a moment and are deleted when the next page reads them.
// Nothing leaves the device.
const DB = 'stayfile', STORE = 'handoff', KEY = 'files', MAX_AGE = 5 * 60_000;

function open(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return open().then((db) => new Promise<T>((res, rej) => {
    const t = db.transaction(STORE, mode);
    const req = fn(t.objectStore(STORE));
    t.oncomplete = () => { db.close(); res(req.result); };
    t.onerror = () => { db.close(); rej(t.error); };
  }));
}

/** Store the files, then go to the tool page. */
export async function handOff(files: File[], slug: string) {
  const items = files.map((f) => ({ name: f.name, type: f.type, blob: f as Blob }));
  await tx('readwrite', (s) => s.put({ at: Date.now(), items }, KEY));
  location.href = `/${slug}/`;
}

/** Take whatever was handed over (once), as File objects. Old or missing handoffs give an empty list. */
export async function takeHandoff(): Promise<File[]> {
  try {
    const got = await tx<{ at: number; items: { name: string; type: string; blob: Blob }[] } | undefined>('readonly', (s) => s.get(KEY));
    if (!got) return [];
    await tx('readwrite', (s) => s.delete(KEY));
    if (Date.now() - got.at > MAX_AGE) return [];
    return got.items.map((i) => new File([i.blob], i.name, { type: i.type }));
  } catch {
    return [];
  }
}
