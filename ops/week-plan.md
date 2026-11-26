# Week plan: 11-26-2026 to 11-29-2026 (replan)

Written by the boss (Opus) on 11-25-2026 at 22:30 Pacific, after the CEO's 11-25 replan order (the 11-25 plan and its backlog were all done in two runs). It replaces that plan. 7 runs: 11-26-2026 morning to 11-29-2026 morning. Row 7 only applies if no new weekly plan has replaced this file by then.

Find your row without reading this whole file: run `TZ=America/Los_Angeles date +%m-%d-%Y` and `TZ=America/Los_Angeles date +%H` (hour before 12 is the morning run, otherwise the evening run), then `grep -n "^| <row> |" ops/week-plan.md`. Read a spec with `grep -n -A60 "^## FIT spec" ops/week-plan.md` (or `^## ZIP spec`, `^## Archive spec`, `^## Page spec`). Read the Rules and Guardrails once. When you finish a step, add `DONE <hash>` at the end of that step in its row. Don't otherwise rewrite this file.

Rule one: if your row is already DONE, take the first row below it that is not DONE; if every row is DONE, take the top backlog item not DONE. A run never ends with only a log commit.

## At a glance

<!-- Summary for the owner's dashboard. Agents: follow the Day-by-day table below and mark DONE there, not here. -->

Goal: Open a Fitness files group with five tools for Strava and Garmin exports, a search gap with no browser tool on page one.

Targets:
- Strava archive to GPX page live and tested by 11-27 evening
- All five fitness tool pages live by 11-28 evening
- 38 guides live by 11-29 (36 now)
- 110 visitors in the last 30 days by 11-29 (100 now)

| Run | In plain words |
|---|---|
| 1 | Fix four quality notes, then build the code that reads watch and bike computer files |
| 2 | Build the code that opens a huge export zip piece by piece and names each activity |
| 3 | Tool: turn a whole Strava archive into GPX files. Tool: many FIT files to GPX |
| 4 | Tool: unpack Strava's .fit.gz files for Garmin Connect. Tool: Garmin export to GPX |
| 5 | Tool: turn a FIT file into a spreadsheet for Excel |
| 6 | Guide: what is in your Strava archive, and how to open it |
| 7 | Guide: moving your Strava history to Garmin Connect |

## Money picture

Spent so far: Stayfile $9.24 (domain $8.20, API $1.04 summed from ops/metrics.csv). SubFixer $8.20 domain plus $3.17 API. The two ventures share one $10.00 OpenRouter credit: $4.21 used, about $5.79 left. Both ventures: $26.40 bought, $0.00 earned.

Monthly cost from now on: domain renewal $14.20 a year, $1.18 a month. Hosting and CI $0. Paid crew model: Stayfile used $0.09 to $0.28 a day (11-21 to 11-25), about $6 a month while the paid model runs. Stayfile's monthly cost: about $7.20 on the paid model, $1.18 on free models. Both ventures together burn about $0.76 a day, so the shared credit runs out around 12-03 at this pace.

Where revenue comes from, in order:
1. AdSense. Applied 11-09, flagged "Low value content" 11-18, fixed and re-requested 11-18, still waiting. It needs original pages that do something useful and no thin pages. Five fitness tools with their own copy and two guides add exactly that.
2. Stayfile Pro through Polar. Trigger 1,000 visits in 30 days; we are at 100. Batch archive conversion is the obvious Pro candidate later; nothing built for Pro this week.
3. No other stream. CEO: no affiliates yet.

Break-even. Assumptions: page RPM $1.50 and 1.3 pages a visit, so about $2 per 1,000 visits; Pro $4 a month, about $3.44 net, 0.2% of monthly visitors subscribe.
- Domain only ($1.18 a month): about 600 visits a month from ads.
- Domain plus paid model ($7.20): about 3,600 visits a month from ads, or 3 Pro subscribers (about 1,500 visits a month at 0.2%).

CEO goal by 12-20-2026: 300 visitors in a 30-day window, and AdSense approval. Now: 100 in the 30 days to 11-25 (30 in the last 7). The 70 visitors of 11-09 to 11-13 leave the window between 12-09 and 12-13, so 12-20 needs about 270 visitors from pages that rank. `site:stayfile.app` still shows no Stayfile page (growth brief 11-25).

How agents know a target is hit:
1. `dist/strava-archive-to-gpx/index.html` exists and `test/fit.test.ts`, `test/zipread.test.ts`, `test/fitness.test.ts` pass.
2. `dist/fit-to-gpx/`, `dist/fit-gz-to-fit/`, `dist/garmin-export-to-gpx/`, `dist/fit-to-csv/` each have an index.html, and the home page shows a "Fitness files" heading (`grep -c "Fitness files" dist/index.html` at least 1).
3. `grep -c "slug: '" src/site.ts` inside `GUIDES` grows by 2; the log states the count.
4. Visitors: sum the last 30 rows of the visitors column every morning. Outside the agents' control.

## Last week (11-19 to 11-25)

- Shipped: photo data remover (JPG and PNG), split CSV, merge CSV, page choice on PDF to JPG and PNG, home drop routing, qa 26, 7 guides (36 now). All in the 11-25 runs.
- Two replans in a row were used up in a day; the spelled-out steps with file names and grep hints are why. Keep that format.
- The only repeated boss question: "the plan and backlog are done, what next?" This plan has a seven-item backlog and a final rule, so it should not come up.
- Runs: 12 of the last 12 finished; none failed since 11-22. Two hit about 61 minutes but committed work.
- Data: 100 visitors in 30 days, 30 in the last 7, $0 earned. No page ranks yet. `qa` 29 is open.

## Who does what

- Daily crew: every row. No hired workers (CEO budget 0), no hire request.
- Paid model test ends 11-27. All code is in rows 1 to 5; rows 6 and 7 and the backlog are one guide each, sized for a free model. Row 5 is one page that copies row 3's component.

## Rules (read once)

### If your row is already done
Take the first row below yours that is not DONE. If every row is DONE, take the top backlog item not DONE. A run never ends with only a log commit. Don't ask the boss what to do next; this is the answer. Only when the whole backlog is DONE may you ask the boss.

### If a step fails twice
`git checkout --` the files you touched, log "row N step M failed: <the error line>", and take the next guide (row 6, 7 or a backlog guide) instead. No run ships nothing.

### A row with several steps
Finish the earlier unfinished step before starting a new one, even if it is in an earlier row. Commit after each step.

## FIT spec

New file `src/lib/fit.ts`, plain TypeScript, no dependency. It never throws: wrap the parse in try/catch and return what was read.

```ts
export interface FitPoint { t?: number; lat?: number; lon?: number; ele?: number; hr?: number; cad?: number; dist?: number; speed?: number; power?: number; temp?: number }
export interface FitActivity { points: FitPoint[]; sport?: string }
export function isFit(b: Uint8Array): boolean   // b.length >= 12 and bytes 8..11 are ".FIT"
export function readFit(b: Uint8Array): FitActivity
export function fitToCsvRows(a: FitActivity): string[][]
```

`t` is Unix time in milliseconds. FIT layout (all of it is needed, nothing else):
- File header: byte 0 = header size (12 or 14). Bytes 4..7 = data size, little endian (the records only, not the header and not the 2-byte CRC at the end). Bytes 8..11 = ".FIT". Records run from `headerSize` to `headerSize + dataSize`, clamped to `b.length`. Don't check any CRC.
- Chained files: after the records and the 2 CRC bytes, if at least 12 bytes remain and `isFit` holds at that offset, parse the next file too and append its points.
- Record header byte `h`:
  - `h & 0x80` set: compressed timestamp data message. Local type = `(h >> 5) & 0x03`, offset = `h & 0x1F`. Timestamp = `(last & ~0x1F) + offset`, plus `0x20` if `offset < (last & 0x1F)`, where `last` is the last FIT timestamp seen in any message. Set `last` to the result.
  - else if `h & 0x40` set: definition message, local type = `h & 0x0F`, developer flag = `h & 0x20`.
  - else: data message, local type = `h & 0x0F`. If no definition exists for that local type, stop parsing this file.
- Definition content: reserved (1 byte), architecture (1 byte: 0 little endian, 1 big endian), global message number (2 bytes in that byte order), field count n (1 byte), then n x 3 bytes: field number, size, base type. If the developer flag is set: one more byte d, then d x 3 bytes (number, size, index); only their sizes matter (skip them in data). Store per local type; a new definition replaces the old.
- Data content: the fields in definition order with their sizes, then the developer fields.
- Read a value by size and signedness: base type 0x01 sint8, 0x02 and 0x00 and 0x0A uint8, 0x83 sint16, 0x84 and 0x8B uint16, 0x85 sint32, 0x86 and 0x8C uint32. Any other base type, or a size that is not 1, 2 or 4: skip the bytes. Invalid values mean "not present": 0xFF (uint8), 0x7F (sint8), 0xFFFF (uint16), 0x7FFF (sint16), 0xFFFFFFFF (uint32), 0x7FFFFFFF (sint32). For the `z` types (0x0A, 0x8B, 0x8C) 0 is invalid too.
- Field 253 in any message is the timestamp (uint32, seconds since 1989-12-31 00:00 UTC): Unix ms = `(v + 631065600) * 1000`. Update `last` with every timestamp read.
- Global message 20 (record) becomes one FitPoint: 253 time, 0 lat and 1 lon (sint32 semicircles, degrees = v * 180 / 2^31, rounded to 7 places), 2 altitude (uint16, metres = v / 5 - 500, used only when 78 is missing), 78 enhanced altitude (uint32, same scale), 3 heart rate (uint8 bpm), 4 cadence (uint8), 5 distance (uint32, metres = v / 100), 6 speed (uint16, m/s = v / 1000, used only when 73 is missing), 73 enhanced speed (uint32, v / 1000), 7 power (uint16 watts), 13 temperature (sint8 C). A compressed-timestamp record message gets its `t` from the header.
- Global message 18 (session) field 5, or message 12 (sport) field 0, is the sport: 1 running, 2 cycling, 5 swimming, 11 walking, 17 hiking; others leave `sport` unset. First one wins.
- `fitToCsvRows`: header row then one row per point. Columns, in this order, only those that have a value in at least one point: `time` (ISO, `new Date(t).toISOString().replace('.000Z', 'Z')`), `latitude`, `longitude`, `altitude_m` (1 decimal), `heart_rate`, `cadence`, `distance_m` (1 decimal), `speed_m_s` (3 decimals), `power_w`, `temperature_c`. Missing values are empty strings.

Tests, `test/fit.test.ts`. Build the FIT bytes in the test with a small helper (header of 14 bytes with the right data size, CRC bytes 0); no fixture file. Cases: (1) one definition (local 0, global 20, little endian) with fields 253 uint32, 0 sint32, 1 sint32, 2 uint16, 3 uint8, and three data messages; the first is at 2026-11-20 10:30:00 UTC (`Date.UTC(2026, 10, 20, 10, 30) / 1000 - 631065600`), lat 37.775, lon -122.419444 (as `Math.round(deg * 2 ** 31 / 180)`), altitude 12.4 m (stored as 2562), heart rate 140. Check the first point to 6 places, `t`, `ele` 12.4, `hr` 140. (2) A compressed timestamp record (header `0x80 | offset`) right after a normal one: its `t` is right, including the wrap case where offset is smaller than `last & 0x1F`. (3) A big-endian definition reads the same values. (4) A definition with one developer field (flag 0x20): the data after it still parses. (5) A heart rate of 0xFF leaves `hr` unset; a point with lat 0x7FFFFFFF has no lat. (6) Two chained files give the points of both. (7) A session message with sport 1 gives `sport: 'running'`. (8) A file cut in half and 200 random bytes don't throw. (9) `fitToCsvRows` gives the header `time,latitude,longitude,altitude_m,heart_rate` for case 1 (no empty columns).

New file `src/lib/gpx.ts`:

```ts
export function toGpx(a: { name?: string; type?: string; points: FitPoint[] }, o?: { extras?: boolean }): string
export function readTcx(text: string): FitActivity
export function countTrackPoints(a: FitActivity): number   // points with both lat and lon
```

- `toGpx`: `<?xml version="1.0" encoding="UTF-8"?>`, then `<gpx version="1.1" creator="Stayfile" xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1">`, `<trk>`, `<name>` and `<type>` when given (XML escaped: & < > "), `<trkseg>`, one `<trkpt lat=".." lon="..">` per point that has both lat and lon, with `<ele>` (1 decimal) and `<time>` (ISO without milliseconds) when present, and when `extras` is not false and hr or cad is present: `<extensions><gpxtpx:TrackPointExtension><gpxtpx:hr>140</gpxtpx:hr><gpxtpx:cad>80</gpxtpx:cad></gpxtpx:TrackPointExtension></extensions>`. Close every tag. Newline between points.
- `readTcx`: regex, not DOMParser (tests run in Node). Strava's TCX files can start with spaces before `<?xml`, so `trim()` first. Split on `<Trackpoint>` ... `</Trackpoint>`; in each read `<Time>`, `<LatitudeDegrees>`, `<LongitudeDegrees>`, `<AltitudeMeters>`, `<HeartRateBpm>` then `<Value>`, `<Cadence>`, `<DistanceMeters>`. Allow an optional namespace prefix on each tag (`(?:\w+:)?`). Sport from `<Activity Sport="Running">` lowercased (`running`, `biking` becomes `cycling`, `other` leaves it unset).
- Tests in `test/fit.test.ts` too: toGpx of case 1 holds 3 `<trkpt`, `lat="37.775"`, `<gpxtpx:hr>140`, and a name `A & B` is written `A &amp; B`; `extras: false` writes no `<extensions>`; a point without position is left out; readTcx of a 2-point TCX string that starts with 10 spaces gives 2 points with hr and sport.
- Commit `git add src/lib/fit.ts src/lib/gpx.ts test/fit.test.ts`.

## ZIP spec

New file `src/lib/zipread.ts`. Reads a zip without loading it whole: only the end of the file, the central directory, and each wanted entry. Copy the idea of reading slices from a `File`, not any code from subfixer.

```ts
export interface ByteSource { size: number; read(offset: number, length: number): Promise<Uint8Array> }
export function fileSource(f: Blob): ByteSource   // read = new Uint8Array(await f.slice(o, o + n).arrayBuffer())
export function bytesSource(b: Uint8Array): ByteSource
export interface ZipEntry { name: string; method: number; compSize: number; size: number; offset: number }
export async function listZip(src: ByteSource): Promise<ZipEntry[]>
export async function readEntry(src: ByteSource, e: ZipEntry): Promise<Uint8Array>
export function zip64Extra(extra: Uint8Array, need: { size: boolean; comp: boolean; offset: boolean }): { size?: number; comp?: number; offset?: number }
export function zipWriter(): { add(name: string, data: Uint8Array): void; finish(): Blob; count(): number }
```

- All numbers little endian. 8-byte values: `lo + hi * 2 ** 32` (fine up to 2^53).
- End record: read the last `min(size, 65557)` bytes, search backwards for signature `50 4B 05 06`. At it: +10 entry count (2), +12 central directory size (4), +16 central directory offset (4). If the count is 0xFFFF or size or offset is 0xFFFFFFFF, it is ZIP64: the locator `50 4B 06 07` sits 20 bytes before the end record; its +8 is the 8-byte offset of the ZIP64 end record (`50 4B 06 06`), whose +32 is the entry count (8), +40 the directory size (8), +48 the directory offset (8). No end record: throw `Error('This is not a zip file.')`.
- Central directory: read it in one slice (it is small even for big archives). Each entry `50 4B 01 02`: +10 method (2), +20 compressed size (4), +24 size (4), +28 name length (2), +30 extra length (2), +32 comment length (2), +42 local header offset (4), +46 name (UTF-8, `new TextDecoder()`). If size, compressed size or offset is 0xFFFFFFFF, take it from the extra field with id 0x0001 through `zip64Extra` (the values are 8 bytes each, in the order size, compressed size, offset, and only the ones that were 0xFFFFFFFF are present). Skip names ending in `/`.
- `readEntry`: read 30 bytes at `offset` (local header `50 4B 03 04`), name length at +26 and extra length at +28 (they can differ from the central copy), data starts at `offset + 30 + n + x`, read `compSize` bytes. Method 0: return as is. Method 8: `inflateSync` from fflate. Other: throw `Error('Unsupported compression')`.
- `zipWriter`: uses fflate's streaming `Zip` and `ZipDeflate` (level 6) so each file is compressed as it is added; collect the chunks in an array and `finish()` returns `new Blob(chunks, { type: 'application/zip' })`. A name already used gets " (2)", " (3)" before the extension, like `zip` in src/lib/save.ts.
- Tests, `test/zipread.test.ts`: a zip made with fflate `zipSync` holding `activities.csv` (stored, `level: 0`) and `activities/1.fit.gz` (deflated) and a folder entry: `listZip(bytesSource(z))` lists the two files with the right sizes and `readEntry` gives the original bytes; a zip with a comment of 100 bytes still lists; random bytes reject with "This is not a zip file."; `zip64Extra` on a hand-built extra field (id 0x0001, size 24, three 8-byte values, one of them above 2^32) returns the three numbers, and with only `offset` needed returns the first value as the offset; `zipWriter` with two files of the same name gives a Blob that fflate `unzipSync` opens into `a.gpx` and `a (2).gpx`.
- Commit `git add src/lib/zipread.ts test/zipread.test.ts`.

## Archive spec

New file `src/lib/fitness.ts`, the logic all five pages share. No DOM in it, so it is tested in Node.

```ts
export interface ActivityInfo { id: string; date?: string; name?: string; type?: string }
export function readActivitiesCsv(text: string): Map<string, ActivityInfo>
export function isActivityPath(path: string): boolean
export function outName(info: ActivityInfo | undefined, path: string, ext: string): string
export function unpack(path: string, bytes: Uint8Array): { path: string; bytes: Uint8Array }
export function convert(path: string, bytes: Uint8Array, o: { name?: string; type?: string; extras: boolean }): { gpx?: string; skip?: 'no-gps' | 'unreadable' }
export function garminFitPaths(entries: { name: string }[]): { fits: string[]; inner: string[] }
```

- `readActivitiesCsv`: `Papa.parse(text, { skipEmptyLines: true })` with no header option; the first row is the header. Find the columns by exact name: `Activity ID`, `Activity Date`, `Activity Name`, `Activity Type`, `Filename`. If `Filename` is missing, return an empty map. Key: the Filename value lowercased (for example `activities/1234567890.fit.gz`). `date`: from `Activity Date`, which looks like `Nov 20, 2026, 10:30:00 AM`; read it with the regex `^([A-Z][a-z]{2}) (\d{1,2}), (\d{4})` into `YYYY-MM-DD`, or `^(\d{4})-(\d{2})-(\d{2})`; otherwise leave it unset. Don't use `Date.parse`.
- `isActivityPath`: lowercased path matches `(^|/)activities/[^/]+\.(fit|tcx|gpx)(\.gz)?$`.
- `outName`: `<date> <name>.<ext>` when both are known, else `<name>.<ext>`, else the file's id (the path's last part without `.gz` and its extension) plus `.<ext>`. Replace each of `/ \ : * ? " < > |` and control characters with `-`, collapse spaces, trim, cut the name part to 80 characters.
- `unpack`: a path ending `.gz` is run through fflate `gunzipSync` and `.gz` is dropped from the path; otherwise it is returned as is.
- `convert`: after `unpack`, by extension: `.fit` through `readFit`, `.tcx` through `readTcx` (decoded with TextDecoder), then `toGpx` with the name, type (the Strava type when given, else the sport) and extras; `.gpx` is returned as its text unchanged. Zero track points (`countTrackPoints` is 0): `skip: 'no-gps'`. Anything that throws or is not a known extension: `skip: 'unreadable'`.
- `garminFitPaths`: `fits` = names ending `.fit` (any folder); `inner` = names ending `.zip` whose lowercased path contains `uploaded` (Garmin puts the FIT files in zips under `DI_CONNECT/DI-Connect-Uploaded-Files/`; some exports name the folder a little differently, which "uploaded" still matches).
- Tests, `test/fitness.test.ts`: a 3-row activities.csv (with the real header order `Activity ID,Activity Date,Activity Name,Activity Type,Elapsed Time,Distance,...,Filename` and a name holding a comma in quotes) maps `activities/123.fit.gz` to date `2026-11-20`, name and type; `outName` gives `2026-11-20 Morning Run.gpx`, replaces `/` in a name, and falls back to `123.gpx`; `isActivityPath` takes `export_1/activities/9.tcx.gz` and refuses `media/1.jpg`; `convert` of a gzipped FIT from the fit test helper gives a GPX with `<trkpt`, of a FIT with no positions gives `skip: 'no-gps'`, of random bytes named `.fit` gives `'unreadable'` or `'no-gps'` without throwing; `garminFitPaths` on `DI_CONNECT/DI-Connect-Uploaded-Files/UploadedFiles_0-_Part1.zip` and `a/b.fit` returns one of each. Move the FIT test helper into `test/fit-helper.ts` so both test files import it.
- Commit `git add src/lib/fitness.ts test/fitness.test.ts test/fit-helper.ts test/fit.test.ts`.

## Page spec

Every fitness page. First page only (row 3 step 5) does the group wiring; later pages skip it.

Group wiring, once:
- src/site.ts: `export type Group` (line 54) gets `| 'Fitness files'`; `GROUPS` (`grep -n "export const GROUPS" src/site.ts`) gets `'Fitness files'` at the end; `GROUP_ID` gets `'Fitness files': 'fitness'`; `GROUP_SHORT` gets `'Fitness files': 'Fitness'`.
- src/components/ToolPage.astro line 128: the "Other ... tools" heading gets `page.group === 'Fitness files' ? 'fitness' :` as the first check.
- src/pages/guides/index.astro line 6: add `'Fitness files'` to `TOPICS` (empty topics are skipped, so this is safe before the first fitness guide).
- Put the PAGES entries after the last `group: 'Spreadsheets and data'` entry (`grep -n "group: 'Spreadsheets and data'" src/site.ts | tail -1`, then find that entry's closing `},`), in a `// ---------- Fitness files ----------` block.

Each page:
- Tool ids: `'fit-strava'`, `'fit-gpx'`, `'fit-gz'`, `'fit-garmin'`, `'fit-csv'`. Add each to the `Tool` union (line 8 onward) as you build its page.
- ToolPage.astro line 26: put `page.tool.startsWith('fit-') ? 'fitness' : ` at the very front of the `family` line (once), plus the render line `{family === 'fitness' && <FitnessTool tool={page.tool} slug={page.slug} />}` after the csvfiles line (78) and the import at the top.
- One component, new `src/components/FitnessTool.astro`, branching on `tool`. Copy its frame from src/components/CsvFilesTool.astro: the `<Drop>` usage, `drop.addEventListener('files', ...)` (line 237), the `status` span with `aria-live="polite"`, the error line, the saved panel through `showDone` from src/lib/done.ts. Write the whole file in one Write call when you create it; later pages add their branch with Edit.
- Files are read with `fileSource(file)` and `listZip`, entry by entry, one at a time, status "Reading activity 12 of 840...". Never `file.arrayBuffer()` on a zip. Single loose files (.fit, .gz, .tcx, .gpx) may be read whole.
- Output through `zipWriter()`; one output file is saved on its own with `save`. Skip any entry whose `size` is over 100 MB and count it as unreadable.
- Result line: "Saved N files. Skipped A without a GPS track (indoor activities) and B that could not be read." Leave out the parts that are 0.
- Silhouette line in src/lib/silhouettes.ts per slug (copy the `'csv-to-sql'` line, line 85, and change the key).
- Copy rules for every page: card, blurb, title (60 or fewer), h1, lede, description (160 or fewer), steps, faq (3 to 5, the last two always the affiliation FAQ and `PRIVATE`), `more` (150 to 300 words, its own h2). Strava and Garmin may be named as the source of the file; no logo, no "official". The affiliation FAQ: q "Is this made by Strava?" (or Garmin), a "No. Stayfile is not affiliated with Strava. The page reads the archive file that Strava lets you download from your account." Say plainly what is kept: track points, times, elevation, heart rate and cadence if present. What is not kept in GPX: laps, power, photos, descriptions. No em or en dashes. No "simply", "seamless", "the good news", "honest". Name no competitor site or app.
- Next steps: add the slug to `dataNext` in src/lib/route.ts as the row says (`grep -n "const dataNext" src/lib/route.ts`).
- Done for each page: `npm test` and `npm run build` pass, `dist/<slug>/index.html` exists. Commit with explicit paths.

## Day-by-day

| # | Run (Pacific) | UTC start | Items |
|---|---|---|---|
| 1 | 11-26-2026 morning | 11-26 14:47 | **(0) qa 29, one commit, then `gh issue close 29 --comment "<hash>"`.** (a) src/components/PhotoMetaTool.astro line 149: `{ type: 'image/jpeg' }` becomes `{ type: only.kind === 'jpeg' ? 'image/jpeg' : 'image/png' }` (check the item's field is called `kind`, as on line 137). (b) src/components/CsvFilesTool.astro: after each up, down or remove click set `status.textContent` to `Moved <name> up`, `Moved <name> down` or `Removed <name>` (`grep -n "up\|down\|remove" src/components/CsvFilesTool.astro`). (c) src/lib/pdf-render.ts line 82: filter `pages` to numbers from 1 to `doc.numPages`; if nothing is left, throw `new Error(\`The PDF has ${doc.numPages} pages.\`)` and check PdfTool.astro shows the error's message (`grep -n "catch" src/components/PdfTool.astro`). (d) src/components/PdfTool.astro: give the Pages input an `id` and its label a matching `for` (keep the label wrapping it). The guide already mentions page choice (591c7b3), so no guide change. **(0b) Growth brief copy, one commit.** src/site.ts line 2120 step becomes "Drop a JPG or PNG photo, or several."; add a FAQ on remove-exif-data before `PRIVATE`: q "Can't Windows or a Mac do this?", a "Partly. Windows can remove some fields from a photo's Properties, but leaves others, and Preview on a Mac removes only the location. This page removes the EXIF, XMP and IPTC blocks in one step." On split-csv, the FAQ "Can a row be cut in half?" (line 3435) gets the sentence "Blank rows are left out, so the parts can hold a few rows fewer than the file has lines." at the end; add a test in test/csvfiles.test.ts that a quoted cell with a line break inside, in the last row of a part, stays one row. On merge-csv, the first FAQ (line 3476) answer starts "Columns are matched by name, not position, so files with the columns in a different order merge fine." In src/pages/guides/combine-csv-files-into-one/index.astro line 4 the title becomes "Combine CSV files into one Excel sheet" and the same title in its `GUIDES` entry (`grep -n "slug: 'combine-csv-files-into-one'" src/site.ts`). Copy otherwise unchanged. **(1) FIT and GPX code: build everything in `## FIT spec`, one commit.** Done: `npm test` passes. |
| 2 | 11-26-2026 evening | 11-27 02:47 | Finish any row 1 step not DONE first. **(2) `## ZIP spec`, one commit.** **(3) `## Archive spec`, one commit.** Done: `npm test` passes. |
| 3 | 11-27-2026 morning | 11-27 14:47 | Finish any earlier step not DONE first. **(4) Group wiring and `/strava-archive-to-gpx/`, one commit**, following `## Page spec`. Tool `'fit-strava'`. Drop: `accept=".zip,.fit,.gz,.tcx,.gpx,.csv,application/zip" multiple`, main "Drop your Strava export zip here, or <u>choose it</u>", sub "The zip Strava emails you, or the files from its activities folder". One .zip: `listZip`; find the entry whose lowercased name is `activities.csv` or ends `/activities.csv`, `readEntry` it, `readActivitiesCsv`; convert every entry where `isActivityPath` holds. Loose files: use a dropped activities.csv if there is one (keys match on `activities/` plus the file name). A select "Activity types" with "All types" plus every `type` found in the CSV, shown once the CSV is read (filter before converting). Checkbox "Include heart rate and cadence" (checked) passes `extras`. Button "Convert to GPX"; save `strava-gpx.zip`. Copy: slug `strava-archive-to-gpx`, card "Strava archive to GPX", blurb "Every activity in your export as a GPX file", title "Convert a Strava archive to GPX files, all at once", h1 "Convert your Strava archive to GPX", lede: first sentence, drop the export zip Strava emails you and every activity becomes a GPX file named by date and activity name, saved in one zip; second, the archive is read on your device piece by piece and never uploaded, and Stayfile is not affiliated with Strava. Steps: request and download the archive from your Strava account settings; drop the zip; pick activity types if you want; convert and save. `more` h2 "What the archive holds and what the GPX keeps": the activities folder holds each activity in the format it was recorded, often .fit.gz from watches and bike computers, .gpx or .tcx.gz from apps; .gz files are unpacked in the page; activities.csv gives the names and dates; GPX keeps track points, times, elevation, heart rate and cadence; laps, power and photos are not kept; indoor activities with no GPS are skipped and counted. FAQ: "How big an archive can it take?" (the zip is read in pieces, one activity at a time, so photos in the archive don't slow it; the GPX zip is built in memory; say "archives over 4 GB" only if the zip64Extra test passed), "Why were some activities skipped?" (no GPS track, for example treadmill or trainer rides), affiliation, `PRIVATE`. `dataNext`: none. Done per `## Page spec`, plus `grep -c "Fitness files" dist/index.html` at least 1. **(5) `/fit-to-gpx/`, one commit.** Tool `'fit-gpx'`, same component. Drop `accept=".fit,.gz,.tcx" multiple`, sub "FIT, .fit.gz and TCX files". Each file through `convert` with the file's own base name; one file saves `<base>.gpx` (`baseName` twice for `.fit.gz`), several save `gpx-files.zip`. Copy: card "FIT to GPX", blurb "Many FIT files to GPX at once", title "Convert FIT files to GPX, many at once, no upload", h1 "Convert FIT files to GPX", lede says it turns FIT files from a watch or bike computer into GPX for maps and other apps, many at once, .fit.gz and TCX too, read on your device. `more` h2 "What a GPX file keeps from a FIT file" (same kept and not-kept list; FIT is a compact binary file most watches record; GPX is plain text most map apps read). FAQ: "Can I convert many files at once?", "What about .fit.gz files?", "Why is my GPX empty?" (indoor activity, no GPS), `PRIVATE` (no affiliation FAQ on this page). |
| 4 | 11-27-2026 evening | 11-28 02:47 | Finish any earlier step not DONE first. **(6) `/fit-gz-to-fit/`, one commit.** Tool `'fit-gz'`. Drop as strava-archive-to-gpx. For each activity entry ending `.fit.gz` (or a dropped .fit.gz file): `unpack`, add to `zipWriter` as `outName(info, path, 'fit')`; entries that are .gpx or .tcx (gz or not) are added unpacked under their own extension with `outName` too, because Garmin Connect imports those as well. Save `activities-fit.zip`. Copy: card ".fit.gz to FIT", blurb "Unpack Strava's .fit.gz files for Garmin Connect", title "Unpack .fit.gz files to FIT for Garmin Connect", h1 "Unpack .fit.gz files into FIT files", lede: Garmin Connect's import takes .fit, .gpx and .tcx files but not the .gz files in a Strava archive; this page unpacks every one into plain files named by date and activity, in one zip, on your device. `more` h2 "Moving the files into Garmin Connect": the import page in Garmin Connect on the web accepts .fit, .gpx and .tcx activity files; FIT keeps the most data; some people report upload errors with TCX or GPX that go away with the FIT file; upload in batches. Add "Menu names can differ a little between app versions." FAQ: "Why does Garmin Connect refuse my .fit.gz file?", "Are the files changed?" (no, the FIT bytes are exactly what was inside the .gz), affiliation (Strava and Garmin both, one answer), `PRIVATE`. Then on strava-archive-to-gpx add the FAQ "Can I get FIT files instead?" linking /fit-gz-to-fit/. **(7) `/garmin-export-to-gpx/`, one commit.** Tool `'fit-garmin'`. Drop `accept=".zip,application/zip"`, one file, sub "The zip from Garmin's Export Your Data". `listZip`; `garminFitPaths`; each `inner` zip is read with `readEntry` and opened with fflate `unzipSync` and a filter for names ending `.fit` (an inner zip is held in memory while it is read; say so in `more`); each FIT through `convert`. Radio "Save as GPX" (default) or "Save the FIT files" (no conversion, the FIT bytes as they are). Names: the FIT's own base name. Status "Opening part 2 of 5..." then "Reading activity N...". Save `garmin-gpx.zip` or `garmin-fit.zip`. Copy: card "Garmin export to GPX", blurb "Get every activity out of a Garmin data export", title "Get the FIT and GPX files out of a Garmin data export", h1 "Get your activities out of a Garmin data export", lede: the export zip Garmin sends hides the activity FIT files inside more zips in the DI_CONNECT folder; drop the whole export and get every activity as GPX or as FIT files in one zip, on your device. `more` h2 "Where the activity files are in the export". FAQ: "Why can't I find my activities in the export?", "Does it read health data like sleep or steps?" (no, only the activity FIT files), affiliation (Garmin), `PRIVATE`. |
| 5 | 11-28-2026 morning | 11-28 14:47 | One item. Finish any earlier step not DONE first, then this. **(8) `/fit-to-csv/`, one commit.** Tool `'fit-csv'`, same component. Drop `accept=".fit,.gz" multiple`. Each file: `unpack`, `readFit`, `fitToCsvRows`, `Papa.unparse(rows, { newline: '\r\n' })`, `withBom` from src/lib/save.ts. One file saves `<base>.csv`; several save `fit-csv.zip`. Show "N rows, columns: time, latitude, ..." for one file. Copy: card "FIT to CSV", blurb "Every second of an activity in a spreadsheet", title "Convert a FIT file to CSV for Excel, no upload", h1 "Convert a FIT file to CSV", lede: one row per recorded point with time, position, altitude, heart rate, cadence, distance, speed, power and temperature where the file has them; opens in Excel; on your device. `more` h2 "The columns in the CSV" (each column and its unit, from the FIT spec; columns with no data are left out; times are UTC). FAQ: "Why are the times off by some hours?" (UTC), "Can I convert many files?", "Will Excel open it?" (yes, saved as UTF-8 with the marker Excel needs; link /csv-to-excel/ for an .xlsx), `PRIVATE`. `dataNext`: `'fit-to-csv': [{ slug: 'csv-to-excel', label: 'Turn it into Excel' }]`. |
| 6 | 11-28-2026 evening | 11-29 02:47 | One item. **Guide** slug `strava-archive-whats-inside`, title "What's in your Strava archive, and how to open it", topic "Fitness files". Phrases: "strava bulk export", "strava archive fit.gz", "download all strava activities". Facts: on strava.com, Settings, My Account, "Download or Delete Your Account", then "Request Your Archive"; Strava emails a link to a zip, which can take a while. Inside: activities.csv (one row per activity, with its id, date, name, type, distance and the file name in the activities folder; some summary fields can be Strava's estimates); the activities folder with each activity in the format it was recorded in (often .fit.gz from watches and bike computers, .gpx, .tcx or .tcx.gz from apps); more CSV files about the account, and a media folder with photos when you posted some. .gz is gzip compression: a Mac opens it with a double click; Windows File Explorer may not, a free archive tool does. The old archive gave GPX for everything; now you get the original files. What to do with it: GPX for maps at /strava-archive-to-gpx/, FIT for Garmin Connect at /fit-gz-to-fit/, the summary in Excel by opening activities.csv (link guide `csv-opens-in-one-column-in-excel` for the one-column problem), per-second data at /fit-to-csv/. Link /strava-archive-to-gpx/, /fit-gz-to-fit/, /fit-to-csv/, /fit-to-gpx/. Set `guide: 'strava-archive-whats-inside'` on strava-archive-to-gpx. |
| 7 | 11-29-2026 morning | 11-29 14:47 | Only if no new weekly plan has replaced this file. One item. **Guide** slug `move-strava-to-garmin-connect`, title "How to move your Strava history to Garmin Connect", topic "Fitness files". Phrases: "import strava activities to garmin connect", "transfer strava to garmin", "garmin connect fit.gz". Facts: Strava has no button that sends history to Garmin; the route is the Strava archive (link the guide `strava-archive-whats-inside`), then Garmin Connect's import page on the web (describe in words: the upload or import option in Garmin Connect on a computer; add the menu-names sentence). Garmin Connect imports .fit, .gpx and .tcx activity files, not .gz, so unpack them first with /fit-gz-to-fit/; FIT keeps the most data (laps, power, device); some people report upload errors with TCX or GPX files that go away with the FIT file; upload in batches, and if the page stalls, try fewer files at once; activities already in Garmin Connect may be refused as duplicates (say "may"). Activities that only exist as GPX keep their track but not laps or power. Link /fit-gz-to-fit/, /strava-archive-to-gpx/, /fit-to-gpx/, guide `strava-archive-whats-inside`. Set `guide: 'move-strava-to-garmin-connect'` on fit-gz-to-fit. |

### Every guide (rows 6 and 7, backlog)
- File `src/pages/guides/<slug>/index.astro`. Copy the frontmatter and outer markup of `src/pages/guides/save-all-excel-sheets-as-csv/index.astro` (Base, title, description, jsonld Article with `datePublished` set to your run's date as YYYY-MM-DD). Write the whole file in one Write call.
- Title 60 characters or fewer. Description 160 or fewer. One `<h1>`. The first two sentences of the lede answer the title. 5 to 7 `<h2>` sections, numbered steps where there are steps. At least 800 words, no padding (the test needs 700).
- Answer the question for people who never use Stayfile; our tool goes where it fits, usually in the second half. Link at least 3 tool pages and 1 existing guide. End with a one-line "See also" naming 1 or 2 guides.
- Outside facts: only the ones in the row. If unsure of a menu name, describe it in words, and add "Menu names can differ a little between app versions." where you give menu paths. Never claim a tool feature you didn't read in the code.
- Finish: add `{ slug, title, blurb, topic }` at the end of `GUIDES` in src/site.ts, set `guide` on the tool pages the row names (a string, or a list if the page already has one). `npm test` and `npm run build` pass, `dist/guides/<slug>/index.html` exists. Commit with `git add src/pages/guides/<slug>/index.astro src/site.ts`.
- A guide whose tool page isn't live yet waits: do the next code step first.

## Backlog (in order, for runs that finish early)

1. **Guide** slug `garmin-export-fit-files`, title "Where the FIT files are in a Garmin data export", topic "Fitness files". Phrases: "garmin export all activities", "garmin export fit files", "DI_CONNECT folder". Facts: the full export is requested from Garmin's account data management page ("Export Your Data"); Garmin emails a link when it is ready, which can take days. In the zip: a DI_CONNECT folder with many subfolders; the activity FIT files are in a folder named DI-Connect-Uploaded-Files (some people report a slightly different name), inside more zip files with names like UploadedFiles_0-_Part1.zip; the other folders hold JSON files about health, sleep and the account. Unzip twice, or drop the whole export on /garmin-export-to-gpx/. Single activities can also be downloaded one at a time from the activity's page in Garmin Connect (describe in words, menu-names sentence). Link /garmin-export-to-gpx/, /fit-to-gpx/, /fit-to-csv/, guide `strava-archive-whats-inside`. Set `guide` on garmin-export-to-gpx.
2. **Home drop routing for fitness files.** src/lib/route.ts: add `'fit'` to `Kind` (line 5) for names ending `.fit` or `.fit.gz` (`grep -n "function kindOf\|\.vcf" src/lib/route.ts` to find where kinds are picked; `.fit.gz` must be checked before the generic extension); `suggestTools` for fit files returns `[{ slug: 'fit-to-gpx', label: 'Turn into GPX' }, { slug: 'fit-to-csv', label: 'Turn into a spreadsheet' }]`; a `.zip` is not routed. Add the matching cases to test/route.test.ts. Done: tests pass.
3. **Guide** slug `what-is-a-fit-file`, title "What is a FIT file, and how do you open one?", topic "Fitness files". Phrases: "what is a fit file", "open fit file", "fit file viewer". Facts: FIT (Flexible and Interoperable Data Transfer) is a compact binary format from Garmin that most sport watches and bike computers record in; it holds track points with time, position, altitude, heart rate, cadence, speed and power, plus laps and device details; a text editor shows only symbols. Open it by uploading it to the training app you use, or convert: GPX for maps (/fit-to-gpx/), CSV for Excel (/fit-to-csv/). Read the FIT spec in this plan for what our reader takes. Link /fit-to-gpx/, /fit-to-csv/, /fit-gz-to-fit/, guide `strava-archive-whats-inside`. Set `guide` on fit-to-gpx (and fit-to-csv as a list if it has one).
4. **Guide** slug `gpx-tcx-or-fit`, title "GPX, TCX or FIT: which activity file should you use?", topic "Fitness files". Facts: GPX is plain XML that almost every map and route app reads; it holds positions, times and elevation, and heart rate or cadence only through extensions that some apps ignore; no laps. TCX is Garmin's XML format with laps, heart rate and cadence. FIT is binary, the smallest, and keeps the most (laps, power, device). Use GPX to share a route or put it on a map, FIT to move activities between training platforms, TCX when an app asks for it. Link /fit-to-gpx/, /strava-archive-to-gpx/, /fit-gz-to-fit/, guide `what-is-a-fit-file` if it exists, else `strava-archive-whats-inside`.
5. **Guide** slug `strava-data-in-excel`, title "How to get your Strava data into Excel", topic "Fitness files". Facts: the archive's activities.csv has one row per activity and opens in Excel directly (some columns repeat a name, such as two distance columns, because Strava stores both its summary and the recorded value; say "some columns appear twice"); open it with Data, From Text/CSV if it lands in one column (link guide `csv-opens-in-one-column-in-excel`); for every recorded second of one activity, take its FIT file through /fit-to-csv/; times in the FIT CSV are UTC. Link /fit-to-csv/, /csv-to-excel/, /strava-archive-to-gpx/, guides `csv-opens-in-one-column-in-excel` and `strava-archive-whats-inside`. Set `guide` on fit-to-csv.
6. **Link the fitness pages from older guides**, one link each at the end of the last paragraph, nothing else changed: src/pages/guides/are-online-file-converters-safe/index.astro gets `<a href="/strava-archive-to-gpx/">convert a Strava archive without uploading it</a>`; src/pages/guides/csv-too-large-for-excel/index.astro gets `<a href="/fit-to-csv/">turn a FIT file into a CSV</a>`. Done: tests and build pass.
7. **Split CSV by column value**, an option on /split-csv/ (growth brief idea 5): a radio "One file per value in a column" with a column select filled from the header; each part named `<base>-<value>.csv` (value cleaned like `outName`); add `makeValueSplitter` to src/lib/csvfiles.ts with a test. Copy: one step and one FAQ. Only if 1 to 6 are DONE.
8. Only after all of the above: ask the boss once.

## Cut, and why

- More CSV, PDF or photo guides: the fitness group is the new gap and the CEO's order; those topics already have 36 guides.
- HEIC and WebP metadata removal: big parser job for few searches.
- Laps, power and FIT writing: GPX has no standard place for them; the CSV page carries power.
- A folder drop on the Strava page: browsers need a different API for folders; selecting all files in the activities folder works with the existing Drop.
- Pro and hire requests: 100 visits against a 1,000 trigger; CEO budget 0.
- Browser checks: daily runs can't run them.

## For the CEO

- I follow the 11-25 order as given: Strava archive, bulk FIT, .fit.gz to FIT, Garmin export, FIT to CSV, then the guides. Three of the four code-heavy pages share one component and one library, so rows 3 and 4 hold two pages each.
- Search check tonight (11-25): for "convert strava archive to gpx online" page one is an iOS app, GitHub scripts that need Python and gpsbabel, and a general upload converter. No browser tool takes the whole archive, so this is a real gap. Garmin's import page takes .fit, .gpx and .tcx, and forum threads show people stuck on .gz and TCX upload errors, which backs /fit-gz-to-fit/.
- Where I'd differ, slightly: these phrases are low volume, so they won't reach 300 visitors on their own. I still think it is the right bet, because the pages face no big brand and fit the "files never leave your device" angle well. I'd put Pro's batch offer on archive conversion when the trigger comes.
- Nothing needs the owner this week. No decision issue, no roadmap change (your 11-25 line already lists the group).

## Guardrails

- If your row is done, take the next row not DONE, then the backlog. Never end with only a log commit.
- Read this file once at the start, and only your row plus the spec it names. Don't re-read the whole of ops/log.md; the top two entries are enough.
- Allowed commands: `date`, `npm test`, `npm run build`, `npm install`, `git`, `gh issue`, `node scripts/ask-boss.mjs`, plus Read, Edit, Write, Glob, Grep. Nothing else (`ls`, `cat`, `cp`, `rm`, `npx`, `python`). Probes go in /tmp.
- No new npm dependencies. FIT, TCX and zip reading are plain TypeScript; fflate (`inflateSync`, `gunzipSync`, `unzipSync`, `Zip`, `ZipDeflate`) and papaparse are installed.
- A new tool id must not start with `img` or `pdf`. Fitness ids start with `fit-`, and the `fit-` check must be the first test on the `family` line.
- site.ts is over 3,700 lines. Anchor Edits on `slug: '<slug>',` plus the next line. If an Edit fails twice, `git checkout -- src/site.ts` and retry once from a fresh `grep -n`.
- Tests run in Node: no DOMParser, no `document` in src/lib files. Keep browser code in the component.
- Never call `arrayBuffer()` on a dropped zip. Read it through `fileSource` and `listZip`.
- Write each guide and each new file with one Write call. Don't re-read a file you just wrote.
- Stage explicit paths only. Never `git add -A` or `git add .`. No helper scripts in the repo root.
- ops/log.md is newest first: your entry goes right under the `# Ops log` heading. Keep it under 15 lines.
- Don't edit ops/metrics.csv, ops/costs.json, ops/roadmap.md, ops/ceo-notes.md or anything in .github/.
- Never claim a feature without reading the code; never state an outside fact that isn't in your row.
- Morning metrics: sum the last 30 rows of the visitors column (blanks as 0) and put the number in the log. Decision issue only at 1,000 (Pro).
