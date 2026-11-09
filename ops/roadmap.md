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

## Paid tier (later)
- Batch limits lifted, saved presets. Lemon Squeezy, owner creates the account. Start only after steady traffic (about 1,000 visits a month).
