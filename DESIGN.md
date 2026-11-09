# Stayfile design

Base system: IBM Carbon (white theme for light mode, Gray 100 for dark). It fits a fast utility:
dense, flat and calm, with hierarchy carried by hairlines and surface changes, not shadows or color.

One deliberate change from Carbon: the accent is Carbon's green ramp, not Carbon blue, so the site
keeps its existing green. Everything else uses Carbon values.

## Tokens (defined in `src/layouts/Base.astro`)

| Role | Light | Dark |
|---|---|---|
| Page `--bg` | #ffffff | #161616 |
| Layer `--layer` (tool panel, footer) | #f4f4f4 | #262626 |
| Field `--field` (inputs, file list) | #ffffff | #393939 |
| Hairline `--line` | #e0e0e0 | #393939 |
| Strong border `--line-strong` (field underline, dashed drop) | #8d8d8d | #6f6f6f |
| Text `--ink` / `--muted` / `--helper` | #161616 / #525252 / #6f6f6f | #f4f4f4 / #c6c6c6 / #a8a8a8 |
| Primary button `--accent` (green 60, hover 70, press 80) | #198038 | #198038 |
| Link `--link` | #198038 | #42be65 (green 40) |
| Secondary button `--btn2` | #393939 | #6f6f6f |
| Focus `--focus` | #198038 | #ffffff |
| Error `--bad` | #da1e28 | #ff8389 |

- Type: IBM Plex Sans, one self-hosted variable file (`public/fonts`, latin subset, 45 KB, OFL).
  Display h1 42px weight 300 (32px on phones). Section heads 20px/400. Body 16px with 0.16px tracking.
  Labels and helper text 12px with 0.32px tracking. Numbers and data cells use the system mono.
- Spacing: 4px grid (4, 8, 12, 16, 24, 32, 48). Content width 1120px, 16px gutter.
- Corners: 0 everywhere. No shadows. No gradients.
- Controls: buttons 48px tall, label left-aligned with 64px right padding (Carbon). Fields 40px tall with a
  bottom rule only. Segmented choices are Carbon content switchers (selected = inverse fill).
- Motion: only color/transform transitions of 70 to 110ms on hover and the accordion chevron.

## Layout

- Header: 48px bar, brand, group links, "Files stay on this device" on the right (hidden on phones).
- Home: left-aligned h1 and lede, then the tool index as labelled rows (group name left, two-column
  list of tools right). No cards.
- Tool page: breadcrumb, h1, lede, then the tool panel (gray layer, white dashed drop zone) above the
  fold. "How to use it", "Questions" and related tools sit in the same label-left rows as the home index.

## Rules

- Do not add rounded corners, shadows, pills, emoji, a second accent color or a second font family.
- Keep the drop zone the largest thing on a tool page until a file is loaded.
