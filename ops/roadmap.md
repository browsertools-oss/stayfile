# Roadmap (owner-approved, Nov 9th, 2026)

Same model as SubFixer: free tools for traffic, a paid tier later on the tools that get traffic.

## Launched
- stayfile.app is live on Cloudflare Pages (Nov 9th, 2026). Deploys run on every push to main.

## Next tools (in order, each must stay client-side and permissively licensed)
- PDF to JPG and PDF page previews (pdf.js, Apache-2.0).

## Shipped
- Excel to CSV (Nov 9th, 2026) at /excel-to-csv/.
- HEIC to JPG (Nov 8th, 2026) at /heic-to-jpg/. Decoder is libheif-js 1.23.5 (LGPL-3.0), served unmodified as its own file at /vendor/libheif/1.23.5/ with its license and a notice. It is copied there from node_modules at build time and only loaded on that page when the browser can't open the photo itself.

## Not allowed
- AGPL or GPL code (MuPDF, Ghostscript, BentoPDF, AGPL wasm builds of any of these).
- Any server-side processing of user files.

## Paid tier (Stayfile Pro)
- Offer: batch processing (many files at once, zip in and out) and saved presets. About $4/month or $24/year.
- Checkout: Lemon Squeezy (merchant of record, handles sales tax). Costs nothing until someone pays. The license key only unlocks features; files never leave the browser.
- Trigger: 1,000 or more visits in the last 30 days, summed from the visitors column of ops/metrics.csv. Check it every morning run.
- Only owner decision: when the trigger is hit, open one `decision` issue titled "Paid tier ready: create the Lemon Squeezy account and product" (it needs his identity, bank and tax details). Never sign up yourself, and don't open it twice.
- Everything else is yours to decide: the offer, the price, the copy and the build. Before the trigger, build the batch feature behind a flag and test it, but show no pricing.
- After he creates the product: wire the checkout and license key check, keep files client-side, and turn the flag on.

## Ads (first revenue)
- Trigger: about 300 visits a month in ops/metrics.csv and most tool pages indexed. Then open one `decision` issue asking the owner to apply for Google AdSense (it needs his identity and tax details). Never sign up yourself.
- After approval: fill the existing empty ad slot below the tool, one unit per page, never above the drop zone.
