# Engineering, Design System & Anti-AI-Slop Rules (`RULES.md`)

Dokumen ini adalah **aturan mengikat (*guardrails*)** untuk setiap tahap pengembangan kode — baik oleh manusia maupun saat melakukan *prompting* ke AI — agar seluruh section tetap konsisten, ringan, dan bebas dari pola desain generik (*AI slop*).

---

## 1. Locked Design System Tokens (Dilarang Mengubah Warna Dasar)

Seluruh section (Navbar, Hero, 3D Vinyl Showcase, Project Detail, About, Contact) **WAJIB** menggunakan token global berikut tanpa pengecualian:

```css
:root {
  --paper: #ECE8E0;               /* Background utama seluruh website */
  --sheet: #F3F0EA;               /* Surface sekunder (Section Detail / Card tipis) */
  --ink: #141414;                 /* Teks utama & garis kontras */
  --muted: #6D6A63;               /* Teks sekunder, metadata, keterangan */
  --cobalt: #1F3FB0;              /* Aksen utama: judul display, dot timeline, CTA, caret */
  --rule: rgba(20, 20, 20, 0.9);  /* Garis tegas 1px untuk .box & divider */
  --hairline: rgba(20, 20, 20, 0.12); /* Garis pemisah section / navbar */
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  --ease-sheet: cubic-bezier(0.76, 0, 0.18, 1);
}
```

### Typography Rules
- **Display, Judul, Nav, UI Labels (`.lbl`):** `"Inter Tight", system-ui, sans-serif` (weights `500`, `600`, `800`).
  - `.lbl`: `600`, `10.5px`, `line-height: 1`, `letter-spacing: 0.14em`, `text-transform: uppercase`.
- **Body Editorial, Sinopsis, Kredit Italic:** `"Newsreader", Georgia, serif` (weight `400`, roman & italic).
- **Dilarang menambahkan font keluarga ke-3** (tidak ada Poppins, Roboto, Montserrat, atau font monospace dekoratif yang tidak perlu).
- **Tanpa teks Jepang / Kanji** di seluruh UI (sesuai keputusan final desain).

### Layout & Spacing Rules
- Padding horizontal global terkunci: **`36px` (desktop)** dan **`16px` (mobile `≤ 767px`)**.
- **Paper Grain Overlay:** 1 layer SVG `feTurbulence` global pada halaman (`pointer-events: none`, `mix-blend-mode: multiply`, `opacity: 0.55`). Tidak boleh menumpuk grain berulang di dalam komponen anak.

---

## 2. Strict Anti-AI-Slop Rules (Daftar Larangan Keras)

Setiap komponen baru yang dibuat AI **WAJIB lolos pemeriksaan berikut**:

1. **NO Neon / Purple-Blue Gradients:** Dilarang keras memakai gradient ungu-biru, glowing blob di background, atau teks gradient pelangi.
2. **NO Glassmorphism Murahan:** Dilarang memakai kartu transparan `backdrop-filter: blur(20px)` dengan border mengkilap. Navbar boleh memakai latar `--paper/92` yang tenang dengan *hairline border* tipis `1px` saat di-scroll.
3. **NO Generic Bento / SaaS Card Grids:** Untuk Section About, Experience, & Capabilities, gunakan tipografi editorial, garis horizontal tipis `1px`, dan ruang kosong (*whitespace*) — **bukan** kumpulan kotak `rounded-2xl shadow-lg` generik.
4. **NO Skill Progress Bars / Percentage Badges:** Dilarang menampilkan *"React 90%"*, *"Java 85%"*, atau deretan badge pil warna-warni.
5. **NO Emoji sebagai Ikon UI:** Gunakan hanya karakter tipografi bersih (`→`, `←`, `↑`, `↗`, `—`) atau SVG *single-stroke* tipis (`stroke-width: 1.2px–1.5px`).
6. **NO Cheap Opacity-Only Fades:** Semua transisi masuk/keluar teks & konten mengikuti bahasa gerak asli website: **mask slide (`translateY` di dalam `overflow: hidden`)**, **`clip-path`**, atau **`scale`** dengan `--ease`.
7. **NO Vintage / Distressed Wear pada Vinyl:** Semua aset vinyl adalah edisi modern yang bersih & tajam (*matte-laminated*). Jangan menambahkan efek kotor/robek/menguning pada gambar vinyl.
8. **NO Dummy Lorems di Production:** Semua teks yang belum diisi user harus ditandai eksplisit dengan format `[PLACEHOLDER: ...]` agar mudah ditemukan dan diganti sebelum deploy.

---

## 3. Scroll, 3D Vinyl & Interaction Contract

1. **No Vertical Scroll Hijacking:**
   - Scroll vertikal mouse (`deltaY`) di Section 02 **HARUS** menggulir halaman secara alami ke Section 01 (atas) atau Section 03 (bawah).
   - Geser rak vinyl hanya dipicu oleh: **pointer drag**, **horizontal wheel/trackpad (`deltaX`)**, **tombol panah `←/→`**, **keyboard `ArrowLeft`/`ArrowRight`**, **klik langsung pada vinyl samping**, atau **klik pada Timeline `2023–2026`**.
2. **Section 02 → Section 03 Click Linkage:**
   - Mengklik vinyl aktif di tengah Section 02 (atau menekan `Enter`) **wajib** memperbarui `activeProjectId` dan melakukan *smooth scroll* ke `#project-detail` (Section 03) dengan memicu ulang animasi reveal untuk project tersebut.
3. **Preserve 3D Vinyl Math:**
   - Jangan mengubah rumus inti kurva mangkuk (`F(r)`, `B(r)`, `scl(u)`, `XS` integral, `ws = H·0.022`, `slot = H·0.145`, `d_full = H·1.5`) serta aturan **1-step directional back-face spin (`navDir`)** dari [prompt.md](file:///e:/PORTO/Porto%20serius/prompt.md) tanpa persetujuan eksplisit.
4. **Transparent PNG Shading Rule:**
   - Dilarang memakai `box-shadow` atau pseudo-element kotak hitam pada `.front` dan `.back` vinyl PNG transparan. Selalu gunakan `filter: brightness(...)` (dan `drop-shadow(...)` terbatas hanya untuk vinyl aktif di tengah).

---

## 4. Performance & Accessibility Guardrails

| Metrik / Aturan | Batas Wajib |
|---|---|
| **3D Frame Rate** | Stabil `60fps` — 0 React re-render di dalam loop `requestAnimationFrame` |
| **Off-Screen CPU** | `rAF` 3D Vinyl & Typewriter Hero **WAJIB pause** via `IntersectionObserver` saat di luar viewport |
| **3D Runtime Bloat** | **0 KB** library 3D eksternal (dilarang install `three`, `@react-three/fiber`, `gsap`, `typed.js`) |
| **Image Weight** | Setiap gambar WebP transparan `< 200 KB`; sprite sheet belakang `< 280 KB` |
| **Lighthouse Targets** | Performance `≥ 95`, Accessibility `≥ 95`, Best Practices `≥ 95`, CLS `= 0` |
| **Reduced Motion** | `@media (prefers-reduced-motion: reduce)` mematikan spring, 1-step spin, typewriter delay, dan mask-slide (tampil instan) |
| **Mobile Touch (`≤ 767px`)** | Custom cursor nonaktif pada `pointer: coarse`; drag jari halus dengan `touch-action: pan-y` |

---

## 5. Monorepo & Section-by-Section Development Workflow Rules

1. **Single Source of Truth untuk Data:**
   - Semua copy teks profil wajib disimpan di `apps/web/src/data/profile.ts` dan seluruh data 7 project di `apps/web/src/data/projects.ts`. **Dilarang hardcode** data project langsung di dalam komponen JSX.
2. **Build & Validate 1 Section per Iterasi:**
   - Eksekusi kode dilakukan bertahap dan divalidasi per section bersama user:
     1. Scaffold Monorepo + Rapikan File + Optimasi Aset WebP
     2. Global Frame (Tokens, Fonts, Paper Grain, Minimalist Navbar `antigravity.google` style)
     3. Section 01 — Live-Typing Hero
     4. Section 02 — Curved Slim 3D Vinyl LP Showcase
     5. Section 03 — Active Project Detail Viewer (terhubung dengan klik vinyl Section 02)
     6. Section 04 & 05 — About, Experience, Contact & Footer
     7. Final Polish, Mobile Audit & Performance Verification
3. **Code Hygiene:**
   - TypeScript `strict: true`, nol `any`, nol `console.log` tersisa, dan jalankan `pnpm --filter web build` + cek lint setiap selesai 1 section.
