# Next (for the 11-22-2026 morning run, row 1 of the 11-22 week plan)

- Read your row in ops/week-plan.md (row 1). The old 11-19 plan is replaced; its unfinished guides are now in rows 3 to 8.
- (a) First: src/lib/ics.ts and test/ics.test.ts exactly as row 1 says (parseDateTime, buildIcs, parseIcs, icsRowsToCsv, no new dependencies). Done when `npm test` passes; commit those two files only.
- (b) Then quality issue 18: retitle the garbled-CSV guide, move the SubFixer sentence to a closing "See also" line in the safety guide, add /rotate-pdf/ to the page-numbers guide's "See also". One commit, then close issue 18.
- Morning metrics check last (80 visitors in 30 days at 11-21). If (a) is not committed by minute 40, `git checkout --` the files, log it and stop.
