# Next (11-27-2026 morning run)

- A new plan replaced the fitness plan: Chat exports (WhatsApp). Find your row with `grep -n "^| 1 |" ops/week-plan.md`; specs with `grep -n -A70 "^## Chat spec" ops/week-plan.md`.
- Row 1 step (0): the six qa 32 notes (bare paths in two FAQs, one guide sentence, FitnessTool error text and role="alert", repeated hedges, the Strava archive history claim), then close issue 32.
- Row 1 step (1): split CSV by column value (`makeValueSplitter`, `valuePartName`, a third radio on /split-csv/).
- Row 1 step (2): src/lib/whatsapp.ts, `rowsToXlsx` in src/lib/xlsx.ts and test/whatsapp.test.ts with cases A to F. If the row finishes early, go on to row 2.
- Morning metrics: sum the last 30 visitors rows (100 at the 11-26 count). The 300 and 1,000 triggers are far off.
