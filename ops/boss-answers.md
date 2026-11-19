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
