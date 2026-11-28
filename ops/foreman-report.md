# Foreman report 11-28-2026

**Runs (last 24h):** Four runs in the window: 11-27 morning was marked failure after 1h07m (the claude-code-action step failed, probably the time cap) but its commits landed; the 11-27 evening run finished green in 36m. 11-27 had no other failures.

**Shipped:** I checked git, not the logs: split CSV by column (e7e18b5), the WhatsApp reader with Excel and PDF pages (3f083af, 8650721, 10db14a), the export, evidence, read-on-computer and per-person guides, home routing (220f609), two older-guide links (0573eba), edge tests (9aaec89), qa 32 fixes (44a6cfd), and five review fixes to the chat page. All guide and page files exist (47 guide folders). I did not run tests or a build; the log reports 424 tests and 151 pages. Every row of the plan, rows 1 to 6 and backlog 1 to 3, is finished, so workers had nothing left but "ask the boss".

**Open qa issue:** #35 (four minor notes). Still open, none fixed. The evening run's chat page review did not touch them (alt text at ChatTool.astro:267 is still the bare file name; the GUIDES title still lacks "of the export"; the evidence lede has no PDF link; the export guide still has the filler).

**Plan changes:** Added row 7 for today's morning run: all four qa 35 fixes with exact files and text, then close #35. Added two guardrails (no filler sentences in guides; alt text says what the image is). I did not touch the At a glance section.

**Needs the boss:** The 11-27 CEO order for Sunday is Telegram chat to Excel/CSV, a Telegram export guide, then Telegram to PDF, after qa 35. Nothing in the plan covers it, and today's evening run has no row after row 7, so the evening crew will be idle or ask you. If you can, replan before 11-28 evening, with the Telegram `result.json` rows sized for a free model.
