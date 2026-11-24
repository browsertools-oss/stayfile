// Calendar file (iCalendar, .ics) read and write. Pure: strings in, strings out.
// No dependencies; the calendar app that opens the file decides the time zone of
// time values without a zone (floating times), which is what a personal import wants.
import Papa from 'papaparse';

export interface CalEvent {
  title: string;
  start: string; // YYYY-MM-DD or YYYYMMDD
  startTime?: string; // HH:MM, HH:MM:SS, HHMM or HHMMSS
  end?: string;
  endTime?: string;
  allDay: boolean;
  location?: string;
  description?: string;
}

export interface IcsRow {
  title: string;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM, empty for all-day
  endDate: string;
  endTime: string;
  allDay: 'Yes' | 'No';
  location: string;
  description: string;
  repeats: string;
  timeZone: string;
}

const pad = (n: number, width = 2) => String(n).padStart(width, '0');

function validYmd(y: number, m: number, d: number): boolean {
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

/** Clock time in any accepted spelling → HHMMSS, or null. */
function parseTimeText(text: string): string | null {
  const m = text.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([AaPp][Mm])?$/);
  if (!m) return null;
  let h = Number(m[1]);
  const min = Number(m[2]);
  const sec = Number(m[3] ?? 0);
  const ap = m[4]?.toUpperCase();
  if (ap) {
    if (h < 1 || h > 12) return null;
    h = ap === 'PM' ? (h === 12 ? 12 : h + 12) : h === 12 ? 0 : h;
  }
  if (h > 23 || min > 59 || sec > 59) return null;
  return pad(h) + pad(min) + pad(sec);
}

/** One date or date-and-time value → compact date YYYYMMDD and optional HHMMSS. */
export function parseDateTime(
  value: string,
  order: 'mdy' | 'dmy',
): { date: string; time?: string } | null {
  const s = value.trim();
  if (!s) return null;

  let y: number;
  let m: number;
  let d: number;
  let rest = '';

  const iso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](.+))?$/);
  const slash = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})(?:[ ](.+))?$/);
  const dot = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{2}|\d{4})(?:[ ](.+))?$/);

  if (iso) {
    y = Number(iso[1]);
    m = Number(iso[2]);
    d = Number(iso[3]);
    rest = (iso[4] ?? '').trim();
  } else if (slash) {
    const a = Number(slash[1]);
    const b = Number(slash[2]);
    const ys = slash[3];
    y = ys.length === 2 ? 2000 + Number(ys) : Number(ys);
    m = order === 'mdy' ? a : b;
    d = order === 'mdy' ? b : a;
    rest = (slash[4] ?? '').trim();
  } else if (dot) {
    // Dot dates are always day first, as written in most of Europe.
    d = Number(dot[1]);
    m = Number(dot[2]);
    const ys = dot[3];
    y = ys.length === 2 ? 2000 + Number(ys) : Number(ys);
    rest = (dot[4] ?? '').trim();
  } else {
    return null;
  }

  if (!validYmd(y, m, d)) return null;
  const date = `${pad(y, 4)}${pad(m)}${pad(d)}`;
  if (!rest) return { date };
  const time = parseTimeText(rest);
  if (!time) return null;
  return { date, time };
}

function compactDate(value: string): string | null {
  const s = value.trim();
  if (/^\d{8}$/.test(s)) return s;
  const m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!m) return null;
  return m[1] + pad(Number(m[2])) + pad(Number(m[3]));
}

function compactTime(value: string): string | null {
  const s = value.trim();
  if (/^\d{6}$/.test(s)) return s;
  if (/^\d{4}$/.test(s)) return s + '00';
  const m = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return null;
  return pad(Number(m[1])) + m[2] + (m[3] ?? '00');
}

function isoFromCompact(value: string): string {
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

function addDays(value: string, days: number): string {
  const y = Number(value.slice(0, 4));
  const m = Number(value.slice(4, 6));
  const d = Number(value.slice(6, 8));
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return `${pad(dt.getUTCFullYear(), 4)}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}`;
}

function addHour(date: string, time: string): { date: string; time: string } {
  const y = Number(date.slice(0, 4));
  const m = Number(date.slice(4, 6));
  const d = Number(date.slice(6, 8));
  const hh = Number(time.slice(0, 2));
  const mm = Number(time.slice(2, 4));
  const ss = Number(time.slice(4, 6));
  const dt = new Date(Date.UTC(y, m - 1, d, hh, mm, ss) + 60 * 60 * 1000);
  return {
    date: `${pad(dt.getUTCFullYear(), 4)}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}`,
    time: `${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}${pad(dt.getUTCSeconds())}`,
  };
}

/** Date and time as the UTC stamp used by DTSTAMP and UID: YYYYMMDDTHHMMSSZ. */
function utcStamp(now: Date): string {
  return (
    `${pad(now.getUTCFullYear(), 4)}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}` +
    `T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`
  );
}

export function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n|\r|\n/g, '\\n');
}

export function unescapeText(value: string): string {
  return value.replace(/\\([\\;,nN])/g, (_all, ch: string) => (ch === 'n' || ch === 'N' ? '\n' : ch));
}

const encoder = new TextEncoder();

/** Fold one content line at 75 UTF-8 bytes; continuations start with a space. */
export function foldLine(line: string): string {
  const out: string[] = [];
  let current = '';
  let bytes = 0;
  for (const ch of line) {
    const size = encoder.encode(ch).length;
    if (bytes + size > 75) {
      out.push(current);
      current = ' ' + ch;
      bytes = 1 + size;
    } else {
      current += ch;
      bytes += size;
    }
  }
  out.push(current);
  return out.join('\r\n');
}

export function buildIcs(events: CalEvent[], now = new Date()): string {
  const stamp = utcStamp(now);
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Stayfile//Calendar//EN',
    'CALSCALE:GREGORIAN',
  ];

  events.forEach((event, index) => {
    const startDate = compactDate(event.start) ?? '';
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${index}-${stamp}@stayfile.app`);
    lines.push(`DTSTAMP:${stamp}`);
    lines.push(`SUMMARY:${escapeText(event.title)}`);

    if (event.allDay) {
      const last = compactDate(event.end ?? event.start) ?? startDate;
      lines.push(`DTSTART;VALUE=DATE:${startDate}`);
      lines.push(`DTEND;VALUE=DATE:${addDays(last, 1)}`);
    } else {
      const startTime = (event.startTime && compactTime(event.startTime)) || '000000';
      const endDate = event.end ? compactDate(event.end) : null;
      const endTime = event.endTime ? compactTime(event.endTime) : null;
      let stop: { date: string; time: string };
      if (!endDate && !endTime) {
        stop = addHour(startDate, startTime);
      } else {
        stop = {
          date: endDate ?? startDate,
          time: endTime ?? startTime,
        };
      }
      lines.push(`DTSTART:${startDate}T${startTime}`);
      lines.push(`DTEND:${stop.date}T${stop.time}`);
    }

    if (event.location) lines.push(`LOCATION:${escapeText(event.location)}`);
    if (event.description) lines.push(`DESCRIPTION:${escapeText(event.description)}`);
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  return lines.map(foldLine).join('\r\n') + '\r\n';
}

interface Prop {
  name: string;
  params: Record<string, string>;
  value: string;
}

/** Split a content line at the first colon that is not inside a quoted parameter. */
function readProp(line: string): Prop | null {
  let quoted = false;
  let colon = -1;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') quoted = !quoted;
    else if (ch === ':' && !quoted) {
      colon = i;
      break;
    }
  }
  if (colon < 0) return null;

  const head = line.slice(0, colon);
  const value = line.slice(colon + 1);

  const parts: string[] = [];
  let current = '';
  let inQuotes = false;
  for (const ch of head) {
    if (ch === '"') inQuotes = !inQuotes;
    if (ch === ';' && !inQuotes) {
      parts.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  parts.push(current);

  const name = parts[0].trim().toUpperCase();
  if (!name) return null;
  const params: Record<string, string> = {};
  for (const part of parts.slice(1)) {
    const eq = part.indexOf('=');
    if (eq < 0) continue;
    const key = part.slice(0, eq).trim().toUpperCase();
    const val = part.slice(eq + 1).trim().replace(/^"(.*)"$/, '$1');
    if (key) params[key] = val;
  }
  return { name, params, value };
}

interface IcsDate {
  date: string; // YYYYMMDD
  time: string; // HHMMSS, or empty
  utc: boolean;
}

function readIcsDate(value: string): IcsDate | null {
  const m = value.trim().match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?)?(Z)?$/);
  if (!m) return null;
  return {
    date: `${m[1]}${m[2]}${m[3]}`,
    time: m[4] ? `${m[4]}${m[5]}${m[6] ?? '00'}` : '',
    utc: Boolean(m[7]),
  };
}

/** A UTC date and time → the same moment in the computer's local time. */
function toLocal(d: IcsDate): IcsDate {
  const dt = new Date(
    Date.UTC(
      Number(d.date.slice(0, 4)),
      Number(d.date.slice(4, 6)) - 1,
      Number(d.date.slice(6, 8)),
      Number(d.time.slice(0, 2) || 0),
      Number(d.time.slice(2, 4) || 0),
      Number(d.time.slice(4, 6) || 0),
    ),
  );
  return {
    date: `${pad(dt.getFullYear(), 4)}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}`,
    time: `${pad(dt.getHours())}${pad(dt.getMinutes())}${pad(dt.getSeconds())}`,
    utc: false,
  };
}

function toRow(props: Map<string, Prop>): IcsRow {
  const startProp = props.get('DTSTART');
  const endProp = props.get('DTEND');
  const allDay = startProp?.params.VALUE?.toUpperCase() === 'DATE';

  let start: IcsDate | null = startProp ? readIcsDate(startProp.value) : null;
  let end: IcsDate | null = endProp ? readIcsDate(endProp.value) : null;
  const timeZone = startProp?.params.TZID ?? '';

  // A value ending in Z is UTC. Convert it to the machine's zone and leave the
  // zone column empty; a TZID keeps its wall clock and reports the zone name.
  if (start?.utc) start = toLocal(start);
  if (end?.utc) end = toLocal(end);

  let startDate = start ? isoFromCompact(start.date) : '';
  let startTime = start && !allDay && start.time ? `${start.time.slice(0, 2)}:${start.time.slice(2, 4)}` : '';
  let endDate = end ? isoFromCompact(end.date) : '';
  let endTime = end && !allDay && end.time ? `${end.time.slice(0, 2)}:${end.time.slice(2, 4)}` : '';

  if (allDay) {
    // ICS all-day end dates are exclusive; the last day shown is DTEND minus one.
    if (end) {
      endDate = isoFromCompact(addDays(end.date, -1));
    } else {
      endDate = startDate;
    }
    endTime = '';
  }

  return {
    title: unescapeText(props.get('SUMMARY')?.value ?? ''),
    startDate,
    startTime,
    endDate,
    endTime,
    allDay: allDay ? 'Yes' : 'No',
    location: unescapeText(props.get('LOCATION')?.value ?? ''),
    description: unescapeText(props.get('DESCRIPTION')?.value ?? ''),
    repeats: props.get('RRULE')?.value ?? '',
    timeZone,
  };
}

const SKIP_BLOCKS = new Set(['VALARM', 'VTODO', 'VTIMEZONE']);

/** Unfold: a line starting with a space or tab continues the line before it. */
export function unfoldLines(text: string): string[] {
  const physical = text.replace(/\r\n?/g, '\n').split('\n');
  const lines: string[] = [];
  for (const line of physical) {
    if ((line.startsWith(' ') || line.startsWith('\t')) && lines.length) {
      lines[lines.length - 1] += line.slice(1);
    } else {
      lines.push(line);
    }
  }
  return lines;
}

export function parseIcs(text: string): IcsRow[] {
  const lines = unfoldLines(text);

  const rows: IcsRow[] = [];
  let props: Map<string, Prop> | null = null;
  let skip: string | null = null;

  for (const line of lines) {
    const upper = line.toUpperCase();
    const begin = upper.match(/^BEGIN:(\S+)/);
    if (begin) {
      const name = begin[1];
      if (name === 'VEVENT') {
        props = new Map();
        skip = null;
      } else if (SKIP_BLOCKS.has(name)) {
        skip = name;
      }
      continue;
    }
    const end = upper.match(/^END:(\S+)/);
    if (end) {
      const name = end[1];
      if (name === 'VEVENT') {
        if (props) rows.push(toRow(props));
        props = null;
        skip = null;
      } else if (name === skip) {
        skip = null;
      }
      continue;
    }
    if (props && !skip) {
      const prop = readProp(line);
      if (prop && prop.name) props.set(prop.name, prop);
    }
  }

  return rows;
}

const CSV_HEADERS = [
  'Title',
  'Start date',
  'Start time',
  'End date',
  'End time',
  'All day',
  'Location',
  'Description',
  'Repeats',
  'Time zone',
];

const CSV_KEYS: (keyof IcsRow)[] = [
  'title',
  'startDate',
  'startTime',
  'endDate',
  'endTime',
  'allDay',
  'location',
  'description',
  'repeats',
  'timeZone',
];

/** Calendar rows → CSV text with CRLF endings, quoted the same way as the other CSV output. */
export function icsRowsToCsv(rows: IcsRow[]): string {
  return Papa.unparse(
    { fields: CSV_HEADERS, data: rows.map((row) => CSV_KEYS.map((key) => row[key])) },
    { delimiter: ',', newline: '\r\n' },
  );
}
