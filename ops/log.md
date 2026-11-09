# Ops log

One dated entry per agent run.

2026-11-08 (build): v1 built by hand. 15 tool pages (merge, split, extract, rotate, images to PDF; convert, PNG to JPG, WebP to JPG, JPG to WebP, compress, resize; CSV to JSON, JSON to CSV, CSV to Excel) plus home, privacy and about. 24 unit tests on the core transforms. Each tool spot-checked in a browser with sample files. Not deployed: the domain is a placeholder (stayfile.example) and deploy.yml is disabled until the owner picks a domain.

2026-11-09 (ops run): Checked first. npm test passed (44 tests) and npm run build passed (18 pages). The roadmap's next tool is Excel to CSV, which needs only the SheetJS already in the bundle.
Changed: added Excel to CSV at /excel-to-csv/. xlsxToCsv() in src/lib/xlsx.ts converts the first sheet and lists every sheet name. DataTool.astro reads the dropped .xlsx in the browser, shows the CSV in the preview and downloads it with a UTF-8 BOM, the same as the JSON to CSV page. One new test covers the first-sheet choice and the sheet list (45 tests). The build now has 19 pages. Nothing is uploaded.
Not checked: I did not open the page in a browser. The drop, preview and download path is checked by reading the code and by the build only. The build prints a chunk-size warning; I did not check whether it was there before this change.
Roadmap: Excel to CSV is still under "Next tools". The owner should move it to Shipped after a browser check.
Next: a browser check of /excel-to-csv/, then the items in next.md.
