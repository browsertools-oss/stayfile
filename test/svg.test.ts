import { describe, it, expect } from 'vitest';
import { svgLength, svgIntrinsicSize, clampSize } from '../src/lib/svg';

describe('svgLength', () => {
  it('reads plain numbers as px', () => {
    expect(svgLength('240')).toBe(240);
  });
  it('reads px and absolute units', () => {
    expect(svgLength('96px')).toBe(96);
    expect(svgLength('1in')).toBe(96);
    expect(svgLength('72pt')).toBe(96);
    expect(svgLength('2.54cm')).toBeCloseTo(96, 5);
    expect(svgLength('25.4mm')).toBeCloseTo(96, 5);
  });
  it('rejects percentages, font units and junk', () => {
    expect(svgLength('100%')).toBeNull();
    expect(svgLength('2em')).toBeNull();
    expect(svgLength('wide')).toBeNull();
    expect(svgLength('-5')).toBeNull();
    expect(svgLength('0')).toBeNull();
  });
});

describe('svgIntrinsicSize', () => {
  it('reads width and height', () => {
    expect(svgIntrinsicSize('<svg width="240" height="120" xmlns="http://www.w3.org/2000/svg"></svg>')).toEqual({ width: 240, height: 120 });
  });
  it('reads units on the size', () => {
    expect(svgIntrinsicSize(`<svg width="1in" height="48pt"></svg>`)).toEqual({ width: 96, height: 64 });
  });
  it('falls back to the viewBox when there is no size', () => {
    expect(svgIntrinsicSize('<svg viewBox="0 0 300 150"></svg>')).toEqual({ width: 300, height: 150 });
    expect(svgIntrinsicSize(`<svg viewBox='10 20 80 40'></svg>`)).toEqual({ width: 80, height: 40 });
    expect(svgIntrinsicSize('<svg viewBox="0,0,640,480"></svg>')).toEqual({ width: 640, height: 480 });
  });
  it('uses the viewBox ratio when only one side is set', () => {
    expect(svgIntrinsicSize('<svg width="200" viewBox="0 0 100 50"></svg>')).toEqual({ width: 200, height: 100 });
    expect(svgIntrinsicSize('<svg height="50" viewBox="0 0 100 50"></svg>')).toEqual({ width: 100, height: 50 });
  });
  it('ignores percentage sizes', () => {
    expect(svgIntrinsicSize('<svg width="100%" height="100%" viewBox="0 0 32 32"></svg>')).toEqual({ width: 32, height: 32 });
    expect(svgIntrinsicSize('<svg width="100%" height="100%"></svg>')).toBeNull();
  });
  it('returns null for junk', () => {
    expect(svgIntrinsicSize('not an svg')).toBeNull();
    expect(svgIntrinsicSize('<svg width="abc" height="def"></svg>')).toBeNull();
    expect(svgIntrinsicSize('<svg></svg>')).toBeNull();
  });
  it('handles single-quoted attributes and attributes across lines', () => {
    expect(svgIntrinsicSize("<svg width='64'\n height='32'></svg>")).toEqual({ width: 64, height: 32 });
  });
});

describe('clampSize', () => {
  it('leaves small sizes alone', () => {
    expect(clampSize({ width: 100, height: 50 }, 8192)).toEqual({ width: 100, height: 50 });
  });
  it('scales a huge SVG down to the limit', () => {
    expect(clampSize({ width: 40000, height: 20000 }, 8192)).toEqual({ width: 8192, height: 4096 });
  });
});
