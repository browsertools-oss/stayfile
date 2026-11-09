import { describe, it, expect } from 'vitest';
import { jpgPageName } from '../src/lib/pdf';

describe('jpgPageName', () => {
  it('pads page numbers to at least two digits', () => {
    expect(jpgPageName('report', 1, 3)).toBe('report-page-01.jpg');
    expect(jpgPageName('report', 3, 3)).toBe('report-page-03.jpg');
  });

  it('widens the padding to match the page count', () => {
    expect(jpgPageName('deck', 7, 120)).toBe('deck-page-007.jpg');
    expect(jpgPageName('deck', 120, 120)).toBe('deck-page-120.jpg');
  });
});
