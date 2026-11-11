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

/** Wrap plain text to lines of at most maxChars, splitting words longer than maxChars. Blank lines in the input stay blank. */
export function wrapText(text: string, maxChars: number): string[] {
  if (maxChars < 1) throw new Error('maxChars must be at least 1.');
  const out: string[] = [];
  for (const raw of text.replace(/\r\n?/g, '\n').split('\n')) {
    const words = raw.split(/\s+/).filter(Boolean);
    if (!words.length) { out.push(''); continue; }
    let cur = '';
    for (const word of words) {
      let rest = word;
      while (rest.length > maxChars) {
        if (cur) { out.push(cur); cur = ''; }
        out.push(rest.slice(0, maxChars));
        rest = rest.slice(maxChars);
      }
      if (!rest) continue;
      if (!cur) cur = rest;
      else if (cur.length + 1 + rest.length <= maxChars) cur += ' ' + rest;
      else { out.push(cur); cur = rest; }
    }
    if (cur) out.push(cur);
  }
  return out;
}

/** Split wrapped text into pages of at most maxLines each. Always returns at least one page. */
export function textPages(text: string, maxChars: number, maxLines: number): string[][] {
  if (maxLines < 1) throw new Error('maxLines must be at least 1.');
  const lines = wrapText(text, maxChars);
  const pages: string[][] = [];
  for (let i = 0; i < lines.length; i += maxLines) pages.push(lines.slice(i, i + maxLines));
  return pages.length ? pages : [['']];
}
