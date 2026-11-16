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
