import { escapeText, foldLine, parseDateTime } from './ics';

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
