# Stayfile design: Formwork

Stayfile is cast, not painted. The wall is warm grey concrete with a speck grain, the type is
near-black ink, and one safety orange marks the only things that act: the primary button, the
"choose files" underline, the drag-over outline and the tab in the "how it works" diagram. Each
tool is a stencilled ink outline on a hairline grid. The tool itself sits in a cast plate with a
hard 6px shadow, and the drop well is pressed into that plate.

Built with Hallmark (theme Formwork, deal 2/3). Stamp and waivers: top of `src/styles/site.css`.

## Files

- `src/styles/tokens.css`: Formwork tokens, Stayfile app tokens, and the night pour (dark).
- `src/styles/base.css`: shared base rules from the scaffold.
- `src/styles/site.css`: every page style. Imported once by `src/layouts/Base.astro`.
- Scoped styles stay in `ToolPage.astro` (band, crumbs, related grid) and `index.astro` (routes, stencil board, diagram).

## Colour

| Role | Cast (light) | Night pour (dark) |
|---|---|---|
| paper (wall) | oklch(74% .008 80) | oklch(27% .006 270) |
| paper-2 (tool band, darker pour) | oklch(69% .009 80) | oklch(23% .006 270) |
| plate (the tool) | oklch(82% .007 80) | oklch(32% .006 270) |
| ink | oklch(18% .005 270) | oklch(95% .006 80) |
| accent (safety orange) | oklch(66% .21 38), dark ink text | oklch(70% .21 40) |
| band (footer) | oklch(18%) with light text | oklch(16%) with light text |

Grain: an SVG speck at 0.09, multiplied (0.045, screened, at night). Orange stays under 5% of a screen.

## Type

- Display: Overpass 800 to 900, uppercase for heads (h1, h2, h3, drop head, wordmark). Overpass
  is the open-source Highway Gothic, the lettering on road and site signs. Buttons use it in
  sentence case, the way signs do.
- Body: Archivo 400 and 600, normal width.
- Figures: Archivo Narrow, tabular, for sizes, page counts and table cells.
- No tracked capitals, no mono except the JSON/CSV text areas.

## Surfaces and controls

- Radius 0 everywhere. Rules: 3px ink bar at the top of a section, 1px paper-3 hairline between rows.
- Primary: orange on a hard `0 3px 0` accent-deep shadow, presses down 3px. Secondary and chips:
  pressed in, 2px ink border. Inputs are pressed in like the secondary.
- Save on a converted file: small ink button with a hard shadow.
- Focus: 3px ring in `--color-focus`, instant.
- Motion: presses only, 120ms. Nothing on scroll.
