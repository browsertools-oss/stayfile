import { describe, test, expect } from 'vitest';
import { buildVcf, type Contact } from '../src/lib/vcard';

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
