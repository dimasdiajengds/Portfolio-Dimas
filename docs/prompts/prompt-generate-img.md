# Panduan & Prompt Generate Gambar Vinyl LP Modern (PNG Cutout) di Gemini — Portfolio Dimas Saputra

Dokumen ini disusun sesuai referensi tampilan pilihan Anda ([8645bc7abdf28d974dc872a70a6d1f50-vinyl-lp-cover-white-mockup.webp](file:///e:/PORTO/Porto%20serius/Souce/Template/8645bc7abdf28d974dc872a70a6d1f50-vinyl-lp-cover-white-mockup.webp)):
- **Bentuk:** Kotak sampul Vinyl LP **persegi `1:1` yang bersih & modern** (BUKAN usang/vintage/kotor) + **Piringan hitam Vinyl LP yang setengah keluar ke kanan (`~50%`)**, dengan **bulatan label tengah warna putih** menampilkan logo project Anda.
- **Color Palette:** Setiap project **mengikuti palet warna asli dari logo project Anda** (tidak dipaksa memakai palet vintage/cobalt-merah).
- **Output PNG Tanpa Pinggiran:** Di-generate terisolasi tanpa background studio abu-abu, tanpa bayangan lantai, tanpa watermark, dan tanpa bingkai luar — sehingga Anda hanya mengambil **kotak wadah + piringan vinyl-nya saja** dalam format `.png` transparan!

---

## 1. Cara Upload di Gemini & Tips Membuat Hasil Jadi PNG Transparan Bersih

1. **Upload 2 Gambar Sekaligus di Gemini pada Setiap Prompt:**
   - **Image 1 (Referensi Bentuk / Silhouette):** Upload file `Souce/Template/8645bc7abdf28d974dc872a70a6d1f50-vinyl-lp-cover-white-mockup.webp` agar Gemini meniru **persis proporsi kotak 1:1 + piringan vinyl yang keluar setengah ke kanan**.
   - **Image 2 (Logo / Source Project Anda):** Upload `Sebatik.png`, `ESC.png`, `LogHub.png` *(export dulu `LogHub.svg` ke PNG)*, atau logo project lainnya.
2. **Tips Penting Soal Transparent PNG dari Gemini:**
   - Saat ini, web Gemini kadang tetap menyimpan gambar dengan latar belakang solid meskipun kita meminta transparent PNG.
   - Oleh karena itu, prompt di bawah mengunci latar belakang agar **100% putih polos rata (`#FFFFFF`) atau transparan, TANPA bayangan jatuh (*zero cast shadow*, *zero floor shadow*, *zero gray gradient*)**.
   - Jika hasil download dari Gemini masih berlatar putih polos, tinggal masukkan 1 klik ke *Remove.bg / Canva / Figma / Photoshop* — karena tidak ada bayangan dan pinggirannya tajam lurus & bulat sempurna, hasilnya langsung menjadi **PNG transparan 100% bersih (hanya kotak LP & piringan vinylnya saja)**!
3. **Rasio Gambar:** Gunakan rasio landscape **`3:2`** (atau `16:9` lalu trim transparan) karena gabungan `[Kotak 1:1 + Vinyl Keluar 50%]` memiliki proporsi tepat **`3 : 2`**.

---

## 2. Master Prompt Gemini (Clean Modern Vinyl LP + Half-Out Disc — Siap PNG Cutout)

> **Upload:** Image 1 = `8645bc7abdf28d974dc872a70a6d1f50-vinyl-lp-cover-white-mockup.webp` | Image 2 = Logo / Source Project Anda

```text
Using Image 1 strictly as the exact object shape and layout reference (a clean modern 1:1 square vinyl LP record jacket on the left with a sleek black grooved vinyl record disc sliding halfway—about 50%—out of the right edge), design a brand-new, crisp, modern vinyl LP edition for the project logo in Image 2.

STRICT STYLE RULES (CLEAN & MODERN — NOT VINTAGE):
- Fresh, crisp, brand-new matte-laminated studio vinyl LP sleeve. ZERO vintage wear, ZERO scuffs, ZERO creases, ZERO dirt, ZERO yellowed paper, ZERO grunge texture.
- Color Palette: STRICTLY derive and harmonize the entire square jacket design from the exact original color palette of the uploaded logo in Image 2. Do NOT alter the logo's colors.
- Square LP Jacket (Left): Clean modern graphic design and editorial composition inspired by Image 2, featuring small clean uppercase header "A DIMAS SAPUTRA PROJECT", bold modern project title "[NAMA PROJECT]", and a crisp minimal boxed "D!" badge in the bottom corner. No Japanese text and no year.
- Half-Out Vinyl Disc (Right): Sleek, brand-new matte-black vinyl LP record with fine realistic circular micro-grooves and subtle crisp studio light sheen. In the exact center of the vinyl disc (partially peeking cleanly next to the right edge of the jacket), place a crisp pure WHITE circular center label (#FFFFFF) featuring the uploaded logo from Image 2 clearly printed in the middle with a small black spindle hole.

CRITICAL PNG CUTOUT / ISOLATION RULE:
- Output ONLY the square vinyl jacket and the half-out vinyl disc isolated cleanly on a completely transparent background (or pure solid flat #FFFFFF white background for effortless 1-click PNG cutout).
- ABSOLUTELY NO gray studio gradient background, NO floor shadow, NO cast drop shadow on the background, NO table, NO watermark, and NO outer border/frame. Razor-sharp clean silhouette edges around the square box and circular vinyl only.
- Aspect ratio 3:2, strictly flat front-facing orthographic studio product view.
```

---

## 3. Prompt Gemini Spesifik per Project (Mengikuti Color Palette Logo Asli)

### 1. SEBATIK — Upload: `Template Vinyl (Image 1)` + `Sebatik.png (Image 2)`
- **Color Palette Logo:** Deep Espresso Brown (`#1D140B`), Warm Tan/Gold (`#D69764`), Crisp White (`#FFFFFF`).
```text
Using Image 1 as the exact 3:2 orthographic layout (a crisp 1:1 square vinyl LP sleeve on the left + sleek black grooved vinyl disc sticking 50% out to the right), design a brand-new modern vinyl LP for "SEBATIK" based on the uploaded logo (Image 2).

Style & Color Palette (Match Logo Colors Exactly — NO Vintage Wear):
- Clean, crisp, brand-new modern matte vinyl jacket. ZERO scuffs, ZERO vintage aging, ZERO grunge.
- Strictly use the exact color palette from Image 2: rich deep espresso brown (#1D140B), warm terracotta tan/gold (#D69764), and crisp pure white (#FFFFFF).
- Square Jacket Design: Modern minimalist geometric batik pattern art expanding the clean symmetrical floral/kawung ornament from Image 2 across the dark espresso brown matte sleeve in warm gold/tan and crisp white linework. Small clean top label "A DIMAS SAPUTRA PROJECT", bold modern title "SEBATIK", and a minimal boxed "D!" badge in the bottom corner. No Japanese text, no year.
- Half-Out Vinyl Disc: Brand-new glossy-grooved black vinyl record protruding halfway out the right side, with a crisp PURE WHITE circular center label (#FFFFFF) displaying the Sebatik batik logo cleanly in the center around the spindle hole.

CRITICAL PNG CUTOUT RULE:
Isolate ONLY the square jacket and half-out vinyl disc on a completely transparent (or pure flat #FFFFFF) background. NO gray studio gradient, NO floor shadows, NO drop shadows, NO watermark, NO outer margins. Razor-sharp edges ready for transparent PNG.
```

### 2. SKYNET - GENESYS CLOUD — Upload: `Template Vinyl (Image 1)` + `Logo Skynet (Image 2)`
- **Color Palette:** Mengikuti warna logo yang Anda upload *(fallback: Deep Navy, Signal Blue/Cyan, White)*.
```text
Using Image 1 as the exact 3:2 orthographic layout (a crisp 1:1 square vinyl LP sleeve on the left + sleek black grooved vinyl disc sticking 50% out to the right), design a brand-new modern vinyl LP for "SKYNET - GENESYS CLOUD" using the uploaded logo/reference (Image 2).

Style & Color Palette (Match Logo Colors Exactly — NO Vintage Wear):
- Clean, crisp, brand-new modern matte vinyl jacket. ZERO scuffs, ZERO vintage aging, ZERO grunge.
- Strictly follow the exact original color palette of the uploaded logo in Image 2 (or if no logo is uploaded, use sleek modern deep navy, crisp cyan-blue, and pure white).
- Square Jacket Design: Clean contemporary Swiss-grid graphic artwork depicting sleek cloud telemetry nodes, precision orbital routing lines, and minimalist architectural cloud geometry harmonized with the logo's colors. Small clean top label "A DIMAS SAPUTRA PROJECT", bold modern title "SKYNET" with sub-line "GENESYS CLOUD", and a minimal boxed "D!" badge in the bottom corner. No Japanese text, no year.
- Half-Out Vinyl Disc: Brand-new grooved black vinyl record protruding halfway out the right side, with a crisp PURE WHITE circular center label (#FFFFFF) displaying the uploaded Skynet logo cleanly in the center around the spindle hole.

CRITICAL PNG CUTOUT RULE:
Isolate ONLY the square jacket and half-out vinyl disc on a completely transparent (or pure flat #FFFFFF) background. NO gray studio gradient, NO floor shadows, NO drop shadows, NO watermark, NO outer margins. Razor-sharp edges ready for transparent PNG.
```

### 3. PSYCHOBOT — Upload: `Template Vinyl (Image 1)` + `Logo Psychobot (Image 2)`
- **Color Palette:** Mengikuti warna logo yang Anda upload *(fallback: Calm Indigo, Soft Violet, White)*.
```text
Using Image 1 as the exact 3:2 orthographic layout (a crisp 1:1 square vinyl LP sleeve on the left + sleek black grooved vinyl disc sticking 50% out to the right), design a brand-new modern vinyl LP for "PSYCHOBOT" using the uploaded logo/reference (Image 2).

Style & Color Palette (Match Logo Colors Exactly — NO Vintage Wear):
- Clean, crisp, brand-new modern matte vinyl jacket. ZERO scuffs, ZERO vintage aging, ZERO grunge.
- Strictly follow the exact original color palette of the uploaded logo in Image 2 (or if no logo is uploaded, use calm modern deep indigo, soft violet, and pure white).
- Square Jacket Design: Refined minimalist contemporary graphic art featuring smooth abstract conversational waveforms, clean symmetric geometric empathy motifs, and crisp modern typography. Small clean top label "A DIMAS SAPUTRA PROJECT", bold modern title "PSYCHOBOT", and a minimal boxed "D!" badge in the bottom corner. No Japanese text, no year.
- Half-Out Vinyl Disc: Brand-new grooved black vinyl record protruding halfway out the right side, with a crisp PURE WHITE circular center label (#FFFFFF) displaying the uploaded Psychobot logo cleanly in the center around the spindle hole.

CRITICAL PNG CUTOUT RULE:
Isolate ONLY the square jacket and half-out vinyl disc on a completely transparent (or pure flat #FFFFFF) background. NO gray studio gradient, NO floor shadows, NO drop shadows, NO watermark, NO outer margins. Razor-sharp edges ready for transparent PNG.
```

### 4. NATASHA — Upload: `Template Vinyl (Image 1)` + `Logo NATASHA (Image 2)`
- **Color Palette:** Mengikuti warna logo yang Anda upload *(fallback: Slate Charcoal, Warm Amber, Crisp White)*.
```text
Using Image 1 as the exact 3:2 orthographic layout (a crisp 1:1 square vinyl LP sleeve on the left + sleek black grooved vinyl disc sticking 50% out to the right), design a brand-new modern vinyl LP for "NATASHA" using the uploaded logo/reference (Image 2).

Style & Color Palette (Match Logo Colors Exactly — NO Vintage Wear):
- Clean, crisp, brand-new modern matte vinyl jacket. ZERO scuffs, ZERO vintage aging, ZERO grunge.
- Strictly follow the exact original color palette of the uploaded logo in Image 2 (or if no logo is uploaded, use sleek slate charcoal, warm amber accent, and crisp white).
- Square Jacket Design: Clean contemporary minimalist editorial artwork featuring crisp modular architectural grid geometry, precise structured forms, and sharp balanced typography. Small clean top label "A DIMAS SAPUTRA PROJECT", bold modern title "NATASHA", and a minimal boxed "D!" badge in the bottom corner. No Japanese text, no year.
- Half-Out Vinyl Disc: Brand-new grooved black vinyl record protruding halfway out the right side, with a crisp PURE WHITE circular center label (#FFFFFF) displaying the uploaded NATASHA logo cleanly in the center around the spindle hole.

CRITICAL PNG CUTOUT RULE:
Isolate ONLY the square jacket and half-out vinyl disc on a completely transparent (or pure flat #FFFFFF) background. NO gray studio gradient, NO floor shadows, NO drop shadows, NO watermark, NO outer margins. Razor-sharp edges ready for transparent PNG.
```

### 5. ESC - ECHO SPACE COFFEE — Upload: `Template Vinyl (Image 1)` + `ESC.png (Image 2)`
- **Color Palette Logo:** Cerulean Sky Blue (`#4B9CD3`), Deep Charcoal Black (`#1A1A1A`), Crisp White (`#FFFFFF`).
```text
Using Image 1 as the exact 3:2 orthographic layout (a crisp 1:1 square vinyl LP sleeve on the left + sleek black grooved vinyl disc sticking 50% out to the right), design a brand-new modern vinyl LP for "ECHO SPACE COFFEE" based on the uploaded stacked logo (Image 2).

Style & Color Palette (Match Logo Colors Exactly — NO Vintage Wear):
- Clean, crisp, brand-new modern matte vinyl jacket. ZERO scuffs, ZERO vintage aging, ZERO grunge.
- Strictly use the exact color palette from Image 2: vibrant cerulean sky blue (#4B9CD3), deep charcoal black (#1A1A1A), and crisp pure white (#FFFFFF).
- Square Jacket Design: Crisp pure white matte sleeve featuring the bold stacked "E-CHO / S-PACE / C-OFFEE" graphic identity (with vertical letters "E", "S", "C" in exact cerulean blue #4B9CD3 and "CHO / PACE / OFFEE" in deep charcoal black #1A1A1A), paired with clean modern minimalist acoustic echo-ring linework and sleek architectural coffee bar geometry. Small clean top label "A DIMAS SAPUTRA PROJECT" and a minimal boxed "D!" badge in the bottom corner. No Japanese text, no year.
- Half-Out Vinyl Disc: Brand-new grooved black vinyl record protruding halfway out the right side, with a crisp PURE WHITE circular center label (#FFFFFF) displaying the ESC logo cleanly in the center around the spindle hole.

CRITICAL PNG CUTOUT RULE:
Isolate ONLY the square jacket and half-out vinyl disc on a completely transparent (or pure flat #FFFFFF) background. NO gray studio gradient, NO floor shadows, NO drop shadows, NO watermark, NO outer margins. Razor-sharp edges ready for transparent PNG.
```

### 6. LOGHUB — Upload: `Template Vinyl (Image 1)` + `LogHub.png (Image 2 — hasil convert dari LogHub.svg)`
- **Color Palette Logo:** Deep Teal (`#0F766E`), Emerald Teal (`#0D9488`), Mint Accent (`#5EEAD4`), Crisp Off-White (`#FAFAF7`).
```text
Using Image 1 as the exact 3:2 orthographic layout (a crisp 1:1 square vinyl LP sleeve on the left + sleek black grooved vinyl disc sticking 50% out to the right), design a brand-new modern vinyl LP for "LOGHUB" based on the uploaded icon (Image 2: teal stacked logbook pages with a sleek quill pen).

Style & Color Palette (Match Logo Colors Exactly — NO Vintage Wear):
- Clean, crisp, brand-new modern matte vinyl jacket. ZERO scuffs, ZERO vintage aging, ZERO grunge.
- Strictly use the exact color palette from Image 2: rich deep teal (#0F766E), emerald teal (#0D9488), soft mint highlight (#5EEAD4), and crisp off-white (#FAFAF7).
- Square Jacket Design: Clean modern contemporary graphic composition in deep teal and crisp white featuring sleek overlapping minimalist ledger cards, precise horizontal journal rhythm lines, and a refined geometric quill pen motif inspired by Image 2. Small clean top label "A DIMAS SAPUTRA PROJECT", bold modern title "LOGHUB", and a minimal boxed "D!" badge in the bottom corner. No Japanese text, no year.
- Half-Out Vinyl Disc: Brand-new grooved black vinyl record protruding halfway out the right side, with a crisp PURE WHITE circular center label (#FFFFFF) displaying the LogHub icon cleanly in the center around the spindle hole.

CRITICAL PNG CUTOUT RULE:
Isolate ONLY the square jacket and half-out vinyl disc on a completely transparent (or pure flat #FFFFFF) background. NO gray studio gradient, NO floor shadows, NO drop shadows, NO watermark, NO outer margins. Razor-sharp edges ready for transparent PNG.
```

### 7. GRACE — Upload: `Template Vinyl (Image 1)` + `Logo Grace (Image 2)`
- **Color Palette:** Mengikuti warna logo yang Anda upload *(fallback: Pure Ivory/White, Obsidian Black, Soft Silver)*.
```text
Using Image 1 as the exact 3:2 orthographic layout (a crisp 1:1 square vinyl LP sleeve on the left + sleek black grooved vinyl disc sticking 50% out to the right), design a brand-new modern vinyl LP for "GRACE" using the uploaded logo/reference (Image 2).

Style & Color Palette (Match Logo Colors Exactly — NO Vintage Wear):
- Clean, crisp, brand-new modern matte vinyl jacket. ZERO scuffs, ZERO vintage aging, ZERO grunge.
- Strictly follow the exact original color palette of the uploaded logo in Image 2 (or if no logo is uploaded, use ultra-clean gallery white, obsidian black, and refined muted silver).
- Square Jacket Design: Ultra-clean modern minimalist architectural graphic art with balanced geometric symmetry, crisp light planes, and refined contemporary typography. Small clean top label "A DIMAS SAPUTRA PROJECT", bold modern title "GRACE", and a minimal boxed "D!" badge in the bottom corner. No Japanese text, no year.
- Half-Out Vinyl Disc: Brand-new grooved black vinyl record protruding halfway out the right side, with a crisp PURE WHITE circular center label (#FFFFFF) displaying the uploaded Grace logo cleanly in the center around the spindle hole.

CRITICAL PNG CUTOUT RULE:
Isolate ONLY the square jacket and half-out vinyl disc on a completely transparent (or pure flat #FFFFFF) background. NO gray studio gradient, NO floor shadows, NO drop shadows, NO watermark, NO outer margins. Razor-sharp edges ready for transparent PNG.
```

---

## 4. Prompt Gemini untuk 7 Punggung Vinyl LP (`Spines`) — Clean Modern Sesuai Warna Logo Masing-Masing

```text
Generate a flat 2D orthographic 16:9 sprite sheet showing 7 tall, sleek, brand-new modern matte vinyl LP record spines standing side by side in a single horizontal row on a completely transparent (or pure flat #FFFFFF) background, with equal spacing between each spine (each spine has a tall 1:7 aspect ratio).

Style (CLEAN & MODERN — ZERO VINTAGE WEAR):
- Crisp, fresh matte-laminated record jacket spines. NO scuffs, NO scratches, NO aged paper, NO grunge.
- Each spine uses its own project's exact brand color palette:
  1. Spine 1 ("SEBATIK"): Deep espresso brown (#1D140B) background, warm gold/tan (#D69764) & white typography
  2. Spine 2 ("SKYNET — GENESYS"): Deep navy background, crisp cyan & white typography
  3. Spine 3 ("PSYCHOBOT"): Deep indigo background, soft violet & white typography
  4. Spine 4 ("NATASHA"): Slate charcoal background, warm amber & white typography
  5. Spine 5 ("ECHO SPACE COFFEE"): Crisp pure white background, cerulean blue (#4B9CD3) & charcoal black (#1A1A1A) typography
  6. Spine 6 ("LOGHUB"): Deep teal (#0F766E) background, mint (#5EEAD4) & white typography
  7. Spine 7 ("GRACE"): Pure off-white background, obsidian black typography

Layout of EACH of the 7 spines from top to bottom:
- Top: a tiny crisp minimalist emblem matching each project.
- Middle: the project title written vertically (rotated 90 degrees clockwise) in crisp bold modern sans-serif typography, clean and legible.
- Bottom: small horizontal uppercase text "SAPUTRA" above a tiny crisp thin-bordered square box containing "D!".

CRITICAL PNG CUTOUT RULE:
Strictly flat 2D front-facing orthographic texture sheet. All 7 spines must be perfectly straight, identical in height and width, aligned cleanly on the same horizontal baseline, with ZERO 3D perspective, ZERO drop shadows, and ZERO background gradients.
```

---

## 5. Prompt Gemini: 7 Tampilan Belakang Vinyl LP Sekaligus (Sprite Sheet Grid `4 × 2` — Polos Warna & Tekstur Matte)

> **Fungsi & Cara Kerja di 3D:**
> - Gambar ini memuat **ketujuh tampilan belakang vinyl sekaligus dalam 1 file landscape (`16:9`, grid `4 kolom × 2 baris`, slot ke-8 kosong)** sehingga langsung bisa dipanggil 1 kali lewat sistem `SHEET.backs` & `CROP` di [prompt.md](file:///e:/PORTO/Porto%20serius/prompt.md).
> - **Posisi Terbalik Presisi 3D (Mirrored Back View):** Karena di tampak depan (`Souce/Jadi/`) kotak sampul berada di **KIRI** dan piringan vinyl keluar di **KANAN**, maka di tampak belakang **piringan vinyl keluar ke KIRI** dan **bagian belakang kotak sampul berada di KANAN** agar pas 100% menyatu saat diputar 3D (`rotateY`)!
> - **Desain Polos & Realistis:** Bagian belakang wadah **tidak memiliki gambar, logo, ataupun teks apa pun** — hanya **warna dasar persis sesuai 7 file jadi di `Souce/Jadi/`** ditambah **tekstur halus kertas karton matte LP asli** dan garis lipatan tipis (*subtle back sleeve fold seam*) khas belakang sampul piringan hitam modern.
> - **Tips Upload:** Anda boleh meng-upload `Souce/Template/8645bc7abdf28d974dc872a70a6d1f50-vinyl-lp-cover-white-mockup.webp` sebagai referensi bentuk (dengan catatan di prompt sudah diperintahkan agar posisinya dibalik menjadi tampak belakang: vinyl di kiri, kotak polos di kanan).

```text
Generate a crisp, ultra-clean flat 2D orthographic 16:9 sprite sheet arranged in an exact, perfectly aligned 4-column by 2-row grid (8 equal rectangular 3:2 cells separated by clean uniform whitespace, with cells 1 to 7 containing the BACK VIEW of 7 brand-new modern vinyl LP records and cell 8 in the bottom-right corner left completely empty/blank).

EXACT OBJECT SILHOUETTE INSIDE EACH OF THE 7 CELLS (REAR / BACK VIEW — MIRRORED FROM FRONT):
- On the LEFT side of each cell: a sleek, brand-new matte-black grooved B-side vinyl LP disc protruding halfway (50%) out of the left opening of the sleeve, with fine realistic concentric circular micro-grooves, subtle studio light sheen, and a completely BLANK pure solid white circular center label (#FFFFFF) with a tiny black center spindle hole (NO text, NO logo, NO artwork on the center label).
- On the RIGHT side of each cell: a crisp 1:1 square BACK COVER of a brand-new modern matte-laminated LP cardboard jacket.
- COMPLETELY BLANK BACK JACKET DESIGN: ZERO illustrations, ZERO graphics, ZERO logos, ZERO text, ZERO barcodes, ZERO stamps. Show ONLY the solid matte brand color below with realistic fine micro-paper/cardstock matte finish and ultra-subtle realistic vinyl back-jacket construction details (a very faint clean folded top and bottom glue-flap seam line along the upper and lower inner edges of the back sleeve, clean crisp edges — brand-new modern print, NOT vintage, NOT worn, NOT dirty, NOT scuffed).

EXACT COLOR ASSIGNMENT PER GRID CELL (MATCHING EACH PROJECT'S FINISHED FRONT COVER):
- Row 1, Col 1 (Cell 1 — Sebatik): Deep Espresso Brown (#1D140B) matte cardstock back sleeve + black B-side vinyl protruding left
- Row 1, Col 2 (Cell 2 — Skynet): Deep Midnight Navy (#0A1622) matte cardstock back sleeve + black B-side vinyl protruding left
- Row 1, Col 3 (Cell 3 — Psychobot): Deep Cosmic Indigo (#151034) matte cardstock back sleeve + black B-side vinyl protruding left
- Row 1, Col 4 (Cell 4 — NATASHA): Deep Matte Charcoal Slate (#262E2F) matte cardstock back sleeve + black B-side vinyl protruding left
- Row 2, Col 1 (Cell 5 — ESC): Crisp Pure Off-White (#F9F9F9) matte cardstock back sleeve (with ultra-subtle light edge contour so it stays crisp) + black B-side vinyl protruding left
- Row 2, Col 2 (Cell 6 — LogHub): Soft Warm Paper White (#F6F7F2) matte cardstock back sleeve + black B-side vinyl protruding left
- Row 2, Col 3 (Cell 7 — Grace): Deep Royal Navy (#0B2545) matte cardstock back sleeve + black B-side vinyl protruding left
- Row 2, Col 4 (Cell 8 — Empty): Completely blank pure white background (leave empty)

CRITICAL SPRITE SHEET & PNG CUTOUT RULES:
- Place all 7 rear vinyl LP units at IDENTICAL scale, IDENTICAL pixel height, and IDENTICAL centered alignment inside their respective 4x2 grid cells so they can be cropped programmatically with exact CSS sprite coordinates (background-size: 400% 200%).
- Pure solid flat #FFFFFF white background (or transparent PNG background).
- ABSOLUTELY NO grid border lines, NO cell numbers, NO labels, NO text anywhere on the image, NO floor shadows, NO cast drop shadows, NO gray studio gradients, and NO 3D perspective tilt. Strictly flat front-facing orthographic rear view.
```
