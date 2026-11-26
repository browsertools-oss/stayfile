// Shared logic for the fitness pages: read a Strava activities.csv, pick the
// activity files, unpack .gz, and convert FIT or TCX to GPX. No DOM here.
import Papa from 'papaparse';
import { gunzipSync } from 'fflate';
import { readFit, type FitActivity } from './fit';
import { toGpx, readTcx, countTrackPoints } from './gpx';

export interface ActivityInfo {
  id: string;
  date?: string;
  name?: string;
  type?: string;
}

const MONTHS: Record<string, string> = {
  Jan: '01',
  Feb: '02',
  Mar: '03',
  Apr: '04',
  May: '05',
  Jun: '06',
  Jul: '07',
  Aug: '08',
  Sep: '09',
  Oct: '10',
  Nov: '11',
  Dec: '12',
};

function parseDate(s: string): string | undefined {
  const t = s.trim();
  let m = /^([A-Z][a-z]{2}) (\d{1,2}), (\d{4})/.exec(t);
  if (m) {
    const mm = MONTHS[m[1]];
    if (!mm) return undefined;
    return `${m[3]}-${mm}-${m[2].padStart(2, '0')}`;
  }
  m = /^(\d{4})-(\d{2})-(\d{2})/.exec(t);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  return undefined;
}

/** Read activities.csv into a map keyed by the lowercased Filename value. */
export function readActivitiesCsv(text: string): Map<string, ActivityInfo> {
  const out = new Map<string, ActivityInfo>();
  const parsed = Papa.parse(text, { skipEmptyLines: true });
  const rows = parsed.data as string[][];
  if (!rows.length) return out;
  const head = rows[0].map((h) => String(h).trim());
  const col = (name: string) => head.indexOf(name);
  const fileCol = col('Filename');
  if (fileCol < 0) return out;
  const idCol = col('Activity ID');
  const dateCol = col('Activity Date');
  const nameCol = col('Activity Name');
  const typeCol = col('Activity Type');
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const file = r[fileCol];
    if (!file) continue;
    const info: ActivityInfo = { id: idCol >= 0 ? String(r[idCol] ?? '') : '' };
    if (dateCol >= 0) {
      const d = parseDate(String(r[dateCol] ?? ''));
      if (d) info.date = d;
    }
    if (nameCol >= 0 && r[nameCol]) info.name = String(r[nameCol]);
    if (typeCol >= 0 && r[typeCol]) info.type = String(r[typeCol]);
    out.set(file.toLowerCase(), info);
  }
  return out;
}

/** A path in the activities folder with a FIT, TCX or GPX file, optionally gzipped. */
export function isActivityPath(path: string): boolean {
  return /(^|\/)activities\/[^/]+\.(fit|tcx|gpx)(\.gz)?$/i.test(path);
}

/** A safe output name: date and activity name, else the name, else the file id. */
export function outName(info: ActivityInfo | undefined, path: string, ext: string): string {
  let base: string;
  if (info?.date && info.name) base = `${info.date} ${info.name}`;
  else if (info?.name) base = info.name;
  else {
    const last = path.split('/').pop() ?? path;
    base = last.replace(/\.gz$/i, '').replace(/\.[^.]+$/, '') || 'activity';
  }
  base = base
    .replace(/[/\\:*?"<>|]/g, '-')
    .replace(/[\x00-\x1f\x7f]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
  return `${base}.${ext}`;
}

/** Drop a .gz wrapper when there is one. */
export function unpack(path: string, bytes: Uint8Array): { path: string; bytes: Uint8Array } {
  if (/\.gz$/i.test(path)) return { path: path.slice(0, -3), bytes: gunzipSync(bytes) };
  return { path, bytes };
}

/** Convert one activity file to GPX, or say why it was skipped. */
export function convert(
  path: string,
  bytes: Uint8Array,
  o: { name?: string; type?: string; extras: boolean },
): { gpx?: string; skip?: 'no-gps' | 'unreadable' } {
  try {
    const u = unpack(path, bytes);
    const lower = u.path.toLowerCase();
    if (lower.endsWith('.gpx')) return { gpx: new TextDecoder().decode(u.bytes) };
    let a: FitActivity;
    if (lower.endsWith('.fit')) a = readFit(u.bytes);
    else if (lower.endsWith('.tcx')) a = readTcx(new TextDecoder().decode(u.bytes));
    else return { skip: 'unreadable' };
    if (countTrackPoints(a) === 0) return { skip: 'no-gps' };
    return {
      gpx: toGpx({ name: o.name, type: o.type || a.sport, points: a.points }, { extras: o.extras }),
    };
  } catch {
    return { skip: 'unreadable' };
  }
}

/** Garmin's export hides FIT files in zips under the Uploaded Files folder. */
export function garminFitPaths(entries: { name: string }[]): { fits: string[]; inner: string[] } {
  const fits: string[] = [];
  const inner: string[] = [];
  for (const e of entries) {
    const lower = e.name.toLowerCase();
    if (lower.endsWith('.fit')) fits.push(e.name);
    else if (lower.endsWith('.zip') && lower.includes('uploaded')) inner.push(e.name);
  }
  return { fits, inner };
}
