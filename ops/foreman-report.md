# Foreman report 11-21-2026

**Runs (last 24h):** 11-20 morning run FAILED after 1h10m: the action stalled right after reading the week plan (last output 14:57 UTC) and nothing was committed, so row 1 never happened. 11-20 evening run finished (1h01m) and shipped row 2, the leading-zeros guide (ba6831e, file and GUIDES entry exist, log matches). It skipped row 1 and went straight to row 2. Nothing else shipped by the workers.

**Open qa issues:** 16 (new): `guide` is now a list on csv-to-excel but the type and ToolPage.astro only take one slug, so that page lost its guide link (confirmed in the code); plus copy drift and an unchecked JSON to Excel claim in the new guide. 13: still open, nothing fixed yet (`check_more.py` is still in the repo root).

**Plan changes:** row 3 (today morning) rewritten as six small ordered steps with exact files: remove `check_more.py`; list support for `guide` (issue 16); fix the guide copy (issue 16); header Guides link; link the four owner guides; the issue 13 fixes (unique headings, WebP to AVIF sentence, claim checks, uniqueness test). Row 3(b) (cutting repeated sentences) moved to the backlog. Added a guardrail about stalling and working in small commits. Issues 13 and 16 stay open until the fixes land.

**Needs the boss:** nothing now. Watch: row 1's work is now squeezed into row 3, so if today's run also stalls, rows 4 and later are not affected but the Guides menu link and the `guide` fix slip another day.
