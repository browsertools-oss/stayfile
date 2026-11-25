import { describe, test, expect } from 'vitest';
import Papa from 'papaparse';
import { partName, makeSplitter, rowsPerPartFor, mergeCsv } from '../src/lib/csvfiles';

function split(rows: string[][], rowsPerPart: number, header: boolean): string[][] {
  const parts: string[][] = [];
  const s = makeSplitter({ header, rowsPerPart, onPart: (csv) => parts.push(Papa.parse(csv).data as string[][]) });
  s.push(rows);
  s.end();
  return parts;
}

describe('partName', () => {
  test('pads the part number to the digits of the part count', () => {
    expect(partName('data', 1, 12)).toBe('data-part-01.csv');
    expect(partName('data', 12, 12)).toBe('data-part-12.csv');
    expect(partName('data', 1, 3)).toBe('data-part-1.csv');
  });
});

describe('makeSplitter', () => {
  const rows = [['name', 'city'], ...Array.from({ length: 10 }, (_, i) => [`Person ${i + 1}`, 'Town'])];

  test('10 data rows at 4 per part give parts of 4, 4 and 2 rows, each with the header', () => {
    const parts = split(rows, 4, true);
    expect(parts).toHaveLength(3);
    expect(parts.map((p) => p.length)).toEqual([5, 5, 3]);
    for (const p of parts) expect(p[0]).toEqual(['name', 'city']);
    expect(parts[2].slice(1)).toEqual([
      ['Person 9', 'Town'],
      ['Person 10', 'Town'],
    ]);
  });

  test('with no header every part starts with data', () => {
    const parts = split(rows.slice(1), 4, false);
    expect(parts).toHaveLength(3);
    expect(parts[0][0]).toEqual(['Person 1', 'Town']);
    expect(parts.flat().some((r) => r[0] === 'name')).toBe(false);
  });

  test('quoted cells with commas and line breaks survive', () => {
    const parts = split([['a', 'b'], ['x, y', 'line one\nline two']], 10, true);
    expect(parts).toHaveLength(1);
    expect(parts[0][1]).toEqual(['x, y', 'line one\nline two']);
  });

  test('empty rows are skipped', () => {
    const parts = split([['a'], [''], ['1'], ['']], 10, true);
    expect(parts[0]).toEqual([['a'], ['1']]);
  });
});

describe('rowsPerPartFor', () => {
  test('rounds up and never returns less than one', () => {
    expect(rowsPerPartFor(10, 3)).toBe(4);
    expect(rowsPerPartFor(9, 3)).toBe(3);
    expect(rowsPerPartFor(2, 10)).toBe(1);
  });
});

describe('mergeCsv', () => {
  test('two files with the same columns give one header and every row', () => {
    const r = mergeCsv(
      [
        { name: 'a.csv', rows: [['name', 'city'], ['Ann', 'Oslo']] },
        { name: 'b.csv', rows: [['name', 'city'], ['Ben', 'Rome']] },
      ],
      { addFileName: false },
    );
    expect(r.rows).toEqual([
      ['name', 'city'],
      ['Ann', 'Oslo'],
      ['Ben', 'Rome'],
    ]);
    expect(r.differing).toEqual([]);
  });

  test('an extra column fills blanks and the file is listed as differing', () => {
    const r = mergeCsv(
      [
        { name: 'a.csv', rows: [['name', 'city'], ['Ann', 'Oslo']] },
        { name: 'b.csv', rows: [['name', 'city', 'zip'], ['Ben', 'Rome', '00100']] },
      ],
      { addFileName: false },
    );
    expect(r.rows[0]).toEqual(['name', 'city', 'zip']);
    expect(r.rows[1]).toEqual(['Ann', 'Oslo', '']);
    expect(r.rows[2]).toEqual(['Ben', 'Rome', '00100']);
    expect(r.differing).toEqual(['b.csv']);
  });

  test('addFileName puts the file name first', () => {
    const r = mergeCsv(
      [
        { name: 'a.csv', rows: [['name'], ['Ann']] },
        { name: 'b.csv', rows: [['name'], ['Ben']] },
      ],
      { addFileName: true },
    );
    expect(r.rows).toEqual([
      ['File', 'name'],
      ['a.csv', 'Ann'],
      ['b.csv', 'Ben'],
    ]);
  });

  test('files with no rows are skipped', () => {
    const r = mergeCsv([{ name: 'empty.csv', rows: [] }, { name: 'a.csv', rows: [['n'], ['1']] }], {
      addFileName: false,
    });
    expect(r.rows).toEqual([['n'], ['1']]);
    expect(r.differing).toEqual([]);
  });
});
