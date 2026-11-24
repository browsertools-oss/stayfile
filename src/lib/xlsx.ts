// Kept apart from data.ts so pages that don't make spreadsheets don't load SheetJS.
import * as XLSX from 'xlsx';
import { parseCsv, type CsvOptions } from './data';

/** One-sheet .xlsx from CSV text. Numbers stay numbers so Excel can sum them. */
export function csvToXlsx(text: string, o: CsvOptions & { sheetName?: string } = {}): Uint8Array {
  const p = parseCsv(text, { ...o, header: false });
  const ws = XLSX.utils.aoa_to_sheet(p.rows as unknown[][]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, (o.sheetName || 'Sheet1').replace(/[\\/?*[\]:]/g, ' ').slice(0, 31));
  return new Uint8Array(XLSX.write(wb, { type: 'array', bookType: 'xlsx', compression: true }) as ArrayBuffer);
}

/** One sheet of an .xlsx as CSV text (the named sheet when it exists, else the first), plus every sheet name. */
export function xlsxToCsv(bytes: Uint8Array, sheet?: string): { csv: string; sheets: string[] } {
  let wb: XLSX.WorkBook;
  try {
    wb = XLSX.read(bytes, { type: 'array' });
  } catch {
    throw new Error('This file could not be read as an Excel workbook.');
  }
  const name = sheet && wb.SheetNames.includes(sheet) ? sheet : wb.SheetNames[0];
  if (!name) throw new Error('This workbook has no sheets.');
  return { csv: XLSX.utils.sheet_to_csv(wb.Sheets[name]), sheets: wb.SheetNames };
}

/** Every sheet of an .xlsx as its own CSV text, in workbook order. */
export function xlsxAllToCsv(bytes: Uint8Array): { name: string; csv: string }[] {
  let wb: XLSX.WorkBook;
  try {
    wb = XLSX.read(bytes, { type: 'array' });
  } catch {
    throw new Error('This file could not be read as an Excel workbook.');
  }
  if (!wb.SheetNames.length) throw new Error('This workbook has no sheets.');
  return wb.SheetNames.map((name) => ({ name, csv: XLSX.utils.sheet_to_csv(wb.Sheets[name]) }));
}

/** Read back the first sheet of an .xlsx as arrays (used by tests and the preview). */
export function xlsxToRows(bytes: Uint8Array): unknown[][] {
  const wb = XLSX.read(bytes, { type: 'array' });
  return XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });
}
