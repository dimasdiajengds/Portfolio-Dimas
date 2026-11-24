# Product Requirements Document (PRD) — Portfolio Dimas Di Ajeng Duwi Saputra

> **Status:** `Draft — Ready for Section-by-Section Validation`  
> **Owner:** Dimas Di Ajeng Duwi Saputra  
> **Scope:** Foundation Website (Phase 1 — Core Portfolio Monorepo)  
> **Design Philosophy:** Minimalist editorial warmth (`--paper: #ECE8E0`, `--cobalt: #1F3FB0`), tactile 3D physical craft, ultra-fast 60fps performance, **strictly Anti-AI-Slop**.

---

## 1. Product Vision & Goals

### 1.1 Vision
Membangun website portfolio pribadi untuk **Dimas Di Ajeng Duwi Saputra** yang menonjol secara visual melalui perpaduan:
- Kesederhanaan dan ketenangan tipografi bergaya [`antigravity.google`](https://antigravity.google/) pada **Global Navbar** dan **Live-Typing Hero**.
- Interaksi katalog karya yang unik dan berkarakter melalui **Curved Slim 3D Vinyl LP Showcase** (7 project utama dalam format piringan vinyl modern ramping 2 sisi).
- Keterbacaan studi kasus (*case study*) yang lugas, cepat diakses, dan terintegrasi langsung di alur halaman.

### 1.2 Target Audience
- Tech Recruiters & Engineering Managers
- Technical Leads & Product Designers
- Klien potensial untuk proyek pengembangan software / full-stack / cloud

### 1.3 Core Success Criteria
- Pengunjung memahami siapa Dimas Saputra dalam `< 3 detik` di Hero.
- Pengunjung dapat menjelajahi 7 project secara interaktif di rak 3D Vinyl pada `60fps` stabil tanpa rasa berat/macet saat scroll.
- Klik pada vinyl di Section 2 langsung membuka detail lengkap project tersebut di Section 3 secara mulus.

---

## 2. Section-by-Section Specification & Validation Checklist

> **Cara Validasi:** Anda dapat mengisi semua bagian bertanda `[PLACEHOLDER: ...]` dan mencentang status `[x] Validated` per section sebelum kita masuk ke tahap coding.

---

### Global Frame — Minimalist Navbar (`antigravity.google` Reference)
- **Status Validasi:** `[ ] Draft` | `[ ] Validated`
- **Referensi Gaya:** Minimalis, lapang, dan bersih seperti [`antigravity.google`](https://antigravity.google/), diadaptasi penuh ke warna dasar warm paper (`--paper: #ECE8E0`) & `--cobalt` (`#1F3FB0`).
- **Perilaku:**
  - *Fixed top* (`68px` desktop, `60px` mobile), padding tepi `36px` desktop / `16px` mobile.
  - Transparan bersih saat di puncak halaman (`scrollY === 0`); muncul *hairline border* `1px solid rgba(20,20,20,0.08)` dan latar `--paper/92` saat user scroll ke bawah.
  - Indikator section aktif halus (underline tipis atau warna `--cobalt`).
- **Elemen & Placeholder:**
  - **Kiri (Brand):** `[PLACEHOLDER_BRAND_MARK: Boxed "D!"]` + `[PLACEHOLDER_BRAND_NAME: DIMAS SAPUTRA]`
  - **Tengah / Kanan (Nav Links):** `Overview` (`#hero`) · `Projects` (`#projects`) · `Details` (`#project-detail`) · `About` (`#about`) · `Contact` (`#contact`)
  - **Ujung Kanan (Primary CTA):** `[PLACEHOLDER_NAV_CTA_LABEL: Download CV / Let's Talk]` → `[PLACEHOLDER_NAV_CTA_HREF: #contact atau /cv.pdf]`
  - **Mobile (`≤ 767px`):** Nav links disembunyikan ke dalam menu drawer minimal yang dipicu tombol burger `2 garis` (`26 × 12px`).

---

### Section 01 — Landing Page / Hero (`#hero` — Live-Typing Opening)
- **Status Validasi:** `[ ] Draft` | `[ ] Validated`
- **Referensi Gaya:** Terinspirasi langsung dari *opening* [`antigravity.google`](https://antigravity.google/) di mana saat pengunjung baru sampai, headline utama langsung **mengetik otomatis karakter-per-karakter** dengan kursor garis vertikal berkedip warna `--cobalt`, di atas kanvas *warm paper* yang lapang.
- **Perilaku Animasi:**
  - Zero library eksternal (custom lightweight typewriter hook).
  - Saat animasi ketik selesai (atau bergantian antar frasa singkat), sub-headline dan tombol CTA muncul lewat *mask slide* (`translateY(105%) → 0`, tanpa opacity-fade murahan).
  - Otomatis berhenti jika user scroll keluar dari Hero (`IntersectionObserver`) dan langsung tampil penuh pada mode `prefers-reduced-motion`.
- **Konten Placeholder:**
  - `[HERO_EYEBROW]`: `"DIMAS DI AJENG DUWI SAPUTRA — PORTFOLIO"` *(ubah sesuai title utama Anda, misal Software Engineer / Full-Stack Developer)*
  - `[HERO_STATIC_PREFIX]`: `"[PLACEHOLDER: misal 'Building' atau 'Engineering']"`
  - `[HERO_TYPING_PHRASES]`:
    1. `"[PLACEHOLDER_PHRASE_1: misal 'clean digital systems with purpose.']"`
    2. `"[PLACEHOLDER_PHRASE_2: misal 'scalable cloud & web applications.']"`
    3. `"[PLACEHOLDER_PHRASE_3: misal 'thoughtful interfaces that last.']"`
  - `[HERO_SUBHEADLINE]`: `"[PLACEHOLDER: 1–2 kalimat singkat bergaya Inter Tight, max 54 karakter per baris, menjelaskan fokus keahlian Anda.]"`
  - `[HERO_PRIMARY_CTA]`: `"Explore Vinyl Projects ↓"` (smooth scroll ke `#projects`)
  - `[HERO_SECONDARY_CTA]`: `"[PLACEHOLDER: Contact Me / View Resume]"`
  - `[HERO_BOTTOM_LEFT_META]`: `"[PLACEHOLDER_LOCATION: Indonesia] — [PLACEHOLDER_STATUS: Open to Opportunities]"`
  - `[HERO_BOTTOM_RIGHT_CUE]`: `"SCROLL TO EXPLORE"`

---

### Section 02 — Project Showcase: Curved Slim 3D Vinyl LP (`#projects`)
- **Status Validasi:** `[ ] Draft` | `[ ] Validated`
- **Spesifikasi Visual & 3D Penuh:** Mengikuti 100% spesifikasi detail di [prompt.md](file:///e:/PORTO/Porto%20serius/prompt.md):
  - **Objek 3D:** 7 Vinyl LP modern, bersih, ramping & pipih (`ws = H·0.022`, ~5–8px), bukan gaya usang/vintage, berdiri melengkung membentuk mangkuk (`bowl arc`) dengan ~11 item ramping terlihat di kiri & kanan.
  - **2 Sisi Presisi:** Sisi depan (`.front`) dari 7 PNG transparan di `Souce/Jadi/PNG/Compress/`, sisi belakang (`.back`) dipotong langsung dari 1 sprite sheet `4 × 2` (`vinyl-backs-sheet.png`), plus sisi pinggir tipis (`.edge`) sesuai warna HEX tiap jaket.
  - **Animasi Putar 1 Langkah (`navDir`):** Hanya vinyl yang **tinggal 1 langkah lagi menuju tengah** (dari arah kiri maupun kanan sesuai arah geser) yang memutar 3D melewati `±180°` sehingga tampilan belakang polosnya terlihat sekilas sebelum berhenti menghadap depan (`0°`).
  - **Background & Chrome:** Teks vertikal halftone `PORT` (kiri) & `FOLIO` (kanan), bayangan lantai lembut, caption *mask-slide* di bawah vinyl, panah `← / →`, dan timeline `2023–2026` dengan dot `--cobalt`.
- **Kontrak Interaksi Penting (Scroll & Click):**
  1. **Vertical Scroll (`deltaY`):** Scroll mouse ke bawah secara alami **langsung melanjutkan halaman ke Section 03** (tidak mengunci atau menghambat scroll user).
  2. **Horizontal Vinyl Browsing:** Drag mouse/touch pada rak, klik piringan di kiri/kanan, tombol panah `← / →`, tombol keyboard `← / →`, klik pada timeline `2023–2026`, atau horizontal trackpad (`deltaX`).
  3. **Click Active Vinyl (atau tombol Play / Enter):** Mengatur `activeProjectId` ke project vinyl yang sedang aktif dan **langsung membuka / menggulir mulus ke isi lengkap project tersebut di Section 03 (`#project-detail`)**!

---

### Section 03 — Active Project Detail / Case Study Viewer (`#project-detail`)
- **Status Validasi:** `[ ] Draft` | `[ ] Validated`
- **Fungsi Utama:**
  - Menampilkan **isi lengkap dari project yang sedang dipilih/diklik di Section 02 (Vinyl Showcase)**.
  - Saat user mengklik vinyl di Section 02, Section 03 langsung menyegarkan isinya (transisi teks *mask-slide* + visual artwork muncul dengan efek *ink-bleed* atau *clip-path* mulus) dan halaman otomatis smooth-scroll menyorot Section 03.
  - Jika user sekadar scroll ke bawah dari Section 02 tanpa mengklik, Section 03 tetap menampilkan detail dari vinyl yang terakhir aktif di tengah rak (default: `NATASHA` atau project pertama), lengkap dengan navigasi cepat `Prev Project / Next Project` serta tombol `↑ Back to Vinyl Shelf`.
- **Struktur Layout Section 03 (2 Kolom Editorial di atas `--sheet: #F3F0EA`):**
  - **Header Bar Section:** Index project (`D! — 01 / 07`), tombol `↑ Back to Shelf`, dan switcher cepat `← Prev / Next →`.
  - **Kolom Kiri (Naratif & Teknis):**
    - Subtitle / Stack tag (`.lbl` cobalt)
    - Judul Project besar (`Inter Tight 600`)
    - Meta line: `YEAR / CATEGORY / ROLE`
    - **Overview / Sinopsis** (`Inter Tight 400`, `17–18px/1.6`)
    - **Key Highlights / Challenge & Solution** (2–3 poin ringkas)
    - **Tech Stack** (daftar teks terstruktur dengan garis tipis, bukan pil warna-warni)
    - **Action Buttons:** `Live Demo ↗` (jika ada) & `Source Code / Repo ↗` (jika ada)
  - **Kolom Kanan (Visual Showcase):**
    - Tampilan besar artwork vinyl project (dengan efek reveal *ink-bleed* SVG saat berganti) + slot opsional `[PLACEHOLDER_SCREENSHOTS: 1–3 gambar UI asli project]`.

#### Tabel Validasi Data 7 Project (Isi Placeholder untuk Section 02 & Section 03)

| # | ID | Judul | Tahun | Role | Deskripsi Singkat (`[PLACEHOLDER]` — silakan revisi) | Tech Stack (`[PLACEHOLDER]`) | Link Demo / Repo (`[PLACEHOLDER]`) |
|---|---|---|---|---|---|---|---|
| 0 | `sebatik` | **Sebatik** | `2023` | `[PLACEHOLDER: Role]` | `[PLACEHOLDER: Platform digital / katalog Batik Indonesia...]` | `[PLACEHOLDER: misal React, Laravel, MySQL]` | `[PLACEHOLDER_URL]` |
| 1 | `skynet` | **Skynet - Genesys Cloud** | `2023` | `[PLACEHOLDER: Role]` | `[PLACEHOLDER: Integrasi Genesys Cloud CX (Solutif / MSIB)...]` | `[PLACEHOLDER: Genesys Cloud, Node.js, REST API]` | `[PLACEHOLDER_URL]` |
| 2 | `psychobot` | **Psychobot** | `2024` | `[PLACEHOLDER: Role]` | `[PLACEHOLDER: Asisten AI percakapan untuk screening psikologi...]` | `[PLACEHOLDER: Python, LLM/NLP, Next.js]` | `[PLACEHOLDER_URL]` |
| 3 | `javaskripsi` | **NATASHA** | `2024` | `[PLACEHOLDER: Role]` | `[PLACEHOLDER: Sistem manajemen NATASHA Pondok Kos (Skripsi Java)...]` | `[PLACEHOLDER: Java, Swing/Spring, MySQL]` | `[PLACEHOLDER_URL]` |
| 4 | `esc` | **ESC - Echo Space Coffee** | `2025` | `[PLACEHOLDER: Role]` | `[PLACEHOLDER: Web storefront & ekosistem operasional Echo Space Coffee...]` | `[PLACEHOLDER: Next.js, TypeScript, Tailwind]` | `[PLACEHOLDER_URL]` |
| 5 | `loghub` | **LogHub** | `2025` | `[PLACEHOLDER: Role]` | `[PLACEHOLDER: Hub pencatatan logbook & dokumentasi aktivitas terpusat...]` | `[PLACEHOLDER: Next.js, PostgreSQL, Prisma]` | `[PLACEHOLDER_URL]` |
| 6 | `grace` | **Grace** | `2026` | `[PLACEHOLDER: Role]` | `[PLACEHOLDER: Platform flagship modern untuk workflow & manajemen...]` | `[PLACEHOLDER: Next.js, TypeScript, Cloud]` | `[PLACEHOLDER_URL]` |

---

### Section 04 — About, Experience & Capabilities (`#about`)
- **Status Validasi:** `[ ] Draft` | `[ ] Validated`
- **Gaya Layout:** Grid editorial asimetris `4 : 8` dengan garis tipis `1px --rule`, tanpa kartu kotak generik dan tanpa progress bar persentase skill.
- **Konten Placeholder:**
  - `[ABOUT_SECTION_LABEL]`: `"04 — ABOUT & EXPERIENCE"`
  - `[ABOUT_HEADLINE]`: `"[PLACEHOLDER: 1 kalimat prinsip kerja Anda dalam membangun software]"`
  - `[ABOUT_BIO_PARAGRAPH_1]`: `"[PLACEHOLDER: Latar belakang pendidikan / perjalanan sebagai developer]"`
  - `[ABOUT_BIO_PARAGRAPH_2]`: `"[PLACEHOLDER: Fokus minat saat ini — desain antarmuka, arsitektur web, cloud/AI]"`
  - `[EXPERIENCE_TIMELINE]`:
    - `[YEAR] — [ROLE] @ [ORGANIZATION] — [1 kalimat dampak/tanggung jawab]` *(contoh: MSIB Solutif — Genesys Cloud, Proyek Kampus/Freelance, dll.)*
    - `[YEAR] — [ROLE] @ [ORGANIZATION] — [1 kalimat dampak/tanggung jawab]`
  - `[CAPABILITIES_LIST]` (Teks rapi dalam 3 kolom tipis):
    - **Frontend & UI:** `[PLACEHOLDER: Next.js, React, TypeScript, Tailwind CSS, CSS 3D]`
    - **Backend & Data:** `[PLACEHOLDER: Java, Node.js, REST API, SQL / PostgreSQL]`
    - **Cloud & Ecosystem:** `[PLACEHOLDER: Genesys Cloud, Git, Docker, AI Integration]`

---

### Section 05 — Contact & Footer (`#contact`)
- **Status Validasi:** `[ ] Draft` | `[ ] Validated`
- **Gaya Layout:** Minimalis penuh ruang kosong (*generous whitespace*), fokus pada 1 aksi kontak utama yang langsung bekerja.
- **Konten Placeholder:**
  - `[CONTACT_EYEBROW]`: `"05 — CONTACT"`
  - `[CONTACT_HEADLINE]`: `"[PLACEHOLDER: Let's build something thoughtful together.]"`
  - `[CONTACT_EMAIL]`: `"[PLACEHOLDER: nama@email.com]"` *(Interaksi: klik langsung copy ke clipboard + feedback mask-slide `"COPIED"`)*
  - `[SOCIAL_LINKS]`:
    - GitHub: `[PLACEHOLDER_GITHUB_URL]`
    - LinkedIn: `[PLACEHOLDER_LINKEDIN_URL]`
    - Instagram: `[PLACEHOLDER_INSTAGRAM_URL]`
  - **Footer Bar:** Kiri `"© 2026 DIMAS DI AJENG DUWI SAPUTRA. ALL RIGHTS RESERVED."` | Kanan `"GH / LI / IG"` + tombol `"BACK TO TOP ↑"`.

---

## 3. Roadmap Phase 2 (Post-Foundation — Di Luar Scope Awal)

Sesuai arahan untuk fokus membangun fondasi website utama terlebih dahulu, fitur berikut **sengaja dipisahkan untuk Phase 2** (route dan struktur monorepo tetap disiapkan agar tinggal pasang nanti):
- `[ ]` **Certifications Page / Drawer** (`/certifications`): Katalog sertifikasi (MSIB, Genesys Cloud, dsb.) dengan verifikasi kredensial.
- `[ ]` **Journal / Writing** (`/journal`): Artikel teknis & catatan desain berbasis MDX.
- `[ ]` **Optional Audio Preview / Turntable Sound Toggle** pada Section Vinyl Showcase.
