import { describe, test, expect } from 'vitest';
import { parseDateTime, buildIcs, parseIcs, icsRowsToCsv, type CalEvent } from '../src/lib/ics';

const CRLF = '\r\n';

function wrap(...lines: string[]): string {
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', ...lines, 'END:VCALENDAR'].join(CRLF) + CRLF;
}

function event(...lines: string[]): string {
  return wrap('BEGIN:VEVENT', ...lines, 'END:VEVENT');
}

describe('parseDateTime', () => {
  test('reads the ISO forms', () => {
    expect(parseDateTime('2026-11-22', 'mdy')).toEqual({ date: '20261122' });
    expect(parseDateTime('2026-11-22 09:30', 'mdy')).toEqual({ date: '20261122', time: '093000' });
    expect(parseDateTime('2026-11-22T09:30', 'mdy')).toEqual({ date: '20261122', time: '093000' });
  });

  test('reads slash dates in the chosen order', () => {
    expect(parseDateTime('11/22/2026', 'mdy')).toEqual({ date: '20261122' });
    expect(parseDateTime('11/22/26', 'mdy')).toEqual({ date: '20261122' });
    expect(parseDateTime('22/11/2026', 'dmy')).toEqual({ date: '20261122' });
    expect(parseDateTime('22/11/26', 'dmy')).toEqual({ date: '20261122' });
    expect(parseDateTime('22/11/2026', 'mdy')).toBeNull();
  });

  test('dot dates are always day first, whatever the order', () => {
    expect(parseDateTime('22.11.2026', 'mdy')).toEqual({ date: '20261122' });
    expect(parseDateTime('22.11.2026', 'dmy')).toEqual({ date: '20261122' });
  });

  test('reads every accepted time spelling', () => {
    const date = { date: '20261122' };
    expect(parseDateTime('2026-11-22 9:30', 'mdy')).toEqual({ ...date, time: '093000' });
    expect(parseDateTime('2026-11-22 09:30:00', 'mdy')).toEqual({ ...date, time: '093000' });
    expect(parseDateTime('2026-11-22 9:30 PM', 'mdy')).toEqual({ ...date, time: '213000' });
    expect(parseDateTime('2026-11-22 9:30pm', 'mdy')).toEqual({ ...date, time: '213000' });
    expect(parseDateTime('2026-11-22 12:05 AM', 'mdy')).toEqual({ ...date, time: '000500' });
  });

  test('returns null for anything else', () => {
    expect(parseDateTime('nonsense', 'mdy')).toBeNull();
    expect(parseDateTime('2026-02-30', 'mdy')).toBeNull();
    expect(parseDateTime('13/13/2026', 'mdy')).toBeNull();
    expect(parseDateTime('2026-11-22 25:00', 'mdy')).toBeNull();
    expect(parseDateTime('', 'mdy')).toBeNull();
  });
});

describe('buildIcs', () => {
  test('writes the calendar header and one event per row', () => {
    const ics = buildIcs(
      [{ title: 'Dentist', start: '2026-11-22', startTime: '09:30', allDay: false }],
      new Date(Date.UTC(2026, 10, 22, 14, 47, 5)),
    );
    const lines = ics.split(CRLF);
    expect(lines[0]).toBe('BEGIN:VCALENDAR');
    expect(lines).toContain('VERSION:2.0');
    expect(lines).toContain('PRODID:-//Stayfile//Calendar//EN');
    expect(lines).toContain('CALSCALE:GREGORIAN');
    expect(lines).toContain('UID:0-20261122T144705Z@stayfile.app');
    expect(lines).toContain('DTSTAMP:20261122T144705Z');
    expect(lines).toContain('SUMMARY:Dentist');
    expect(lines).toContain('DTSTART:20261122T093000');
    expect(lines).toContain('DTEND:20261122T103000');
    expect(lines).toContain('END:VCALENDAR');
    expect(ics.endsWith(CRLF)).toBe(true);
  });

  test('an all-day event with no end lasts one day and ends exclusive', () => {
    const ics = buildIcs([{ title: 'Holiday', start: '2026-11-22', allDay: true }], new Date(0));
    expect(ics).toContain('DTSTART;VALUE=DATE:20261122');
    expect(ics).toContain('DTEND;VALUE=DATE:20261123');
    expect(ics).not.toContain('DTSTART:2026');
  });

  test('an all-day event with an end ends the day after the last day', () => {
    const ics = buildIcs(
      [{ title: 'Trip', start: '2026-11-22', end: '2026-11-24', allDay: true }],
      new Date(0),
    );
    expect(ics).toContain('DTSTART;VALUE=DATE:20261122');
    expect(ics).toContain('DTEND;VALUE=DATE:20261125');
  });

  test('a timed event without an end gets one hour', () => {
    const ics = buildIcs(
      [{ title: 'Call', start: '2026-12-31', startTime: '23:30', allDay: false }],
      new Date(0),
    );
    expect(ics).toContain('DTSTART:20261231T233000');
    expect(ics).toContain('DTEND:20270101T003000');
  });

  test('escapes commas, semicolons, backslashes and newlines', () => {
    const ics = buildIcs(
      [
        {
          title: 'Hi, there; ok',
          start: '2026-11-22',
          allDay: true,
          location: 'Back\\slash',
          description: 'line one\nline two',
        },
      ],
      new Date(0),
    );
    expect(ics).toContain('SUMMARY:Hi\\, there\\; ok');
    expect(ics).toContain('LOCATION:Back\\\\slash');
    expect(ics).toContain('DESCRIPTION:line one\\nline two');
  });

  test('folds a long title at 75 bytes without splitting a character', () => {
    const title = 'a'.repeat(73) + '😀' + 'b'.repeat(120);
    const ics = buildIcs([{ title, start: '2026-11-22', allDay: true }], new Date(0));
    for (const line of ics.split(CRLF)) {
      expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    }
    expect(parseIcs(ics)[0].title).toBe(title);
  });
});

describe('parseIcs', () => {
  test('round trips three events: all-day, timed with an end and timed with a default end', () => {
    const events: CalEvent[] = [
      { title: 'Holiday', start: '2026-11-22', allDay: true },
      {
        title: 'Trip',
        start: '2026-11-23',
        end: '2026-11-25',
        allDay: true,
      },
      {
        title: 'Dinner, with friends',
        start: '2026-11-26',
        startTime: '19:30',
        end: '2026-11-26',
        endTime: '21:00',
        allDay: false,
        location: 'Home',
      },
    ];
    const rows = parseIcs(buildIcs(events, new Date(0)));
    expect(rows).toHaveLength(3);
    expect(rows.map((r) => r.title)).toEqual(['Holiday', 'Trip', 'Dinner, with friends']);
    expect(rows[0]).toMatchObject({
      startDate: '2026-11-22',
      endDate: '2026-11-22',
      allDay: 'Yes',
    });
    expect(rows[1]).toMatchObject({
      startDate: '2026-11-23',
      endDate: '2026-11-25',
      allDay: 'Yes',
    });
    expect(rows[2]).toMatchObject({
      startDate: '2026-11-26',
      startTime: '19:30',
      endDate: '2026-11-26',
      endTime: '21:00',
      allDay: 'No',
      location: 'Home',
    });
  });

  test('unescapes text values', () => {
    const rows = parseIcs(
      event(
        'DTSTART;VALUE=DATE:20261122',
        'SUMMARY:Hi\\, there\\; ok',
        'LOCATION:Back\\\\slash',
        'DESCRIPTION:line one\\nline two',
      ),
    );
    expect(rows[0].title).toBe('Hi, there; ok');
    expect(rows[0].location).toBe('Back\\slash');
    expect(rows[0].description).toBe('line one\nline two');
  });

  test('reads an all-day end date as exclusive both ways', () => {
    const rows = parseIcs(
      event('DTSTART;VALUE=DATE:20261122', 'DTEND;VALUE=DATE:20261125'),
    );
    expect(rows[0]).toMatchObject({ startDate: '2026-11-22', endDate: '2026-11-24', allDay: 'Yes' });
    const again = parseIcs(buildIcs([{ title: 'Trip', start: '2026-11-22', end: '2026-11-24', allDay: true }], new Date(0)));
    expect(again[0].endDate).toBe('2026-11-24');
  });

  test('keeps a repeat rule as written instead of expanding it', () => {
    const rows = parseIcs(
      event('DTSTART:20261122T090000', 'SUMMARY:Standup', 'RRULE:FREQ=WEEKLY;BYDAY=MO'),
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].repeats).toBe('FREQ=WEEKLY;BYDAY=MO');
  });

  test('converts a UTC value to the computer time zone and leaves the zone empty', () => {
    const rows = parseIcs(event('DTSTART:20261122T140000Z', 'SUMMARY:Call'));
    expect(rows[0].timeZone).toBe('');
    const [y, m, d] = rows[0].startDate.split('-').map(Number);
    const [h, min] = rows[0].startTime.split(':').map(Number);
    expect(new Date(y, m - 1, d, h, min).getTime()).toBe(Date.UTC(2026, 10, 22, 14, 0, 0));
  });

  test('keeps the wall clock and the zone name for a TZID value', () => {
    const rows = parseIcs(
      event('DTSTART;TZID=America/New_York:20261122T093000', 'SUMMARY:Call'),
    );
    expect(rows[0]).toMatchObject({
      startDate: '2026-11-22',
      startTime: '09:30',
      timeZone: 'America/New_York',
    });
  });

  test('ignores VALARM, VTODO and VTIMEZONE blocks', () => {
    const text = wrap(
      'BEGIN:VTIMEZONE',
      'TZID:America/New_York',
      'BEGIN:STANDARD',
      'DTSTART:19701101T020000',
      'END:STANDARD',
      'END:VTIMEZONE',
      'BEGIN:VEVENT',
      'DTSTART;VALUE=DATE:20261122',
      'SUMMARY:Keep me',
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      'DESCRIPTION:Alarm text',
      'END:VALARM',
      'END:VEVENT',
      'BEGIN:VTODO',
      'SUMMARY:Not an event',
      'END:VTODO',
    );
    const rows = parseIcs(text);
    expect(rows).toHaveLength(1);
    expect(rows[0].title).toBe('Keep me');
    expect(rows[0].description).toBe('');
  });

  test('unfolds continuation lines', () => {
    const rows = parseIcs(
      wrap(
        'BEGIN:VEVENT',
        'DTSTART;VALUE=DATE:20261122',
        'SUMMARY:A very long title that was folded',
        '  across two lines',
        'END:VEVENT',
      ),
    );
    expect(rows[0].title).toBe('A very long title that was folded across two lines');
  });
});

describe('icsRowsToCsv', () => {
  test('writes the header and quotes values that need it', () => {
    const rows = parseIcs(
      event(
        'DTSTART;VALUE=DATE:20261122',
        'SUMMARY:Hi, there',
        'DESCRIPTION:line one\\nline two',
      ),
    );
    const csv = icsRowsToCsv(rows);
    expect(csv.startsWith('Title,Start date,Start time,End date,End time,All day,Location,Description,Repeats,Time zone\r\n')).toBe(true);
    expect(csv).toContain('"Hi, there"');
    expect(csv).toContain('"line one\nline two"');
  });
});
