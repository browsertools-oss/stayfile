import Papa from 'papaparse';
import { escapeText, foldLine, parseDateTime, unescapeText, unfoldLines } from './ics';

export interface Contact {
  first?: string;
  last?: string;
  full?: string;
  org?: string;
  jobTitle?: string;
  phones: { value: string; type: 'cell' | 'home' | 'work' }[];
  emails: { value: string; type: 'home' | 'work' }[];
  street?: string;
  city?: string;
  region?: string;
  postcode?: string;
  country?: string;
  birthday?: string;
  note?: string;
}

const PHONE_TYPE = { cell: 'CELL', home: 'HOME', work: 'WORK' } as const;

function add(lines: string[], name: string, value: string | undefined): void {
  const v = (value ?? '').trim();
  if (v) lines.push(`${name}:${escapeText(v)}`);
}

function birthdayValue(value: string | undefined): string {
  const parsed = parseDateTime(value ?? '', 'mdy');
  if (!parsed) return '';
  const y = parsed.date.slice(0, 4);
  const m = parsed.date.slice(4, 6);
  const d = parsed.date.slice(6, 8);
  return `${y}-${m}-${d}`;
}

/** One vCard 3.0 card per contact, CRLF line ends, folded at 75 bytes. */
export function buildVcf(contacts: Contact[]): string {
  const out: string[] = [];

  for (const c of contacts) {
    const first = (c.first ?? '').trim();
    const last = (c.last ?? '').trim();
    const full = (c.full ?? '').trim() || `${first} ${last}`.trim() || (c.org ?? '').trim();
    const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0'];

    lines.push(`N:${escapeText(last)};${escapeText(first)};;;`);
    if (full) lines.push(`FN:${escapeText(full)}`);
    add(lines, 'ORG', c.org);
    add(lines, 'TITLE', c.jobTitle);

    for (const p of c.phones ?? []) {
      const v = p.value.trim();
      if (v) lines.push(`TEL;TYPE=${PHONE_TYPE[p.type]}:${escapeText(v)}`);
    }
    for (const e of c.emails ?? []) {
      const v = e.value.trim();
      if (v) lines.push(`EMAIL;TYPE=INTERNET,${e.type === 'work' ? 'WORK' : 'HOME'}:${escapeText(v)}`);
    }

    const adr = [c.street, c.city, c.region, c.postcode, c.country].map((p) => (p ?? '').trim());
    if (adr.some(Boolean)) {
      lines.push(`ADR;TYPE=HOME:;;${adr.map((p) => (p ? escapeText(p) : '')).join(';')}`);
    }

    const bday = birthdayValue(c.birthday);
    if (bday) lines.push(`BDAY:${bday}`);
    add(lines, 'NOTE', c.note);
    lines.push('END:VCARD');

    for (const line of lines) out.push(foldLine(line));
  }

  return out.length ? out.join('\r\n') + '\r\n' : '';
}

export interface VcfRow {
  'First name': string;
  'Last name': string;
  'Full name': string;
  Organization: string;
  'Job title': string;
  Mobile: string;
  'Home phone': string;
  'Work phone': string;
  'Other phone': string;
  Email: string;
  'Email 2': string;
  Street: string;
  City: string;
  Region: string;
  Postcode: string;
  Country: string;
  Birthday: string;
  Note: string;
}

export const VCF_HEADERS: (keyof VcfRow)[] = [
  'First name',
  'Last name',
  'Full name',
  'Organization',
  'Job title',
  'Mobile',
  'Home phone',
  'Work phone',
  'Other phone',
  'Email',
  'Email 2',
  'Street',
  'City',
  'Region',
  'Postcode',
  'Country',
  'Birthday',
  'Note',
];

interface VcfLine {
  name: string;
  types: string[];
  value: string;
  quotedPrintable: boolean;
}

/** Decode a quoted-printable value: =XX bytes read as UTF-8, plain characters as they are. */
function decodeQuotedPrintable(value: string): string {
  const bytes: number[] = [];
  const text = new TextEncoder();
  for (let i = 0; i < value.length; i++) {
    const pair = value.slice(i + 1, i + 3);
    if (value[i] === '=' && /^[0-9A-Fa-f]{2}$/.test(pair)) {
      bytes.push(parseInt(pair, 16));
      i += 2;
    } else {
      bytes.push(...text.encode(value[i]));
    }
  }
  return new TextDecoder('utf-8').decode(new Uint8Array(bytes));
}

/** Split one unfolded vCard line into name, types and value. */
function readVcfLine(line: string): VcfLine | null {
  const colon = line.indexOf(':');
  if (colon < 0) return null;
  const head = line.slice(0, colon);
  const value = line.slice(colon + 1);

  const parts = head.split(';');
  // A group prefix such as item1.EMAIL is not part of the name.
  const name = parts[0].replace(/^[^.]*\./, '').trim().toUpperCase();
  if (!name) return null;

  const types: string[] = [];
  let quotedPrintable = false;
  for (const part of parts.slice(1)) {
    const eq = part.indexOf('=');
    if (eq < 0) {
      const bare = part.trim().toUpperCase();
      if (bare) types.push(bare);
      continue;
    }
    const key = part.slice(0, eq).trim().toUpperCase();
    const val = part.slice(eq + 1).trim().replace(/^"(.*)"$/, '$1');
    if (key === 'TYPE') {
      for (const t of val.split(',')) {
        const type = t.trim().toUpperCase();
        if (type) types.push(type);
      }
    } else if (key === 'ENCODING' && val.toUpperCase() === 'QUOTED-PRINTABLE') {
      quotedPrintable = true;
    }
  }
  return { name, types, value, quotedPrintable };
}

function textOf(line: VcfLine): string {
  const raw = line.quotedPrintable ? decodeQuotedPrintable(line.value) : line.value;
  return unescapeText(raw).trim();
}

/** Split a compound value such as N or ADR on semicolons that are not escaped. */
function splitParts(value: string): string[] {
  const parts: string[] = [];
  let current = '';
  for (let i = 0; i < value.length; i++) {
    const ch = value[i];
    if (ch === '\\' && i + 1 < value.length) {
      current += ch + value[i + 1];
      i++;
    } else if (ch === ';') {
      parts.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  parts.push(current);
  return parts.map((part) => unescapeText(part).trim());
}

const PHONE_SLOTS: { types: string[]; slot: keyof VcfRow }[] = [
  { types: ['CELL', 'IPHONE', 'MOBILE'], slot: 'Mobile' },
  { types: ['HOME'], slot: 'Home phone' },
  { types: ['WORK'], slot: 'Work phone' },
];

/** The value after the colon as written, with a quoted-printable value decoded. */
function rawTextOf(line: VcfLine): string {
  return (line.quotedPrintable ? decodeQuotedPrintable(line.value) : line.value).trim();
}

function emptyRow(): VcfRow {
  const row = {} as VcfRow;
  for (const key of VCF_HEADERS) row[key] = '';
  return row;
}

function cardToRow(lines: VcfLine[]): VcfRow {
  const row = emptyRow();

  for (const line of lines) {
    switch (line.name) {
      case 'N': {
        const parts = splitParts(rawTextOf(line));
        row['Last name'] = parts[0] ?? '';
        row['First name'] = parts[1] ?? '';
        break;
      }
      case 'FN':
        row['Full name'] = textOf(line);
        break;
      case 'ORG':
        row.Organization = splitParts(rawTextOf(line))[0] ?? '';
        break;
      case 'TITLE':
        row['Job title'] = textOf(line);
        break;
      case 'TEL': {
        const slot =
          PHONE_SLOTS.find((s) => s.types.some((t) => line.types.includes(t)))?.slot ?? 'Other phone';
        const value = textOf(line);
        if (!value) break;
        if (!row[slot]) row[slot] = value;
        else if (!row['Other phone']) row['Other phone'] = value;
        break;
      }
      case 'EMAIL': {
        const value = textOf(line);
        if (!value) break;
        if (!row.Email) row.Email = value;
        else if (!row['Email 2']) row['Email 2'] = value;
        break;
      }
      case 'ADR': {
        const parts = splitParts(rawTextOf(line));
        row.Street = parts[2] ?? '';
        row.City = parts[3] ?? '';
        row.Region = parts[4] ?? '';
        row.Postcode = parts[5] ?? '';
        row.Country = parts[6] ?? '';
        break;
      }
      case 'BDAY':
        row.Birthday = textOf(line);
        break;
      case 'NOTE':
        row.Note = textOf(line);
        break;
      default:
        break;
    }
  }

  return row;
}

export function parseVcf(text: string): VcfRow[] {
  // Soft line breaks inside quoted-printable values: a line ending in = continues below.
  const joined = text.replace(/=\r?\n[ \t]?/g, '');
  const lines = unfoldLines(joined);
  const rows: VcfRow[] = [];
  let card: VcfLine[] | null = null;

  for (const line of lines) {
    const upper = line.trim().toUpperCase();
    if (upper === 'BEGIN:VCARD') {
      card = [];
      continue;
    }
    if (upper === 'END:VCARD') {
      if (card) rows.push(cardToRow(card));
      card = null;
      continue;
    }
    if (!card) continue;
    if (upper.startsWith('PHOTO')) continue;
    const parsed = readVcfLine(line);
    if (parsed) card.push(parsed);
  }

  return rows;
}

export function vcfRowsToCsv(rows: VcfRow[]): string {
  return Papa.unparse(
    { fields: VCF_HEADERS, data: rows.map((row) => VCF_HEADERS.map((key) => row[key])) },
    { delimiter: ',', newline: '\r\n' },
  );
}
