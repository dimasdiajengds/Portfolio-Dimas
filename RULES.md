# Engineering, Design System & Anti-AI-Slop Rules (`RULES.md`)

Dokumen ini adalah **aturan mengikat (*guardrails*)** untuk setiap tahap pengembangan kode, baik oleh manusia maupun saat melakukan *prompting* ke AI, agar seluruh section tetap konsisten, ringan, dan bebas dari pola desain generik (*AI slop*).

---

## 1. Locked Design System Tokens (Tema Utama Hitam Putih + Aksen Biru Minimal)

Seluruh section (Navbar, Hero, 3D Vinyl Showcase, Project Detail, About, Contact) **WAJIB** menggunakan token global berikut tanpa pengecualian:

```css
:root {
  --paper: #FFFFFF;               /* Background utama putih bersih */
  --sheet: #F6F6F6;               /* Surface sekunder abu-abu netral sangat lembut */
  --ink: #0A0A0A;                 /* Teks utama, tombol primer, judul, dan garis tegas */
  --muted: #666666;               /* Teks sekunder, metadata, keterangan */
  --cobalt: #1F3FB0;              /* Aksen minimal: caret ketik, dot timeline aktif, dan hover state */
  --rule: rgba(10, 10, 10, 0.9);  /* Garis tegas 1px untuk .box & divider */
  --hairline: rgba(10, 10, 10, 0.1); /* Garis pemisah section / navbar */
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  --ease-sheet: cubic-bezier(0.76, 0, 0.18, 1);
}
```

### Typography Rules
- **Single-Font System (Semua Teks & UI):** `"Inter Tight", system-ui, sans-serif` (variable weights `400`, `500`, `600`, `700`, `800`) untuk seluruh display headline, subheadline, body copy, sinopsis, label, navigasi, dan footer.
  - `.lbl`: `600`, `10.5px`, `line-height: 1`, `letter-spacing: 0.14em`, `text-transform: uppercase`.
- **Dilarang menambahkan font keluarga lain** (tidak ada `Newsreader`, serif dekoratif, Poppins, Roboto, Montserrat, atau font monospace yang tidak perlu, seluruh proyek konsisten menggunakan `Inter Tight`).
- **Tanpa teks Jepang / Kanji** di seluruh UI (sesuai keputusan final desain).

### Layout & Spacing Rules
- Padding horizontal global terkunci: **`48px` (`px-12`) / `36px` (desktop)** dan **`20px` / `16px` (mobile `<= 767px`)**.
- **Paper Grain Overlay:** 1 layer SVG `feTurbulence` global pada halaman (`pointer-events: none`, `mix-blend-mode: multiply`, `opacity: 0.55`). Tidak boleh menumpuk grain berulang di dalam komponen anak.

---

## 2. Strict Anti-AI-Slop Rules (Daftar Larangan Keras)

Setiap komponen baru yang dibuat AI **WAJIB lolos pemeriksaan berikut**:

1. **NO Neon / Purple-Blue Gradients:** Dilarang keras memakai gradient ungu-biru, glowing blob di background, atau teks gradient pelangi.
2. **NO Overuse of Blue (`--cobalt`):** Tema utama wajib **Hitam Putih** (`#FFFFFF` & `#0A0A0A`). Warna biru (`--cobalt`) hanya boleh dipakai sangat minim sebagai aksen (misalnya typing caret, dot timeline aktif, atau hover state), **bukan** sebagai warna dominan judul, tombol, atau footer.
3. **NO Em-Dash (`U+2014` / Strip Panjang):** Dilarang keras menggunakan karakter strip panjang (em-dash) di seluruh UI, copywriting, judul, kode project, maupun metadata karena menjadi ciri khas AI slop. Gunakan tanda hubung standar (`-`), slash (`/`), koma, atau pemisah visual bersih sebagai gantinya.
4. **NO Glassmorphism Murahan:** Dilarang memakai kartu transparan `backdrop-filter: blur(20px)` dengan border mengkilap. Navbar boleh memakai latar solid/semi-solid putih bersih (`bg-white/95`) dengan *hairline border* tipis `1px` saat di-scroll.
5. **NO Generic Bento / SaaS Card Grids:** Untuk Section About, Experience, & Capabilities, gunakan tipografi bersih, garis horizontal tipis `1px`, dan ruang kosong (*whitespace*), **bukan** kumpulan kotak `rounded-2xl shadow-lg` generik.
6. **NO Skill Progress Bars / Percentage Badges:** Dilarang menampilkan *"React 90%"*, *"Java 85%"*, atau deretan badge pil warna-warni.
7. **NO Emoji sebagai Ikon UI:** Gunakan hanya karakter tipografi bersih (`→`, `←`, `↑`, `↗`, `/`, `-`) atau SVG *single-stroke* tipis (`stroke-width: 1.2px-1.5px`).
8. **NO Cheap Opacity-Only Fades:** Semua transisi masuk/keluar teks & konten mengikuti bahasa gerak asli website: **mask slide (`translateY` di dalam `overflow: hidden`)**, **`clip-path`**, atau **`scale`** dengan `--ease`.
9. **NO Vintage / Distressed Wear pada Vinyl:** Semua aset vinyl adalah edisi modern yang bersih & tajam (*matte-laminated*). Jangan menambahkan efek kotor/robek/menguning pada gambar vinyl.
10. **NO Dummy Lorems di Production:** Semua teks yang belum diisi user harus ditandai eksplisit dengan format `[PLACEHOLDER: ...]` agar mudah ditemukan dan diganti sebelum deploy.

---

## 3. Scroll, 3D Vinyl & Interaction Contract

1. **No Vertical Scroll Hijacking:**
   - Scroll vertikal mouse (`deltaY`) di Section 02 **HARUS** menggulir halaman secara alami ke Section 01 (atas) atau Section 03 (bawah).
   - Geser rak vinyl hanya dipicu oleh: **pointer drag**, **horizontal wheel/trackpad (`deltaX`)**, **tombol panah `←/→`**, **keyboard `ArrowLeft`/`ArrowRight`**, **klik langsung pada vinyl samping**, atau **klik pada Timeline `2023-2026`**.
2. **Section 02 -> Section 03 Click Linkage:**
   - Mengklik vinyl aktif di tengah Section 02 (atau menekan `Enter`) **wajib** memperbarui `activeProjectId` dan melakukan *smooth scroll* ke `#project-detail` (Section 03) dengan memicu ulang animasi reveal untuk project tersebut.
3. **Preserve 3D Vinyl Math:**
   - Jangan mengubah rumus inti kurva mangkuk (`F(r)`, `B(r)`, `scl(u)`, `XS` integral, `ws = H*0.022`, `slot = H*0.145`, `d_full = H*1.5`) serta aturan **1-step directional back-face spin (`navDir`)** dari [prompt-vinyl-3d.md](file:///e:/PORTO/Porto%20serius/docs/prompts/prompt-vinyl-3d.md) tanpa persetujuan eksplisit.
4. **Transparent PNG Shading Rule:**
   - Dilarang memakai `box-shadow` atau pseudo-element kotak hitam pada `.front` dan `.back` vinyl PNG transparan. Selalu gunakan `filter: brightness(...)` (dan `drop-shadow(...)` terbatas hanya untuk vinyl aktif di tengah).

---

## 4. Performance & Accessibility Guardrails

| Metrik / Aturan | Batas Wajib |
|---|---|
| **3D Frame Rate** | Stabil `60fps` dengan 0 React re-render di dalam loop `requestAnimationFrame` |
| **Off-Screen CPU** | `rAF` 3D Vinyl & Typewriter Hero **WAJIB pause** via `IntersectionObserver` saat di luar viewport |
| **3D Runtime Bloat** | **0 KB** library 3D eksternal (dilarang install `three`, `@react-three/fiber`, `gsap`, `typed.js`) |
| **Image Weight** | Setiap gambar WebP transparan `< 200 KB`; sprite sheet belakang `< 280 KB` |
| **Lighthouse Targets** | Performance `>= 95`, Accessibility `>= 95`, Best Practices `>= 95`, CLS `= 0` |
| **Reduced Motion** | `@media (prefers-reduced-motion: reduce)` mematikan spring, 1-step spin, typewriter delay, dan mask-slide (tampil instan) |
| **Mobile Touch (`<= 767px`)** | Custom cursor nonaktif pada `pointer: coarse`; drag jari halus dengan `touch-action: pan-y` |

---

## 5. Monorepo & Section-by-Section Development Workflow Rules

1. **Single Source of Truth untuk Data:**
   - Semua copy teks profil wajib disimpan di `apps/web/src/data/profile.ts` dan seluruh data 7 project di `apps/web/src/data/projects.ts`. **Dilarang hardcode** data project langsung di dalam komponen JSX.
2. **Build & Validate 1 Section per Iterasi:**
   - Eksekusi kode dilakukan bertahap dan divalidasi per section bersama user:
     1. Scaffold Monorepo + Rapikan File + Optimasi Aset WebP
     2. Global Frame (Tokens, Fonts, Paper Grain, Minimalist Navbar 3-link)
     3. Section 01: Live-Typing Hero
     4. Section 02: Curved Slim 3D Vinyl LP Showcase
     5. Section 03: Active Project Detail Viewer (terhubung dengan klik vinyl Section 02)
     6. Section 04 & 05: About, Experience, Contact & Footer
     7. Final Polish, Mobile Audit & Performance Verification
3. **Code Hygiene:**
   - TypeScript `strict: true`, nol `any`, nol `console.log` tersisa, dan jalankan `tsc --noEmit` setiap selesai perubahan.
