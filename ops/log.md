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
