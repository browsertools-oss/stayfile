# Foreman report 11-24-2026

**Runs, last 24 hours.** Morning 11-23 (run 45198058302, 38m) and evening 11-23 (run 45314984911, 1h01m) both finished green. The morning run shipped three guides (combine-PDF Acrobat-free section 0a19e37, PDF too large to email 037ff31, calendar to Excel 6b225fa) and the log commits. The evening run found no plan row left and committed only a log (ops/next.md and log). Run 11-22 evening failed after 1h04m, but its work shipped.

**Evidence checked.** The three guide commits exist and touch the named files. No new tool code since src/lib/ics.ts; src/lib/vcard.ts does not exist yet. QA issue 23 (four copy fixes in four guides) is open and its fixes are not in the code, so it stays open. I could not run npm test here (dependencies not installed).

**Plan changes.**
- Row 1 (today morning) was too big for one free-model run: qa 23 plus four code commits. I kept qa 23 first, then the ics.ts export step and vcard.ts build side. The read side (parseVcf, vcfRowsToCsv) moved to the front of row 2.
- Added a guardrail: finish the earlier unfinished step before starting a new one in multi-commit rows.
- The qa 23 fixes were already at the top of row 1; no other change.

**Needs the boss:** nothing now. If rows 1 and 2 ship under three commits between them, the contacts tools (csv-to-vcf and vcf-to-csv) will not land this week; consider dropping vcf-to-csv.
