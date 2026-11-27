import { describe, test, expect } from 'vitest';
import * as XLSX from 'xlsx';
import {
  readChat,
  chatRows,
  chatTitle,
  findChatTxt,
  isChatImage,
  csvSafe,
} from '../src/lib/whatsapp';
import { rowsToXlsx } from '../src/lib/xlsx';

const NBSP = ' ';
const LRM = '‎';

const cases = [
  {
    name: 'A iPhone day first 24 hour',
    format: 'iphone',
    line1: '[20/11/2026, 14:05:09] Anna: See you at 6',
    line2: '[20/11/2026, 14:06:09] Anna: Second',
    time: '14:05:09',
    text1: 'See you at 6',
  },
  {
    name: 'B iPhone US 12 hour',
    format: 'iphone',
    line1: `[11/20/26, 2:05:09${NBSP}PM] Anna: See you at 6`,
    line2: `[11/20/26, 2:06:09${NBSP}PM] Anna: Second`,
    time: '14:05:09',
    text1: 'See you at 6',
  },
  {
    name: 'C iPhone dots',
    format: 'iphone',
    line1: '[20.11.26, 14:05:09] Anna: Bis gleich',
    line2: '[20.11.26, 14:06:09] Anna: Second',
    time: '14:05:09',
    text1: 'Bis gleich',
  },
  {
    name: 'D Android day first 24 hour',
    format: 'android',
    line1: '20/11/2026, 14:05 - Anna: See you at 6',
    line2: '20/11/2026, 14:06 - Anna: Second',
    time: '14:05',
    text1: 'See you at 6',
  },
  {
    name: 'E Android US 12 hour',
    format: 'android',
    line1: `11/20/26, 2:05${NBSP}PM - Anna: See you at 6`,
    line2: `11/20/26, 2:06${NBSP}PM - Anna: Second`,
    time: '14:05',
    text1: 'See you at 6',
  },
  {
    name: 'F Android dashes no comma',
    format: 'android',
    line1: '20-11-2026 14:05 - Anna: Tot zo',
    line2: '20-11-2026 14:06 - Anna: Second',
    time: '14:05',
    text1: 'Tot zo',
  },
];

describe('readChat formats', () => {
  for (const c of cases) {
    test(c.name, () => {
      const chat = readChat([c.line1, c.line2, 'and a second line'].join('\n'));
      expect(chat.format).toBe(c.format);
      expect(chat.messages).toHaveLength(2);
      expect(chat.messages[0].date).toBe('2026-11-20');
      expect(chat.messages[0].sender).toBe('Anna');
      expect(chat.messages[0].text).toBe(c.text1);
      expect(chat.messages[0].time).toBe(c.time);
      expect(chat.messages[1].text).toBe('Second\nand a second line');
    });
  }
});

describe('dates and times', () => {
  test('an ambiguous day and month can be overridden, and a clear date settles it', () => {
    const one = readChat('[03/04/2026, 09:00:00] Anna: hi');
    expect(one.ambiguous).toBe(true);
    expect(one.messages[0].date).toBe('2026-04-03');
    const mdy = readChat('[03/04/2026, 09:00:00] Anna: hi', { order: 'mdy' });
    expect(mdy.messages[0].date).toBe('2026-03-04');
    const two = readChat('[03/04/2026, 09:00:00] Anna: hi\n[25/04/2026, 09:00:00] Anna: later');
    expect(two.order).toBe('dmy');
    expect(two.ambiguous).toBe(false);
  });

  test('12 AM is 00, 12 PM is 12 and 1 PM is 13', () => {
    expect(readChat(`[11/20/26, 12:05${NBSP}AM] Anna: x`).messages[0].time).toBe('00:05');
    expect(readChat(`[11/20/26, 12:05${NBSP}PM] Anna: x`).messages[0].time).toBe('12:05');
    expect(readChat(`[11/20/26, 1:05${NBSP}PM] Anna: x`).messages[0].time).toBe('13:05');
  });
});

describe('attachments, system lines and kinds', () => {
  test('iPhone attachment name is kept and the tag removed', () => {
    const chat = readChat(
      `[20/11/2026, 14:06:00] Anna: ${LRM}<attached: 00000012-PHOTO-2026-11-20-14-06-00.jpg>`,
    );
    expect(chat.messages[0].attachment).toBe('00000012-PHOTO-2026-11-20-14-06-00.jpg');
    expect(chat.messages[0].text).toBe('');
  });

  test('Android attachment keeps its caption line', () => {
    const chat = readChat(
      ['20/11/2026, 14:06 - Anna: IMG-20261120-WA0003.jpg (file attached)', 'a caption line'].join('\n'),
    );
    expect(chat.messages[0].attachment).toBe('IMG-20261120-WA0003.jpg');
    expect(chat.messages[0].text).toBe('a caption line');
  });

  test('Android and iPhone encryption notices are system lines with no sender', () => {
    const android = readChat(
      '20/11/2026, 14:00 - Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them. Tap to learn more.',
    );
    expect(android.messages[0].kind).toBe('system');
    expect(android.messages[0].sender).toBe('');

    const iphone = readChat(
      `[20/11/2026, 14:00:00] Family: ${LRM}Messages and calls are end-to-end encrypted.\n[20/11/2026, 14:01:00] Anna: hi`,
    );
    expect(iphone.messages[0].kind).toBe('system');
    expect(iphone.messages[0].sender).toBe('');
    expect(chatRows(iphone, { system: false })).toHaveLength(2);
    expect(chatRows(iphone, { system: true })).toHaveLength(3);
    expect(chatRows(android, { system: false })).toHaveLength(1);
  });

  test('omitted and deleted messages are marked', () => {
    const chat = readChat(
      [
        '[20/11/2026, 14:00:00] Anna: <Media omitted>',
        `[20/11/2026, 14:01:00] Anna: ${LRM}image omitted`,
        '[20/11/2026, 14:02:00] Anna: This message was deleted',
      ].join('\n'),
    );
    expect(chat.messages.map((m) => m.kind)).toEqual(['omitted', 'omitted', 'deleted']);
  });
});

describe('names and safety', () => {
  test('chatTitle and findChatTxt', () => {
    expect(chatTitle('WhatsApp Chat with Anna.txt')).toBe('Chat with Anna');
    expect(chatTitle('WhatsApp Chat - Ben.txt')).toBe('Chat with Ben');
    expect(chatTitle('_chat.txt')).toBe('Chat');
    expect(findChatTxt(['x/_chat.txt', 'a.jpg'])).toBe('x/_chat.txt');
    expect(findChatTxt(['a.jpg'])).toBeUndefined();
  });

  test('isChatImage reads the usual photo extensions', () => {
    expect(isChatImage('a.JPG')).toBe(true);
    expect(isChatImage('a.webp')).toBe(true);
    expect(isChatImage('a.txt')).toBe(false);
  });

  test('csvSafe guards formula starts only', () => {
    expect(csvSafe('=SUM(A1)')).toBe("'=SUM(A1)");
    expect(csvSafe('+1')).toBe("'+1");
    expect(csvSafe('@here')).toBe("'@here");
    expect(csvSafe('-ok')).toBe('-ok');
    expect(csvSafe('')).toBe('');
    const random = Array.from({ length: 1000 }, () =>
      String.fromCharCode(32 + Math.floor(Math.random() * 200)),
    ).join('');
    expect(() => csvSafe(random)).not.toThrow();
  });
});

describe('edge cases', () => {
  test('5,000 messages read in under two seconds', () => {
    const lines = Array.from({ length: 5000 }, (_, i) => `20/11/2026, 14:05 - Anna: message ${i}`);
    const started = Date.now();
    const chat = readChat(lines.join('\n'));
    const elapsed = Date.now() - started;
    expect(chat.messages).toHaveLength(5000);
    expect(elapsed).toBeLessThan(2000);
  });

  test('a colon inside the message text is kept', () => {
    const chat = readChat('20/11/2026, 14:05 - Anna: time: 5pm');
    expect(chat.messages[0].sender).toBe('Anna');
    expect(chat.messages[0].text).toBe('time: 5pm');
  });
});

describe('rowsToXlsx', () => {
  test('a message that starts with = stays text', () => {
    const bytes = rowsToXlsx([['message'], ['=1+1']]);
    const wb = XLSX.read(bytes, { type: 'array' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    expect((ws.A2 as XLSX.CellObject).t).toBe('s');
    expect((ws.A2 as XLSX.CellObject).v).toBe('=1+1');
  });
});
