// Reads the text file WhatsApp's Export chat saves and turns it into rows.
// Plain TypeScript: no DOM and no new dependency.

export type Order = 'dmy' | 'mdy' | 'ymd';
export type ChatKind = 'message' | 'system' | 'omitted' | 'deleted';

export interface ChatMessage {
  date: string;
  time: string;
  sender: string;
  text: string;
  attachment?: string;
  kind: ChatKind;
}

export interface Chat {
  messages: ChatMessage[];
  format: 'iphone' | 'android' | 'unknown';
  order: Order;
  ambiguous: boolean;
  senders: string[];
}

const IPHONE = /^\[(\d{1,4})[./-](\d{1,2})[./-](\d{1,4}),? (\d{1,2}):(\d{2})(?::(\d{2}))?(?: ?([ap])\.? ?m\.?)?\] ([\s\S]*)$/i;
const ANDROID = /^(\d{1,4})[./-](\d{1,2})[./-](\d{1,4}),? (\d{1,2}):(\d{2})(?::(\d{2}))?(?: ?([ap])\.? ?m\.?)? - ([\s\S]*)$/i;

/** Zero-width and direction marks the phones put in the file. */
const MARKS = /[‎‏‪-‮⁦-⁩]/g;
/** Narrow no-break space and no-break space become plain spaces. */
const NARROW = /[  ]/g;

const clean = (s: string) => s.replace(MARKS, '').replace(NARROW, ' ');

interface Header {
  p1s: string;
  p2s: string;
  p3s: string;
  sep: string;
  hour: string;
  minute: string;
  second?: string;
  ampm?: string;
  rest: string;
  raw: string;
}

function readHeader(line: string, raw: string, format: 'iphone' | 'android'): Header | null {
  const m = (format === 'iphone' ? IPHONE : ANDROID).exec(line);
  if (!m) return null;
  const firstSep = /[./-]/.exec(m[0]);
  return {
    p1s: m[1],
    p2s: m[2],
    p3s: m[3],
    sep: firstSep ? firstSep[0] : '/',
    hour: m[4],
    minute: m[5],
    second: m[6],
    ampm: m[7],
    rest: m[8],
    raw,
  };
}

function pickOrder(headers: Header[], override?: 'dmy' | 'mdy'): { order: Order; ambiguous: boolean } {
  if (!headers.length) return { order: 'dmy', ambiguous: false };
  if (headers.some((h) => h.p1s.length === 4)) return { order: 'ymd', ambiguous: false };
  const certainDmy = headers.some((h) => Number(h.p1s) > 12);
  const certainMdy = headers.some((h) => Number(h.p2s) > 12);
  if (certainDmy) return { order: override ?? 'dmy', ambiguous: false };
  if (certainMdy) return { order: override ?? 'mdy', ambiguous: false };
  const sep = headers[0].sep;
  let order: Order;
  if (sep === '.' || sep === '-') order = 'dmy';
  else if (headers.some((h) => h.ampm)) order = 'mdy';
  else order = 'dmy';
  return { order: override ?? order, ambiguous: true };
}

function toDate(h: Header, order: Order): string {
  let year = h.p3s;
  let month = h.p2s;
  let day = h.p1s;
  if (order === 'ymd') {
    year = h.p1s;
    month = h.p2s;
    day = h.p3s;
  } else if (order === 'mdy') {
    month = h.p1s;
    day = h.p2s;
    year = h.p3s;
  }
  const y = year.length < 3 ? 2000 + Number(year) : Number(year);
  return `${String(y).padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function toTime(h: Header): string {
  let hour = Number(h.hour);
  const ap = (h.ampm ?? '').toLowerCase();
  if (ap === 'p') {
    if (hour !== 12) hour += 12;
  } else if (ap === 'a') {
    if (hour === 12) hour = 0;
  }
  const hh = String(hour).padStart(2, '0');
  return h.second !== undefined ? `${hh}:${h.minute}:${h.second}` : `${hh}:${h.minute}`;
}

function isDeleted(text: string): boolean {
  return (
    text === 'This message was deleted' ||
    text === 'This message was deleted.' ||
    text === 'You deleted this message' ||
    text === 'You deleted this message.'
  );
}

function isOmitted(text: string): boolean {
  return (
    text === '<Media omitted>' ||
    /^(image|video|audio|sticker|GIF|Contact card) omitted$/i.test(text) ||
    /document omitted$/i.test(text)
  );
}

/** Read an export. Never throws: on any problem it returns what it read so far. */
export function readChat(text: string, o?: { order?: 'dmy' | 'mdy' }): Chat {
  const empty: Chat = { messages: [], format: 'unknown', order: 'dmy', ambiguous: false, senders: [] };
  let messages: ChatMessage[] = [];
  try {
    let body = text;
    if (body.charCodeAt(0) === 0xfeff) body = body.slice(1);
    const raws = body.split(/\r?\n/);
    const lines = raws.map(clean);

    let iphone = 0;
    let android = 0;
    for (const line of lines) {
      if (IPHONE.test(line)) iphone++;
      if (ANDROID.test(line)) android++;
    }
    if (!iphone && !android) return empty;
    const format: 'iphone' | 'android' = android > iphone ? 'android' : 'iphone';

    const headers: Header[] = [];
    for (let i = 0; i < lines.length; i++) {
      const h = readHeader(lines[i], raws[i], format);
      if (h) headers.push(h);
    }
    const { order, ambiguous } = pickOrder(headers, o?.order);

    try {
      for (let i = 0; i < lines.length; i++) {
        const h = readHeader(lines[i], raws[i], format);
        if (!h) {
          if (messages.length) {
            const last = messages[messages.length - 1];
            last.text = last.text ? `${last.text}\n${lines[i]}` : lines[i];
          }
          continue;
        }

        const cut = h.rest.indexOf(': ');
        let sender = '';
        let msgText = h.rest;
        let kind: ChatKind = 'message';
        if (cut === -1) {
          kind = 'system';
        } else {
          sender = h.rest.slice(0, cut);
          msgText = h.rest.slice(cut + 2);
        }

        let attachment: string | undefined;
        if (format === 'iphone') {
          const att = /<attached: ([^>]+)>/.exec(msgText);
          if (att) {
            attachment = att[1];
            msgText = msgText.replace(att[0], '').trim();
          }
        }
        if (!attachment && kind === 'message') {
          const att = /^(.+?\.[A-Za-z0-9]{2,5}) \(file attached\)\n?/.exec(msgText);
          if (att) {
            attachment = att[1];
            msgText = msgText.slice(att[0].length).trim();
          }
        }
        if (!attachment) {
          if (isOmitted(msgText)) kind = 'omitted';
          else if (isDeleted(msgText)) kind = 'deleted';
          else if (kind === 'message' && format === 'iphone' && /: ‎/.test(h.raw)) {
            kind = 'system';
            sender = '';
          }
        }

        const msg: ChatMessage = {
          date: toDate(h, order),
          time: toTime(h),
          sender,
          text: msgText,
          kind,
        };
        if (attachment !== undefined) msg.attachment = attachment;
        messages.push(msg);
      }
    } catch {
      // Keep what was read so far.
    }

    const senders: string[] = [];
    for (const m of messages) if (m.sender && !senders.includes(m.sender)) senders.push(m.sender);

    return { messages, format, order, ambiguous, senders };
  } catch {
    return { ...empty, messages };
  }
}

/** Header row plus one row per message; system lines are optional, and csv cleans the text cells. */
export function chatRows(c: Chat, o: { system: boolean; csv?: boolean }): string[][] {
  const rows: string[][] = [['date', 'time', 'sender', 'message', 'attachment']];
  for (const m of c.messages) {
    if (!o.system && m.kind === 'system') continue;
    rows.push([
      m.date,
      m.time,
      o.csv ? csvSafe(m.sender) : m.sender,
      o.csv ? csvSafe(m.text) : m.text,
      m.attachment ?? '',
    ]);
  }
  return rows;
}

/** The chat name for a heading or a file name, without .txt or .zip. */
export function chatTitle(fileName: string): string {
  const parts = fileName.split(/[\\/]/);
  let base = parts[parts.length - 1] ?? '';
  const dot = base.lastIndexOf('.');
  if (dot > 0) base = base.slice(0, dot);
  const withName = /^WhatsApp Chat with (.+)$/i.exec(base);
  const dashName = /^WhatsApp Chat - (.+)$/i.exec(base);
  let title = base;
  if (withName) title = `Chat with ${withName[1]}`;
  else if (dashName) title = `Chat with ${dashName[1]}`;
  else if (base === '_chat') title = 'Chat';
  return title.replace(/[/\\:*?"<>|]/g, '-');
}

/** The chat text file inside a WhatsApp export zip, when there is one. */
export function findChatTxt(names: string[]): string | undefined {
  const last = (n: string) => n.split(/[\\/]/).pop() ?? n;
  const exact = names.find((n) => last(n) === '_chat.txt');
  if (exact) return exact;
  const named = names.find((n) => /\.txt$/i.test(last(n)) && /^WhatsApp Chat/i.test(last(n)));
  if (named) return named;
  const txts = names.filter((n) => /\.txt$/i.test(last(n)));
  return txts.length === 1 ? txts[0] : undefined;
}

export function isChatImage(name: string): boolean {
  return /\.(jpe?g|png|webp|gif)$/i.test(name);
}

/** A cell starting with =, + or @ gets a leading apostrophe so a spreadsheet does not run it. */
export function csvSafe(v: string): string {
  return /^[=+@]/.test(v) ? `'${v}` : v;
}
