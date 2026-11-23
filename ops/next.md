# Next (for the 11-23-2026 morning run, row 3 of the 11-22 week plan)

- Row 3 (a): build /ics-to-csv/ in the new CalendarTool.astro. That component does not exist yet, so row 2 (a) has to come first in practice: write src/components/CalendarTool.astro with the CSV to ICS mode, add 'csv-to-ics' to the Tool union and PAGES, set family 'cal' in ToolPage.astro, and add the OWN_COMPONENT set in test/wiring.test.ts. Then add the ICS to CSV mode and the route.ts changes row 3 lists.
- Row 2 (b) is still open: the `ics` entry in src/formats.ts (kind "Calendar data in plain text (iCalendar)").
- Once both calendar tool pages are live and committed, row 3 (b): the guide `pdf-too-large-to-email`. If the calendar pages take past minute 40, leave the guide and log it.
- At the end of the run, mark row 2 and row 3 DONE in ops/week-plan.md with the commit hashes as each item lands, not all at the end.
