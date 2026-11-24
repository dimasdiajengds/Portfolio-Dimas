# Dimas Di Ajeng Duwi Saputra - Portfolio

Personal portfolio website built with a minimalist editorial aesthetic, live-typing hero, and an interactive **Curved Slim 3D Vinyl LP Showcase** running at 60fps.

## Highlights

- **Live-Typing Hero (`#hero`)** - Zero-dependency typewriter opening with mask-slide reveals and `prefers-reduced-motion` support.
- **Curved Slim 3D Vinyl LP Showcase (`#projects`)** - Interactive 3D vinyl shelf featuring 7 flagship projects (2023–2026) with dual-sided artwork, directional flip animation, drag/keyboard/timeline navigation, and natural vertical scroll pass-through.
- **Linked Case Study Viewer (`#project-detail`)** - Selecting any vinyl opens its full project breakdown with smooth scrolling and SVG ink-bleed artwork reveal.
- **Design System** - Warm paper palette (`#ECE8E0`), cobalt accents (`#1F3FB0`), unified self-hosted `Inter Tight` typography, and subtle paper grain texture.

## Featured Projects

| Year | Project | Description |
| --- | --- | --- |
| 2023 | **Sebatik** | Digital platform & catalog for Indonesian Batik |
| 2023 | **Skynet - Genesys Cloud** | Genesys Cloud CX integration |
| 2024 | **Psychobot** | Conversational AI assistant for psychological screening |
| 2024 | **NATASHA** | Boarding house management system (Java Thesis Project) |
| 2025 | **ESC - Echo Space Coffee** | Web storefront & operational ecosystem |
| 2025 | **LogHub** | Centralized logbook & activity documentation hub |
| 2026 | **Grace** | Modern workflow & management platform |

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **UI Library:** [React 19](https://react.dev/)
- **Language:** [TypeScript 5.8](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + Dedicated CSS Modules (`VinylShelf.module.css`)
- **Monorepo:** [pnpm workspaces](https://pnpm.io/workspaces)

## Monorepo Structure

```text
.
├── apps/
│   └── web/              # Main Next.js App Router application
├── packages/             # Shared workspace packages (reserved)
├── docs/                 # Prompts and brainstorming notes
├── assets-raw/           # Source logos, templates, and raw vinyl renders
├── PRD.md                # Product Requirements Document
├── ARCHITECTURE.md       # Technical Architecture & Monorepo Blueprint
├── RULES.md              # Design System & Coding Rules
├── package.json          # Root monorepo scripts
└── pnpm-workspace.yaml   # Workspace configuration
```

## Getting Started

### Prerequisites

- **Node.js** >= 20
- **pnpm** 10.x (`corepack enable` or `npm install -g pnpm`)

### Installation & Development

```bash
# Install dependencies
pnpm install

# Start development server (Next.js + Turbopack)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the site.

### Available Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Run the web app in development mode |
| `pnpm build` | Build the web app for production |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint across the web app |
| `pnpm typecheck` | Run TypeScript type checking (`tsc --noEmit`) |

## Documentation

- [PRD.md](./PRD.md) - Product vision, section specifications, and project data
- [ARCHITECTURE.md](./ARCHITECTURE.md) - State flow, 3D math, and directory architecture
- [RULES.md](./RULES.md) - Design tokens and engineering guidelines
