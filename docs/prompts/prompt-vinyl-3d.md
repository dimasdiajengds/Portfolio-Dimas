# Dimas Di Ajeng Duwi Saputra: Curved Slim 3D Vinyl LP Project Showcase (Exact Recreation Prompt)

Give me the superdetailed exact prompt to recreate this project showcase section/page exactly as it is, including the correct asset structure, all elements, animations, 3D curved arc math, ultra-slim double-sided vinyl LP geometry with directional 1-step flip reveal, and fonts. This is that prompt.

## What it is

Build a single-screen **project showcase section** (placed directly below the landing page hero, or as a standalone full-viewport project view) for **Dimas Di Ajeng Duwi Saputra** (**Dimas Saputra**). Use plain HTML, CSS and vanilla JavaScript in one file (or encapsulated inside a single self-contained Next.js Client Component with zero external animation library dependencies — pure CSS 3D, one `requestAnimationFrame` loop, and the native Web Animations API).

The section background keeps the exact original warm off-white paper palette (`--paper`, `--sheet`, `--ink`, `--cobalt`) unchanged.
- **The shelf (slim & flat LP records):** across the middle, **clean, crisp, ultra-slim modern vinyl LP records** (ramping dan pipih — real record thickness `~5–8px`, NOT fat VHS bricks, and NOT worn/vintage) stand angled cleanly on a **curved arc that recedes into depth**. Records get smaller, darker and more tightly packed toward both edges, about 11 per side. They turn slightly toward the centre and sit lower as they go back, like a shelf bent into a shallow bowl.
- **The active vinyl LP & 1-step directional back-face spin:** the vinyl LP at the centre faces you squarely (`0°`) over a soft floor shadow, showing its crisp **1:1 square LP jacket cover** on the left and its **sleek black grooved vinyl LP disc protruding halfway (`~50%`) to the right** with a **white circular center label displaying the project's logo**. Whenever the user navigates/scrolls from either the left or the right, **the incoming vinyl that is 1 step away from reaching the centre (`0 < |r| < 1` in the scroll direction) performs a smooth 3D turnaround spin (`±70° → ±180° → ±360° ≡ 0°`)**, briefly revealing its **plain solid-colored matte back cover + B-side vinyl disc (`.back`)** and ultra-slim cardboard edge (`.edge`) before settling cleanly front-facing at the centre!
- **Background:** two columns of giant/medium halftone vertical typography, **PORT** on the left and **FOLIO** on the right, sit behind the shelf.
- **Caption:** under the cover, the project's title is set big and bold in cobalt, with its subtitle / tech stack tag, a short rule and `"YEAR — THEME PROJECT"`. Arrows sit on either side.
- **Timeline:** a ruler from **2023 to 2026** runs along the bottom. A cobalt dot glides to the active project's year.
- **Detail sheet:** clicking the cover grows a sheet of paper out of it into a full-screen project detail page. Its artwork bleeds in like ink.

Everything runs on one `requestAnimationFrame` loop plus the Web Animations API. There are no opacity fades: every reveal is a mask slide, a clip or a scale.

---

## Media: every asset URL (Front Transparent PNG Vinyls + 7-in-1 Back-Side Sprite Sheet)

All **7 projects** use:
1. **7 Front Vinyl LP Cutouts (`.front`):** Transparent PNG cutouts (`3:2` landscape, `width = d_full = H × 1.5`, `height = H`) containing ONLY the 1:1 square front cover on the left + the half-out grooved black vinyl disc on the right (sourced from the 7 finished renders in `Souce/Jadi/` with white backgrounds removed to transparent PNG).
2. **1 Unified 7-in-1 Back-Side Vinyl Sprite Sheet (`SHEET['backs']` for `.back`):** A single `4 × 2` landscape grid PNG (`16:9` / transparent background) holding all **7 plain matte-textured back vinyl views** (Slots 0–6; Slot 7 blank). Each cell has the **physically mirrored back silhouette** — half-out black B-side vinyl on the **LEFT** + plain solid-colored matte back jacket (zero artwork/text) on the **RIGHT** — so when CSS applies `rotateY(180deg)` to `.back`, its silhouette aligns pixel-for-pixel behind `.front`!

### Sprite Sheet & Crop Table for the 7-in-1 Back-Side Image (`SHEET['backs']`)

Store the 7-in-1 back sheet as `SHEET.backs = ['/images/vinyl/vinyl-backs-sheet.png', W, H]` (4 equal columns × 2 equal rows, cell width `cw = W / 4`, cell height `ch = H / 2`):

| # | Project id | Project Name | Front Vinyl PNG (`frontPng`) | Back Sheet Cell (`col, row`) | Back Crop (`x, y, w, h`) | Exact Jacket Base Color (`edgeColor` / Back Color) |
|---|---|---|---|---|---|---|
| 0 | `sebatik` | Sebatik | `/images/vinyl/Sebatik.png` *(from `Souce/Jadi/Sebatik.jpg`)* | `col 0, row 0` | `0, 0, cw, ch` | `#1D140B` (Deep Espresso Brown) |
| 1 | `skynet` | Skynet - Genesys Cloud | `/images/vinyl/SYK NET.png` *(from `Souce/Jadi/SYK NET.jpg`)* | `col 1, row 0` | `cw, 0, cw, ch` | `#0A1622` (Deep Midnight Navy) |
| 2 | `psychobot` | Psychobot | `/images/vinyl/PSYCHOBOT.png` *(from `Souce/Jadi/PSYCHOBOT.jpg`)* | `col 2, row 0` | `2*cw, 0, cw, ch` | `#151034` (Deep Cosmic Indigo) |
| 3 | `javaskripsi` | NATASHA | `/images/vinyl/NATASHA.png` *(from `Souce/Jadi/NATASHA.jpg`)* | `col 3, row 0` | `3*cw, 0, cw, ch` | `#262E2F` (Deep Matte Charcoal Slate) |
| 4 | `esc` | ESC - Echo Space Coffee | `/images/vinyl/ESC.png` *(from `Souce/Jadi/ESC.jpg`)* | `col 0, row 1` | `0, ch, cw, ch` | `#F9F9F9` (Crisp Pure Off-White) |
| 5 | `loghub` | LogHub | `/images/vinyl/LOGHUB.png` *(from `Souce/Jadi/LOGHUB.jpg`)* | `col 1, row 1` | `cw, ch, cw, ch` | `#F6F7F2` (Soft Warm Paper White) |
| 6 | `grace` | Grace | `/images/vinyl/GRACE.png` *(from `Souce/Jadi/GRACE.jpg`)* | `col 2, row 1` | `2*cw, ch, cw, ch` | `#0B2545` (Deep Royal Navy) |

*(Slot `col 3, row 1` on the 4×2 back sprite sheet is unused/blank.)*

**Cropping & Transparent PNG Rendering Rules:**
- **Front face `.front`:** `background-image: url(frontPng); background-size: contain; background-repeat: no-repeat; background-position: center; background-color: transparent;`
- **Back face `.back` (cropped from the single 7-in-1 `SHEET.backs`):**
  - `background-image: url(SHEET.backs[0]);`
  - `background-size: 400% 200%;` (for the 4-column × 2-row grid!)
  - `background-position: (col / 3 * 100)% (row * 100)%;`
  - *(Also supports standalone per-project `backPng` files if provided: when `backPng` is set, use `background-size: contain; background-position: center;` instead.)*
- **Shadow & Shading on Transparent PNGs:** Never use `box-shadow` or rectangular black `::after` overlays on `.front` or `.back` (which would paint a box over transparent regions!). Instead, apply `filter: drop-shadow(0 24px 30px rgba(20,16,10,.28)) brightness(calc(1 - var(--shade) * 0.65))` so both shadows and depth darkening strictly hug the opaque silhouette of the square LP jacket + curved vinyl disc!
- **Detail poster:** an SVG `<image>` of `frontPng` with `viewBox="0 0 900 600"` and `preserveAspectRatio="xMidYMid meet"`, masked by the ink-blot reveal circles.
- Preload all 7 `frontPng` images plus `SHEET.backs` as `Image()` objects on start.

---

## Fonts (all embedded as base64 WOFF2 or loaded via Google Fonts with `font-display:block`)

| Family | Weight | Use |
|---|---|---|
| Inter Tight (variable 100–900) | 500, 600, 800 | Every label, the caption title, the detail title, years, and giant background halftone `PORT` / `FOLIO` |
| Newsreader (variable 200–800, roman and italic) | 400 | Detail project synopsis/description and italic role/tech credit |

- **Sans stack:** `"Inter Tight",system-ui,sans-serif`.
- **Serif stack:** `"Newsreader",Georgia,serif`.

---

## Tokens (Page Base Colors Unchanged)

```css
--paper:#ECE8E0; --sheet:#F3F0EA; --ink:#141414; --muted:#6D6A63; --cobalt:#1F3FB0; --rule:rgba(20,20,20,.9);
--ease:cubic-bezier(.2,.8,.2,1);
--H:min(44vh,30vw);  /* vinyl LP height; min(56vw,36svh) on phones */
--cy:41%;            /* shelf centre line; 43% on phones */
```

- The section container (or `body` when standalone) stays `--paper` (`#ECE8E0`), `100vh` (or `100svh`), with hidden overflow, `user-select:none` and antialiasing. On `(pointer:fine)` inside the project section, the native cursor is hidden.
- **Paper grain (page background only — NOT applied as dirt/wear on the vinyl jackets):** a fixed/absolute full-screen layer (z 40, no pointer events, `mix-blend-mode:multiply`, opacity .6). It is a 220px SVG tile: `feTurbulence` fractalNoise (baseFrequency .85, 3 octaves, stitchTiles) through `feColorMatrix` `0 0 0 0 .45 / 0 0 0 0 .42 / 0 0 0 0 .38 / 0 0 0 .22 0`.
- **`.lbl`:** Inter Tight 600, 10.5px, line-height 1, letter-spacing .14em, uppercase.
- **`.box`:** inline-flex, 21px tall, 0 8px padding, 1px `--rule` border.

---

## Layout (desktop; everything positioned inside the 100vh project viewport)

1. **Top bar:** 76px tall, 36px side padding, space-between, all cobalt.
   - **Left:** a link `.lbl` `"DIMAS SAPUTRA"`, a 40 × 1px line, then `"PROJECTS"`, with 16px gaps.
   - **Right:** `"PROJECTS"`, `"ABOUT"`, `"CONTACT"` (34px gaps), then a burger of two 1.5px lines, 26 × 12px.
2. **Halftone background typography:**
   - Positioned at z 1, `writing-mode:vertical-rl`, font `"Inter Tight"` 800 uppercase at `min(19vh,12.5vw)`, line-height 1.02, letter-spacing .02em.
   - The fill is a dot screen: transparent text with `background-clip:text` over `radial-gradient(circle at 50% 50%, rgba(64,82,138,.55) 0 36%, transparent 40%)` at 3 × 3px, plus a flat `rgba(110,122,160,.26)` wash.
   - **PORT** sits at left 2.4vw, top 13vh. **FOLIO** sits at right 2.4vw, top 9vh.
3. **Floor shadow:**
   - Position: centred at `top:calc(--cy + H×.49)`, width `min(96vw, H×3.9)`, height `H×.24`.
   - Fill: `radial-gradient(50% 50% at 50% 40%, rgba(40,32,20,.28), rgba(40,32,20,.09) 55%, transparent 72%)`.
4. **Shelf (Ultra-Slim & Flat Double-Sided 3D Vinyl LP Cards):**
   - The section spans the full width, top `--cy − H/2 − 50px`, height `H + 100px`, with `perspective:1400px` at `50% 50%`, z 10 and `touch-action:pan-y`.
   - A zero-size `.stage` at the centre has `preserve-3d`.
   - **Each slim vinyl LP item** is a zero-size `preserve-3d` card with **ultra-slim thickness `ws = H × 0.022`** (~5–8px) and **3 crisp 3D parts**:
     - **Front Face `.front`:** width `d_full` (`H × 1.5`), height `H`, `left: -d_full/2`, `top: -H/2`, `transform: translateZ(ws/2)`, `backface-visibility: hidden`. Displays the project's transparent PNG front vinyl cutout (`[1:1 Square Cover Left + Half-Out Vinyl Right]`).
     - **Back Face `.back`:** width `d_full` (`H × 1.5`), height `H`, `left: -d_full/2`, `top: -H/2`, `transform: rotateY(180deg) translateZ(ws/2)`, `backface-visibility: hidden`. Displays the matching cell cropped from the **7-in-1 Back-Side Vinyl Sprite Sheet (`SHEET.backs`)** (`[Half-Out B-Side Vinyl Left + Plain Matte-Textured Back Jacket Right]`). Because of `rotateY(180deg)`, it sits pixel-for-pixel flush behind `.front` and becomes visible whenever the vinyl flips past `±90°`!
     - **Ultra-Slim Spine Edge `.edge`:** width `ws` (`~6px`), height `H`, `left: -d_full/2 - ws/2`, `top: -H/2`, `transform: rotateY(-90deg)`, `background: project.edgeColor` with a subtle `1px` specular paper rim (`rgba(255,255,255,0.14)`). Gives real slim LP jacket thickness along the left spine edge when viewed edge-on or rotating past `±90°`.
   - **Shading:** Both `.front` and `.back` use `filter: drop-shadow(...) brightness(calc(1 - var(--shade) * 0.65))` where `--shade` darkens receding side records smoothly into depth.
5. **Play ring:** a 42px circle with a 1px cobalt border, `rgba(236,232,224,.8)` fill and a 12px cobalt triangle. It sits on the LP jacket's lower-left corner (`left = W/2 − d_full/2 − 6`, `top = shelfCentre + .36H`).
6. **Caption:** a centred grid at `top: --cy + H/2 + 4.2vh`, 10px gap. Each line sits in an overflow mask, `min(80vw,640px)` wide.
   - **Title:** Inter Tight 600, `clamp(28px,3.4vw,46px)`, letter-spacing −.015em, cobalt (e.g. **NATASHA** or **Skynet - Genesys Cloud**).
   - **Subtitle:** a cobalt `.lbl` at 9.5px, letter-spacing .24em, `"STACK / SUBTITLE"` (e.g. `PONDOK KOS MANAGEMENT APP` or `GENESYS CLOUD CX INTEGRATION`).
   - **Rule:** 18 × 1px, cobalt.
   - **Year line:** Inter Tight 500, 10.5px, letter-spacing .08em, ink, `YEAR — THEME PROJECT` (e.g. `2024 — DESKTOP & CORE JAVA`).
7. **Arrows:** two 44px cobalt buttons on the title's line, at `50% ± min(22vw,290px)`. They hold 24 × 12 arrow SVGs (1.2px stroke): `M6 1L1 6l5 5M1 6h23` and its mirror.
8. **Timeline:** left and right 36px, bottom 64px, 40px tall.
   - A cobalt 1px line at 12px (opacity .75).
   - A ruler spanning **2023–2026** with 36 total ticks across the width (1 major tick per year at `2023`, `2024`, `2025`, `2026` — 13px tall at .75 opacity — and minor subdivision ticks in between at 7px tall, .4 opacity, preserving the dense ruler look of the original 36-tick timeline).
   - Year labels (`2023`, `2024`, `2025`, `2026`) in Inter Tight 500 9.5px, cobalt, under the majors (the first `2023` is left-aligned, `2026` right-aligned).
   - A 9px cobalt dot rides the line smoothly between project years.
   - A click area covers it.
9. **Footer:** left/right 36px, bottom 24px, cobalt `.lbl`s: `"© DIMAS DI AJENG DUWI SAPUTRA. ALL RIGHTS RESERVED."` on the left and `"GH / LI / IG"` (links) on the right.
10. **Cursor:** 58px, fixed, z 100.
    - **Parts:** a 1.5px ink ring, a 6px ink dot, and a hidden white label `"OPEN"` in Inter Tight 600 10px.
    - **Movement:** it follows with `1 − e^(−16dt)` smoothing.
    - **States:**
      - `.open` (over the settled active vinyl LP): the ring scales to 1.75 and fills cobalt, and the label pops in.
      - `.spine` (over other slim angled vinyls on the shelf): .72.
      - `.btn` (over buttons, links or the timeline): .55 with no dot.
    - **Transitions:** ring .5s, colours .4s, dot .4s, label .45s.

---

## Project data (shelf order: oldest to newest; the page opens on index 3)

| # | id | Title | Subtitle / Stack | Project Code | Year | Theme Project | Role / Scope | Back Sheet Cell | Synopsis / Project Description |
|---|---|---|---|---|---|---|---|---|---|
| 0 | `sebatik` | Sebatik | INDONESIAN BATIK DIGITAL PLATFORM | D! — 01 | 2023 | Heritage & Web App | Full-Stack Dev | `(0, 0)` | A digital platform and interactive catalog dedicated to preserving, exploring, and showcasing Indonesian Batik motifs and cultural craftsmanship. |
| 1 | `skynet` | Skynet - Genesys Cloud | GENESYS CLOUD CX INTEGRATION | D! — 02 | 2023 | Cloud & Contact Center | Cloud Engineer | `(1, 0)` | Enterprise omnichannel contact center architecture powered by Genesys Cloud (Solutif / MSIB), integrating real-time telemetry, routing automation, and agent workspace tooling. |
| 2 | `psychobot` | Psychobot | AI MENTAL HEALTH COMPANION | D! — 03 | 2024 | AI & Conversational | AI / App Dev | `(2, 0)` | An intelligent conversational assistant designed for psychological screening and empathetic daily check-ins, pairing structured behavioral prompts with natural dialogue. |
| 3 | `javaskripsi` | NATASHA | PONDOK KOS MANAGEMENT SYSTEM | D! — 04 | 2024 | Desktop & Core Java | Lead Author | `(3, 0)` | A comprehensive Java-based academic thesis management system for NATASHA Pondok Kos implementing modular architecture, tenant records, billing, and analytical reporting. |
| 4 | `esc` | ESC - Echo Space Coffee | COFFEE SHOP POS & BRAND EXPERIENCE | D! — 05 | 2025 | Hospitality & Web App | Full-Stack Dev | `(0, 1)` | End-to-end digital storefront and operational ecosystem for Echo Space Coffee, crafted to unite specialty coffee culture with seamless ordering and inventory tracking. |
| 5 | `loghub` | LogHub | CENTRALIZED LOGBOOK & JOURNAL HUB | D! — 06 | 2025 | Productivity & Logging | System Architect | `(1, 1)` | A unified logbook, activity documentation, and operational journaling hub engineered to organize records and daily tracking into an intuitive workspace. |
| 6 | `grace` | Grace | MODERN ENTERPRISE WORKSPACE | D! — 07 | 2026 | Flagship Platform | Full-Stack Dev | `(2, 1)` | The latest flagship software platform focusing on refined user experience, high-reliability workflow orchestration, and clean minimalist system design. |

*(Note: All text fields, colors, PNG paths, and `backCell` coordinates in the data array `PROJECTS` are structured clearly at the top of the script so the user can edit years, descriptions, links, or assets in seconds.)*

Render the **7 projects five times** (`35 slim LP records` total, virtual index `v = copy×7 + i`, so the shelf maintains ~17 items per side in the pool and ~11 visible slim angled vinyls on each side, identical to the original 36-item curved shelf visual density). Start at `s = T = 3 + 14` (copy 2, index 3: **NATASHA**, or change initial index `3` to `6` to open on **Grace**).

---

## Arc geometry (curved bowl shelf + slim flat LP spacing + 1-step directional back-face spin)

### Measured values
Measure H with a probe element of `height:var(--H)`. Then:
- `ws = H·0.022` (ultra-slim, flat real LP cardboard thickness — ~5–8px on desktop)
- `slot = H·0.145` (tight horizontal pitch per slim angled vinyl standing on the curved shelf so ~11 slim LP records pack elegantly per side without colliding)
- `d_full = H·1.5` (full `3:2` width of the active front/back vinyl cutout: 1:1 square jacket + 50% protruding vinyl disc)
- `gap = H·.035`
- `U = H·1.45` on desktop, `H·1.1` below 768px (the depth falloff)
- `P = 1400` (the CSS perspective)

### Functions
- **Total virtual items:** `N = 7`, `COPIES = 5`, `TOTAL = 35` (half-wrap is `17.5`).
- **Relative index:** `rel(v,s) = ((v−s) mod TOTAL)` mapped into `[−TOTAL/2, TOTAL/2)`.
- **Arc length from the centre:** `F(r) = r·(slot+gap) + (d_full − slot + 1.4·gap)·B(r)`, where `B(r) = (r + sin(πr)/π)/2` for `|r| < 1` and `±.5` otherwise. The open active vinyl LP pushes its slim angled neighbours apart smoothly.
- **Screen scale at arc length u:** `scl(u) = 1/(1 + (|u|/U)^1.6)`.
- **Screen x:** the integral of `scl`. Precompute `XS` by stepping u from 0 to 3U in 2px steps, accumulating `2/(1+(u/U)^1.6)`. Then `xsc(u) = sign(u)·XS[|u|/2]`. Far records pack tighter in screen space.

### Per item, every frame (Slim 3D Angle + 1-Step Directional Back-Face Turnaround)
- `o = smoothstep(max(0, 1−|r|))`: 0 for a parked slim record on the side shelf, 1 for the active front-facing vinyl at the centre.
- Track navigation direction `navDir` (`+1` when moving forward / scrolling next from the **right** side so `T > s`; `−1` when moving backward / scrolling prev from the **left** side so `T < s`). Update `navDir = sign(T − s)` whenever `|T − s| > 0.02`.
- `u = F(r)`. If `|u| > U·1.95`, hide the item.
- `sc = scl(u)` and `k = 1/sc`. The item sits at the depth that gives this on-screen scale:
  - `z = P·(1−k) + o·H·.1`
  - `x = xsc(u)·k`
  - `y = (H·.5·(1−sc)·.42 + o·H·.012 − lift·H·.05)·k`, so far records sink a little, forming the bowl.
- **Slim Shelf Angle & 1-Step Directional Back-Face Spin (`rotateY`):**
  - Base slim parked angle on the curved shelf (`|r| ≥ 1`): `shelfDeg = -sign(u) · (70° + min(1, |u|/U) · 10°)` (so left-side slim vinyls stand tightly angled at `+70°..+80°`, and right-side slim vinyls stand tightly angled at `-70°..-80°`).
  - **Only when a vinyl is 1 step away from entering the centre in the active scroll direction** (`0 < |r| < 1` AND `sign(r) === navDir`):
    - **Coming from the right (`navDir = +1`, `0 < r < 1`):** `rotateY = shelfDeg · (1 − o) − 360° · o + tiltY · o`
      - At `r = 1` (`o = 0`): `-70°` (seamless match with right shelf!)
      - As it glides the final 1 step toward centre (`o: 0 → 1`): sweeps smoothly past `-90°` (slim edge) → **`-180°` (clean plain matte BACK face `.back` clearly visible!)** → `-270°` → `-360° ≡ 0°` (front face `.front` settles squarely at centre!).
    - **Coming from the left (`navDir = -1`, `-1 < r < 0`):** `rotateY = shelfDeg · (1 − o) + 360° · o + tiltY · o`
      - At `r = -1` (`o = 0`): `+70°` (seamless match with left shelf!)
      - As it glides the final 1 step toward centre (`o: 0 → 1`): sweeps smoothly past `+90°` (slim edge) → **`+180°` (clean plain matte BACK face `.back` clearly visible!)** → `+270°` → `+360° ≡ 0°` (front face `.front` settles squarely at centre!).
  - **Outgoing vinyl leaving the centre (`0 < |r| < 1` AND `sign(r) !== navDir`) or settled vinyl (`r = 0`):**
    - Simply eases smoothly without extra spin: `rotateY = shelfDeg · (1 − o) + tiltY · o` (moving cleanly from `0°` back into `±70°` on the opposite shelf!).
  - `rotateX = tiltX · o`.
- Transform on item container: `translate3d(x,y,z) rotateX() rotateY()`. z-index `round(3000+z)`.
- **Shading:** `--shade = min(.58, (1−sc)·.40 · (1−o))`, applied via `filter: brightness(calc(1 - var(--shade) * 0.65))` on `.front` and `.back` so far slim records darken into depth while transparent PNG backgrounds remain 100% invisible.
- **Hover lift:** a hovered non-active slim vinyl (`|r| > .5`) eases its lift to 1 at `1−e^(−12dt)`.

### Motion
- **Spring:** `s += (T−s)·(1−e^(−k·dt))`, with k = 5.2, or 18 while dragging. `dt` is capped at 50ms. When `s` passes ±2 loops from the middle copy, shift `s` and `T` by whole loops (`±7`).
- **Active project:** `((round(s) % 7) + 7) % 7`. On change, swap the caption with `dir = sign(T−s)`.
- **Timeline dot:** interpolate the position between the projects at `floor(s)` and `floor(s)+1`. Assign each of the 7 projects a continuous timeline coordinate `timelineYear` (`2023.0`, `2023.5`, `2024.0`, `2024.5`, `2025.0`, `2025.5`, `2026.0`). On the `2026.0 → 2023.0` wrap, jump at the halfway point. It eases at `1−e^(−14dt)` and jumps directly when wrapping across the ends. Left is `(timelineYear − 2023) / 3`.
- **Cover tilt:**
  - The pointer is "on the cover" when it is within `.55d_full` of the screen centre and `.55H` of the shelf centre, the shelf has settled (`|T−s| < .3`) and the detail is closed.
  - On the cover: `tiltY → (mx−W/2)/(.55d_full)·8°` and `tiltX → −(my−cy)/(H/2)·5°`.
  - Elsewhere: `tiltY → (mx−W/2)/W·4°` and `tiltX → 0`.
  - Both ease at `1−e^(−7dt)`.
- **Play ring scale:** `smoothstep(max(0, 1−|T−s|·3))`, or 0 while the detail is open.

### Inputs
- **Click a vinyl item:** the active one opens the detail; any other glides to `round(T + r)`. Clicks are ignored after a drag.
- **Arrows and keys:** arrows and ←/→ step ±1. Enter opens, Escape closes.
- **Drag:** `T = T0 − dx/(slot+gap)` once moved more than 5px. Release snaps to the nearest integer.
- **Wheel:** `T += delta/(slot+gap)·.5`, using the larger axis, then snaps after 160ms idle. It is ignored while the detail is open.
- **Timeline click:** convert x to a `timelineYear` (`2023 + (x/width)·3`) and jump to the project with the nearest `timelineYear` by the shortest way round.

---

## Caption swap (mask slide)

- A new span is appended over the old one inside the mask.
- The new span slides from `translateY(dir·105%)` to 0.
- Each old span slides from its current transform to `translateY(−dir·105%)` and is then removed.
- Timing: 650ms, `cubic-bezier(.2,.8,.2,1)`, `fill both`.

---

## Detail sheet

**Structure:** a fixed full-screen `.detail` in `--sheet`, z 60, hidden until opened.
- **Grid:** two columns with a 4vw gap and padding `110px 6vw 56px 7vw`.
- **Close button:** a boxed `.lbl` `"CLOSE"` at 36px, 28px.
- **Brand:** a cobalt copy of the brand (`"DIMAS SAPUTRA —— PROJECTS"`) top right.

**Left column:** centred vertically, max 520px, 18px gap. Every line sits in its own mask:
1. The cobalt subtitle `.lbl` (`STACK / PROJECT CODE`).
2. The project title in Inter Tight 600, `clamp(44px,5.2vw,80px)`, letter-spacing −.03em, cobalt.
3. The muted meta line `YEAR / THEME PROJECT / ROLE`.
4. The project synopsis/description in Newsreader 17px/1.5, max 42ch.
5. The italic muted credit `"Designed & developed by Dimas Di Ajeng Duwi Saputra."`.
6. A 44px cobalt-bordered button `"VIEW PROJECT"` (links to the live demo or GitHub repository URL in `project.url`).

**Right column:** the vinyl artwork SVG (viewBox `0 0 900 600` for `3:2` transparent vinyl PNG, height `min(100%,68vh)`).
- **Image:** the isolated transparent PNG front vinyl cutout, masked by seven white circles in a group.
- **Ink filter on that group:** `feTurbulence` fractalNoise, baseFrequency .011, 3 octaves, seed 7, into `feDisplacementMap` with scale 120 (R/G channels).
- **Circles** (cx, cy, delay ms): `(220,260,0)` `(640,420,120)` `(450,140,220)` `(160,500,300)` `(760,200,360)` `(480,540,420)` `(420,320,180)`.

**Open:**
1. Snap T, fill in the texts, aim the artwork image, and reset the radii to 0.
2. Read the cover face's projected `getBoundingClientRect`.
3. Animate the sheet's `clip-path` from `inset(top right bottom left round 3px)` (the cover rect) to `inset(0 round 0)` over **1050ms** with `cubic-bezier(.76,0,.18,1)`. A blank rectangle of paper grows straight out of the cover to fill the screen.
4. The text lines rise from `translateY(110%)` over 900ms, with delays of `620 + i·75` ms.
5. From 520ms, each circle grows from 0 to r = 720 over 1250ms after its delay (ease-out cubic). The vinyl artwork bleeds in as ragged ink blots.

**Close:** the reverse clip back to the current cover rect over 850ms, then hide the sheet and cancel its animations.

---

## Phones (≤ 767px)
- `--H:min(56vw,36svh)` and `--cy:43%`.
- **Top bar:** 60px, 16px padding. The nav text is hidden (the burger stays) and the brand line is 22px.
- **Halftone background text:** 22vw at .8 opacity.
- **Caption:** the title is 27px. The arrows drop to bottom 118px at the screen edges.
- **Timeline:** 16px sides, bottom 54px, and every other year label is hidden if crowded.
- **Detail:** one scrolling column with the vinyl artwork first at 42svh and a 42px title.
- No custom cursor; finger drag scrubs the shelf.

## Reduced motion
- The spring and lift are instant (and the 1-step turnaround spin is disabled so records settle immediately at `0°`).
- Captions swap without sliding.
- The sheet and text animations take 1ms.
- The ink starts 5s in the past, so the artwork shows at once.
