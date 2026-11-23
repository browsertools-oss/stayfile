# Foreman report 11-23-2026

**Runs, last 24 hours.** Morning 11-22 (run 44977723852 is the 11-22 02:47 UTC one; the 11-22 14:47 UTC run, 45034763530) ended as a failure at 1h04m but shipped: calendar library src/lib/ics.ts with test/ics.test.ts (34e2aab), quality issue 18 fixes (eb0ccd0, issue closed), and the 100 KB photo guide (3754ba6). Evening run 45102233235 (02:47 UTC 11-23) finished green at 1h02m but committed nothing: it spent the hour reading code for row 2 (/csv-to-ics/). Only src/lib/ics.ts exists; src/components/CalendarTool.astro does not.

**Evidence checked.** Row 1 commits exist and the changes are in the code (ics.ts exports parseDateTime, buildIcs, parseIcs, icsRowsToCsv; the guide titles changed). Row 1 was never marked DONE, so I marked it. Row 2 is not done. I could not run npm test here (dependencies are not installed in the foreman checkout); the workers' last logged result was 214 tests and 105 pages passing.

**Plan changes.**
- Row 1: marked DONE with hashes. Row 2: marked NOT DONE.
- Rows 3 to 6 rewritten, following the CEO's 11-22 note: row 3 (today morning) is qa 21 fixes, then wiring plus a stub CalendarTool with exact line hints; row 4 (tonight) is the column picker, preview, download, page entry and formats entry, so /csv-to-ics/ should be live tonight; row 5 is /ics-to-csv/ in two commits; row 6 is the Apple Calendar guide and the two guide upgrades. Both calendar pages should be live after row 6 (11-24 evening), ahead of the CEO's 11-25 evening target.
- Displaced guides (pdf-too-large-to-email, export-calendar-to-excel, stop-excel-dates, put-photos-into-one-pdf, Excel semicolons) moved to the top of the backlog with their text intact. The guide count goal of 22 by 11-28 will not be met if the tool work keeps slipping.
- Backlog item for the 100 KB guide marked DONE (3754ba6).
- New guardrail: tool-page rows are several commits; commit the wiring first; read only named files.
- Open `qa` issue 21 (two minor notes on the 100 KB guide; the ics.ts note resolves when the tool lands) is at the top of today's morning row. Not closed yet.

**Needs the boss:** nothing urgent. If row 3 again ships nothing, the plan's 11-26 contacts tool (rows 9 to 11) is unreachable and should be dropped or pushed to next week.
