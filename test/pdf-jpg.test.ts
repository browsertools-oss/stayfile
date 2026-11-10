import { describe, it, expect } from 'vitest';
import { pageImageName } from '../src/lib/pdf';

describe('pageImageName', () => {
  it('pads page numbers to at least two digits', () => {
    expect(pageImageName('report', 1, 3)).toBe('report-page-01.jpg');
    expect(pageImageName('report', 3, 3)).toBe('report-page-03.jpg');
  });

  it('widens the padding to match the page count', () => {
    expect(pageImageName('deck', 7, 120)).toBe('deck-page-007.jpg');
    expect(pageImageName('deck', 120, 120)).toBe('deck-page-120.jpg');
  });

  it('uses the extension it is given for PNG pages', () => {
    expect(pageImageName('report', 2, 10, 'png')).toBe('report-page-02.png');
  });
});
