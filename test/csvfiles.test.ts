import { describe, test, expect } from 'vitest';
import Papa from 'papaparse';
import { partName, makeSplitter, makeValueSplitter, valuePartName, rowsPerPartFor, mergeCsv } from '../src/lib/csvfiles';

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

  test('a quoted cell with a line break in the last row of a part stays one row', () => {
    const parts = split(
      [
        ['name', 'note'],
        ['Ann', 'ok'],
        ['Ben', 'line one\nline two'],
        ['Cat', 'fine'],
      ],
      2,
      true,
    );
    expect(parts).toHaveLength(2);
    expect(parts[0]).toEqual([
      ['name', 'note'],
      ['Ann', 'ok'],
      ['Ben', 'line one\nline two'],
    ]);
    expect(parts[1]).toEqual([
      ['name', 'note'],
      ['Cat', 'fine'],
    ]);
    expect(parts.flat()).toHaveLength(5);
  });

  test('empty rows are skipped', () => {
    const parts = split([['a'], [''], ['1'], ['']], 10, true);
    expect(parts[0]).toEqual([['a'], ['1']]);
  });
});

describe('makeValueSplitter', () => {
  function byValue(rows: string[][], column: number): Map<string, string[][]> {
    const parts = new Map<string, string[][]>();
    const s = makeValueSplitter({
      column,
      onPart: (value, csv) => parts.set(value, Papa.parse(csv).data as string[][]),
    });
    s.push(rows);
    s.end();
    return parts;
  }

  test('three values give three parts, each with the header', () => {
    const parts = byValue(
      [
        ['name', 'month', 'total'],
        ['Ann', 'May', '1'],
        ['Ben', 'June', '2'],
        ['Cat', 'May', '3'],
      ],
      1,
    );
    expect([...parts.keys()]).toEqual(['May', 'June']);
    expect(parts.get('May')).toEqual([
      ['name', 'month', 'total'],
      ['Ann', 'May', '1'],
      ['Cat', 'May', '3'],
    ]);
    expect(parts.get('June')).toEqual([
      ['name', 'month', 'total'],
      ['Ben', 'June', '2'],
    ]);
  });

  test('a quoted cell with a comma stays whole', () => {
    const parts = byValue(
      [
        ['name', 'city'],
        ['Ann', 'Oslo, Norway'],
        ['Ben', 'Oslo, Norway'],
      ],
      1,
    );
    expect(parts.get('Oslo, Norway')).toEqual([
      ['name', 'city'],
      ['Ann', 'Oslo, Norway'],
      ['Ben', 'Oslo, Norway'],
    ]);
  });

  test('more than 500 different values throws', () => {
    const rows = [['id', 'group'], ...Array.from({ length: 501 }, (_, i) => [String(i), `g${i}`])];
    const s = makeValueSplitter({ column: 1, onPart: () => {} });
    expect(() => s.push(rows)).toThrow('That column has more than 500 different values.');
  });
});

describe('valuePartName', () => {
  test('cleans unsafe characters and falls back to blank', () => {
    expect(valuePartName('sales', 'A/B')).toBe('sales-A-B.csv');
    expect(valuePartName('sales', '')).toBe('sales-blank.csv');
    expect(valuePartName('sales', '  x  ')).toBe('sales-x.csv');
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
