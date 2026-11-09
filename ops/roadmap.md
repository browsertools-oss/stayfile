# Roadmap (draft, needs owner approval)

Same model as SubFixer: free tools for traffic, a paid tier later on the tools that get traffic.

## Before launch (owner)
- Pick and buy a domain (suggestions in the build report). Set it in src/site.ts, public/robots.txt and deploy.yml.
- Add Cloudflare secrets and enable deploy.yml.

## Next tools (in order, each must stay client-side and permissively licensed)
- PDF to JPG and PDF page previews (pdf.js, Apache-2.0).
- Excel to CSV (SheetJS, already bundled).

## Shipped
- HEIC to JPG (Nov 8th, 2026) at /heic-to-jpg/. Decoder is libheif-js 1.23.5 (LGPL-3.0), served unmodified as its own file at /vendor/libheif/1.23.5/ with its license and a notice. It is copied there from node_modules at build time and only loaded on that page when the browser can't open the photo itself.

## Not allowed
- AGPL or GPL code (MuPDF, Ghostscript, BentoPDF, AGPL wasm builds of any of these).
- Any server-side processing of user files.

## Paid tier (later)
- Batch limits lifted, saved presets. Lemon Squeezy, owner creates the account. Start only after steady traffic (about 1,000 visits a month).
