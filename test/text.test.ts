import { describe, expect, it } from 'vitest';
import { textItemsToString } from '../src/lib/text';

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
