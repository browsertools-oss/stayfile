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
- 2026-11-11: every tool page carries its own silhouette in the header band and related-tools grid. Pages added after Nov 8th reused the generic sheet, so all 31 pages now have one. New pages must add a shape in src/lib/silhouettes.ts or they read as unfinished next to the rest.
- 2026-11-11: SVG pages (/svg-to-png/, /svg-to-jpg/). SVG is rasterised through a canvas at the SVG's own size (width/height, or the viewBox), with a 1024 by 768 fallback when the SVG has no size at all and an 8192 px cap on the long side. Transparency is kept, and JPG pages fill it with white like every other JPG output. Rationale: createImageBitmap is not reliable for SVG across browsers, so the canvas path is the only one that works everywhere. The SVG silhouette is the format-pair photo with a bezier curve and three node dots, to say "vector" without adding a new shape language.
- 2026-11-11: PDF page previews. Single-PDF pages only (split, extract, remove, rotate, PDF to JPG, PDF to PNG); merge and images-to-PDF stay without them because several files at once is not a page sequence. pdf.js loads on the first drop, never on page load, and the preview strip is a plain horizontal scroll of 84 px JPEG thumbnails with page numbers. Clicking a thumbnail appends its page number to the pages box on the rotate and split pages; previews are view-only elsewhere. Previews are capped at 48 pages with a note saying how many remain, and a preview failure hides the strip rather than blocking the tool. Rationale: seeing the pages is what people need when they type page ranges, and it must not cost the split/rotate pages a 409 kB download until someone actually drops a file.
- 2026-11-12: related-tools grid capped at eight cards, ranked by shared format token with the current page (curated order breaks ties). The Images group had grown to 23 cards, which pushed the FAQ off the screen; the footer still lists every page. Rationale: related tools should point at the pages that serve the same job, not dump the whole group.
- 2026-11-12: single-format preset pages now say which format they take on the drop-zone sub line ("JPG files"), instead of always listing every image format. Multi-format pages keep the full list. Rationale: the sub line should match what the picker accepts.
