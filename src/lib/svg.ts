// SVG helpers. Kept pure so the size reader can be tested in Node; drawing the file needs the browser.

export interface SvgSize {
  width: number;
  height: number;
}

const UNIT: Record<string, number> = {
  px: 1,
  pt: 96 / 72,
  pc: 16,
  in: 96,
  cm: 96 / 2.54,
  mm: 96 / 25.4,
  q: 96 / 25.4 / 10,
};

/** A length like "120", "120px" or "10cm" as CSS pixels. Percentages and font units return null. */
export function svgLength(v: string): number | null {
  const m = v.trim().match(/^(-?(?:\d+|\d*\.\d+))(px|pt|pc|in|cm|mm|q)?$/i);
  if (!m) return null;
  const n = parseFloat(m[1]);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n * UNIT[(m[2] ?? 'px').toLowerCase()];
}

/**
 * Intrinsic size of an SVG document, or null when it has none (a plain viewBox-only icon is fine;
 * a width-only tag with no viewBox is not, since the aspect ratio is unknown).
 */
export function svgIntrinsicSize(text: string): SvgSize | null {
  const tag = text.match(/<svg\b[^>]*>/i);
  if (!tag) return null;
  const attr = (name: string): string | null => {
    const a = tag[0].match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i'));
    return a ? (a[2] ?? a[3] ?? '') : null;
  };
  const w = attr('width') != null ? svgLength(attr('width')!) : null;
  const h = attr('height') != null ? svgLength(attr('height')!) : null;
  if (w && h) return { width: Math.round(w), height: Math.round(h) };
  const vb = attr('viewBox');
  if (vb) {
    const p = vb.trim().split(/[\s,]+/).map(Number);
    if (p.length === 4 && p.every(Number.isFinite) && p[2] > 0 && p[3] > 0) {
      const ratio = p[2] / p[3];
      if (w) return { width: Math.round(w), height: Math.max(1, Math.round(w / ratio)) };
      if (h) return { width: Math.max(1, Math.round(h * ratio)), height: Math.round(h) };
      return { width: Math.round(p[2]), height: Math.round(p[3]) };
    }
  }
  return null;
}

/** Keep a canvas within browser limits: scale down so the long side is at most maxPx. */
export function clampSize(s: SvgSize, maxPx: number): SvgSize {
  const long = Math.max(s.width, s.height);
  if (long <= maxPx) return { width: Math.max(1, Math.round(s.width)), height: Math.max(1, Math.round(s.height)) };
  const k = maxPx / long;
  return { width: Math.max(1, Math.round(s.width * k)), height: Math.max(1, Math.round(s.height * k)) };
}
