// GPX output and TCX reading for the fitness tools.
import type { FitActivity, FitPoint } from './fit';

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const iso = (t: number) => new Date(t).toISOString().replace('.000Z', 'Z');

/** Build a GPX 1.1 track. Points without a position are left out. */
export function toGpx(
  a: { name?: string; type?: string; points: FitPoint[] },
  o?: { extras?: boolean },
): string {
  const extras = o?.extras !== false;
  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<gpx version="1.1" creator="Stayfile" xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1">',
    '<trk>',
  ];
  if (a.name) lines.push(`<name>${escapeXml(a.name)}</name>`);
  if (a.type) lines.push(`<type>${escapeXml(a.type)}</type>`);
  lines.push('<trkseg>');
  for (const p of a.points) {
    if (p.lat === undefined || p.lon === undefined) continue;
    const parts: string[] = [`<trkpt lat="${p.lat}" lon="${p.lon}">`];
    if (p.ele !== undefined) parts.push(`<ele>${p.ele.toFixed(1)}</ele>`);
    if (p.t !== undefined) parts.push(`<time>${iso(p.t)}</time>`);
    if (extras && (p.hr !== undefined || p.cad !== undefined)) {
      const inner: string[] = [];
      if (p.hr !== undefined) inner.push(`<gpxtpx:hr>${p.hr}</gpxtpx:hr>`);
      if (p.cad !== undefined) inner.push(`<gpxtpx:cad>${p.cad}</gpxtpx:cad>`);
      parts.push(
        `<extensions><gpxtpx:TrackPointExtension>${inner.join('')}</gpxtpx:TrackPointExtension></extensions>`,
      );
    }
    parts.push('</trkpt>');
    lines.push(parts.join(''));
  }
  lines.push('</trkseg>', '</trk>', '</gpx>');
  return lines.join('\n');
}

const tag = (block: string, name: string): string | undefined => {
  const m = new RegExp(`<(?:\\w+:)?${name}>([\\s\\S]*?)</(?:\\w+:)?${name}>`, 'i').exec(block);
  return m ? m[1].trim() : undefined;
};

const num = (s: string | undefined): number | undefined => {
  if (s === undefined) return undefined;
  const v = parseFloat(s);
  return Number.isFinite(v) ? v : undefined;
};

/** Read the track points and sport out of a TCX file. */
export function readTcx(text: string): FitActivity {
  const s = text.trim();
  const out: FitActivity = { points: [] };
  const sport = /<Activity[^>]*\bSport="([^"]*)"/i.exec(s);
  if (sport) {
    const v = sport[1].toLowerCase();
    if (v === 'biking') out.sport = 'cycling';
    else if (v !== 'other') out.sport = v;
  }
  const re = /<(?:\w+:)?Trackpoint>([\s\S]*?)<\/(?:\w+:)?Trackpoint>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    const block = m[1];
    const p: FitPoint = {};
    const time = tag(block, 'Time');
    if (time) {
      const t = Date.parse(time);
      if (Number.isFinite(t)) p.t = t;
    }
    const lat = num(tag(block, 'LatitudeDegrees'));
    const lon = num(tag(block, 'LongitudeDegrees'));
    const ele = num(tag(block, 'AltitudeMeters'));
    const hrBlock = tag(block, 'HeartRateBpm');
    const hr = num(hrBlock ? tag(hrBlock, 'Value') : undefined);
    const cad = num(tag(block, 'Cadence'));
    const dist = num(tag(block, 'DistanceMeters'));
    if (lat !== undefined) p.lat = lat;
    if (lon !== undefined) p.lon = lon;
    if (ele !== undefined) p.ele = ele;
    if (hr !== undefined) p.hr = hr;
    if (cad !== undefined) p.cad = cad;
    if (dist !== undefined) p.dist = dist;
    out.points.push(p);
  }
  return out;
}

/** Points that have a position. */
export function countTrackPoints(a: FitActivity): number {
  return a.points.filter((p) => p.lat !== undefined && p.lon !== undefined).length;
}
