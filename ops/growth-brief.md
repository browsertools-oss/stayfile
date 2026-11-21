# Growth brief: 11-20-2026

From the head of growth. The boss reads this when planning. Facts were checked on the web on 11-20-2026; they are help pages and user reports, so copy says "a common cause is". Check every Stayfile claim in code first (file names given). Never name a competitor site in copy.

**Where we stand in search.** A `site:stayfile.app` web search returns nothing from the site yet (unrelated "SiteFile" and "Stayfiles" pages fill it). Head phrases stay out of reach. This week's plan (rows 2 to 11, backlog 1 and 2) already targets the best spreadsheet and PDF problem phrases; keep it as is. The list below is what comes after it.

## Phrases to target next, in priority order

All new guides, one per run, after this week's guide rows and backlog. Same rules as the week plan (800+ words, 3 tool links, 1 guide link).

1. **"remove location from photo", "remove exif data from photo before sending"**. Guide `remove-location-from-photo`, title "Remove the location from a photo before you share it". Fits our "nothing leaves your device" promise exactly. Facts: phone photos usually store GPS position, date and camera model (EXIF). iPhone: in the Share sheet tap Options at the top and turn off Location before sending. Windows: right-click the file > Properties > Details > "Remove Properties and Personal Information". Mac Preview: Tools > Show Inspector, the GPS tab, "Remove Location Info" (only when the photo has a location). Browser route: Stayfile's image converters redraw the image on a canvas, so EXIF (date, location, camera) is dropped; site.ts line 1091 says so for JPG; confirm in src/lib/image.ts that this holds for every image tool before claiming it. Tools: /compress-jpg/, /heic-to-jpg/, /convert-image/. Link guide `are-online-file-converters-safe`.
2. **"reduce photo size to 100 kb", "photo under 50 kb for online form"**. Guide `photo-under-100kb-for-a-form`, title "Get a photo under 100 KB (or 50 KB) for an online form". Huge demand; page one is tool pages with a fixed KB preset, no real explanation. Be honest: Stayfile has no "target size" box. Steps: (1) read the form's rules: size limit, format, and often minimum pixel size; (2) resize first, a phone photo is 4000 px wide and a form photo rarely needs more than about 1200 (link /resize-jpg/); (3) then lower quality on /compress-jpg/ and watch the size shown (src/lib/image.ts line 61 formats KB; check the page shows output size); (4) plain backgrounds compress smaller; (5) HEIC from an iPhone: convert first (/heic-to-jpg/). Link guide `make-a-photo-smaller-to-email` and say that one is about email limits, this one about forms, so they don't overlap.
3. **"avif file won't open", "convert avif to jpg windows"**. Guide `open-avif-images`, title "Saved an AVIF image you can't open? Convert it". Same shape as `open-webp-images` (which ranks for nothing yet but is the right pattern): websites serve AVIF more and more, older apps refuse it. Tools /avif-to-jpg/, /avif-to-png/ (site.ts line 1186: decoded by the browser, 10-bit flattened, animation not kept; say so). Link `open-webp-images` and `jpg-png-webp-or-avif`.
4. **"png to jpg transparent background turns white", "png turns black when converted"**. Guide `png-transparent-background-jpg`. Facts: JPG has no transparency, so a converter must fill it; Stayfile fills white (src/lib/image.ts lines 137 and 170); tools that fill black are the usual "it turned black" complaint. If you need the see-through part, keep PNG or use /png-to-webp/. Tools /png-to-jpg/, /png-to-webp/, /compress-png/. Link `jpg-png-webp-or-avif`.
5. **"svg to png high resolution", "svg to png transparent"**. Guide `svg-to-png-sharp`. Read src/lib/svg.ts (`svgIntrinsicSize`, `clampSize` maxPx) and the ImageTool size options; explain why an SVG without width/height or viewBox gives a tiny or failed PNG and how to pick the output width. Tools /svg-to-png/, /svg-to-jpg/, /svg-to-ico/. Only if the tool lets the visitor set a larger output size; if it does not, skip this row.
6. **"convert markdown to pdf"** (writers and developers). Guide `markdown-to-pdf`. Read `textToPdf` in src/lib/pdf.ts and the markdown-to-pdf preset first; say exactly what formatting survives (headings, lists, code, images or not). If it only lays out plain text, skip this row: a guide that oversells it hurts.

## Pages that compete with each other

- No clashes found among the 12 live guides. Watch two planned ones: `put-photos-into-one-pdf` (row 8) and `combine-pdf-files` must stay apart (photos vs PDFs; link, don't repeat). Phrase 2 above and `make-a-photo-smaller-to-email` likewise (form vs email).

## Links to and from SubFixer (subfixer.app)

Add only these two, after the page they point to exists:

1. In `csv-garbled-characters-excel` (row 4), at the end of the section that shows the Ã© table, one sentence: "Subtitle files go wrong the same way; SubFixer has [a guide for subtitles that show Ã©](https://subfixer.app/guides/subtitles-weird-characters/)." The page is live now.
2. In `are-online-file-converters-safe`, where it explains that browser tools keep the file on the device, a short closing line: "Our sibling site [SubFixer](https://subfixer.app/) works the same way for subtitle files." One link, one sentence; drop it if the section has no natural spot.

No footer lists, no links from tool pages to SubFixer.

## A gap a tool could fill (for the boss and CEO to decide, not an order)

- /excel-to-csv/ converts only the first sheet (src/lib/xlsx.ts `xlsxToCsv`). "save all sheets as csv" is a real Excel pain (Excel saves only the active sheet). A sheet picker on the existing page would serve it without a new URL.
- Calendar files (CSV/Excel to ICS, ICS to CSV) fit the Spreadsheets group; see hq ops/growth.md. Not this week.
