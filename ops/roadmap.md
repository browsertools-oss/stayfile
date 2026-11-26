# Roadmap (owner-approved, Nov 9th, 2026)

Owner direction (11-15-2026): everything is designed and optimized for revenue first and foremost. The weekly planner may change the triggers, order and offers below when the evidence says revenue comes sooner; owner-only steps (sign-ins, spending, tax and payment details) stay with the owner.

Same model as SubFixer: free tools for traffic, a paid tier later on the tools that get traffic.


## Accounts (Nov 9th, 2026)
- AdSense account created (the owner's personal Google account, publisher pub-3033001375409079). The script and ads.txt are live on both sites, the payment profile is done, and both sites were submitted for review on Nov 9th, 2026. Ads appear only after Google approves.
- Lemon Squeezy turned down the store on Nov 16th, 2026 (it is winding down and takes no new stores). Don't use Lemon Squeezy.
- Checkout provider is Polar (polar.sh), chosen by the owner Nov 16th, 2026. No Polar account exists yet; the owner creates it (GitHub sign-in, identity and payout) when the paid-tier trigger is hit. Don't open a decision issue for it before then.
- Ads go live once the owner adds the AdSense publisher ID (ca-pub-...) to the repo, and the paid tier once the Polar product exists. Traffic triggers below still decide when ads or pricing are shown.
## Launched
- stayfile.app is live on Cloudflare Pages (Nov 9th, 2026). Deploys run on every push to main.

## Next tools (in order, each must stay client-side and permissively licensed)
- 11-25-2026 (CEO): new group "Fitness files" instead of a separate GPX site. In order: Strava archive to GPX, bulk FIT to GPX, .fit.gz to .fit for Garmin Connect, Garmin export to GPX, FIT to CSV, plus three guides. Same revenue path as the rest of the site (AdSense, then Pro at 1,000 visits/30d; batch archive conversion is a Pro candidate then). No Strava or Garmin logos, no claim of affiliation.
- 11-24-2026 (boss, per the CEO's 11-24 order): the calendar and contacts tools shipped 11-23 and 11-24. Next, in order: (1) Remove photo data at /remove-exif-data/ (JPG, then PNG; data blocks cut, picture not re-encoded; HEIC sent to /heic-to-jpg/), (2) Split CSV at /split-csv/, (3) Merge CSV at /merge-csv/, (4) page choice on /pdf-to-jpg/ and /pdf-to-png/. Plain TypeScript and the installed papaparse and fflate, no new dependencies. Each gets a guide for the problem search around it.
- 11-22-2026 (boss, per the CEO's 11-20 and 11-21 notes): (1) CSV or Excel to ICS at /csv-to-ics/, (2) ICS to CSV at /ics-to-csv/, (3) CSV or Excel to VCF at /csv-to-vcf/, (4) VCF to CSV at /vcf-to-csv/. All plain TypeScript in the browser, no new dependencies. Page one for these phrases is small sites, and Apple Calendar and iPhone Contacts can't import CSV, so these pages can rank where head-phrase converters can't. Candidate after them: Compress PDF for scanned and photo PDFs (pages re-rendered with pdf.js and rebuilt with pdf-lib, both permissive), asked of the CEO in the 11-22 plan. No other new tool pages.

## Shipped
- Excel to CSV (Nov 9th, 2026) at /excel-to-csv/.
- HEIC to JPG (Nov 8th, 2026) at /heic-to-jpg/. Decoder is libheif-js 1.23.5 (LGPL-3.0), served unmodified as its own file at /vendor/libheif/1.23.5/ with its license and a notice. It is copied there from node_modules at build time and only loaded on that page when the browser can't open the photo itself.

## Not allowed
- AGPL or GPL code (MuPDF, Ghostscript, BentoPDF, AGPL wasm builds of any of these).
- Any server-side processing of user files.

## Paid tier (Stayfile Pro)
- Offer: batch processing (many files at once, zip in and out) and saved presets. About $4/month or $24/year.
- Checkout: Polar (merchant of record, handles sales tax, built-in license keys). Costs nothing until someone pays. The license key only unlocks features; files never leave the browser.
- Trigger: 1,000 or more visits in the last 30 days, summed from the visitors column of ops/metrics.csv. Check it every morning run.
- Only owner decision: when the trigger is hit, open one `decision` issue titled "Paid tier ready: set up Polar and create the product" (only the owner creates the account and signs in). In it, list the product, prices and the license-key benefit to configure. Never sign up yourself, and don't open it twice.
- Everything else is yours to decide: the offer, the price, the copy and the build. Before the trigger, build the batch feature behind a flag and test it, but show no pricing.
- After he creates the product: wire Polar checkout and the license key check (Polar's public license-key validate endpoint, called from the browser), keep files client-side, and turn the flag on.

## Ads (first revenue)
- Nov 18th, 2026: AdSense marked stayfile.app "Needs attention: Low value content" (77 of 89 tool pages were about 150 words of near-identical copy, with two guides). Fixed the same day: every tool page now has a format reference section (src/formats.ts), four more guides (ten total, alongside the agents' four from the same day), a contact page, an ads and cookies paragraph on the privacy page, and a longer about page. Review requested again. Until approval, keep adding original content: one new guide (700+ words, real facts, no padding) at least every other run, and "more" sections for the tool pages that still lack one. Never add thin or near-duplicate pages; a new tool page needs its own useful copy before it ships.
- Trigger: about 300 visits a month in ops/metrics.csv and most tool pages indexed. AdSense was already applied for on Nov 9th, 2026 (code and ads.txt are live). Once it is approved and earning, open one `decision` issue asking the owner to add his AdSense tax info. Never sign in yourself.
- After approval: fill the existing empty ad slot below the tool, one unit per page, never above the drop zone.
