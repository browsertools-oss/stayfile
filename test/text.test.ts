import { describe, expect, it } from 'vitest';
import { textItemsToString, wrapText, textPages } from '../src/lib/text';

describe('textItemsToString', () => {
  it('joins runs and ends lines where pdf.js says they end', () => {
    expect(textItemsToString([
      { str: 'Hello ' }, { str: 'world', hasEOL: true },
      { str: 'Second ' }, { str: 'line', hasEOL: true },
    ])).toBe('Hello world\nSecond line\n');
  });

  it('keeps a blank line between paragraphs but never two', () => {
    expect(textItemsToString([
      { str: 'One', hasEOL: true },
      { str: '', hasEOL: true },
      { str: '', hasEOL: true },
      { str: '', hasEOL: true },
      { str: 'Two', hasEOL: true },
    ])).toBe('One\n\nTwo\n');
  });

  it('trims spaces at line ends and drops carriage returns', () => {
    expect(textItemsToString([
      { str: 'a \r', hasEOL: true },
      { str: 'b\t', hasEOL: true },
    ])).toBe('a\nb\n');
  });

  it('returns an empty string for no items', () => {
    expect(textItemsToString([])).toBe('');
  });
});

describe('wrapText', () => {
  it('wraps words to the line width', () => {
    expect(wrapText('Hello world foo bar', 11)).toEqual(['Hello world', 'foo bar']);
  });

  it('packs words up to the limit, then starts a new line', () => {
    expect(wrapText('aa bb cc dd', 5)).toEqual(['aa bb', 'cc dd']);
  });

  it('hard-splits a word longer than the limit', () => {
    expect(wrapText('abcdefghij', 4)).toEqual(['abcd', 'efgh', 'ij']);
  });

  it('flushes the current line before an over-long word', () => {
    expect(wrapText('ab cdefghij kl', 4)).toEqual(['ab', 'cdef', 'ghij', 'kl']);
  });

  it('keeps blank lines', () => {
    expect(wrapText('a\n\nb', 10)).toEqual(['a', '', 'b']);
  });

  it('normalises carriage returns', () => {
    expect(wrapText('a\r\nb', 10)).toEqual(['a', 'b']);
  });

  it('throws on a limit below 1', () => {
    expect(() => wrapText('a', 0)).toThrow();
  });
});

describe('textPages', () => {
  it('splits wrapped lines into pages of at most maxLines', () => {
    expect(textPages('one\ntwo\nthree\nfour\nfive\nsix', 10, 2)).toEqual([
      ['one', 'two'],
      ['three', 'four'],
      ['five', 'six'],
    ]);
  });

  it('always returns at least one page, even for empty text', () => {
    expect(textPages('', 10, 5)).toEqual([['']]);
  });

  it('throws on maxLines below 1', () => {
    expect(() => textPages('a', 10, 0)).toThrow();
  });
});
