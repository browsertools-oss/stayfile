// Helpers for splitting one CSV into parts and merging several CSVs into one.
import Papa from 'papaparse';

/** data-part-01.csv for part 1 of 12; data-part-1.csv for part 1 of 3. */
export function partName(base: string, i: number, count: number): string {
  const digits = String(Math.max(1, count)).length;
  return `${base}-part-${String(i).padStart(digits, '0')}.csv`;
}

export interface Splitter {
  push(rows: string[][]): void;
  end(): void;
}

/**
 * Collects parsed rows and hands out one CSV string per part. With a header
 * on, the first row pushed is written at the top of every part.
 */
export function makeSplitter(o: {
  header: boolean;
  rowsPerPart: number;
  onPart: (csv: string) => void;
}): Splitter {
  const per = Math.max(1, Math.floor(o.rowsPerPart));
  let header: string[] | null = null;
  let current: string[][] = [];

  const isEmpty = (r: string[]) => r.length === 0 || (r.length === 1 && (r[0] ?? '') === '');

  const emit = (rows: string[][]) => {
    if (!rows.length) return;
    const body = o.header && header ? [header, ...rows] : rows;
    o.onPart(Papa.unparse(body, { newline: '\r\n' }));
  };

  return {
    push(rows: string[][]) {
      for (const row of rows) {
        if (isEmpty(row)) continue;
        if (o.header && !header) {
          header = row;
          continue;
        }
        current.push(row);
        if (current.length >= per) {
          emit(current);
          current = [];
        }
      }
    },
    end() {
      if (current.length) {
        emit(current);
        current = [];
      }
    },
  };
}

/** The rows for each file when a row count is split into a set number of files. */
export function rowsPerPartFor(total: number, files: number): number {
  const n = files > 0 ? Math.ceil(total / files) : total;
  return Math.max(1, n);
}

function sameList(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

/**
 * Merge parsed CSVs by column name. The first row of each file is its header;
 * the output header is the union of every header in first-seen order.
 */
export function mergeCsv(
  files: { name: string; rows: string[][] }[],
  o: { addFileName: boolean },
): { rows: string[][]; differing: string[] } {
  const live = files.filter((f) => f.rows.length > 0);
  const headers: string[] = [];
  const seen = new Set<string>();
  for (const f of live) {
    for (const h of f.rows[0]) {
      if (!seen.has(h)) {
        seen.add(h);
        headers.push(h);
      }
    }
  }

  const out: string[][] = [o.addFileName ? ['File', ...headers] : headers];
  const firstHeader = live.length ? live[0].rows[0] : [];
  const differing: string[] = [];

  for (const f of live) {
    if (!sameList(f.rows[0], firstHeader)) differing.push(f.name);
    const at = new Map<string, number>();
    f.rows[0].forEach((h, i) => {
      if (!at.has(h)) at.set(h, i);
    });
    for (let r = 1; r < f.rows.length; r++) {
      const row = f.rows[r];
      const cells = headers.map((h) => {
        const i = at.get(h);
        return i === undefined ? '' : (row[i] ?? '');
      });
      out.push(o.addFileName ? [f.name, ...cells] : cells);
    }
  }

  return { rows: out, differing };
}
