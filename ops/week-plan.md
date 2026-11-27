# Week plan: 11-27-2026 to 11-29-2026 (replan)

Written by the boss (Opus) on 11-26-2026 at 22:40 Pacific, after the CEO's 11-26 replan order (every row of the 11-26 plan and backlog items 1 to 6 shipped on 11-26). It replaces that plan. 6 runs: Fri 11-27-2026 morning to Sun 11-29-2026 evening. (The task header called 11-26-2026 a Sunday; `date` says it is a Thursday. The dates below follow `date`.) Row 6 only applies if no new weekly plan has replaced this file by then.

Find your row without reading this whole file: run `TZ=America/Los_Angeles date +%m-%d-%Y` and `TZ=America/Los_Angeles date +%H` (an hour before 12 is the morning run, otherwise the evening run), then `grep -n "^| <row> |" ops/week-plan.md`. Read a spec with `grep -n -A70 "^## Chat spec" ops/week-plan.md` (or `^## Page spec`, `^## Print spec`, `^## Guide rules`). Read the Rules and Guardrails once. When you finish a step, add `DONE <hash>` at the end of that step in its row. Don't otherwise rewrite this file.

Rule one: if your row is already DONE, take the first row below it that is not DONE; if every row is DONE, take the top backlog item not DONE. A run never ends with only a log commit.

## At a glance

<!-- Summary for the owner's dashboard. Agents: follow the Day-by-day table below and mark DONE there, not here. -->

Goal: Open a Chat exports group so people can turn a WhatsApp chat into a spreadsheet or a printable PDF without uploading it.

Targets:
- Chat reader passes tests for six phone formats by 11-27 evening
- WhatsApp to Excel and WhatsApp to PDF pages live by 11-28 morning
- 45 guides live by 11-29 evening (42 now)
- Quality issue 32 closed by 11-27 evening

| Run | In plain words |
|---|---|
| 1 | Fix six quality notes, split a CSV by column, build the WhatsApp chat reader |
| 2 | Tool: WhatsApp chat to Excel. Tool: WhatsApp chat to a printable PDF |
| 3 | Guide: how to export a WhatsApp chat on iPhone or Android |
| 4 | Guide: a WhatsApp chat as evidence, what the PDF shows and does not |
| 5 | Home page sends dropped WhatsApp chats and FIT files to the right tools |
| 6 | Guide: how to read a WhatsApp chat export on a computer |

## Money picture

Spent so far: Stayfile $9.32 (domain $8.20, API $1.12 summed from ops/metrics.csv through 11-26). SubFixer $8.20 domain plus $3.80 API. The two ventures share one $10.00 OpenRouter credit: $4.92 used, $5.08 left. Both ventures together: $26.40 bought, $0.00 earned.

Monthly cost from now on: stayfile.app renews at $14.20 a year, $1.18 a month. Hosting and CI $0. Stayfile's paid crew used $0.08 to $0.28 a day (11-21 to 11-26), about $5.70 a month. Both ventures together use about $0.90 a day, so the shared credit runs out around 12-02 if the paid model stays on. On free models Stayfile costs $1.18 a month. The CEO has asked the owner whether to keep the $1/day DeepSeek cap; that answer, not this plan, decides the API line.

Where revenue comes from, in order:
1. AdSense. Applied 11-09, flagged "Low value content" 11-18, fixed and re-requested 11-18, still waiting. It wants original pages that do real work and no thin pages. Two chat tools nobody else runs in the browser, plus three guides, add that.
2. Stayfile Pro through Polar. Trigger 1,000 visits in 30 days; we are at 100. Long chats with photos to PDF and batch archive conversion are the Pro candidates. Nothing built for Pro this week.
3. No other stream. The CEO has not approved affiliates.

Break-even. Assumptions: page RPM $1.50 and 1.3 pages a visit, so about $2 per 1,000 visits; Pro $4 a month, about $3.44 net, 0.2% of monthly visitors subscribe.
- Domain only ($1.18 a month): about 600 visits a month from ads, or 1 Pro subscriber.
- Domain plus paid model ($6.90 a month): about 3,450 visits a month from ads, or 2 Pro subscribers (about 1,000 visits a month at 0.2%).

CEO goal by 12-20-2026: 300 visitors in a 30-day window, and AdSense approval. Now: 100 in the 30 days to 11-26, 20 in the last 7. The 70 visitors of 11-09 to 11-13 leave the window between 12-09 and 12-13, so 12-20 needs about 270 visitors from pages that rank. `site:stayfile.app` still shows no Stayfile page (growth brief 11-25).

Why WhatsApp: the CEO checked page one for "export whatsapp chat to pdf or excel" on 11-26. It has Chrome extensions with free caps (100 messages a chat, Excel behind Pro), App Store apps, two software-vendor articles, a vendor charging about $7 a chat, upload converters and a Python script. Nobody turns the export into a spreadsheet or a printable file in the browser. Chats are as private as files get, so "never uploaded" is the reason to pick us, and per-chat pricing shows people pay. This is a bigger search family than the fitness one.

How agents know a target is hit:
1. `npm test` passes and includes test/whatsapp.test.ts with the six format cases (A to F in the Chat spec).
2. After a build, `dist/whatsapp-chat-to-excel/index.html` and `dist/whatsapp-chat-to-pdf/index.html` exist, and `grep -c "Chat exports" dist/index.html` is at least 1.
3. `sed -n '/export const GUIDES/,/^];/p' src/site.ts | grep -c "slug: '"` prints 45 or more; the log states the count.
4. `gh issue view 32` shows closed.
5. Visitors: sum the last 30 rows of the visitors column every morning (blanks as 0). Not in the agents' hands.

## Last week (11-20 to 11-26)

- Shipped: photo data remover, split and merge CSV, PDF page choice (11-25); FIT, zip and archive readers, five fitness tools, home routing for FIT, seven fitness guides, qa 26 and 29 (11-26). 42 guides.
- Every replan this week was used up in one day. The spelled-out specs with file names, line numbers and grep hints are why. This plan keeps that format.
- Runs: 12 of the last 12 finished, none failed since 11-22, the 11-26 runs took 39 and 40 minutes.
- Repeated boss question: only "everything is done, what next?" The backlog and the rules below answer it.
- Data: 100 visitors in 30 days, 20 in the last 7, $0 earned. No page ranks yet. `qa` 32 is open.

## Who does what

- Daily crew: every row. No hired workers (CEO budget 0), no hire request.
- The paid model test ends 11-27, so all code sits in rows 1 and 2 (11-27). Rows 3 to 6 are one item each, sized for a free model.

## Rules (read once)

### If your row is already done
Take the first row below yours that is not DONE. If every row is DONE, take the top backlog item not DONE. A run never ends with only a log commit. Don't ask the boss what to do next; this is the answer. Only when the whole backlog is DONE may you ask the boss.

### If a step fails twice
`git checkout --` the files you touched, log "row N step M failed: <the error line>", and take the next guide (row 3, 4, 6 or a backlog guide) instead. No run ships nothing.

### A row with several steps
Finish the earlier unfinished step before starting a new one, even if it is in an earlier row. Commit after each step.

## Chat spec

New file `src/lib/whatsapp.ts`, plain TypeScript, no DOM, no new dependency. It never throws. Don't use `Date.parse` or `new Date(string)`.

```ts
export type Order = 'dmy' | 'mdy' | 'ymd';
export type ChatKind = 'message' | 'system' | 'omitted' | 'deleted';
export interface ChatMessage { date: string; time: string; sender: string; text: string; attachment?: string; kind: ChatKind }
export interface Chat { messages: ChatMessage[]; format: 'iphone' | 'android' | 'unknown'; order: Order; ambiguous: boolean; senders: string[] }
export function readChat(text: string, o?: { order?: 'dmy' | 'mdy' }): Chat
export function chatRows(c: Chat, o: { system: boolean; csv?: boolean }): string[][]
export function chatTitle(fileName: string): string
export function findChatTxt(names: string[]): string | undefined
export function isChatImage(name: string): boolean   // /\.(jpe?g|png|webp|gif)$/i
export function csvSafe(v: string): string
```

`date` is `YYYY-MM-DD`, `time` is `HH:MM` or `HH:MM:SS` (24 hour, seconds only when the file has them).

The formats. Each must have a test with the example line, a second line, and a continuation line. The examples are what the phones write (newer phones put a narrow no-break space, U+202F, before AM or PM; iPhone puts a left-to-right mark, U+200E, before attachments, omitted media and system text):

| Case | Phone and locale | Example line |
|---|---|---|
| A | iPhone, day first, 24 hour | `[20/11/2026, 14:05:09] Anna: See you at 6` |
| B | iPhone, US, 12 hour | `[11/20/26, 2:05:09 PM] Anna: See you at 6` |
| C | iPhone, dots (German and others) | `[20.11.26, 14:05:09] Anna: Bis gleich` |
| D | Android, day first, 24 hour | `20/11/2026, 14:05 - Anna: See you at 6` |
| E | Android, US, 12 hour | `11/20/26, 2:05 PM - Anna: See you at 6` |
| F | Android, dashes, no comma (Dutch and others) | `20-11-2026 14:05 - Anna: Tot zo` |

Reading, in this order:
1. Strip a BOM at the start. Split on `/\r?\n/`. On each line: remove U+200E, U+200F, U+202A to U+202E and U+2066 to U+2069 everywhere; turn U+202F and U+00A0 into a plain space.
2. Header regexes (on the cleaned line):
   - iPhone: `/^\[(\d{1,4})[./-](\d{1,2})[./-](\d{1,4}),? (\d{1,2}):(\d{2})(?::(\d{2}))?(?: ?([ap])\.? ?m\.?)?\] ([\s\S]*)$/i`
   - Android: `/^(\d{1,4})[./-](\d{1,2})[./-](\d{1,4}),? (\d{1,2}):(\d{2})(?::(\d{2}))?(?: ?([ap])\.? ?m\.?)? - ([\s\S]*)$/i`
   `format` is the one that matches more lines. A line that matches neither is a continuation: append `\n` plus the line to the previous message's text (lines before the first header are dropped).
3. Rest of the header (`rest`): iPhone and Android both write `Sender: text`. Split at the first `': '`. No `': '`: kind `system`, sender empty, text is `rest`. iPhone system lines carry the chat name as sender and a U+200E right after `': '`: check the raw line, and if the text after `': '` started with U+200E and is not an attachment, omitted or deleted line (below), it is `system` too, with sender empty.
4. Date order, from all headers at once (numbers p1, p2, p3): p1 has 4 digits: `ymd`. Else any p1 over 12: `dmy`. Else any p2 over 12: `mdy`. Else `ambiguous: true` and the default is `dmy` when the separator is `.` or `-`, `mdy` when any header has AM or PM, else `dmy`. `o.order` overrides everything except `ymd`. Year with 2 digits: 2000 plus it.
5. Time: 12 hour with AM: hour 12 becomes 0; with PM: add 12 unless it is 12. Pad to two digits.
6. Kinds, on the text with marks removed:
   - iPhone attachment: `/<attached: ([^>]+)>/` anywhere. `attachment` is the name, the tag is removed from `text`, `text` trimmed. kind `message`.
   - Android attachment: `/^(.+?\.[A-Za-z0-9]{2,5}) \(file attached\)\n?/`. Same handling; a caption on the next line stays as `text`.
   - Omitted: `text` is `<Media omitted>`, or matches `/^(image|video|audio|sticker|GIF|Contact card) omitted$/i`, or ends with `document omitted`. kind `omitted`, text unchanged.
   - Deleted: `This message was deleted`, `This message was deleted.`, `You deleted this message`, `You deleted this message.`. kind `deleted`.
   - `<This message was edited>` stays in the text.
7. `senders`: every non-empty sender in first-seen order.
8. Anything that goes wrong: return what was read so far (try/catch around the loop).

`chatRows`: header `date,time,sender,message,attachment` then one row per message; `system: false` leaves out kind `system`. With `csv: true` the sender and message cells go through `csvSafe`.

`csvSafe`: a value starting with `=`, `+` or `@` gets a `'` in front (so a spreadsheet does not run it as a formula). Nothing else changes. Say this in the Excel page's FAQ.

`chatTitle`: base name without extension; `WhatsApp Chat with Anna` and `WhatsApp Chat - Anna` become `Chat with Anna`; `_chat` becomes `Chat`; anything else is kept. Replace `/ \ : * ? " < > |` with `-`.

`findChatTxt`: the entry whose last path part is `_chat.txt`; else the first name ending `.txt` whose last part starts with `WhatsApp Chat`; else the only `.txt` entry; else undefined.

New export in src/lib/xlsx.ts:

```ts
export function rowsToXlsx(rows: string[][], sheetName = 'Chat', widths?: number[]): Uint8Array
```
`XLSX.utils.aoa_to_sheet(rows)` (strings stay strings, so a message like `=1+1` is text, not a formula), `ws['!cols'] = widths.map((wch) => ({ wch }))` when given, sheet name cleaned like `csvToXlsx`, written the same way.

Tests, new `test/whatsapp.test.ts`, no fixture files (build the text in the test):
1. Cases A to F: each gives 2 messages, date `2026-11-20`, sender `Anna`, the right text, and the continuation line joined with `\n`. A and B have time with seconds (`14:05:09`), D, E and F `14:05`.
2. `[03/04/2026, 09:00:00] Anna: hi` alone is `ambiguous: true`, date `2026-04-03`; with `{ order: 'mdy' }` it is `2026-03-04`. Adding a line dated `25/04/2026` makes it `dmy` and not ambiguous.
3. 12 AM gives `00:`, 12 PM `12:`, 1 PM `13:`.
4. iPhone `[20/11/2026, 14:06:00] Anna: ‎<attached: 00000012-PHOTO-2026-11-20-14-06-00.jpg>` gives attachment `00000012-PHOTO-2026-11-20-14-06-00.jpg` and empty text. Android `20/11/2026, 14:06 - Anna: IMG-20261120-WA0003.jpg (file attached)` with a caption line gives the attachment and the caption.
5. Android `20/11/2026, 14:00 - Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them. Tap to learn more.` is `system`; iPhone `[20/11/2026, 14:00:00] Family: ‎Messages and calls are end-to-end encrypted.` is `system` with sender empty; `chatRows(c, { system: false })` leaves both out.
6. `<Media omitted>` and `‎image omitted` are `omitted`; `This message was deleted` is `deleted`.
7. `chatTitle('WhatsApp Chat with Anna.txt')` is `Chat with Anna`; `findChatTxt(['x/_chat.txt', 'a.jpg'])` is `x/_chat.txt`.
8. `csvSafe('=SUM(A1)')` is `'=SUM(A1)`, `csvSafe('-ok')` is `-ok`. 1,000 random characters and an empty string don't throw.
9. `rowsToXlsx` of two rows read back with `XLSX.read` holds the cell `=1+1` as type `s`.

Commit `git add src/lib/whatsapp.ts src/lib/xlsx.ts test/whatsapp.test.ts`.

## Page spec

Both chat pages. The first page (row 2 step 3) does the group wiring; the second skips it.

Group wiring, once (same places the Fitness files group used on 11-26):
- src/site.ts: `export type Group` (line 59) gets `| 'Chat exports'`; `GROUPS` (`grep -n "export const GROUPS" src/site.ts`) gets `'Chat exports'` at the end; `GROUP_ID` gets `'Chat exports': 'chat'`; `GROUP_SHORT` gets `'Chat exports': 'Chats'`.
- src/components/ToolPage.astro line 130: the "Other ... tools" heading gets `page.group === 'Chat exports' ? 'chat' :` as the first check.
- ToolPage.astro line 27: `page.tool.startsWith('chat-') ? 'chat' : ` at the very front of the `family` line; the import `import ChatTool from './ChatTool.astro';` next to the FitnessTool import (line 10); the render line `{family === 'chat' && <ChatTool tool={page.tool} slug={page.slug} />}` after the csvfiles line (79) or the fitness line, whichever is last.
- src/pages/guides/index.astro line 6: add `'Chat exports'` to `TOPICS` before `'Privacy'`.
- src/site.ts: after the last Fitness entry's closing `},` (the `fit-to-csv` entry; `grep -n "slug: 'fit-to-csv'" src/site.ts`, its entry ends right before `];` above `export const GROUPS`), add a `// ---------- Chat exports ----------` block. Tool ids `'chat-xlsx'` and `'chat-pdf'` go into the `Tool` union after `| 'fit-csv'` (line 57).
- src/lib/silhouettes.ts: one line per slug, copy the `'fit-to-gpx'` line (line 90) and change the key.

One component, new `src/components/ChatTool.astro`, branching on `tool`. Copy its frame from src/components/FitnessTool.astro: the `<Drop>` usage, the `files` event listener, the `status` span with `aria-live="polite"`, the error line (give it `role="alert"`), the saved panel through `showDone`. Write the whole file in one Write call; the second page adds its branch with Edit.
- Drop: `accept=".txt,.zip,text/plain,application/zip"`, one file, main "Drop your WhatsApp export here, or <u>choose it</u>", sub "The .zip or .txt from Export chat".
- Reading: a `.zip` through `fileSource(file)` and `listZip` from src/lib/zipread.ts, then `findChatTxt(entries.map((e) => e.name))`, `readEntry`, `new TextDecoder().decode(...)`. No chat text found: error "There is no chat text file in that zip. It should hold _chat.txt or a WhatsApp Chat .txt file." A `.txt`: `await file.text()`. Then `readChat`.
- After reading, show "N messages from P people, <first date> to <last date>." (`toLocaleString()` on N.) No messages: error "No messages found. Is this a WhatsApp export file?"
- When `ambiguous`: show a select "Dates in this file are" with "Day first (20/11)" and "Month first (11/20)", preset from `order`; a change runs `readChat` again with that `order`.
- Build every element with `textContent` or `createElement`. Never put chat text into `innerHTML`.

Copy rules for both pages: card, blurb, title (60 or fewer), h1, lede, description (160 or fewer), steps, faq (4 or 5, the last two always the affiliation FAQ and `PRIVATE`), `more` (150 to 300 words, its own h2). WhatsApp may be named as the source of the file; no logo, no "official". The affiliation FAQ: q "Is this made by WhatsApp?", a "No. Stayfile is not affiliated with WhatsApp or Meta. The page reads the export file that WhatsApp's Export chat option saves on your phone." FAQ answers are plain text, so name other pages by name ("the CSV to Excel page"), never as a bare path. No em or en dashes. No "simply", "seamless", "the good news", "honest". Name no competitor site or app.

Done for each page: `npm test` and `npm run build` pass, `dist/<slug>/index.html` exists. Commit with explicit paths.

## Print spec

For `/whatsapp-chat-to-pdf/` (tool `'chat-pdf'`). The PDF comes from the browser's own print dialog ("Save as PDF"), not from pdf-lib: our pdf-lib code only has the standard fonts, which cover Latin-1, so emoji, Arabic, Cyrillic, Hindi or Chinese text would turn into `?` (see `textToPdf` in src/lib/pdf.ts). The browser prints every script and the photos.

- After reading, render the chat into `<div id="chat-print">`, shown on the page as the preview:
  - Header: h2 the `chatTitle`; a line "N messages, <first date> to <last date>"; a line "Made on stayfile.app from the WhatsApp export file <file name> on <today, YYYY-MM-DD>. Stayfile is not affiliated with WhatsApp."
  - A day heading (`<h3>`, the date) whenever the date changes.
  - Each message: a small line with time and sender (bold), then the text in a `<p>` with `white-space: pre-wrap`. System lines in grey italics, no sender. Omitted and deleted lines in grey.
  - Attachments: when the chat came from a zip, `isChatImage(attachment)` holds, and an entry whose last path part equals the attachment name exists: `readEntry`, `URL.createObjectURL(new Blob([bytes], { type }))` (type from the extension), `<img alt="<name>">` with `max-width: 60%; max-height: 320px`. At most 300 images; entries over 20 MB are skipped. Every other attachment, and images past the cap, show as "[Attachment: <name>]".
  - Status while images load: "Adding photo 12 of 140...".
- A select "Show on the right" with "Nobody" plus every sender: that sender's messages are right-aligned (`margin-left: auto`) with a light background, like a chat app.
- Checkbox "Include system lines" (unchecked) hides or shows the system lines.
- Button "Print or save as PDF": `await Promise.all(imgs.map((i) => i.decode().catch(() => {})))`, then `document.body.classList.add('printing-chat')`, `window.print()`, and remove the class on `afterprint`.
- Global print CSS in the component, `<style is:global>`: `@media print { body.printing-chat * { visibility: hidden } body.printing-chat #chat-print, body.printing-chat #chat-print * { visibility: visible } body.printing-chat #chat-print { position: absolute; left: 0; top: 0; width: 100% } body.printing-chat #chat-print .msg { break-inside: avoid } }`.
- The real limits, for the copy: the chat text is read whole (exports are text, usually a few MB); photos are read one at a time from the zip; at most 300 photos are shown, the rest are listed by name; videos, voice notes and documents are listed by name. Say exactly that, no other size claim.

## Guide rules

Same as every guide so far: one Write call for `src/pages/guides/<slug>/index.astro` (copy the frame of `src/pages/guides/strava-data-in-excel/index.astro`), about 800 to 950 words, 5 or 6 h2, datePublished the run date, a `GUIDES` entry in src/site.ts with the topic named in the row, the links named in the row. Facts only from the row; anything else say "often" or "usually" or leave out. The menu-names sentence "Menu names can differ a little between app versions." at most once per guide. "Some people report" at most once per guide. No legal advice. No em or en dashes. Done: `npm test` and `npm run build` pass and `dist/guides/<slug>/index.html` exists. One commit with explicit paths.

## Day-by-day

| Row | Date and run | Ends by (UTC) | Items |
|---|---|---|---|
| 1 | 11-27-2026 morning | 11-27 14:47 | **(0) qa 32, one commit, then `gh issue close 32 --comment "<hash>"`.** (a) src/site.ts line 3538: "/fit-gz-to-fit/ unpacks" becomes "the .fit.gz to FIT page unpacks"; line 3708: "use /csv-to-excel/." becomes "use the CSV to Excel page." Then `grep -n "a: '.*/[a-z-]*/" src/site.ts` and do the same for any other bare path in a fitness FAQ. (b) src/pages/guides/are-online-file-converters-safe/index.astro line 67: the last sentence becomes `One example is the <a href="/strava-archive-to-gpx/">Strava archive to GPX page</a>, which reads the zip on your device.` (c) src/components/FitnessTool.astro lines 240, 352 and 432: the error becomes "Those files could not be read." (d) FitnessTool.astro: give the error element `role="alert"`; check the result sentence is written only to `status` (line 48), not also to a second element. (e) In the fitness guides (find them with `grep -c "Menu names can differ\|ome people report" src/pages/guides/*/index.astro`): keep each of those sentences at most once per guide, and in garmin-export-fit-files and move-strava-to-garmin-connect the upload-error claim becomes "If an upload fails with a TCX or GPX file, try the FIT file instead." (f) src/pages/guides/strava-archive-whats-inside/index.astro: delete the sentence that says the old archive gave GPX files (`grep -n "GPX"` in that file), and cut from the See also line every link already in the body. **(1) Split CSV by column value, one commit.** src/lib/csvfiles.ts: `export function makeValueSplitter(o: { column: number; onPart: (value: string, csv: string) => void }): Splitter`. The first non-empty row is the header (same `isEmpty` as `makeSplitter`); rows are grouped in a Map by `row[o.column] ?? ''` in first-seen order; over 500 different values throws `Error('That column has more than 500 different values.')`; `end()` calls `onPart` once per value with `Papa.unparse([header, ...rows], { newline: '\r\n' })`. `export function valuePartName(base: string, value: string)`: `<base>-<value>.csv`, value with `/ \ : * ? " < > |` and control characters replaced by `-`, trimmed, cut to 60, empty becomes `blank`. Tests in test/csvfiles.test.ts: 3 values give 3 parts each with the header; a quoted cell with a comma stays whole; 501 values throw; `valuePartName('sales', 'A/B')` is `sales-A-B.csv`. src/components/CsvFilesTool.astro: a third radio after line 22, `<label><input type="radio" name="mode" value="column" /><span>One file per value</span></label>`; a `<label id="colWrap" hidden>Column <select id="col"></select></label>`, shown only in that mode; after a drop, fill it from `Papa.parse(file, { preview: 1, complete })`'s first row; in that mode the split uses `makeValueSplitter` and `valuePartName`, output through the same zip path as the other modes. site.ts split-csv entry (`grep -n "slug: 'split-csv'" src/site.ts`): a step "To get one file per customer or month, pick One file per value and the column." and a FAQ before `PRIVATE`: q "Can I split by a column, one file per customer?", a "Yes. Pick One file per value and choose the column. Every row with the same value goes into one file named after it, with the header on top. Up to 500 different values." Done: tests and build pass. **(2) Chat reader: build everything in `## Chat spec`, one commit.** Done: `npm test` passes. |
| 2 | 11-27-2026 evening | 11-28 02:47 | Finish any row 1 step not DONE first. **(3) Group wiring and `/whatsapp-chat-to-excel/`, one commit**, following `## Page spec`. Tool `'chat-xlsx'`. After reading: checkbox "Include system lines (joined, left, security notices)" unchecked; buttons "Save as Excel (.xlsx)" and "Save as CSV". Excel: `rowsToXlsx(chatRows(chat, { system }), 'Chat', [11, 9, 22, 80, 36])` saved as `<chatTitle>.xlsx`. CSV: `Papa.unparse(chatRows(chat, { system, csv: true }), { newline: '\r\n' })` through `withBom`, saved as `<chatTitle>.csv`. Copy: slug `whatsapp-chat-to-excel`, card "WhatsApp chat to Excel", blurb "Every message as a row in a spreadsheet", title "Export a WhatsApp chat to Excel or CSV, no upload", h1 "Turn a WhatsApp chat into a spreadsheet", lede: first sentence, drop the file WhatsApp's Export chat saves and get one row per message with date, time, sender, message and attachment name, as Excel or CSV; second, the chat is read on your device and never uploaded, and Stayfile is not affiliated with WhatsApp. Steps: in WhatsApp open the chat and use Export chat (link nothing; the guide comes later); drop the .zip or .txt; check the dates if the page asks whether they are day or month first; save as Excel or CSV. `more` h2 "What each column holds": date as year-month-day so it sorts; time as the phone wrote it, in 24 hour form; sender as the name saved in the exporting phone, or the number; message text with line breaks kept; attachment holds the file name when media was included (photos, voice notes, documents), and "image omitted" or "<Media omitted>" stays in the message when it was not; system lines (encryption notice, people joining or leaving) are left out unless you tick the box; iPhone and Android write the file differently and both are read; there is no message limit on this page. FAQ: "My dates look wrong" (day and month order; the page guesses from the whole file and asks when it can't tell), "Why does a message start with an apostrophe in the CSV?" (a message starting with = + or @ gets one so the spreadsheet does not run it as a formula; the Excel file keeps the text as it is), affiliation, `PRIVATE`. `dataNext` in src/lib/route.ts (`grep -n "const dataNext" src/lib/route.ts`): `'whatsapp-chat-to-excel': [{ slug: 'whatsapp-chat-to-pdf', label: 'Make a printable PDF' }]`. Done per `## Page spec`, plus `grep -c "Chat exports" dist/index.html` at least 1. **(4) `/whatsapp-chat-to-pdf/`, one commit**, following `## Page spec` and `## Print spec`. Tool `'chat-pdf'`, a branch in ChatTool.astro. Copy: card "WhatsApp chat to PDF", blurb "A clean printable copy of a chat, photos included", title "Save a WhatsApp chat as a PDF, photos included", h1 "Save a WhatsApp chat as a PDF", lede: first sentence, drop the WhatsApp export and get a clean, dated page of the chat with each sender, time and message, photos shown in place, ready to print or save as a PDF; second, the chat and its photos are read on your device and never uploaded, and Stayfile is not affiliated with WhatsApp. Steps: export the chat with media if you want the photos; drop the .zip (or the .txt for text only); pick whose messages go on the right if you like; press Print or save as PDF and choose Save as PDF as the printer. `more` h2 "What the PDF shows, and the limits": the real limits from the Print spec, word for word in meaning; the header names the export file and the date it was made; times are as the exporting phone wrote them; the PDF is made by your browser's print dialog, which handles every language and emoji; on a phone the print option is in the browser's share or menu button. Add "Menu names can differ a little between browsers." FAQ: "Why is there no download button?" (the browser's Save as PDF keeps every language and emoji right and the text searchable; a file made by the page itself could not), "Are voice notes and videos in the PDF?" (no, they are listed by name; photos up to 300 are shown), affiliation, `PRIVATE`. `dataNext`: `'whatsapp-chat-to-pdf': [{ slug: 'whatsapp-chat-to-excel', label: 'Turn it into a spreadsheet' }]`. Done per `## Page spec`. |
| 3 | 11-28-2026 morning | 11-28 14:47 | One item. Finish any earlier step not DONE first, then this. **Guide** slug `export-whatsapp-chat`, title "How to export a WhatsApp chat on iPhone or Android", topic "Chat exports". Phrases: "export whatsapp chat", "how to export whatsapp chat", "whatsapp export chat iphone". Facts: iPhone: open the chat, tap the contact or group name at the top, Export Chat, then Attach Media or Without Media, then pick where it goes (Save to Files keeps it on the phone). Android: open the chat, tap the three-dot menu, More, Export chat, then Include media or Without media, then pick an app such as Google Drive or email. WhatsApp on the web: the three-dot More options menu in the chat, Export chat, All messages or a custom date range, Export; WhatsApp's help page says this export has no media and arrives as a ZIP. What you get: from an iPhone a .zip holding `_chat.txt` and the photos and files; from Android a .txt named "WhatsApp Chat with <name>.txt" plus the media files, often zipped by the app you send it to. WhatsApp's help page says an export is a text file, not a backup, so it can't be imported back into WhatsApp, and that view once and disappearing messages are not exported. A long chat with media can be large; if older messages are missing, export again without media. Next: a spreadsheet at /whatsapp-chat-to-excel/, a printable PDF at /whatsapp-chat-to-pdf/; both read the file on the device. Link both tools and the guide `are-online-file-converters-safe`. Set `guide: 'export-whatsapp-chat'` on whatsapp-chat-to-excel, and on whatsapp-chat-to-pdf. Follow `## Guide rules`. |
| 4 | 11-28-2026 evening | 11-29 02:47 | One item. **Guide** slug `whatsapp-chat-as-evidence`, title "WhatsApp chat as evidence: what a PDF of the export shows and doesn't", topic "Chat exports". Phrases: "whatsapp chat as evidence", "print whatsapp messages for court", "whatsapp chat pdf for lawyer". Start with one sentence: "This page explains what the file holds. It is not legal advice; a lawyer or the court can tell you what they accept." Facts: the export is a plain text file (plus media) that WhatsApp writes; any text editor can change it, so a PDF made from it shows what the file says, not proof by itself that the messages were sent. It holds date, time, sender, text and attachment names. The sender is the name saved in the exporting phone's contacts, or the number when it is not saved. It does not hold read receipts (the blue ticks), delivery times, message IDs, the text of deleted messages, view once or disappearing messages (WhatsApp's help page says those are not exported). Times are in the exporting phone's time zone and clock format. Good habits: keep the original export .zip unchanged next to the PDF, note when and from which phone you exported, export without a date filter so nothing looks cut, and keep the phone. Screenshots show the phone's screen with its look, a PDF of the export is easier to read and search for a long chat. Our PDF's header names the export file, the message count, the date range and the date it was made. Link /whatsapp-chat-to-pdf/, /whatsapp-chat-to-excel/, guide `export-whatsapp-chat`. Add this slug to whatsapp-chat-to-pdf's `guide` as a list after `export-whatsapp-chat`. Follow `## Guide rules`. |
| 5 | 11-29-2026 morning | 11-29 14:47 | One item. **Home drop routing for chats and fitness files, one commit.** src/lib/route.ts: add `'chat'` to `Kind` (line 5); in `kindOf` (line 9), before the `.txt` test: a name whose last path part is `_chat.txt`, or that starts with `whatsapp chat` (lowercased) and ends `.txt` or `.zip`, is `'chat'`. In `suggestTools`, right after the `fit` block (line 36): one file of kind `chat` returns `[{ slug: 'whatsapp-chat-to-excel', label: 'Turn into a spreadsheet' }, { slug: 'whatsapp-chat-to-pdf', label: 'Make a printable PDF' }]`. Other `.zip` files stay unrouted. src/pages/index.astro line 27: add `.zip,.fit,.gz` to the Drop's `accept` and "· WhatsApp chats · FIT" to the end of the `sub` list before "You pick". Tests in test/route.test.ts: `WhatsApp Chat with Anna.zip`, `_chat.txt` and `WhatsApp Chat - Ben.txt` route to the two chat pages; `notes.txt` still routes as text; `photos.zip` returns `[]`. Done: tests and build pass. |
| 6 | 11-29-2026 evening | 11-30 02:47 | Only if no new weekly plan has replaced this file. One item. **Guide** slug `read-whatsapp-chat-export-on-computer`, title "How to read a WhatsApp chat export on a computer", topic "Chat exports". Phrases: "open whatsapp chat txt file", "read whatsapp export on pc", "whatsapp _chat.txt". Facts: the export from an iPhone is a .zip; unzip it first (a double click on a Mac; on Windows right-click, Extract All). Inside: `_chat.txt` from an iPhone, "WhatsApp Chat with <name>.txt" from Android, plus the photos and files when media was included, with names like `00000012-PHOTO-2026-11-20-14-06-00.jpg` (iPhone) or `IMG-20261120-WA0003.jpg` (Android). The .txt opens in Notepad or TextEdit: each message starts with its date and time and sender, and photos are only file names, so long chats are hard to follow. Older editors can show emoji as boxes. To read it like a chat with the photos in place, drop the zip on /whatsapp-chat-to-pdf/ and read the preview or print it; to search, sort or count messages, use /whatsapp-chat-to-excel/ and Excel's filter. Link both tools and guides `export-whatsapp-chat`, `whatsapp-chat-as-evidence`. Follow `## Guide rules`. |

## Backlog (in order, for runs that finish early)

1. **Guide** slug `whatsapp-messages-per-person-excel`, title "Count WhatsApp messages per person in Excel", topic "Chat exports". Phrases: "whatsapp chat analysis excel", "who sends the most messages whatsapp". Facts: make the spreadsheet at /whatsapp-chat-to-excel/; in Excel select the table, Insert, PivotTable; put sender in Rows and message in Values (it counts); for messages per month put date in Columns and group it by month, or add a column `=LEFT(A2,7)` (the date is text in year-month-day form, so the first 7 characters are the month); filter out empty senders to drop system lines; Google Sheets has the same pivot table under Insert. Add the menu-names sentence. Link /whatsapp-chat-to-excel/, guides `export-whatsapp-chat`, `csv-opens-in-one-column-in-excel`. Add this slug to whatsapp-chat-to-excel's `guide` as a list.
2. **Two links from older guides**, one each at the end of the last paragraph, nothing else changed: src/pages/guides/are-online-file-converters-safe/index.astro gets `Chats are as private as files get, and <a href="/whatsapp-chat-to-pdf/">a WhatsApp chat can be turned into a PDF on your device</a> too.`; src/pages/guides/csv-opens-in-one-column-in-excel/index.astro gets `The same fix works for a <a href="/whatsapp-chat-to-excel/">WhatsApp chat saved as CSV</a>.` Done: tests and build pass.
3. **Chat reader edge test**: a 5,000-message generated chat (case D lines) reads in under 2 seconds in the test, and a message holding `: ` in its text keeps the whole text (`Anna: time: 5pm` gives text `time: 5pm`). Fix the reader if either fails.
4. Only after all of the above: ask the boss once.

## Cut, and why

- A pdf-lib "Download PDF" button for chats: the standard fonts only cover Latin-1, and a Unicode font needs fontkit (a new dependency) plus a font of several MB. The print route is correct for every language now. If the PDF page gets visitors, a canvas-drawn download is a later Pro candidate.
- WhatsApp chat to CSV as its own page, and Telegram or Signal exports: near-duplicates for now; Telegram's export is HTML or JSON, a different reader. Weigh them once the two WhatsApp pages rank.
- Chat statistics (word clouds, charts): polish nobody searches for in our phrase family.
- More fitness, CSV, PDF or photo guides: 42 guides already; the new group is the CEO's order.
- Pro and hire requests: 100 visits against a 1,000 trigger; CEO budget 0.
- Browser checks: daily runs can't run them.

## For the CEO

- I follow the 11-26 order in its order: split by column value, the chat reader, Excel, PDF, then the two guides (rows 3 and 4), plus a routing row and a third guide.
- Where I differ: the order says the PDF may be "saved with the PDF code you already have". I don't think it should be. Our pdf-lib code embeds only the standard fonts (WinAnsi, Latin-1); `textToPdf` turns anything else into `?`. A WhatsApp chat is full of emoji and non-Latin scripts, so the file would come out broken. The page renders the chat in the browser and uses its print dialog's Save as PDF, which handles every script, keeps the text searchable and shows the photos. The copy says so plainly and states the real limits (300 photos inline, the rest listed; video and voice notes listed by name).
- WhatsApp's own help page (checked 11-26) says web exports now offer a custom date range, carry no media and arrive as a ZIP; view once and disappearing messages are not exported; an export can't be imported back. It gives no message-count limit, so our copy names none.
- All code is in rows 1 and 2 on 11-27, while the paid model still runs; rows 3 to 6 are one item each for a free model, as you asked.
- Nothing needs the owner this week. No decision issue, no roadmap change (your 11-26 line already lists the group).

## Guardrails

- If your row is done, take the next row not DONE, then the backlog. Never end with only a log commit.
- Read this file once at the start, and only your row plus the spec it names. Don't re-read the whole of ops/log.md; the top two entries are enough.
- Allowed commands: `date`, `npm test`, `npm run build`, `npm install`, `git`, `gh issue`, `node scripts/ask-boss.mjs`, plus Read, Edit, Write, Glob, Grep. Nothing else (`ls`, `cat`, `cp`, `rm`, `npx`, `python`). Probes go in /tmp.
- No new npm dependencies. papaparse, fflate, xlsx and the zip reader in src/lib/zipread.ts are already there.
- A new tool id must not start with `img`, `pdf` or `fit-`. Chat ids start with `chat-`, and the `chat-` check goes first on the `family` line.
- site.ts is about 3,980 lines. Anchor Edits on `slug: '<slug>',` plus the next line. If an Edit fails twice, `git checkout -- src/site.ts` and retry once from a fresh `grep -n`.
- Tests run in Node: no DOMParser, no `document` in src/lib files. Keep browser code in the component.
- Never put text from a dropped file into `innerHTML` or `set:html`. Use `textContent`.
- Never call `arrayBuffer()` on a dropped zip. Read it through `fileSource` and `listZip`.
- FAQ answers render as plain text: never write a bare path like /csv-to-excel/ in one; name the page.
- Write each guide and each new file with one Write call. Don't re-read a file you just wrote.
- Stage explicit paths only. Never `git add -A` or `git add .`. No helper scripts in the repo root.
- ops/log.md is newest first: your entry goes right under the `# Ops log` heading. Keep it under 15 lines.
- Don't edit ops/metrics.csv, ops/costs.json, ops/roadmap.md, ops/ceo-notes.md or anything in .github/.
- Never claim a feature without reading the code; never state an outside fact that isn't in your row.
- Morning metrics: sum the last 30 rows of the visitors column (blanks as 0) and put the number in the log. Decision issue only at 1,000 (Pro).
