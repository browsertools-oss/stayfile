import { describe, test, expect } from 'vitest';
import { readFit, fitToCsvRows } from '../src/lib/fit';
import { toGpx, readTcx, countTrackPoints } from '../src/lib/gpx';
import {
  type F,
  definition,
  data,
  file,
  recordFields,
  latF,
  lonF,
  t253,
  fitSeconds,
  deg,
  recordFile,
} from './fit-helper';

describe('readFit', () => {
  test('a definition and three records give three points', () => {
    const a = readFit(recordFile());
    expect(a.points).toHaveLength(3);
    const p = a.points[0];
    expect(p.t).toBe(Date.UTC(2026, 10, 20, 10, 30));
    expect(p.lat!).toBeCloseTo(37.775, 6);
    expect(p.lon!).toBeCloseTo(-122.419444, 6);
    expect(p.ele!).toBeCloseTo(12.4, 6);
    expect(p.hr).toBe(140);
  });

  test('compressed timestamp records use the header, including the wrap', () => {
    const low = fitSeconds & ~0x1f;
    const start = low + 20;
    const fields = [latF, lonF];
    let last = start;
    const compTs = (offset: number) => {
      let ts = (last & ~0x1f) + offset;
      if (offset < (last & 0x1f)) ts += 0x20;
      last = ts;
      return ts;
    };
    const a = readFit(
      file([
        ...definition(0, 20, [t253, ...fields]),
        ...data(0, [t253, ...fields], [start, deg(37.775), deg(-122.419444)]),
        ...definition(1, 20, fields),
        0x80 | (1 << 5) | 5,
        ...data(1, fields, [deg(37.776), deg(-122.4194)]).slice(1),
        0x80 | (1 << 5) | 25,
        ...data(1, fields, [deg(37.777), deg(-122.4193)]).slice(1),
      ]),
    );
    expect(a.points).toHaveLength(3);
    expect(a.points[0].t).toBe((start + 631065600) * 1000);
    const first = compTs(5);
    const second = compTs(25);
    expect(a.points[1].t).toBe((first + 631065600) * 1000);
    expect(a.points[2].t).toBe((second + 631065600) * 1000);
    expect(first & 0x1f).toBe(5);
    expect(second).toBe((first & ~0x1f) + 25);
  });

  test('a big-endian definition reads the same values', () => {
    const a = readFit(
      file([
        ...definition(0, 20, recordFields, { be: true }),
        ...data(0, recordFields, [fitSeconds, deg(37.775), deg(-122.419444), 2562, 140], { be: true }),
      ]),
    );
    const p = a.points[0];
    expect(p.lat!).toBeCloseTo(37.775, 6);
    expect(p.lon!).toBeCloseTo(-122.419444, 6);
    expect(p.ele!).toBeCloseTo(12.4, 6);
    expect(p.hr).toBe(140);
  });

  test('a developer field is skipped and later records still parse', () => {
    const a = readFit(
      file([
        ...definition(0, 20, recordFields, { dev: [2] }),
        ...data(0, recordFields, [fitSeconds, deg(37.775), deg(-122.419444), 2562, 140], { dev: [2] }),
        ...data(0, recordFields, [fitSeconds + 1, deg(37.776), deg(-122.4194), 2565, 141], { dev: [2] }),
      ]),
    );
    expect(a.points).toHaveLength(2);
    expect(a.points[1].hr).toBe(141);
    expect(a.points[1].lat!).toBeCloseTo(37.776, 6);
  });

  test('invalid values mean not present', () => {
    const a = readFit(
      file([
        ...definition(0, 20, recordFields),
        ...data(0, recordFields, [fitSeconds, 0x7fffffff, deg(-122.419444), 2562, 0xff]),
      ]),
    );
    const p = a.points[0];
    expect(p.lat).toBeUndefined();
    expect(p.hr).toBeUndefined();
    expect(p.lon!).toBeCloseTo(-122.419444, 6);
  });

  test('two chained files give the points of both', () => {
    const one = file([
      ...definition(0, 20, recordFields),
      ...data(0, recordFields, [fitSeconds, deg(37.775), deg(-122.419444), 2562, 140]),
    ]);
    const two = file([
      ...definition(0, 20, recordFields),
      ...data(0, recordFields, [fitSeconds + 1, deg(37.776), deg(-122.4194), 2565, 141]),
    ]);
    const joined = new Uint8Array(one.length + two.length);
    joined.set(one);
    joined.set(two, one.length);
    const a = readFit(joined);
    expect(a.points).toHaveLength(2);
    expect(a.points[1].hr).toBe(141);
  });

  test('a session message gives the sport', () => {
    const sportF: F = { num: 5, size: 1, type: 0x02 };
    const a = readFit(
      file([
        ...definition(0, 20, recordFields),
        ...data(0, recordFields, [fitSeconds, deg(37.775), deg(-122.419444), 2562, 140]),
        ...definition(1, 18, [sportF]),
        ...data(1, [sportF], [1]),
      ]),
    );
    expect(a.sport).toBe('running');
  });

  test('a cut file and random bytes do not throw', () => {
    const b = recordFile();
    expect(() => readFit(b.slice(0, Math.floor(b.length / 2)))).not.toThrow();
    const rnd = new Uint8Array(200);
    for (let i = 0; i < rnd.length; i++) rnd[i] = (i * 37 + 11) % 256;
    expect(() => readFit(rnd)).not.toThrow();
  });

  test('fitToCsvRows writes only the columns that have data', () => {
    const rows = fitToCsvRows(readFit(recordFile()));
    expect(rows[0]).toEqual(['time', 'latitude', 'longitude', 'altitude_m', 'heart_rate']);
    expect(rows).toHaveLength(4);
    expect(rows[1][0]).toBe('2026-11-20T10:30:00Z');
  });
});

describe('gpx', () => {
  test('toGpx writes a track point per positioned point', () => {
    const a = readFit(recordFile());
    const gpx = toGpx({ name: 'A & B', type: 'running', points: a.points });
    expect((gpx.match(/<trkpt /g) ?? []).length).toBe(3);
    expect(gpx).toContain('lat="37.775"');
    expect(gpx).toContain('<gpxtpx:hr>140</gpxtpx:hr>');
    expect(gpx).toContain('<name>A &amp; B</name>');
    expect(gpx).toContain('</gpx>');
  });

  test('extras false writes no extensions', () => {
    const a = readFit(recordFile());
    expect(toGpx({ points: a.points }, { extras: false })).not.toContain('<extensions>');
  });

  test('a point without a position is left out', () => {
    const gpx = toGpx({ points: [{ t: Date.UTC(2026, 10, 20), hr: 120 }] });
    expect(gpx).not.toContain('<trkpt');
    expect(gpx).not.toContain('<extensions>');
  });

  test('readTcx reads points, heart rate and sport from a padded file', () => {
    const tcx = `          <?xml version="1.0" encoding="UTF-8"?>
<TrainingCenterDatabase xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2">
<Activities><Activity Sport="Running"><Lap><Track>
<Trackpoint><Time>2026-11-20T10:30:00Z</Time><Position><LatitudeDegrees>37.775</LatitudeDegrees><LongitudeDegrees>-122.419444</LongitudeDegrees></Position><AltitudeMeters>12.4</AltitudeMeters><HeartRateBpm><Value>140</Value></HeartRateBpm><Cadence>80</Cadence><DistanceMeters>100.5</DistanceMeters></Trackpoint>
<Trackpoint><Time>2026-11-20T10:30:01Z</Time><Position><LatitudeDegrees>37.776</LatitudeDegrees><LongitudeDegrees>-122.4194</LongitudeDegrees></Position><HeartRateBpm><Value>141</Value></HeartRateBpm></Trackpoint>
</Track></Lap></Activity></Activities></TrainingCenterDatabase>`;
    const a = readTcx(tcx);
    expect(a.points).toHaveLength(2);
    expect(a.sport).toBe('running');
    expect(a.points[0].hr).toBe(140);
    expect(a.points[0].cad).toBe(80);
    expect(a.points[0].dist).toBe(100.5);
    expect(a.points[0].lat!).toBeCloseTo(37.775, 6);
    expect(countTrackPoints(a)).toBe(2);
  });
});
