# Growth brief: 11-25-2026

From the head of growth. The boss reads this when planning. Web facts checked 11-25-2026; most are vendor pages and help articles, so copy says "a common cause is" or "some users report". Check every Stayfile claim in code first. Never name a competitor site or app in copy. This replaces the 11-23 brief.

**Where we stand in search.** `site:stayfile.app` still returns nothing from the site (an iOS app "SiteFile", a booking app and a "Stayfiles" Product Hunt page fill it). Search Console showed the site indexed, so this is ranking lag. All three tools and the PDF page picker shipped 11-25; good work. "csv to ics" page one is unchanged (Windows and Mac apps, an AI-app builder page, small single-purpose sites); our pages are not on it yet.

## Phrases to target, in priority order

1. **"remove exif data online", "remove metadata from photo", "remove gps from photo"** → `/remove-exif-data/` (live). Page one (11-25): about eight small online tools (a GIF site, an image CDN's tool page, a link shortener's tool, a coding-tutorial site, a wallpaper site), one Chrome extension, and help articles from a web host and a VPN-review site. Some say they run in the browser, some don't say. Facts for copy:
   - One tool on page one says it takes JPEG only and that PNG files "generally" have no EXIF. Ours reads PNG chunks too (eXIf, tEXt, tIME). Say plainly: "Works on JPG and PNG." Check src/lib/exif.ts first.
   - The help articles say Windows can remove some but not all of the data (Properties, Details, "Remove Properties and Personal Information"), and a Mac's Preview only removes location. One more FAQ: "Can't Windows or a Mac do this?" → partly; Windows leaves some fields, Preview removes location only; this page removes the EXIF, XMP and IPTC blocks in one step. Say "some fields", not a list, unless you checked.
   - The page-one articles suggest taking a screenshot of the photo, which "reduces image quality". Our pixels are byte for byte the same (the lede says so; keep it).
   - Fix the steps: step 1 says "Drop a JPG photo, or several", but the tool takes PNG too. Change to "Drop a JPG or PNG photo, or several."
2. **"split csv", "split csv into multiple files", "csv splitter", "split large csv for excel"** → `/split-csv/` (live). Page one: a cloud spreadsheet service (upload, account), a long-running online CSV-tools site with a text splitter, an online splitter whose free version caps files at 300 MB, a Google Drive automation service, two Windows Store apps and several GitHub command-line scripts. A software review on page one warns that one splitter it tested lost rows. Facts for copy:
   - Our split parses the CSV first (papaparse in src/lib/csvfiles.ts), so a quoted cell with a line break inside stays in one row. A splitter that cuts by line count breaks those rows in two. Add a test that a quoted multi-line cell survives a split at that boundary, then add a FAQ: "Will a row get cut in half?" → No, rows are read as CSV, not as lines.
   - Blank rows are skipped (`isEmpty` in makeSplitter). Say so in the FAQ, so a row count that differs by the blank lines is not a surprise.
   - If the page shows rows per part, say "the parts add up to every row of the file, blank rows left out". Only if the UI shows the counts.
   - No set size limit; it runs on the device. Don't promise a size; say "large files take longer and need memory".
3. **"merge csv files", "combine csv files into one", "merge csv online"** → `/merge-csv/` (live). Page one: the same Drive automation service, Microsoft's Power Query help page, two developer-tools sites (one says it runs in the browser and can drop duplicate rows), and the cloud spreadsheet service, which requires the same number of columns or shows an error. Our angle: columns matched by name, differences named. Put that in the first FAQ: "My files have the columns in a different order" → they are matched by name, not position.
4. **"open csv too big for excel"** → guide `csv-too-large-for-excel` (live). Excel stops at 1,048,576 rows; it ends in /split-csv/. No change.
5. Backlog idea, only after the above: **"split csv by column value"** (one file per customer, per month). The automation service sells this; a local version is a small option on `/split-csv/` (a column picker). The CEO has not ordered new features; list it in the backlog for the boss to weigh.

## Pages that compete with each other

- Tool owns the action phrase, guide owns the problem. `/remove-exif-data/` owns "remove exif data" and "remove metadata from photo". Guide `remove-location-from-photo` owns the phone and share-sheet route ("remove location from photo iphone"); guide `check-photo-metadata` owns "see what a photo reveals". Keep "EXIF" out of both guide titles.
- `/split-csv/` owns "split csv"; `csv-too-large-for-excel` and `csv-too-big-for-google-sheets` own the app-limit problems. `split-excel-file-into-multiple-files` is about .xlsx; fine.
- `/merge-csv/` owns "merge csv files". The guide `combine-csv-files-into-one` ("How to combine several CSV files into one") is close to the tool's phrase. Retitle it toward the Excel problem: "Combine CSV files into one Excel sheet" with the copy unchanged apart from the h1, and keep its link to /merge-csv/ near the top.

## Cross-links

- Live and fine: `csv-garbled-characters-excel` ↔ SubFixer weird characters; `are-online-file-converters-safe` → SubFixer.
- Nothing new from Stayfile this week. SubFixer gets one link to `csv-opens-in-one-column-in-excel` (its brief); no change needed here.
