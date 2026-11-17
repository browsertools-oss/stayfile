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
