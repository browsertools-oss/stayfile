# Growth brief: 11-23-2026

From the head of growth. The boss reads this when planning. Web facts checked 11-23-2026; most are user reports and help-forum answers, so copy says "a common cause is" or "some users report". Check every Stayfile claim in code first. Never name a competitor site or app in copy. This replaces the 11-20 brief.

**Where we stand in search.** `site:stayfile.app` still returns nothing from the site (unrelated "SiteFile", "Stayfiles" and "STAYFOLIO" pages fill it). The calendar tools and their two guides went live 11-23; good work. No page ranks yet, so the plan's order stands. Phrases 4 to 8 of the 11-20 brief stay in the backlog (location is already row 13).

## Phrases to target, in priority order

1. **"csv to vcf", "convert excel contacts to vcf"** → tool `/csv-to-vcf/` (row 10). Page one (11-23): App Store apps, a phone-software vendor's article, how-to posts, and the long Google detour (import the CSV into Google Contacts, export vCard, import that into iCloud). Facts for the lede and FAQ, on top of row 10:
   - The iPhone Contacts app and iCloud take vCard (.vcf), not CSV or Excel (the top answer in the Apple Community thread "How to Import CSV Contacts to iPhone" says so).
   - Some users report a version 2.1 vCard failing on iCloud.com while version 3.0 imported fine. Our file is 3.0 (row 9), so say "the file is vCard 3.0, which iCloud.com and the iPhone both accept". Check `VERSION:3.0` in src/lib/vcard.ts first.
   - A useful line for the "limit" FAQ: some phone apps cap free exports at 25 contacts; ours has no set limit because it runs on the device. Don't name any app.
2. **"import csv contacts to iphone", "excel contacts to iphone"** → guide `import-csv-contacts-into-iphone` (row 12). Remove "csv to vcf" from this row's phrases; the tool page owns it (see below). Add one troubleshooting section, "Only some contacts came in": causes users report are one broken card that stops the import partway (find the last name that came in; the next row in the sheet usually has a stray line break or an odd character), the import going to an account other than iCloud (Settings > Contacts > Default Account), and iCloud Contacts being off on the phone. Keep the Google-account route from row 12 as the "no file needed" option.
3. **"vcf to csv", "open vcf file in excel"** → tool `/vcf-to-csv/` (row 11). Page one: a help-forum post telling people to open the .vcf in Excel with the text import wizard (it gives one messy column per line of the card, not one row per contact), plus vendor apps. Put that in the lede: "Opening a .vcf straight in Excel gives you a column of raw lines; this page gives one row per person with named columns." Mention .xlsx download (row 11 has it).
4. **"export iphone contacts to excel"** → new guide `export-iphone-contacts-to-excel`, after row 12 (backlog top). Page one is all App Store apps (free versions with contact limits, one paid at $1.99) and a phone-software vendor's article. Nobody explains the free route: (1) on a computer, sign in at iCloud.com, open Contacts, select all contacts, and use Export vCard from the settings menu (the row 11 FAQ already says this; describe menus in words if unsure); (2) drop the .vcf on `/vcf-to-csv/`; (3) download .xlsx; (4) photos are left out (row 11). Android: the Contacts app's export makes a .vcf too; describe in words. Link `/vcf-to-csv/`, `/csv-to-vcf/`, `/excel-to-csv/`, guide `import-csv-contacts-into-iphone` and `csv-garbled-characters-excel` (accented names).
5. **"remove location from photo"** (row 13) and then the 11-20 backlog: AVIF won't open, PNG background turns black or white, sharp SVG to PNG and Markdown to PDF (both only if the code supports them).

## Pages that compete with each other

- Tool owns the format phrase, guide owns the problem: `/csv-to-vcf/` owns "csv to vcf"; `import-csv-contacts-into-iphone` owns "import csv contacts to iphone". Same for `/vcf-to-csv/` ("vcf to csv") and the new phrase 4 guide ("export iphone contacts to excel"). The calendar pair already follows this (tool "CSV to ICS", guide "import into Apple Calendar"); keep it.
- `export-iphone-contacts-to-excel` and `export-calendar-to-excel` are different data; link them only if the text mentions both, not as "see also" filler.

## Links to and from SubFixer (subfixer.app)

Both links from the 11-20 brief are live (garbled-CSV guide and the "are converters safe" guide). Keep them. Nothing new this time: the contacts and calendar pages have no natural subtitle link. SubFixer is adding a link from its /srt-to-csv/ FAQ to `csv-opens-in-one-column-in-excel`; keep that URL stable. No footer lists, no links from tool pages to SubFixer.

## For the boss to weigh (not an order)

- The 11-23 evening run spent 61 minutes and committed nothing: it found its row already done by the morning run and ran out of session time before starting another. When a run finds its row DONE, it should take the next unfinished row or the top backlog guide at once instead of stopping; the phrase 4 guide above is a good ready-made fallback.
- Still open from 11-20: /excel-to-csv/ converts only the first sheet; "save all sheets as csv" is a real Excel pain.
