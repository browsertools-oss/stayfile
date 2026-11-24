import { describe, test, expect } from 'vitest';
import { buildVcf, parseVcf, vcfRowsToCsv, type Contact } from '../src/lib/vcard';

const ana: Contact = {
  first: 'Ana',
  last: 'Lima',
  org: 'Ferro Oficina',
  jobTitle: 'Buyer',
  phones: [
    { value: '+55 11 5555 0100', type: 'cell' },
    { value: '+55 11 5555 0200', type: 'work' },
  ],
  emails: [{ value: 'ana@example.com', type: 'work' }],
  street: 'Rua das Flores 12',
  city: 'Sao Paulo',
  region: 'SP',
  postcode: '01000-000',
  country: 'Brasil',
  birthday: '3/14/1988',
  note: 'Met at the trade fair',
};

const ben: Contact = {
  first: 'Ben',
  last: 'Okafor',
  full: 'Ben Okafor',
  phones: [{ value: '555 0101', type: 'home' }],
  emails: [],
};

// The bytes of one folded content line, including its continuation leading spaces.
const linesOf = (vcf: string) => vcf.split('\r\n').filter(Boolean);

describe('buildVcf', () => {
  test('writes two cards with vCard 3.0 headers and one card per contact', () => {
    const vcf = buildVcf([ana, ben]);
    expect(vcf.match(/BEGIN:VCARD/g)).toHaveLength(2);
    expect(vcf.match(/END:VCARD/g)).toHaveLength(2);
    expect(vcf).toContain('VERSION:3.0');
    expect(vcf).toContain('N:Lima;Ana;;;');
    expect(vcf).toContain('FN:Ana Lima');
    expect(vcf).toContain('FN:Ben Okafor');
    expect(vcf).toContain('TEL;TYPE=CELL:+55 11 5555 0100');
    expect(vcf).toContain('TEL;TYPE=WORK:+55 11 5555 0200');
    expect(vcf).toContain('TEL;TYPE=HOME:555 0101');
    expect(vcf).toContain('EMAIL;TYPE=INTERNET,WORK:ana@example.com');
    expect(vcf).toContain('ADR;TYPE=HOME:;;Rua das Flores 12;Sao Paulo;SP;01000-000;Brasil');
    expect(vcf).toContain('BDAY:1988-03-14');
    expect(vcf).not.toContain('EMAIL;TYPE=INTERNET,HOME:');
    expect(vcf.endsWith('\r\n')).toBe(true);
  });

  test('falls back to the organization for FN and leaves out unreadable birthdays', () => {
    const vcf = buildVcf([{ org: 'Solo Print', phones: [], emails: [], birthday: 'soon' }]);
    expect(vcf).toContain('FN:Solo Print');
    expect(vcf).not.toContain('BDAY');
    expect(vcf).not.toContain('EMAIL');
  });

  test('escapes commas and semicolons in a note', () => {
    const vcf = buildVcf([{ ...ben, note: 'Team lead, West; contact after 2pm' }]);
    expect(vcf).toContain('NOTE:Team lead\\, West\\; contact after 2pm');
    expect(linesOf(vcf)).toContain('NOTE:Team lead\\, West\\; contact after 2pm');
  });

  test('folds a long note with accents to lines of 75 bytes or less', () => {
    const note =
      'Résumé of the long conversation at the annual meeting: pricing, delivery dates, ' +
      'warranty terms, spare parts, training for the new staff and a follow-up call in April. '.repeat(2);
    expect(note.length).toBeGreaterThan(120);
    const vcf = buildVcf([{ ...ben, note }]);
    const encoder = new TextEncoder();
    const noteLines = linesOf(vcf).filter((line) => line.startsWith('NOTE:') || /^[ \t]/.test(line));
    expect(noteLines.length).toBeGreaterThan(1);
    for (const line of noteLines) expect(encoder.encode(line).length).toBeLessThanOrEqual(75);
    expect(noteLines[0].startsWith('NOTE:')).toBe(true);
    // Unfolding gives the original note back.
    const joined = noteLines.map((line, i) => (i === 0 ? line.slice(5) : line.slice(1))).join('');
    expect(joined.replace(/\\,/g, ',').replace(/\\;/g, ';')).toBe(note.trim());
  });
});

describe('parseVcf', () => {
  const third: Contact = {
    first: 'Chidi',
    last: 'Eze',
    phones: [],
    emails: [{ value: 'chidi@example.org', type: 'home' }],
    note: 'Work, home; nothing else',
  };

  test('round trips three contacts built here', () => {
    const rows = parseVcf(buildVcf([ana, ben, third]));
    expect(rows).toHaveLength(3);

    expect(rows[0]['First name']).toBe('Ana');
    expect(rows[0]['Last name']).toBe('Lima');
    expect(rows[0]['Full name']).toBe('Ana Lima');
    expect(rows[0].Organization).toBe('Ferro Oficina');
    expect(rows[0]['Job title']).toBe('Buyer');
    expect(rows[0].Mobile).toBe('+55 11 5555 0100');
    expect(rows[0]['Home phone']).toBe('');
    expect(rows[0]['Work phone']).toBe('+55 11 5555 0200');
    expect(rows[0].Email).toBe('ana@example.com');
    expect(rows[0].Street).toBe('Rua das Flores 12');
    expect(rows[0].City).toBe('Sao Paulo');
    expect(rows[0].Region).toBe('SP');
    expect(rows[0].Postcode).toBe('01000-000');
    expect(rows[0].Country).toBe('Brasil');
    expect(rows[0].Birthday).toBe('1988-03-14');

    expect(rows[1]['First name']).toBe('Ben');
    expect(rows[1]['Last name']).toBe('Okafor');
    expect(rows[1]['Home phone']).toBe('555 0101');

    expect(rows[2]['First name']).toBe('Chidi');
    expect(rows[2].Email).toBe('chidi@example.org');
    expect(rows[2].Note).toBe('Work, home; nothing else');
  });

  test('reads a version 2.1 card with bare TYPE params and quoted-printable names', () => {
    const card = [
      'BEGIN:VCARD',
      'VERSION:2.1',
      'N;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:M=C3=BCller;J=C3=BCrgen;;;',
      'TEL;CELL:555 0100',
      'END:VCARD',
      '',
    ].join('\r\n');
    const [row] = parseVcf(card);
    expect(row['Last name']).toBe('Müller');
    expect(row['First name']).toBe('Jürgen');
    expect(row.Mobile).toBe('555 0100');
  });

  test('keeps two phones and two emails in their own columns', () => {
    const card = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'FN:Rae Snow',
      'TEL;TYPE=cell,voice:555 0200',
      'TEL;TYPE=HOME:555 0201',
      'EMAIL;TYPE=INTERNET,HOME:rae@home.example',
      'EMAIL;TYPE=INTERNET,WORK:rae@work.example',
      'END:VCARD',
    ].join('\r\n');
    const [row] = parseVcf(card);
    expect(row.Mobile).toBe('555 0200');
    expect(row['Home phone']).toBe('555 0201');
    expect(row.Email).toBe('rae@home.example');
    expect(row['Email 2']).toBe('rae@work.example');
  });

  test('strips an item group prefix from the line name', () => {
    const card = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'FN:Sam Cole',
      'item1.EMAIL;type=INTERNET:a@b.co',
      'END:VCARD',
    ].join('\r\n');

    const [row] = parseVcf(card);
    expect(row.Email).toBe('a@b.co');
  });

  test('writes one CSV row per contact with the named header row', () => {
    const csv = vcfRowsToCsv(parseVcf(buildVcf([ana, ben])));
    const lines = csv.split('\r\n');
    expect(lines[0]).toBe(
      'First name,Last name,Full name,Organization,Job title,Mobile,Home phone,Work phone,Other phone,Email,Email 2,Street,City,Region,Postcode,Country,Birthday,Note',
    );
    expect(lines).toHaveLength(3);
  });
});
