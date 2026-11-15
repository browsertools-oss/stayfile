// YAML ↔ JSON. The text in and out is plain; js-yaml (MIT) does the parsing. Imported dynamically,
// never on pages that do not convert YAML.
import { loadAll, dump } from 'js-yaml';
import { parseCsv, type CsvOptions } from './data';

const firstLine = (e: unknown) => ((e as Error).message ?? String(e)).split('\n')[0];

/** YAML text → JSON text. Several YAML documents (separated by ---) become a JSON array. */
export function yamlToJson(text: string, o: { indent?: number } = {}): string {
  const t = text.replace(/^﻿/, '');
  if (!t.trim()) throw new Error('The file is empty.');
  let docs: unknown[];
  try {
    docs = loadAll(t);
  } catch (e) {
    throw new Error(`Not valid YAML: ${firstLine(e)}`);
  }
  docs = docs.filter((d) => d !== undefined);
  if (!docs.length) throw new Error('The file holds no YAML documents.');
  const data = docs.length === 1 ? docs[0] : docs;
  return JSON.stringify(data, null, o.indent ?? 2);
}

/** JSON text → YAML text. Any JSON value becomes YAML; keys come out in the file's order. */
export function jsonToYaml(text: string): string {
  const t = text.replace(/^﻿/, '').trim();
  if (!t) throw new Error('The file is empty.');
  let data: unknown;
  try {
    data = JSON.parse(t);
  } catch (e) {
    throw new Error(`Not valid JSON: ${firstLine(e)}`);
  }
  return dump(data);
}

/** CSV text → YAML text. With a header row, each record becomes a mapping keyed by the column names.
 *  Without one, the result is a YAML list of lists. Values are typed like the CSV to JSON output. */
export function csvToYaml(text: string, o: CsvOptions = {}): string {
  if (!text.trim()) throw new Error('The file is empty.');
  const p = parseCsv(text, o);
  const rows = p.rows as unknown[];
  if (!rows.length) throw new Error('No rows found in the file.');
  return dump(rows);
}
