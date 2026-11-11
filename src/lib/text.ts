// Text helpers for the PDF to text page. Pure, so they can be tested in Node.

export interface TextItem {
  str: string;
  hasEOL?: boolean; // pdf.js marks the end-of-line item
}

/** Join pdf.js text items into readable text. Ends lines where pdf.js says the line ended, tidies spaces, and never leaves runs of blank lines. */
export function textItemsToString(items: TextItem[]): string {
  let out = '';
  for (const item of items) {
    out += item.str;
    if (item.hasEOL) out += '\n';
  }
  return out
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n') // trim the space the line ended with
    .replace(/\n{3,}/g, '\n\n') // never more than one blank line
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n');
}
