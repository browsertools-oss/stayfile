import { describe, test, expect } from 'vitest';
import { gzipSync } from 'fflate';
import { readActivitiesCsv, isActivityPath, outName, convert, garminFitPaths } from '../src/lib/fitness';
import { definition, data, file, t253, hrF, fitSeconds, recordFile } from './fit-helper';

const csv = `Activity ID,Activity Date,Activity Name,Activity Type,Elapsed Time,Distance,Filename
123,"Nov 20, 2026, 10:30:00 AM","Morning Run, easy",Run,3600,10000,activities/123.fit.gz
124,"Nov 21, 2026, 7:00:00 AM",Ride,Ride,5400,30000,activities/124.tcx.gz
125,2026-11-22,Walk,Walk,1800,2000,activities/125.gpx`;

describe('readActivitiesCsv', () => {
  test('maps each file name to its date, name and type', () => {
    const map = readActivitiesCsv(csv);
    expect(map.size).toBe(3);
    const a = map.get('activities/123.fit.gz')!;
    expect(a.id).toBe('123');
    expect(a.date).toBe('2026-11-20');
    expect(a.name).toBe('Morning Run, easy');
    expect(a.type).toBe('Run');
    expect(map.get('activities/125.gpx')!.date).toBe('2026-11-22');
  });

  test('a file with no Filename column gives an empty map', () => {
    expect(readActivitiesCsv('Activity ID,Activity Name\n1,Run').size).toBe(0);
  });
});

describe('outName', () => {
  test('date and name, then name, then the file id', () => {
    expect(outName({ id: '1', date: '2026-11-20', name: 'Morning Run' }, 'activities/1.fit.gz', 'gpx')).toBe(
      '2026-11-20 Morning Run.gpx',
    );
    expect(outName({ id: '1', name: 'A/B' }, 'x', 'gpx')).toBe('A-B.gpx');
    expect(outName(undefined, 'activities/123.fit.gz', 'gpx')).toBe('123.gpx');
  });
});

describe('isActivityPath', () => {
  test('takes activity files and refuses other files', () => {
    expect(isActivityPath('export_1/activities/9.tcx.gz')).toBe(true);
    expect(isActivityPath('activities/1.fit')).toBe(true);
    expect(isActivityPath('media/1.jpg')).toBe(false);
  });
});

describe('convert', () => {
  test('a gzipped FIT gives a GPX track', () => {
    const r = convert('activities/1.fit.gz', gzipSync(recordFile()), {
      name: 'Morning Run',
      type: 'Run',
      extras: true,
    });
    expect(r.gpx).toContain('<trkpt');
    expect(r.gpx).toContain('<name>Morning Run</name>');
  });

  test('a FIT with no positions is skipped as no-gps', () => {
    const noGps = file([
      ...definition(0, 20, [t253, hrF]),
      ...data(0, [t253, hrF], [fitSeconds, 140]),
    ]);
    expect(convert('x.fit', noGps, { extras: true }).skip).toBe('no-gps');
  });

  test('random bytes named .fit do not throw', () => {
    const r = convert('x.fit', new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]), { extras: true });
    expect(r.skip === 'unreadable' || r.skip === 'no-gps').toBe(true);
  });
});

describe('garminFitPaths', () => {
  test('finds FIT files and the zips under the uploaded folder', () => {
    const g = garminFitPaths([
      { name: 'DI_CONNECT/DI-Connect-Uploaded-Files/UploadedFiles_0-_Part1.zip' },
      { name: 'a/b.fit' },
    ]);
    expect(g.inner).toEqual(['DI_CONNECT/DI-Connect-Uploaded-Files/UploadedFiles_0-_Part1.zip']);
    expect(g.fits).toEqual(['a/b.fit']);
  });
});
