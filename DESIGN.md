# Stayfile design: shadow board

Stayfile is a workshop wall. Each tool hangs on a green pegboard as a pale painted outline, the way a
shop paints the shape of every tool so you can see where it goes. Names sit on label-maker tape. One
safety-yellow tag marks whatever is active or finished: a hovered tool, a converted file's Save, the
download-all button.

## Tokens (src/layouts/Base.astro)

| Role | Light | Dark |
|---|---|---|
| board | #1d6a3b, 24px hole grid at rgba(0,0,0,.3) | #123a24, holes at .5 |
| paint (silhouettes, text on board) | #eef5ec | #e3eee5 |
| tape (labels, primary button) | #141414 on white | #050806 with a light 1px ring |
| tag (active or finished only) | #ffd23f, ink #1a1a10 | same |
| ground / tray / field | #f3f5f1 / #e7ece5 / #fff | #0b1410 / #13231a / #1a2e22 |
| ink / muted | #102117 / #44564a | #e6efe8 / #a9bcae |

Corners: 6px (routed hardboard), 3px on tape, 10px on the tool tray.

## Type

Archivo variable, self-hosted (`/fonts/archivo-var.woff2`, wght 100-900, wdth 62-125%). Display is
heavy and wide (800, 116%). Tape is 700 at 112% in caps with 0.06em tracking. Body is 400 at normal
width.

## Components

- Silhouette (`src/components/Silhouette.astro`): one SVG per tool slug, viewBox 120x96. Fill is
  currentColor; `.cut` lines are routed back to the surface color (`--cut`); `.ink` lines are painted
  strokes. Layers paint back to front.
- Home: a full-bleed board. Each group is a zone with a tape label; its first tool hangs larger.
  Hovering one tool dims the rest and turns its tape yellow.
- Tool page: a board band holding breadcrumb, h1, lede, the large silhouette and the tool tray. The
  drop zone shows the family icon via `data-family` (pdf, img, data). An empty `.ad-slot` sits under
  the band. Steps hang as paper tags; related tools repeat as small silhouettes on the ground.
- Buttons: primary is black tape, secondary is the yellow tag, Save on a converted file is a
  tag-shaped button with a punched hole.

## Rules

- Yellow means active or finished. Never use it for decoration.
- No gradients on text, no hard offset shadows, no scroll effects, no images beyond inline SVG.
- Focus is a 3px outline: ink on the ground, yellow on the board.
