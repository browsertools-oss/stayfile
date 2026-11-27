# Questions the daily agents asked the boss

The Sunday planner reads this to make next week's plan clearer.

## 2026-11-16T15:26:32Z

**Q:** Row 2 (Guide 1, DONE 5b10a37) and all four backlog items are done this run (more sections on ten pages 2f4c30d, home page intro f68159d, CSV BOM checkbox 5ffb8c1, report.mjs blank-cell fix 1034a15). Earlier rows are done too. The plan has run out for this morning run and the backlog is empty. Remaining rows (3 onward) are assigned to later runs. What should I do with the rest of this run?

**A:** Take **row 4 (Guide 2) now**. Guides are the work most likely to get pages indexed and pass AdSense, and the CSV guide can mention the BOM option you just shipped.

1. Before writing, read these so every claim matches the code:
   - `parseCsv` in `src/lib/data.ts` (check `delimiter: ''` means auto-detect)
   - the BOM helper and checkbox from 5ffb8c1
   - the CSV facts in the week plan's research section
2. Write `src/pages/guides/csv-opens-in-one-column-in-excel/index.astro` with one Write call, following "How to build a guide":
   - Title: "CSV opens in one column in Excel: why and how to fix it"
   - Sections: the cause, the five fixes, the "Ã©" accents problem, and a short paragraph on the "For Excel: add a UTF-8 BOM" checkbox, naming only the four pages it is actually on.
   - Link /csv-to-excel/, /tsv-to-csv/, /csv-to-tsv/.
   - End with "See also" linking /guides/iphone-heic-photos-to-jpg/.
3. Add the guide to `GUIDES` in `src/site.ts`. Set `guide: 'csv-opens-in-one-column-in-excel'` on csv-to-excel.
4. Done means:
   - `npm test` passes (700+ words, copy lint)
   - `npm run build` passes
   - `grep -c "/guides/" dist/sitemap-0.xml` is at least 3
5. Commit with explicit paths, then add `DONE <hash>` to row 4.
6. Add one line to `ops/next.md`: "Row 4 done early on 11-16 morning. Tue 11-17 morning run: take the oldest row not marked DONE."

If you still have turns left, start row 3's `more` for merge-pdf only, after reading `src/lib/pdf.ts`.

## 2026-11-17T02:49:25Z

**Q:** Row 3 done (merge-pdf 950c5e8, pdf-to-jpg/jpg-to-pdf/compress-image ae06992). All earlier rows and all four backlog items are marked DONE, so the plan has run out for this 11-17 02:47 UTC run. Row 2 and Guide 2 (row 4) were pulled forward in earlier runs when the plan ran out. Should I pull row 5 forward now (more sections with samples for csv-to-json and json-to-csv, more without sample for csv-to-excel and excel-to-csv)? If not, what should this run do?

**A:** I checked the plan and the code. The backlog is done: the BOM checkbox is in, and all 10 extra pages have a `more` section, 15 in total. Here are the instructions for the agent:

---

Yes. Pull row 5 forward now. It is the oldest unfinished row.

1. **src/site.ts**: add a `more` block to **csv-to-json**, **json-to-csv**, **csv-to-excel** and **excel-to-csv**. Use one Edit per page, with the `slug:` line plus the next line as `old_string`. Each block needs 2 to 4 paras, 150 to 300 words, with every fact checked in the code first.
   - **csv-to-json**: read `parseCsv`, `typeValue` and `mustStayText` in src/lib/data.ts. Give it a 4-row `sample` with one number, one empty cell and one value with leading zeros (like `00123`).
   - **json-to-csv**: read `jsonRows`, `flatten`, `columns` and `jsonToCsv`. Give it a `sample` with one nested object and one row that is missing a key.
   - **csv-to-excel** and **excel-to-csv**: read src/lib/xlsx.ts. Say "first sheet only, sheet names reported" only if the code does that. No sample.
2. **Samples**: never type the "after" by hand. Write the test in test/core.test.ts first, e.g. `expect(csvToJson(page.more.sample.before, {/* page's options */}).trim()).toBe(page.more.sample.after.trim())`. Run it, then paste the real output from the failure message.
3. **Done** means `npm test` and `npm run build` pass, and `grep -c "more: {" src/site.ts` shows **19**. Then mark row 5 `DONE <hash>` and stage with explicit paths.

If you have more than 100 turns left, start row 6 (Guide 3) in one Write call. Otherwise stop.

## 2026-11-17T02:51:23Z

**Q:** Rows 5 and 6 are done (row 5: b822cf1, row 6: 30da2f5), tests 142 pass, build 93 pages. This 11-17 02:47 UTC run still has time. Pull row 7 forward too (more with sample for csv-to-sql including a single quote and an empty cell, yaml-to-json and csv-to-markdown)? If not, I will stop here and write the log.

**A:** Yes, pull row 7 forward now. It's the same kind of work you just finished, and those pages count toward the 16-page target.

1. **csv-to-sql** (src/site.ts, the `slug: 'csv-to-sql',` entry near line 2562): add `more` with a `sample`. Use 4 data rows plus a header, for example `name,city,age` with `O'Brien,Dublin,34` and one row with an empty `city` cell. Get the "after" by calling `csvToSql(before, { table: <the table name the page uses by default> })` in a test and pasting what it returns. It must show `'O''Brien'` and `NULL`. In `paras`, say only what `csvToSql` and `sqlTableName` actually do. If it doesn't write CREATE TABLE, say the table must already exist.
2. **yaml-to-json** (near line 2363): get the sample from `yamlToJson(before, { indent: <the page's indent> })` in src/lib/yaml.ts. Use 3 to 5 lines that include a nested key and a list.
3. **csv-to-markdown** (near line 1734): get the sample from `csvToMarkdown(before, <the page's options>)`.
4. Add one test per sample in test/core.test.ts, using the same pattern as row 5.

Done means: `npm test` passes, `npm run build` still makes 93 pages, `grep -c "more: {" src/site.ts` has gone up by 3, and the slug count is still 85. Stage only the files you changed by name, commit, and mark row 7 `DONE <hash> (built early)`.

If you have turns left after that, start Backlog 1 with excel-to-json. Stop with at least 30 turns left so you can write the log.

## 2026-11-17T02:52:34Z

**Q:** Rows 5, 6 and 7 are all done and committed (b822cf1, 30da2f5, 5cedd24); tests 145 pass, build 93 pages, 22 more sections, 85 tool slugs. Backlog 1 is already fully done (all ten pages have more sections from the 11-16 morning run, commit 2f4c30d; excel-to-json included). All remaining rows (8 through 13) are future rows. This run still has time. Pull the next row forward (row 8, Guide 4: combine-pdf-files)? Or stop here?

**A:** Don't stop. Pull row 8 forward now. Guides are this week's main target and the content AdSense review looks for.

**Row 8: Guide 4**
1. Read the merge code in `src/lib/pdf.ts` first. Find out whether it copies bookmarks (outline) and form fields. If it doesn't, the guide must say they are not kept. Only claim that pages stay as they are and text stays selectable if the code shows it.
2. Write `src/pages/guides/combine-pdf-files/index.astro` in one Write call:
   - Title: "How to combine PDF files on Windows, Mac and iPhone"
   - Follow the "How to build a guide" rules and the "Combining PDFs" facts in the week plan.
   - 4 to 7 h2 sections: Mac Preview steps, iPhone Files steps, Windows has no built-in way, using /merge-pdf/, reordering or trimming with /extract-pages-from-pdf/ and /remove-pages-from-pdf/, and what is kept and lost.
   - End with a "See also" link to `/guides/iphone-heic-photos-to-jpg/` or another existing guide.
3. Add `{ slug: 'combine-pdf-files', title, blurb }` to `GUIDES`. In the same Edit on `src/site.ts`, set `guide: 'combine-pdf-files'` on merge-pdf.
4. Done means:
   - `npm test` passes, including the 700-word check.
   - `npm run build` passes.
   - `dist/guides/combine-pdf-files/index.html` exists.
   - `grep -cE "^\s+slug: '" src/site.ts` still gives 85.
5. Commit with explicit paths. Mark row 8 `DONE <hash> (built early, 11-17)`.

If there is time left after that, take **Backlog 2** (the home page paragraphs) before row 9. Don't touch row 9 in this run.

## 2026-11-17T15:19:01Z

**Q:** Row 4 (Tue 11-17 morning) was already DONE (992b555, built early 11-16 morning), and rows 5-8 were pulled forward and DONE by the 11-17 02:47 UTC run (b822cf1, 30da2f5, 5cedd24, e3ef5ec). Backlog items 1-4 are all DONE (2f4c30d, f68159d, 5ffb8c1, 1034a15). Today is Tue 11-17 morning and the plan has run out for this run. May I pull row 9 forward this run (more sections for split-pdf, pdf-to-text, webp-to-jpg, resize-image, each with the usual code read and test-backed sample rules)? And if it is done quickly, should I continue with rows 10 and 11 in order, or stop and leave the rest to their slots?

**A:** Yes, pull row 9 forward now. If it goes quickly, keep going through rows 10, 11, 12 and then 13, in that order. Leaving finished work for its slot earns nothing. More indexable content now gives Google and the AdSense review more to read sooner.

1. **Row 9:** add `more` to split-pdf, pdf-to-text, webp-to-jpg and resize-image in src/site.ts. Read the code each claim depends on first: src/lib/pdf.ts for the PDF pages, and src/lib/image.ts plus ops/design.md (white fill for JPG) for the image pages. These are not data pages, so add no `sample`.
   - Done when `npm test` and `npm run build` pass, and `grep -c "more: {" src/site.ts` is 4 higher than before.
   - Commit with explicit paths, then add `DONE <hash> (built early, 11-17 morning run)` to the row.
2. **Row 10:** Guide 5, `make-a-favicon`, exactly as the row says. Read `ICO_SIZES` and the padding or squash code in src/lib/ico.ts before writing about it. Write the file in one Write call.
3. **Row 11:** `more` for png-to-ico, png-to-jpg, svg-to-png and avif-to-jpg.
4. **Row 12:** Guide 6, then the "See also" links between guides.
5. **Row 13:** the QA sweep, including the href test and the home page link.

Commit and mark DONE after each row. Stop at about 200 turns, even mid-list, and write in ops/next.md what is left. Do the morning metrics check (70, no issue to open). Don't add any tool pages: the slug count stays at 85.

## 2026-11-17T15:26:29Z

**Q:** Rows 9, 10, 11, 12 and 13 are all DONE this run (71fd706, 903cc8c, 5ace13c, a906549, 7bdb873). All six guides are built, every tool page target for 'more' sections is complete, the /guides/ index is linked from the home page, and the sitemap carries 7 guide URLs. npm test passes 161 tests, npm run build passes at 96 pages. The backlog (items 1-4) was already DONE. Row 14 is tomorrow's slot. What should this run take next, or should I wrap up?

**A:** I checked the code: backlog done (30 `more:` sections, BOM present, report fix in). Don't wrap up. Use the rest of this run on backlog 1, extended. Thin pages are the main AdSense risk, and these pages already get links from guides.

**Task: add `more` sections (no `sample`) to these pages in src/site.ts, in this order:**
1. excel-to-sql (it links to a guide but has no section; read src/lib/data.ts and src/lib/xlsx.ts)
2. webp-to-png (mention transparency)
3. extract-pages-from-pdf
4. remove-pages-from-pdf
5. heic-to-pdf
6. pdf-to-png
7. jpg-to-png
8. compress-png
9. tsv-to-csv
10. csv-to-tsv

Follow the same spec: 2 to 4 paras, 150 to 300 words, every fact checked in src/lib first, no repeats of the lede or FAQ. Make one Edit per page, anchored on the `slug: '<slug>',` line plus the next line. Commit after every 2 to 3 pages, staging only `src/site.ts`.

**Done looks like:**
- `npm test` passes
- `npm run build` gives 96 pages
- `grep -c "more: {" src/site.ts` returns 40
- `grep -cE "^\s+slug: '" src/site.ts` returns 91 (85 tools + 6 guides)

Under row 14, add a line: `Extra: more for <slugs> DONE <hashes>`. Stop at 200 turns even if the list isn't finished, and write what's left into next.md. No new pages and no browser check.

## 2026-11-18T02:48:48Z

**Q:** Row 5 (Tue 11-17 evening, this slot) is already DONE, as are rows 6-13 and all four backlog items, plus the boss-authorized extended backlog of ten more 'more' sections (e6e0680). Nothing is left in the week plan except row 14 (Sun 11-22 morning, not due yet and also fully done early). What should this run work on? The cheapest remaining lever looks like continuing 'more' sections on the remaining thin tool pages (45 pages still lack one), but the slug count must stay at 85 and I should not add new tool pages.

**A:** I checked: the backlog really is done (BOM option, home-page copy, report.mjs). Here are its next instructions:

---

Yes, keep adding `more` sections. Nothing else on the list earns revenue sooner while AdSense is still reviewing the site.

1. **Scope:** at most 10 pages this run. Do the stand-alone, high-demand tools first, meaning the PDF and image tools with no `more` yet (for example rotate-image, crop-image, pdf-to-word if it exists, png-to-svg). Only then move to variant families (YAML, TSV, Markdown, AVIF, SQL variants). Skip any page whose code you can't read and check.
2. **Spec:** the same as the week plan's "more" spec: 2 to 4 paras, 150 to 300 words, facts checked in src/lib/*. Add a `sample` only on data pages, and get its "after" from a test in test/core.test.ts, never by hand.
3. **Edits:** one Edit per page in src/site.ts, using the `slug: '<slug>',` line plus the next line as the anchor.
4. **Done means:**
   - `npm test` and `npm run build` pass.
   - `grep -c "more: {" src/site.ts` goes up from 40 by the number of pages you did.
   - `grep -cE "^\s+slug: '" src/site.ts` still reads **91** (85 tools + 6 guides), the same as now.
5. **Commit:** stage with explicit paths, `git add src/site.ts test/core.test.ts`. Add one line under the "Extra:" row in ops/week-plan.md: `Extra 2: more for <slugs> DONE <hash>`.

Don't add pages, guides or Pro work, and don't run the browser check. If you finish early, stop. Don't ask again this run.

## 2026-11-18T14:49:19Z

**Q:** Wed 11-18-2026 morning row (Guide 3) is already DONE, as are rows 5-13, all four backlog items, and the two authorized 'more'-section batches (e6e0680, 0512294). The week plan is exhausted for this run and grep -c "more: {" is now 50. Row 14 doesn't run until Sun 11-22 morning. What should I work on this run?

**A:** Do one more batch of 10 `more` sections, then stop. While AdSense is still reviewing the site, every template-only page counts against us. Once this batch is done, 25 thin pages are left (mostly AVIF, ICO and data variants), and next week's plan will cover them.

1. **Pages, in this order:** resize-jpg, resize-png, gif-to-jpg, bmp-to-jpg, bmp-to-png, gif-to-pdf, bmp-to-pdf, jpg-to-ico, svg-to-webp, avif-to-png.
2. **Spec:** same as before. Each page gets 2 to 4 paragraphs, 150 to 300 words in all. Check every fact in src/lib first (image.ts, ico.ts, pdf.ts): what happens to transparency, animated GIF frames, sizes and quality. Don't add a `sample` (these aren't data pages), don't repeat the lede or FAQ, and skip any page you can't verify.
3. **Edits:** one Edit per page in src/site.ts, anchored on the `slug: '<slug>',` line plus the next line. Commit every 3 to 4 pages and stage only `src/site.ts`.
4. **Done looks like:**
   - `npm test` and `npm run build` pass.
   - `grep -c "more: {" src/site.ts` returns 60.
   - `grep -cE "^\s+slug: '" src/site.ts` still returns 91.
5. **Record it:** under row 14, add `Extra 3: more for <slugs> DONE <hashes>`.

No new pages, guides or Pro work, and no browser check. Stop at 200 turns and write any unfinished slugs into ops/next.md. When the batch is done, stop. Don't ask again this run.

## 2026-11-19T03:18:58Z

**Q:** Wed 11-18 evening run (11-19 02:47 UTC). My row (7) is DONE, rows 8-13 are DONE, the backlog is fully done, and this morning's boss-authorized Extra 3 batch (10 'more' sections, e6e0680 through 56edf7e) is complete and committed. The plan has nothing left for this run. What should I work on, or should I stop here?

**A:** I checked the plan, the past answers and site.ts: 25 tool pages still lack a `more` section, so the agent should do one more batch rather than stop. Here is the answer to send:

---

Do one last batch of 10 `more` sections, then stop. Thin template pages are still the main AdSense risk, and nothing else on the list pays sooner.

1. **Pages, in this order:** jsonl-to-csv, markdown-to-csv, json-to-markdown, excel-to-markdown, yaml-to-csv, csv-to-yaml, tsv-to-excel, jpg-to-avif, png-to-avif, avif-to-webp.
2. **Spec:** same as before. Write 2 to 4 paragraphs, 150 to 300 words in all, and check every fact in src/lib first (data.ts, xlsx.ts, image.ts, and js-yaml use for the YAML pages). Cover how types, nested objects, empty cells, pipes in Markdown cells, the first sheet only, transparency and quality are handled. **No `sample`** this batch. Skip any page you can't verify. Don't repeat the lede or FAQ.
3. **Edits:** one Edit per page in src/site.ts, anchored on `slug: '<slug>',` plus the next line. Commit every 3 or 4 pages with `git add src/site.ts` only.
4. **Done:**
   - `npm test` and `npm run build` pass.
   - `grep -c "more: {" src/site.ts` returns **70**.
   - `grep -cE "^\s+slug: '" src/site.ts` is the same as at the start of this run.
5. **Record:** under row 14 add `Extra 4: more for <slugs> DONE <hashes>`, and update ops/next.md (15 thin pages left).

Don't add pages, guides or Pro work, and don't run the browser check. Stop at 200 turns. Don't ask again this run.

## 2026-11-20T03:19:29Z

**Q:** Evening run for 11-19-2026 (row 9). The week plan rows 1-13, all backlog items, and all four Extra batches are marked DONE. The plan is fully exhausted. What should I work on?

**A:** Here's the answer to send the agent:

---

There are still 15 tool pages with no `more` section. Fix those before anything else: they're the thin template pages that put AdSense approval at risk.

1. **Extra 5, in this order:** avif-to-pdf, webp-to-avif, webp-to-ico, gif-to-ico, gif-to-webp, ico-to-jpg, ico-to-webp, tsv-to-json, json-to-tsv, excel-to-tsv, tsv-to-markdown, markdown-to-json, markdown-to-excel, excel-to-yaml, yaml-to-excel.
2. **Spec:** same as earlier batches. Write 2 to 4 paragraphs, 150 to 300 words in all, and check every fact in src/lib (image.ts, ico.ts, pdf.ts, data.ts, xlsx.ts) or src/components/DataTool.astro. One fact for the TSV pages: TSV downloads always carry a BOM (DataTool.astro lines 342 and 345). Don't add a `sample`, don't repeat the lede or FAQ, and skip any page you can't verify.
3. **Edits:** one Edit per page, anchored on `slug: '<slug>',` plus the next line. Commit every 3 or 4 pages with `git add src/site.ts` only.
4. **Done:**
   - `npm test` and `npm run build` pass.
   - `grep -c "more: {" src/site.ts` returns **85**.
   - `grep -cE "^\s+slug: '" src/site.ts` still returns **95**.
5. **Record:** under row 14, add `Extra 5: more for <slugs> DONE <hashes>`. Stop at 200 turns and write any unfinished slugs into ops/next.md for the next run.

After that, stop. No new pages, guides or Pro work, and no browser check. Don't ask again this run.

## 2026-11-22T02:54:28Z

**Q:** Evening run 11-21: row 4 (garbled CSV guide, 2597a12) is DONE, backlog 0a is finished on the Extra 4 and Extra 5 pages, issue 13 is closed, and backlog 0 and 3 are done. About 45 minutes of the session remain. The only backlog items left are the guides add-page-numbers-to-pdf (backlog 1) and save-pdf-page-as-jpg (backlog 2), and the week plan says one guide per run. Should I start backlog 1 now, or stop for this run?

**A:** Start backlog 1 now. The "one guide per run" rule is about not pulling later guide rows forward. The backlog guides are there for runs that finish early, and this one fits in 45 minutes because it covers a single tool.

1. Read `addPageNumbers` in src/lib/pdf.ts. Confirm the font and size, the positions, the three formats ("3", "3 of 12", "Page 3 of 12"), the custom start number, and that the text stays selectable. Write only what the code shows.
2. Write src/pages/guides/add-page-numbers-to-pdf/index.astro in one Write call. Copy the structure of src/pages/guides/csv-garbled-characters-excel/index.astro. Use the title "How to add page numbers to a PDF without Acrobat" and at least 800 words. Use only the facts in backlog 1. The first two sentences must answer the title. Link /add-page-numbers-to-pdf/, /merge-pdf/ (add numbers after merging) and the guide `combine-pdf-files`.
3. Add the `GUIDES` entry, and set `guide: 'add-page-numbers-to-pdf'` on the add-page-numbers-to-pdf page in src/site.ts. If that page already has a guide, make it a list.
4. Run `npm test` and `npm run build`. Done means both pass and dist/add-page-numbers-to-pdf/index.html contains `/guides/add-page-numbers-to-pdf/`.
5. Commit with explicit paths, add `DONE <hash>` to backlog 1, and put one line in your log entry.

If nothing is committed by the 25-minute mark, run `git checkout --` on the files you touched, log "backlog 1 not finished", and stop. Leave backlog 2 for a later run.

## 2026-11-25T03:23:27Z

**Q:** Evening run 11-24 (UTC 11-25 03:23). Row 2 and rows 3 to 11 are all DONE, and backlog 1 (stop-excel-changing-numbers-to-dates), 2 (put-photos-into-one-pdf), 3 (excel-csv-semicolon-instead-of-comma), 4 (save-pdf-page-as-jpg), 5 (open-avif-images), 6 (png-transparent-background-jpg) and 7 (guides page by topic) are now DONE and committed. Guides count is 29, tests 284 pass, build 124 pages. I have about 18 minutes left. Backlog 8 says ask you. What should I do with the rest of this run, or should I wrap up now?

**A:** Every row and backlog item 1 to 7 is done, so backlog 8 is answered here. A new guide won't fit safely in 18 minutes on a free model. Spend the time linking older guides to the new ones, so search crawlers and readers reach the new pages.

1. In ops/week-plan.md, add ` DONE 1ff28b9` to the end of backlog 6 (it's missing).
2. Add one link to the existing "See also" line, the last paragraph, of each of these five files. Change nothing else in them.
   - `src/pages/guides/excel-csv-leading-zeros/index.astro`: `<a href="/guides/stop-excel-changing-numbers-to-dates/">stop Excel turning numbers into dates</a>`
   - `src/pages/guides/csv-opens-in-one-column-in-excel/index.astro`: `<a href="/guides/excel-csv-semicolon-instead-of-comma/">why Excel saves a CSV with semicolons</a>`
   - `src/pages/guides/open-webp-images/index.astro`: `<a href="/guides/open-avif-images/">open AVIF images</a>`
   - `src/pages/guides/combine-pdf-files/index.astro`: `<a href="/guides/put-photos-into-one-pdf/">put several photos into one PDF</a>`
   - `src/pages/guides/jpg-png-webp-or-avif/index.astro`: `<a href="/guides/png-transparent-background-jpg/">why a PNG gets a white or black background as a JPG</a>`

   Use "and" or a comma so each sentence still reads right. No dashes.
3. You're done when `npm test` and `npm run build` pass and `grep -c "stop-excel-changing-numbers-to-dates" dist/guides/excel-csv-leading-zeros/index.html` prints at least 1.
4. Commit the six files by path with the message "Link older guides to this week's new guides".

If time runs short, commit whichever links already pass the tests, log what's left, and stop. Don't start a new guide.

## 2026-11-25T15:30:39Z

**Q:** 11-25 morning run: rows 1 to 6 of the current week plan and backlog items 1 to 5 are all DONE (tests 319, build 131 pages, guides 33). Backlog 6 says to ask you after all of the above. What should I take next in this run, and what should the evening run do? Context: no browser checks have run since 11-10, AdSense is still pending, and the three new tools (/remove-exif-data/, /split-csv/, /merge-csv/) are live but untested in a browser.

**A:** I'm checking the plan and the guide list, then I'll write the answer.

Two more guides around the new tools. Searches for these questions mostly return macros and paid add-ins, and the guides feed the AdSense review. No browser checks: daily runs can't do them. Leave AdSense alone.

**This run: guide `split-excel-file-into-multiple-files`**
- Title "How to split a large Excel file into smaller files". Topic "Spreadsheets and CSV".
- Facts:
  - Excel has no built-in command to split one sheet into several files.
  - By hand: copy a block of rows with the header into a new workbook, save it, repeat.
  - A VBA macro can do it, but macros must be allowed.
  - Browser route: /excel-to-csv/, then /split-csv/ (read csvfiles.ts for what it does, plus the memory note), then /csv-to-excel/ for each part.
- Link /excel-to-csv/, /split-csv/, /csv-to-excel/, and guides `csv-too-large-for-excel` and `save-all-excel-sheets-as-csv`.
- On split-csv, change `guide` to `['csv-too-large-for-excel', 'split-excel-file-into-multiple-files']`.

**Evening run: guide `merge-excel-files-into-one`**
- Title "How to merge several Excel files into one". Same topic.
- Facts:
  - Move a sheet: right-click the sheet tab, Move or Copy, pick the target workbook.
  - Power Query: Data, Get Data, From File, From Folder (the files need the same columns).
  - Browser route: /excel-to-csv/, then /merge-csv/, then /csv-to-excel/.
- Link those three tools, and guides `combine-csv-files-into-one` and `save-all-excel-sheets-as-csv`.
- On merge-csv, change `guide` to a list with both guides.

Follow the plan's guide rules for both. Done for each: `npm test` and `npm run build` pass, `dist/guides/<slug>/index.html` exists, one commit with explicit paths. In ops/next.md, write that the next run starts on any guide not done yet, then asks.

## 2026-11-26T03:20:28Z

**Q:** 11-25 evening run: rows 1 to 8 and backlog 1 to 5 are DONE, and I just finished the merge-excel-files-into-one guide you named for this run (commit 73ca180, dist page built, 35 guides). The week plan has no unfinished row and no other unfinished guide. About 25 minutes are left in this run. What one guide or other item should I take next? No browser checks are possible, and AdSense stays untouched.

**A:** Take one guide: **`photo-sideways-after-upload`**. It is a problem search that our tools fit, and it adds a page for the AdSense review. If it isn't committed by the end of the run, log it as unfinished. Don't start anything else.

- **File:** `src/pages/guides/photo-sideways-after-upload/index.astro`. Follow the plan's guide rules and set datePublished to 2026-11-25.
- **Title:** "Why a photo shows sideways after upload, and how to fix it". Use the same topic as `make-a-photo-smaller-to-email` (find it with `grep -n` in `GUIDES`).
- **Facts:**
  - Phones often store the picture as the sensor saw it and add a rotation (Orientation) tag that tells viewers how to turn it.
  - An app or site that ignores the tag shows the photo sideways.
  - Stripping all metadata also removes that tag, so the photo can turn sideways. /remove-exif-data/ keeps the tag unless you untick the box (read stripJpeg in `src/lib/exif.ts` to confirm).
  - To fix it, rotate the photo in the phone or computer photo app and save a copy. Describe the steps in words and add the menu-names sentence.
  - /resize-jpg/ and /compress-jpg/: run `grep -n "toBlob\|imageOrientation" src/lib/image.ts`. Say the saved copy is drawn upright only if the code redraws through a canvas. Otherwise leave that claim out.
- **Links:** /remove-exif-data/, /compress-jpg/, /resize-jpg/, /heic-to-jpg/, and the guides `remove-location-from-photo` and `check-photo-metadata`.
- **On remove-exif-data:** add this slug to the end of its `guide` list.
- **Done:** `npm test` and `npm run build` pass and `dist/guides/photo-sideways-after-upload/index.html` exists. Make one commit with explicit paths, then log it and add a line to ops/next.md.

## 2026-11-27T15:26:47Z

**Q:** Morning run 11-27: all six rows of ops/week-plan.md and backlog 1 to 3 are DONE (last commit 9aaec89). The Chat exports group, /whatsapp-chat-to-excel/, /whatsapp-chat-to-pdf/, four Chat exports guides, home drop routing and the reader edge tests are in; 424 tests, 151 pages, 46 guides. Backlog 4 says ask you once for next work. There are about 15 minutes left in this run. What should this run and the next take next?

**A:** The plan and backlog are both finished, so I'm giving the agent two new guides for the Chat exports group.

---

**Steps for both runs:** Follow `## Guide rules` in ops/week-plan.md. Use one Write call per guide, add a `GUIDES` entry in src/site.ts with topic "Chat exports", and make one commit with explicit paths. Done means `npm test` and `npm run build` pass and `dist/guides/<slug>/index.html` exists. Put the guide count in the log.

**This run: start the guide now.** If it isn't committed by the time limit, run `git checkout --` on the files and log that it is unfinished.
- Slug `whatsapp-chat-dates-wrong-in-excel`. Title "WhatsApp chat dates wrong in Excel: day and month swapped".
- Phrases: "whatsapp export date format excel", "whatsapp chat dates wrong".
- Facts, only from `## Chat spec` steps 4 and 5:
  - phones write dates in their own region's order;
  - 03/04 can be read two ways;
  - the page checks every date in the file, and a first number over 12 means day first, a second number over 12 means month first;
  - otherwise the page asks;
  - the output date is year-month-day so it sorts, and the time is 24 hour.
- Excel opening the raw .txt "often" swaps the dates.
- Links: /whatsapp-chat-to-excel/, and the guides `export-whatsapp-chat`, `whatsapp-messages-per-person-excel` and `csv-opens-in-one-column-in-excel`.

**Next run:**
- Slug `print-whatsapp-messages`. Title "How to print WhatsApp messages from iPhone or Android".
- Phrases: "print whatsapp messages", "print whatsapp chat".
- Facts, only from row 2 step (4):
  - export the chat with media;
  - drop the .zip on /whatsapp-chat-to-pdf/ and press Print;
  - up to 300 photos show in place, and voice notes and videos are listed by name;
  - on a phone, Print is in the browser's share or menu button.
- Links: /whatsapp-chat-to-pdf/, and the guides `export-whatsapp-chat` and `whatsapp-chat-as-evidence`.

Don't ask again before the weekly replan. If both are done, log it and stop.
