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

/** First sheet of an .xlsx as CSV text, plus every sheet name so the page can say what was left out. */
export function xlsxToCsv(bytes: Uint8Array): { csv: string; sheets: string[] } {
  let wb: XLSX.WorkBook;
  try {
    wb = XLSX.read(bytes, { type: 'array' });
  } catch {
    throw new Error('This file could not be read as an Excel workbook.');
  }
  const first = wb.SheetNames[0];
  if (!first) throw new Error('This workbook has no sheets.');
  return { csv: XLSX.utils.sheet_to_csv(wb.Sheets[first]), sheets: wb.SheetNames };
}

/** Read back the first sheet of an .xlsx as arrays (used by tests and the preview). */
export function xlsxToRows(bytes: Uint8Array): unknown[][] {
  const wb = XLSX.read(bytes, { type: 'array' });
  return XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });
}
