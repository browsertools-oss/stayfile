# Design notes

How the site looks and why, so later runs stay consistent. One visual system across every page.

## The look (as built Nov 8th, 2026)
- Pages read like a work board: dark board background, the tool sits in a pale recessed "work tray" (`.tool`) set into it.
- One safety-yellow accent (`--tag`) for the finished-file state, and a green `--ok` for success text. No other accent colors.
- Drop zones are dashed bordered fields with a big instruction line; when files are listed the drop zone compacts to one row.
- Buttons: one primary dark button per action row, secondary buttons beside it, a plain `.link` "Start over" for resets.
- Type is stretched/wide for the instruction line, monospace for numbers, byte counts and file meta.
- Copy is plain sentences a person would write. No sales words, no em or en dashes, no groups of three.
- Mobile: tool padding shrinks, drop zone shrinks, file rows wrap, image rows put the size line under the name.

## Decisions
- 2026-11-10: preset pages (e.g. /png-to-pdf/ reuses the images-to-PDF tool). New search phrase, same tool, different copy and FAQ. Better than a duplicate tool.
- 2026-11-11: result preview for text tools is a read-only textarea inside the options row, the same pattern the data pages use. PDF to text shows the extracted text there (capped at 200,000 characters, with the download holding everything) rather than in a modal.
- 2026-11-11: every tool page carries its own silhouette in the header band and related-tools grid. Pages added after Nov 8th reused the generic sheet, so all 31 pages now have one. New pages must add a shape to Silhouette.astro or they read as unfinished next to the rest.
- 2026-11-11: PDF page previews. Single-PDF pages only (split, extract, remove, rotate, PDF to JPG, PDF to PNG); merge and images-to-PDF stay without them because several files at once is not a page sequence. pdf.js loads on the first drop, never on page load, and the preview strip is a plain horizontal scroll of 84 px JPEG thumbnails with page numbers. Clicking a thumbnail appends its page number to the pages box on the rotate and split pages; previews are view-only elsewhere. Previews are capped at 48 pages with a note saying how many remain, and a preview failure hides the strip rather than blocking the tool. Rationale: seeing the pages is what people need when they type page ranges, and it must not cost the split/rotate pages a 409 kB download until someone actually drops a file.
