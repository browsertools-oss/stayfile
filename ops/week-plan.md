# Week plan: 11-15-2026 (Sun) to 11-22-2026 (Sun)

Written by the weekly planner (Opus) on 11-15-2026. **Find your row:** run `TZ=America/Los_Angeles date +%m-%d-%Y` and `TZ=America/Los_Angeles date +%H`. If the hour is before 12 you are the morning run, otherwise the evening run. Runs start about 6:47am and 6:47pm Pacific (14:47 and 02:47 UTC). The evening run's UTC date is the next day: the 11-16-2026 02:47 UTC run is row 1, "Sun 11-15-2026 evening". When you finish an item, add `DONE <hash>` at the end of that item. Don't otherwise rewrite this file.

## At a glance

<!-- Summary for the owner's dashboard. Agents: follow the Day-by-day table below and mark DONE there, not here. -->

Goal: Turn thin converter pages into pages worth indexing: six guides and real detail on 16 top tools, with no new pages.

Targets:
- Six guides plus a guides index, each guide at least 700 words
- 16 top tool pages get a section of real detail
- No new tool pages (stays at 85)
- 100 visitors in the last 30 days (now 70)

| Run | In plain words |
|---|---|
| 1 | Set up the guides section and a "more detail" block, starting on HEIC to JPG |
| 2 | Guide 1: iPhone HEIC photos, how to convert them and stop getting them |
| 3 | More detail on merge PDF, PDF to JPG, JPG to PDF and compress image |
| 4 | Guide 2: why a CSV opens in one column in Excel |
| 5 | More detail and samples on four CSV, JSON and Excel pages |
| 6 | Guide 3: loading a CSV into MySQL, PostgreSQL or SQLite |
| 7 | More detail and samples on CSV to SQL, YAML to JSON and CSV to Markdown |
| 8 | Guide 4: combining PDF files on Windows, Mac and iPhone |
| 9 | More detail on split PDF, PDF to text, WebP to JPG and resize image |
| 10 | Guide 5: making a favicon from a PNG or SVG |
| 11 | More detail on four image pages |
| 12 | Guide 6: opening WebP images, then link the guides to each other |
| 13 | Check every guide (tests, links, sitemap) and link the guides from the home page |
| 14 | Finish anything left over, then work down the backlog |

## Money picture

**Spent so far (cash, from ops/costs.json in both repos):**
- Stayfile: $8.20 (stayfile.app domain, 1 year).
- SubFixer: $18.20 ($8.20 subfixer.app domain + $10.00 OpenRouter credit that both ventures share).
- Both ventures: **$26.40 spent, $0.00 earned.**
- OpenRouter credit used: about $0.22 by Stayfile (11-09 to 11-11) and $0.17 by SubFixer. Daily runs are on free models now, so the credit has not moved since 11-11-2026.

**Monthly costs from now on:**
- Domain: subfixer.app renews at $14.20 a year. I assume stayfile.app renews at about the same, so **$1.18 a month** for Stayfile.
- API: $0 to $0.50 a month while runs stay on free models (the weekly Opus session is not in costs.json).
- Hosting (Cloudflare Pages) and CI cost nothing.
- **Stayfile: about $1.45 a month. Both ventures: about $2.90 a month.**

**Where revenue comes from, in order:**
1. **AdSense.** Applied 11-09-2026 for both sites, still in review. The roadmap shows ads at about 300 visits a month with most tool pages indexed. Google rejects tool sites it sees as "low value content": a page that is only a drop box plus 200 words of template copy looks thin, and Stayfile has 85 such pages, 59 of them X-to-Y converter variants. AdSense pays out only at a $100 balance, so the first cash from ads is months away even after approval.
2. **Stayfile Pro** (Lemon Squeezy, about $4 a month or $24 a year). Trigger: 1,000 visits in 30 days. After Lemon Squeezy's fee (5% + $0.50) one monthly sale nets about $3.30. Note for later: image batch convert and zip download are **already free** on Stayfile, so the roadmap's "batch" offer needs a different shape here (saved presets, batch on PDF and data pages). That is not this week's work; the trigger is at 7%.

**Break-even (assumptions stated):**
- Ads: page RPM $1.50 and 1.3 pages per visit, so about **$2.00 per 1,000 visits**. Stayfile alone ($1.45 a month) needs about **725 visits a month**. Both ventures ($2.90) need about 1,450 combined. Earning back the $26.40 already spent within 12 months as well needs about 2,550 combined.
- Pro: 0.2% of monthly visitors subscribe. **One subscriber** covers Stayfile's monthly cost, which needs about 500 visits a month.

**Where we are:** 70 visits in the last 30 days (ops/metrics.csv: 20, 10, 20, 0, 20, 0, blank). That is 23% of the ads level and 7% of the Pro trigger. SubFixer is at 80. A web search for `site:stayfile.app` on 11-15-2026 returned **no pages**. The sitemap is live (88 URLs at https://stayfile.app/sitemap-0.xml) and deploys ping IndexNow, but Google has not indexed anything. Owner issue #9 in the subfixer repo asks the owner to submit both sitemaps and request indexing. It names Stayfile's pages only as "the home page and its top tools", so here is the list (owner: request indexing in this order, about 10 a day): /, /heic-to-jpg/, /merge-pdf/, /pdf-to-jpg/, /jpg-to-pdf/, /csv-to-excel/, /compress-image/, /webp-to-jpg/, /csv-to-sql/, /png-to-ico/, then /guides/ once it is live. Until pages are indexed, more converter pages add nothing.

**This week's targets (the planner checks them next Sunday):**
1. **Six guides live under /guides/**, each with at least 700 words of its own text, plus a /guides/ index page. Check: `npm test` passes the new guide word-count test (row 1 builds it) and `grep -c "/guides/" dist/sitemap-0.xml` is at least 7 after `npm run build`.
2. **At least 16 top tool pages get a "more" section** (150 to 300 words of page-specific facts checked against the code), and 5 data pages get a before/after sample whose "after" a test proves is the real output. Check: `grep -c "more: {" src/site.ts` is at least 16 and `npm test` passes.
3. **No new tool or preset pages.** Check: `grep -cE "^\s+slug: '" src/site.ts` stays at **85**.
4. Outside the agents' control (planner checks): at least 1 page shows for `site:stayfile.app`, and 30-day visitors reach at least 100.

## Last week

- **Shipped:** about 180 commits in 8 days. Pages went from about 25 to 85 (built 89 including home, about, privacy, 404). Almost all new pages were converter variants (YAML, TSV, Markdown, SQL, ICO, AVIF families). Also a 404 page, keyboard fixes, a copy-lint test, a wiring test that pins next-step keys to real slugs, and several honest-copy fixes.
- **Runs:** 14 scheduled runs. Five were marked failed (11-12 14:47, 11-13 14:47, 11-14 02:47, 11-14 14:47, 11-15 02:47 UTC). The 11-15 02:47 failure was "Reached maximum number of turns (250)" after 12 minutes. The commit step still saved work in each.
- **Slipped:** every browser check. `node scripts/browser-check.mjs` is not an allowed command for daily runs and never will be. Every run since 11-10 tried it, logged it as blocked and wrote it into next.md again.
- **What the data says:** traffic is flat at about 10 visits a day with zero indexed pages. Sixty template pages did not move it. This week goes into fewer, deeper pages that answer real questions, which also is what AdSense review needs.

## Research done for you (use these facts; don't invent others)

Competition: every converter phrase ("heic to jpg", "csv to sql", "merge pdf") already has dozens of "free, private, in-browser" clones on *.pages.dev, lovable.app and similar, plus the big sites. "No upload" alone is not an edge any more. The gap is **plain answers to the problem around the conversion** (why the file won't open, why Excel shows one column, how to get the data into the database), with our tool as the step that fixes it. Don't name competitors in copy.

- **iPhone HEIC** (Apple support article HT201302 and others):
  - Settings > Camera > Formats. "High Efficiency" saves photos as HEIF/HEIC (and video as HEVC). "Most Compatible" saves JPEG (and H.264). Changing it does not convert photos already taken. Most Compatible files are larger.
  - To keep HEIC on the phone but get JPGs on a computer: Settings > Photos > "Transfer to Mac or PC" > Automatic. "Keep Originals" sends HEIC as is. (On newer iOS this sits under Settings > Apps > Photos; say "the Photos settings".)
  - Windows 10 and 11: the free "HEIF Image Extensions" from the Microsoft Store, and many HEIC photos also need "HEVC Video Extensions", which usually costs $0.99 (some PCs can get the free "HEVC Video Extensions from Device Manufacturer"). Prices vary by region; say "usually about a dollar".
  - Before writing what our HEIC page does, read src/lib/heic.ts: the browser decodes it when it can, and libheif-js loads only when it can't. Check whether EXIF metadata (date, location) survives: if the code draws to a canvas and re-encodes, metadata is **not** kept. Say so plainly either way.
- **CSV opens in one column in Excel:**
  - Cause: Excel splits a CSV with the "list separator" from the computer's region settings. In regions that use a comma as the decimal mark (most of Europe, much of South America) the separator is a semicolon, so a comma file lands in column A. The reverse also happens.
  - Fixes: (1) Data > From Text/CSV, then choose the delimiter by hand. (2) Put `sep=,` (or `sep=;`) as the first line of the file; Excel reads it, but other programs treat it as a data row. (3) Data > Text to Columns on column A (turns values into text). (4) Change the list separator: Windows Control Panel > Region > Additional settings; Mac System Settings > Language & Region. (5) Convert to .xlsx, which has no separator problem: our /csv-to-excel/ page, which auto-detects the delimiter (check `parseCsv` in src/lib/data.ts: `delimiter: ''` means auto-detect).
  - Accents shown as "Ã©": the file is UTF-8 but Excel read it as the local code page. Fix: Data > From Text/CSV and set File Origin to "65001: Unicode (UTF-8)", or save from Excel as "CSV UTF-8 (Comma delimited)". Converting to .xlsx also avoids it.
- **Loading a CSV into a database:**
  - MySQL: `LOAD DATA LOCAL INFILE 'people.csv' INTO TABLE people FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 LINES;` Needs `local_infile` enabled on both client and server, which many hosts turn off.
  - PostgreSQL (psql): `\copy people FROM 'people.csv' WITH (FORMAT csv, HEADER true)`. The table must exist first.
  - SQLite (sqlite3 shell): `.import --csv people.csv people`. If the table does not exist, the first row becomes the column names.
  - When none of those work (a web SQL console, a host without file access, a migration file in git), INSERT statements are the portable route: /csv-to-sql/ and /excel-to-sql/. Read `csvToSql` and `sqlTableName` in src/lib/data.ts before saying what our output does (numbers unquoted, empty cells NULL, quotes doubled, table name cleaned to letters, digits, `_` and `$`, 64 characters max). Check whether it writes CREATE TABLE; don't claim it if it doesn't.
- **Combining PDFs without extra software:**
  - Mac: open the first PDF in Preview, View > Thumbnails, drag the other PDFs into the sidebar where they should go, then File > Export as PDF.
  - iPhone and iPad: in the Files app tap Select, pick the PDFs, tap the More button (three dots), Create PDF. Menu names move between iOS versions; keep it to these words.
  - Windows 10 and 11 have no built-in way to join PDFs; "Microsoft Print to PDF" prints one document at a time. Use /merge-pdf/.
  - Read src/lib/pdf.ts merge code first: say what it keeps (pages as they are, text stays selectable) and what it does not (check bookmarks/outline and form fields; if not copied, say so).
- **Favicons:**
  - An .ico file can hold several sizes in one file. Our /png-to-ico/ writes 16, 32 and 48 px (`ICO_SIZES` in src/lib/ico.ts).
  - Put favicon.ico at the site root; browsers ask for /favicon.ico on their own. Markup that covers modern browsers: `<link rel="icon" href="/favicon.ico" sizes="any">`, `<link rel="icon" href="/icon.svg" type="image/svg+xml">`, `<link rel="apple-touch-icon" href="/apple-touch-icon.png">` with a 180 by 180 PNG.
  - Start from a square image; a non-square one is padded or squashed (check what src/lib/ico.ts does and say that).
- **WebP images:** browsers save many web images as .webp because the site served WebP. Some older programs, print shops and upload forms refuse .webp. Converting to JPG gives the widest support; PNG keeps transparency. A JPG has no transparency, and our JPG output fills it with white (stated in ops/design.md).

## How to build a guide (rows 1, 2, 4, 6, 8, 10, 12)

- File: `src/pages/guides/<slug>/index.astro`. Use `Base` with `title`, `description`, `path={'/guides/<slug>/'}` and `jsonld` holding one schema.org `Article` object (`headline`, `description`, `datePublished` as "2026-11-16" style ISO date, `author` and `publisher` `{ '@type': 'Organization', name: 'Stayfile' }`).
- Body: one `<h1>`, a lede paragraph, then 4 to 7 `<h2>` sections, plain `<p>`, `<ol>`/`<ul>`, and `<pre><code>` for commands. Link at least 3 tool pages (`/slug/`) where they fit the text, and end with a "See also" line linking another guide once one exists.
- Wrap the content in a container that matches the about page: open `src/pages/about/index.astro` and copy its outer markup and classes. Don't invent new CSS beyond a `pre` rule (monospace, `overflow-x: auto`).
- Title at most 60 characters, description at most 160. Body at least **700 words** of the guide's own text. Every claim about what Stayfile does must be checked in the code first.
- Add `{ slug, title, blurb }` to a new exported `GUIDES` array in src/site.ts (row 1 creates it). A guide goes into `GUIDES` only when it is finished and passes the word-count test.
- Write the whole guide file with one Write call, not many small Edits. That saves turns (the turn cap is 250).

## Spec for the "more" section (row 1 builds it, later rows fill it)

- In `ToolPage` (src/site.ts) add `more?: { h2: string; paras: string[]; sample?: { before: string; after: string } }` and `guide?: string` (a guide slug).
- In src/components/ToolPage.astro, render `more` right after the "How to use it" section: a `<section class="row">` with `<h2>{more.h2}</h2>`, each para as `<p>`, and if `sample` is set, two labelled `<pre class="sample">` blocks "Before" and "After" (monospace, `overflow-x: auto`, small type). If `guide` is set, render "Read the guide: <title>" as a link under the Questions section, with the title taken from `GUIDES`. Record the decision in ops/design.md.
- `paras`: 2 to 4 paragraphs, 150 to 300 words in all, facts specific to this conversion (what happens to quality, transparency, metadata, page size, sheets, types, limits), each checked in the code. No repeat of the lede or the FAQ.
- `sample` (data pages only): 3 to 5 rows. Never type the "after" by hand; get it by calling the transform in a test, then paste it. Each sample gets a test in test/core.test.ts: `expect(<transform>(page.more.sample.before, <options the page uses>).trim()).toBe(page.more.sample.after.trim())`, looking the page up from `PAGES` by slug.
- The copy-lint test must also cover `more.h2`, `more.paras` and the guide files (row 1 extends it).

## Day-by-day

| # | Run (Pacific) | UTC start | Items |
|---|---|---|---|
| 1 | Sun 11-15-2026 evening | 11-16 02:47 | (a) Build the guide plumbing: `GUIDES` array in src/site.ts; src/pages/guides/index.astro (h1 "Guides", one line per guide with its blurb, path /guides/, empty-safe); a "Guides" column in the footer of src/layouts/Base.astro linking /guides/ and each guide; test/guides.test.ts that reads each `src/pages/guides/<slug>/index.astro` for every `GUIDES` entry, strips the frontmatter and tags, and asserts at least 700 words, one `<h1>`, and that title is 60 characters or fewer. Extend the copy-lint test to guide files. (b) Build the "more" section and `guide` field (spec above). Fill `more` for **heic-to-jpg** (no sample). Done = `npm test` and `npm run build` pass, dist/heic-to-jpg/index.html shows the section, dist/guides/index.html exists. DONE 058d2b5 |
| 2 | Mon 11-16-2026 morning | 11-16 14:47 | Guide 1: slug `iphone-heic-photos-to-jpg`, title "iPhone HEIC photos: convert to JPG and stop getting them". Phrases: "heic to jpg", "how to open heic on windows", "iphone photos heic". Sections: what HEIC is and why the iPhone uses it; why Windows, upload forms and older apps refuse it; converting photos you already have (/heic-to-jpg/, /heic-to-png/, /heic-to-pdf/); stopping it on the phone (Camera > Formats, Transfer to Mac or PC); the Windows extensions route and its cost; what is kept and lost (metadata, per the code). Set `guide: 'iphone-heic-photos-to-jpg'` on heic-to-jpg and heic-to-png. DONE 5b10a37 |
| 3 | Mon 11-16-2026 evening | 11-17 02:47 | `more` for **merge-pdf**, **pdf-to-jpg**, **jpg-to-pdf**, **compress-image**. Read each tool's code first (src/lib/pdf.ts, pdf-render.ts, image.ts). DONE 950c5e8 (merge-pdf) ae06992 (pdf-to-jpg, jpg-to-pdf, compress-image) |
| 4 | Tue 11-17-2026 morning | 11-17 14:47 | Guide 2: slug `csv-opens-in-one-column-in-excel`, title "CSV opens in one column in Excel: why and how to fix it". Phrases: "csv opens in one column", "excel csv not separating columns", "csv semicolon excel". Use the CSV facts: cause, the five fixes, the "Ã©" accents problem. Link /csv-to-excel/, /tsv-to-csv/, /csv-to-tsv/. Set `guide` on csv-to-excel. DONE 992b555 (built early, 11-16 morning) |
| 5 | Tue 11-17-2026 evening | 11-18 02:47 | `more` with `sample` for **csv-to-json** and **json-to-csv**; `more` without sample for **csv-to-excel** and **excel-to-csv** (first sheet only, sheet names reported; read src/lib/xlsx.ts). DONE b822cf1 (built early, 11-17 evening UTC run) |
| 6 | Wed 11-18-2026 morning | 11-18 14:47 | Guide 3: slug `import-csv-into-mysql-postgresql-sqlite`, title "Load a CSV into MySQL, PostgreSQL or SQLite". Phrases: "import csv into mysql", "csv to sql insert", "import csv postgresql". Use the database facts with the exact commands in `<pre><code>`. Then the INSERT route via /csv-to-sql/ and /excel-to-sql/, described from the code. Set `guide` on csv-to-sql and excel-to-sql. DONE 30da2f5 (built early, 11-17 evening UTC run) |
| 7 | Wed 11-18-2026 evening | 11-19 02:47 | `more` with `sample` for **csv-to-sql** (include a cell with a single quote and an empty cell so the doubling and NULL show), **yaml-to-json** and **csv-to-markdown**. DONE 5cedd24 (built early, 11-17 evening UTC run) |
| 8 | Thu 11-19-2026 morning | 11-19 14:47 | Guide 4: slug `combine-pdf-files`, title "How to combine PDF files on Windows, Mac and iPhone". Phrases: "combine pdf files", "merge pdf on windows", "merge pdf on mac". Use the PDF facts; Mac Preview steps, iPhone Files steps, Windows has no built-in way; then /merge-pdf/, and reorder or trim with /extract-pages-from-pdf/ and /remove-pages-from-pdf/. Set `guide` on merge-pdf. DONE e3ef5ec (built early, 11-17 evening UTC run) |
| 9 | Thu 11-19-2026 evening | 11-20 02:47 | `more` for **split-pdf**, **pdf-to-text**, **webp-to-jpg**, **resize-image**. DONE 71fd706 (built early, 11-17 morning run) |
| 10 | Fri 11-20-2026 morning | 11-20 14:47 | Guide 5: slug `make-a-favicon`, title "How to make a favicon.ico from a PNG or SVG". Phrases: "favicon ico", "png to ico", "how to make a favicon". Use the favicon facts and markup in `<pre><code>`. Link /png-to-ico/, /svg-to-ico/, /resize-image/. Set `guide` on png-to-ico and svg-to-ico. DONE 903cc8c (built early, 11-17 morning run) |
| 11 | Fri 11-20-2026 evening | 11-21 02:47 | `more` for **png-to-ico**, **png-to-jpg**, **svg-to-png**, **avif-to-jpg**. DONE 5ace13c (built early, 11-17 morning run) |
| 12 | Sat 11-21-2026 morning | 11-21 14:47 | Guide 6: slug `open-webp-images`, title "Saved a WebP image you can't open? Convert it". Phrases: "webp to jpg", "how to open webp", "save webp as jpg". Use the WebP facts. Link /webp-to-jpg/, /webp-to-png/, /webp-to-pdf/. Set `guide` on webp-to-jpg and webp-to-png. Then add a "See also" link from each older guide to one newer guide where it fits. DONE a906549 (built early, 11-17 morning run; import-csv and combine-pdf kept older targets, no newer fit by topic) |
| 13 | Sat 11-21-2026 evening | 11-22 02:47 | QA sweep: `npm test` (word counts, copy lint), one h1 per guide, every internal href in the guides points at an existing slug (add a test in test/guides.test.ts that collects `href="/..."` from each guide file and checks it against `PAGES` slugs plus `/guides/...` and `/`), `grep -c "/guides/" dist/sitemap-0.xml`. Fix what fails. Link the /guides/ index from the home page (one line or small section under the tool groups in src/pages/index.astro). DONE 7bdb873 (built early, 11-17 morning run; sitemap holds 7 guide URLs, one per line-agnostic count) |
| 14 | Sun 11-22-2026 morning | 11-22 14:47 | Finish anything not marked DONE above, oldest first. If all done, take the backlog in order. Do the usual morning metrics trigger check. |
Extra: more for excel-to-sql, webp-to-png, extract-pages-from-pdf, remove-pages-from-pdf, heic-to-pdf, pdf-to-png, jpg-to-png, compress-png, tsv-to-csv, csv-to-tsv DONE e6e0680 |

## Backlog (in order, for runs that finish early)

1. More `more` sections, in this order: excel-to-json, json-to-excel, rotate-pdf, add-page-numbers-to-pdf, compress-jpg, png-to-webp, heic-to-png, svg-to-ico, text-to-pdf, json-to-yaml.
2. Home page (src/pages/index.astro): one or two plain paragraphs under the h1 saying who Stayfile is for and that files never leave the browser (check the about page wording, don't contradict it). AdSense reviewers read the home page first.
3. CSV downloads: add an option "For Excel: add a UTF-8 BOM" (checkbox, off by default) on json-to-csv, excel-to-csv, yaml-to-csv and tsv-to-csv, prepending `﻿` to the saved file only. Unit-test the helper. Mention it in the CSV guide once built.
4. scripts/report.mjs: if yesterday's visitors cell is blank, print "not counted yet" instead of "undefined" (if it does that; read it first). It is a script, not a workflow, so you may edit it.

## Cut this week, and why

- **New tool and preset pages (any X-to-Y):** 85 exist, none are indexed, and template pages are what AdSense flags as thin. Nothing new until Search Console shows indexing.
- **Browser checks (`scripts/browser-check.mjs`):** daily runs can't run node scripts. Stop trying, stop logging it, and stop putting it in next.md. The planner will decide on a way to run it.
- **Moving pages to "Shipped" in ops/roadmap.md:** the roadmap is the owner's file. Don't edit it.
- **noindex or deleting thin pages:** wait for the owner's Search Console numbers (issue #9 in the subfixer repo). Don't remove pages this week.
- **Pro / paid tier work:** trigger at 7%. Only after all targets are met, and only as a planner-written item next week.
- **Polishing done-panel chains and related-grid ranking:** visitors who never arrive don't see them.

## Guardrails (seen this week)

- **Allowed commands** are `date`, `npm test`, `npm run build`, `npm install`, `git`, `gh issue`, `node scripts/ask-boss.mjs` and the Read/Edit/Write/Glob/Grep tools. Anything else (`node scripts/...`, `npx`, `rm`, `curl`, `ls`, `cat`) is blocked. Use Glob and Read instead of `ls` and `cat`. Probes go in /tmp, never in the repo.
- **Turn cap is 250.** One run hit it in 12 minutes on 11-15. Write new files in one Write call; group edits to site.ts into one Edit per page; don't re-read a file you just edited.
- **site.ts is 2,400+ lines.** Use a unique `old_string`: the `slug: '<slug>',` line plus the next line. If an Edit fails twice, `git checkout -- src/site.ts` and move on.
- **dataNext keys in src/lib/route.ts must equal page slugs** (the wiring test enforces it). This week you should not need to touch route.ts.
- **Stage with explicit paths** (`git add src/site.ts test/core.test.ts`), never `git add -A` or `.`.
- **Don't edit** ops/metrics.csv, ops/costs.json, ops/roadmap.md or anything in .github/.
- **Never claim a feature without reading the code.** That applies to guides and `more` text. If the code doesn't do it, don't write it.
- **Metrics check (morning runs):** sum the last 30 rows of the visitors column in ops/metrics.csv, blanks as 0. No decision issue unless it reaches 300 (ads) or 1,000 (Pro). At 70 it won't this week.
- **Ask the boss** (`node scripts/ask-boss.mjs "..."`) only when an item conflicts with the code or is blocked. Don't ask whether to do the browser check or add new converter pages: the answer is no.
