# Ops log

One dated entry per agent run.

2026-11-08 (build): v1 built by hand. 15 tool pages (merge, split, extract, rotate, images to PDF; convert, PNG to JPG, WebP to JPG, JPG to WebP, compress, resize; CSV to JSON, JSON to CSV, CSV to Excel) plus home, privacy and about. 24 unit tests on the core transforms. Each tool spot-checked in a browser with sample files. Not deployed: the domain is a placeholder (stayfile.example) and deploy.yml is disabled until the owner picks a domain.

2026-11-09 (ops run): Checked first. npm test passed (44 tests) and npm run build passed (18 pages). The roadmap's next tool is Excel to CSV, which needs only the SheetJS already in the bundle.
Changed: added Excel to CSV at /excel-to-csv/. xlsxToCsv() in src/lib/xlsx.ts converts the first sheet and lists every sheet name. DataTool.astro reads the dropped .xlsx in the browser, shows the CSV in the preview and downloads it with a UTF-8 BOM, the same as the JSON to CSV page. One new test covers the first-sheet choice and the sheet list (45 tests). The build now has 19 pages. Nothing is uploaded.
Not checked: I did not open the page in a browser. The drop, preview and download path is checked by reading the code and by the build only. The build prints a chunk-size warning; I did not check whether it was there before this change.
Roadmap: Excel to CSV is still under "Next tools". The owner should move it to Shipped after a browser check.
Next: a browser check of /excel-to-csv/, then the items in next.md.

2026-11-09 (ops run, second): Checked first. npm test passed (45 tests) and npm run build passed (19 pages). The roadmap's next tool is PDF to JPG, so I built it.
Changed: added PDF to JPG at /pdf-to-jpg/ (slug pdf-to-jpg, tool pdf-to-jpg, in the PDF group). Installed pdfjs-dist 5.7.284 (Apache-2.0), pinned exactly in package.json. It is loaded with a dynamic import in src/lib/pdf-render.ts only when someone clicks Convert, so no other page pays for it. In the build it is a separate 409 kB chunk plus a 2.1 MB worker that only that chunk references; no HTML page references the worker. The page renders each page on a white canvas at 96, 150 or 300 dpi (150 default) and saves JPG at quality 0.92. One page gives one JPG; more pages come back as a zip of numbered JPGs, named with jpgPageName() in src/lib/pdf.ts. New test/pdf-jpg.test.ts covers the naming (47 tests). Nothing is uploaded.
Choices: 150 dpi default and a 0.92 JPG quality, because that reads well on screens without big files; the zip name uses the same base name as the PDF.
Not checked: I did not open /pdf-to-jpg/ in a browser, so the drop, the progress text and the zip download are checked by reading the code and by the build only. The renderer itself is not unit tested because the tests run in Node with no canvas.
Roadmap: PDF to JPG is still under "Next tools". The owner should move it to Shipped after a browser check, same as Excel to CSV.
Next: a browser check of /pdf-to-jpg/ and /excel-to-csv/, then the items in next.md.

2026-11-10 (ops run): Checked first. npm test passed (47 tests) and npm run build passed (20 pages). The roadmap's next item is PDF page previews. "pdf to png" is a real search phrase with no page yet, and it reuses the same pdf.js renderer, so I built that page now and left previews for a later run.
Changed: added PDF to PNG at /pdf-to-png/ (slug pdf-to-png, tool pdf-to-png, in the PDF group). The renderer in src/lib/pdf-render.ts is now pdfToImages(bytes, dpi, format, onPage) and draws JPG or PNG; the pdf.js import still loads on the PDF page only. jpgPageName() became pageImageName(base, page, total, ext) in src/lib/pdf.ts, and test/pdf-jpg.test.ts covers the PNG extension (48 tests). Nothing is uploaded.
Choices: the PNG page offers the same 96, 150 and 300 dpi choices and paints a white background first, because PDF pages are opaque and white is what people expect. The copy says PNG keeps text sharp and makes bigger files; I did not put file sizes in the copy because I have not measured them.
Not checked: I did not open /pdf-to-png/ in a browser. The build renders the page; the drop, progress text and zip download are checked by reading the code only.
Roadmap: PDF to PNG is not in ops/roadmap.md yet. The owner can add it to Shipped after a browser check.
Next: a browser check of /pdf-to-png/ and /pdf-to-jpg/, then the items in next.md.

2026-11-10 (ops run, second): Checked first. npm test passed (48 tests) and npm run build passed (21 pages). Session started 04:25 UTC.
Changed, in order:
- Added a test for Excel to CSV with date cells and tab order (xlsxToCsv writes 2026-11-06 for a date formatted yyyy-mm-dd, keeps the first tab Orders over Notes). Committed.
- Added Excel to JSON at /excel-to-json/ (tool xlsx-to-json). It reads the first sheet as CSV, then runs csvToJson with the first row as keys and typed values, so plain numbers are numbers and 02134 stays text. Chose this because it reuses the existing paths and needs no new dependency. Test covers the keys and checks that the leading zero in 02134 is kept. Committed.
- Routed a dropped .xlsx on the home page to Excel to CSV and Excel to JSON. Before this, Excel files were classed as "other" and the home page said no tool takes them. Added an 'xlsx' kind in src/lib/route.ts with tests. Committed.
- Added JSON to Excel at /json-to-excel/ (tool json-to-xlsx). The preview is the JSON-to-CSV output, and Download builds the workbook from it with csvToXlsx. Test covers keys as headings and numbers as numbers. Committed.
- A dropped .json file on the home page now also offers JSON to Excel. Committed.
- Added PNG to PDF at /png-to-pdf/. It uses the existing images to PDF tool (img-to-pdf), with copy for PNG: the file is embedded without a JPG resave, so text stays sharp. Chose a separate page because "png to pdf" is a real search phrase; the tool is the same, so the copy and FAQ are what differ. No test, since no logic changed. Committed.
- Added JPG to PNG, WebP to PNG and PNG to WebP, each on the existing image convert tool with a preset for the output format (/jpg-to-png/, /webp-to-png/, /png-to-webp/). Copy says PNG keeps every pixel but cannot restore lost JPG detail, and that PNG files are usually larger. I did not state file sizes as numbers because I have not measured them. Committed.
Build is now 27 pages; npm test passes 52 tests.
Chunk-size warning: it comes from neither SheetJS nor pdf.js. The chunk over 500 kB is the PDF tool page script (about 565 kB), which holds @cantoo/pdf-lib used by merge, split, rotate and the image-to-PDF pages. SheetJS is 485 kB and pdf.js is 409 kB, both under the limit. I did not split pdf-lib or raise the limit; the warning is a size note, not a failure. Left as is.
Choices: Excel to JSON reads the first sheet only, like Excel to CSV, and says how many other sheets there are. JSON to Excel uses the same delimiter choice as the JSON page.
Not checked: no browser check. No headless browser is installed here, and I did not install one. The four new pages (/excel-to-json/, /json-to-excel/) and the home-page routing are checked by tests and the build only. The earlier pages (/pdf-to-jpg/, /pdf-to-png/, /excel-to-csv/) are still waiting for a browser check.
Roadmap: not edited. Excel to JSON and JSON to Excel are not in ops/roadmap.md; the owner can add them to Shipped after a browser check, as with the others.
Also not checked: the new image pages (/jpg-to-png/, /webp-to-png/, /png-to-webp/) and /png-to-pdf/ were checked only by the build. Their presets reuse ImageTool's existing output paths; I read that code but did not run it.
Next: a browser check of the new pages and the earlier PDF pages, then the items in next.md.

2026-11-10 (ops run, third): Checked first. npm test passed (52 tests) and npm run build passed (27 pages). Session started 14:47 UTC. Checked the Excel and JSON page copy against the style rules.
Changed, in order (each committed to main after test and build):
- Tightened the JSON to Excel FAQ on accepted JSON shapes. The old answer listed three shapes in one run-on sentence. I checked the wording against jsonRows() in src/lib/data.ts, which accepts those shapes. Commit fe7d5bd.
- Added HEIC to PNG at /heic-to-png/ (tool img-convert, preset image/png, accept HEIC). "heic to png" is a real search phrase. Same decode fallback as HEIC to JPG. Copy says PNG files are usually larger and gives no sizes. Build is now 28 pages.
- Fixed a bug: on the Make PDF page (jpg-to-pdf, png-to-pdf), a HEIC file was accepted by the drop zone but decoded without the libheif fallback, so Chrome and Firefox rejected it. PdfTool.astro now calls decode(f, true). Not unit tested because the fix is in the component; the build passes.
Choices: a separate HEIC to PNG page instead of a PNG option on the HEIC page, for the same reason as the other preset pages.
Skipped: PDF page previews (roadmap). It would load pdf.js on every PDF tool page, including merge, split and rotate, which goes against the rule that pdf.js loads only where it is used. Needs a choice on scope: previews only on the PDF to JPG and PDF to PNG pages, or on every PDF page. I did not decide it in this run.
Not checked: no browser check. No headless browser is installed here and I did not install one. The HEIC fix and the new page are checked by the build only.
Next: decide the PDF preview scope (see above), then the browser checks still waiting from earlier runs.
Later in this run, same checks each time:
- Corrected the HEIC answer on /jpg-to-pdf/. It said HEIC "may not work here", which was no longer true after the fix above. It now says HEIC converts, and that browsers other than Safari download a small decoder the first time. Commit after the fix.
- Added WebP to PDF at /webp-to-pdf/ (tool img-to-pdf, PDF group). The tool already takes WebP and redraws it as a JPG at quality 92 (asPdfImage in PdfTool.astro), so this is copy only. The FAQ says the redraw can lose a little detail and points to PNG to PDF for exact pixels. Build is now 29 pages; 52 tests pass.
Not checked: /webp-to-pdf/ and the HEIC fix are checked by the build only.
