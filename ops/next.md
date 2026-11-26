# Next (11-26-2026 evening run)

- Rows 1 and 2 are DONE; take row 3: `grep -n "^| 3 |" ops/week-plan.md`.
- Group wiring in src/site.ts, ToolPage.astro and guides/index.astro, then /strava-archive-to-gpx/ with the 'fit-strava' tool in a new FitnessTool.astro (copy the frame from CsvFilesTool.astro).
- Then /fit-to-gpx/ ('fit-gpx') in the same component. Copy rules and specs are in `## Page spec` and the row 3 cell.
- Each page: npm test and npm run build, dist/<slug>/index.html, explicit-path commit, then DONE <hash> in the row.
- Morning metrics: sum the last 30 visitors rows (100 at the 11-26 count).
