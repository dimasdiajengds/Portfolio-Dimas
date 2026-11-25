export type ProjectId =
  | 'sebatik'
  | 'skynet'
  | 'psychobot'
  | 'javaskripsi'
  | 'esc'
  | 'loghub'
  | 'grace';

export interface ProjectMockupSlide {
  id: string;
  label: string;
  caption: string;
  /** Optional 16:9 mockup image path (e.g. '/assets/mockups/grace-01.webp') */
  imageSrc?: string;
}

export interface ProjectItem {
  id: ProjectId;
  index: number;
  code: string;
  title: string;
  subtitle: string;
  year: number;
  timelineYear: number;
  theme: string;
  role: string;
  edgeColor: string;
  frontImage: string;
  backCell: readonly [col: number, row: number];
  /** Optional per-project audio track URL (e.g. '/assets/audio/grace.mp3') for the Section 3 turntable */
  audioSrc?: string;
  /** Up to 3 widescreen (16:9) mockup showcase slides displayed beneath the project details */
  mockups: readonly ProjectMockupSlide[];
  synopsis: string;
  challenge: string;
  solution: string;
  highlights: string[];
  techStack: string[];
  demoUrl: string;
  repoUrl: string;
  isPlaceholderData: boolean;
}

export const VINYL_BACKS_SHEET = '/assets/vinyl/vinyl-backs-sheet.webp';

export const PROJECTS: readonly ProjectItem[] = [
  {
    id: 'sebatik',
    index: 0,
    code: 'D! / 01',
    title: 'Sebatik',
    subtitle: 'RUMAH BATIK DIGITAL PLATFORM FOR SALES',
    year: 2024,
    timelineYear: 2024.2,
    theme: 'Mobile Android APP',
    role: 'Backend Engineer & Cloud Architec',
    edgeColor: '#1D140B',
    frontImage: '/assets/vinyl/sebatik.webp',
    backCell: [0, 0],
    mockups: [
      {
        id: 'sebatik-1',
        label: 'MOBILE STOREFRONT & CATALOG',
        caption: '16:9 mockup slot 01 — Batik mobile catalog & regional discovery screens.',
      },
      {
        id: 'sebatik-2',
        label: 'ORDER FLOW & SALES DASHBOARD',
        caption: '16:9 mockup slot 02 — Rumah Batik sales flow & product detail preview.',
      },
      {
        id: 'sebatik-3',
        label: 'CLOUD BACKEND ARCHITECTURE',
        caption: '16:9 mockup slot 03 — API service layout & cloud deployment overview.',
      },
    ],
    synopsis:
      '[PLACEHOLDER] A digital platform and interactive catalog dedicated to preserving, exploring, and showcasing Indonesian Batik motifs and cultural craftsmanship with structured regional taxonomy.',
    challenge:
      '[PLACEHOLDER] Traditional batik documentation is often scattered across static archives, making motif discovery and educational reference difficult for modern audiences.',
    solution:
      '[PLACEHOLDER] Engineered a clean, searchable web catalog featuring curated visual motif breakdowns, responsive filtering, and fast image delivery.',
    highlights: [
      '[PLACEHOLDER] Interactive Batik motif catalog with regional & philosophical metadata',
      '[PLACEHOLDER] Fast search & category filtering built with modular frontend components',
      '[PLACEHOLDER] Responsive editorial layout tailored for mobile & desktop exploration',
    ],
    techStack: ['React', 'JavaScript', 'Tailwind CSS', 'REST API', 'MySQL'],
    demoUrl: '#contact',
    repoUrl: '#contact',
    isPlaceholderData: true,
  },
  {
    id: 'skynet',
    index: 1,
    code: 'D! / 02',
    title: 'Skynet',
    subtitle: 'GENESYS CLOUD CX INTEGRATION',
    year: 2024,
    timelineYear: 2024.7,
    theme: 'Cloud & Cloud Architec',
    role: 'Cloud Engineer for CX Solution',
    edgeColor: '#0A1622',
    frontImage: '/assets/vinyl/skynet.webp',
    backCell: [1, 0],
    mockups: [
      {
        id: 'skynet-1',
        label: 'GENESYS CLOUD CX ROUTING FLOW',
        caption: '16:9 mockup slot 01 — Omnichannel call routing & architect flow overview.',
      },
      {
        id: 'skynet-2',
        label: 'TELEMETRY & AGENT WORKSPACE',
        caption: '16:9 mockup slot 02 — Real-time queue metrics & cloud integration diagram.',
      },
    ],
    synopsis:
      '[PLACEHOLDER] Enterprise omnichannel contact center architecture powered by Genesys Cloud (Solutif / MSIB Kampus Merdeka), integrating real-time telemetry, routing automation, and agent workspace tooling.',
    challenge:
      '[PLACEHOLDER] Coordinating multi-channel customer interactions and real-time queue metrics requires reliable cloud routing flows and low-latency API orchestration.',
    solution:
      '[PLACEHOLDER] Configured Genesys Cloud architect flows, API webhooks, and monitoring utilities to streamline agent routing and customer experience visibility.',
    highlights: [
      '[PLACEHOLDER] Omnichannel routing & IVR flow configuration on Genesys Cloud CX',
      '[PLACEHOLDER] Real-time telemetry & queue analytics integration via Platform API',
      '[PLACEHOLDER] Delivered under MSIB Kampus Merdeka collaboration with Solutif',
    ],
    techStack: ['Genesys Cloud CX', 'Node.js', 'REST API', 'Webhooks', 'Cloud Routing'],
    demoUrl: '#contact',
    repoUrl: '#contact',
    isPlaceholderData: true,
  },
  {
    id: 'psychobot',
    index: 2,
    code: 'D! / 03',
    title: 'Psychobot',
    subtitle: 'AI MENTAL HEALTH COMPANION',
    year: 2025,
    timelineYear: 2025.3,
    theme: 'AI Implementation for detect mental health from sosmed',
    role: 'Web Developer',
    edgeColor: '#151034',
    frontImage: '/assets/vinyl/psychobot.webp',
    backCell: [2, 0],
    mockups: [
      {
        id: 'psychobot-1',
        label: 'SOCIAL SENTIMENT & AI DETECTION',
        caption: '16:9 mockup slot 01 — Mental health detection flow from social media inputs.',
      },
      {
        id: 'psychobot-2',
        label: 'CONVERSATIONAL CHECK-IN UI',
        caption: '16:9 mockup slot 02 — Guided AI dialogue & empathetic prompt interface.',
      },
      {
        id: 'psychobot-3',
        label: 'SCREENING SUMMARY & INSIGHTS',
        caption: '16:9 mockup slot 03 — Structured reflection summary & screening metrics.',
      },
    ],
    synopsis:
      '[PLACEHOLDER] An intelligent conversational assistant designed for psychological screening and empathetic daily check-ins, pairing structured behavioral prompts with calm natural dialogue.',
    challenge:
      '[PLACEHOLDER] Early emotional check-ins often feel clinical or intimidating; users need a calm, structured conversational interface with consistent guidance boundaries.',
    solution:
      '[PLACEHOLDER] Built an AI-assisted dialogue pipeline combining structured assessment prompts, sentiment-aware responses, and a distraction-free chat interface.',
    highlights: [
      '[PLACEHOLDER] Guided conversational check-in flow with structured screening outputs',
      '[PLACEHOLDER] Context-aware AI dialogue designed for calm, readable sessions',
      '[PLACEHOLDER] Lightweight session history & personal reflection summaries',
    ],
    techStack: ['Python', 'NLP / LLM API', 'Next.js', 'TypeScript', 'PostgreSQL'],
    demoUrl: '#contact',
    repoUrl: '#contact',
    isPlaceholderData: true,
  },
  {
    id: 'javaskripsi',
    index: 3,
    code: 'D! / 04',
    title: 'NATASHA',
    subtitle: 'DESKTOP APP MANAGEMENT SYSTEM for KOST',
    year: 2025,
    timelineYear: 2025.6,
    theme: 'Desktop APP for Money Menegement and Risk Solution Rekomendation',
    role: 'FullStack Developer',
    edgeColor: '#262E2F',
    frontImage: '/assets/vinyl/natasha.webp',
    backCell: [3, 0],
    mockups: [
      {
        id: 'natasha-1',
        label: 'KOST MANAGEMENT DESKTOP VIEW',
        caption: '16:9 mockup slot 01 — Room occupancy & tenant management desktop UI.',
      },
      {
        id: 'natasha-2',
        label: 'FINANCIAL & BILLING LEDGER',
        caption: '16:9 mockup slot 02 — Automated billing, cashflow tracking & receipts.',
      },
      {
        id: 'natasha-3',
        label: 'RISK SOLUTION RECOMMENDATION',
        caption: '16:9 mockup slot 03 — Financial risk analysis & recommendation module.',
      },
    ],
    synopsis:
      '[PLACEHOLDER] A comprehensive Java-based academic thesis software engineering project for NATASHA Pondok Kos implementing modular object-oriented architecture, tenant records, billing automation, and analytical reporting.',
    challenge:
      '[PLACEHOLDER] Manual boarding-house bookkeeping leads to billing delays, occupancy tracking errors, and fragmented tenant records across spreadsheets.',
    solution:
      '[PLACEHOLDER] Architected a structured Java application with relational database persistence, room occupancy dashboards, automated payment receipts, and financial summaries.',
    highlights: [
      '[PLACEHOLDER] End-to-end room inventory, tenant onboarding, and monthly billing module',
      '[PLACEHOLDER] Clean object-oriented Java architecture with relational SQL persistence',
      '[PLACEHOLDER] Automated payment status tracking and printable financial reports',
    ],
    techStack: ['Java', 'JDBC / SQL', 'Desktop UI', 'OOP Architecture', 'Jasper / Reports'],
    demoUrl: '#contact',
    repoUrl: '#contact',
    isPlaceholderData: true,
  },
  {
    id: 'esc',
    index: 4,
    code: 'D! / 05',
    title: 'ESC',
    subtitle: 'DESKTOP APP FINANCE for EMPLOYEE',
    year: 2025,
    timelineYear: 2025.9,
    theme: 'Desktop APP for Cashier Integration and Finance Integration',
    role: 'Backend Engineer Desktop APP',
    edgeColor: '#F9F9F9',
    frontImage: '/assets/vinyl/esc.webp',
    backCell: [0, 1],
    mockups: [
      {
        id: 'esc-1',
        label: 'CASHIER & FINANCE INTEGRATION',
        caption: '16:9 mockup slot 01 — POS cashier sync & employee finance desktop views.',
      },
      {
        id: 'esc-2',
        label: 'DAILY SETTLEMENT & REPORTS',
        caption: '16:9 mockup slot 02 — Automated financial ledger & operational summary.',
      },
    ],
    synopsis:
      '[PLACEHOLDER] End-to-end digital storefront and operational ecosystem for Echo Space Coffee, crafted to unite specialty coffee culture with seamless menu exploration, ordering, and daily stock tracking.',
    challenge:
      '[PLACEHOLDER] Translating the tactile calm of a specialty coffee space into a fast digital presence while supporting reliable order and catalog management.',
    solution:
      '[PLACEHOLDER] Designed a sharp, brand-faithful web experience anchored on Echo Space Coffee’s cerulean-and-ink identity paired with responsive catalog & operational tools.',
    highlights: [
      '[PLACEHOLDER] High-contrast minimalist brand storefront tailored to Echo Space Coffee',
      '[PLACEHOLDER] Streamlined digital menu & order workflow optimized for mobile speed',
      '[PLACEHOLDER] Clean back-office product & operational status management',
    ],
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'REST API'],
    demoUrl: '#contact',
    repoUrl: '#contact',
    isPlaceholderData: true,
  },
  {
    id: 'loghub',
    index: 5,
    code: 'D! / 06',
    title: 'LogHub',
    subtitle: 'CENTRALIZED LOGBOOK, JOURNAL HUB, REMINDER APP, AND ATTENDANCE',
    year: 2026,
    timelineYear: 2026.5,
    theme: 'Web APP for Maganghub Participant Logbook & Attendance',
    role: 'System Architect & Fullstack Developer',
    edgeColor: '#F6F7F2',
    frontImage: '/assets/vinyl/loghub.webp',
    backCell: [1, 1],
    mockups: [
      {
        id: 'loghub-1',
        label: 'CENTRALIZED LOGBOOK WORKSPACE',
        caption: '16:9 mockup slot 01 — Daily Maganghub logbook & structured journal UI.',
      },
      {
        id: 'loghub-2',
        label: 'ATTENDANCE & REMINDER SYSTEM',
        caption: '16:9 mockup slot 02 — Daily check-in tracker & automated reminder flow.',
      },
      {
        id: 'loghub-3',
        label: 'ACTIVITY TIMELINE & EXPORT',
        caption: '16:9 mockup slot 03 — Chronological filtering & exportable reports.',
      },
    ],
    synopsis:
      '[PLACEHOLDER] A unified logbook, activity documentation, and operational journaling hub engineered to organize daily records, structured notes, and progress logs into one intuitive workspace.',
    challenge:
      '[PLACEHOLDER] Daily operational logs and project journals quickly become unsearchable when split across chat threads and ad-hoc documents.',
    solution:
      '[PLACEHOLDER] Created a structured digital logbook platform with fast chronological filtering, clean entry authoring, and exportable activity summaries.',
    highlights: [
      '[PLACEHOLDER] Fast structured log authoring with chronological & tag-based search',
      '[PLACEHOLDER] Clean emerald-teal workspace built for zero-friction daily journaling',
      '[PLACEHOLDER] Modular backend ready for team audit trails and report exports',
    ],
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
    demoUrl: '#contact',
    repoUrl: '#contact',
    isPlaceholderData: true,
  },
  {
    id: 'grace',
    index: 6,
    code: 'D! / 07',
    title: 'Grace',
    subtitle: 'GRC (Governance Risk and Compliance) TOOLS FOR IT RISK',
    year: 2026,
    timelineYear: 2026.8,
    theme: 'Website to Managing data Internal IT Risk for XLSMART',
    role: 'System Architec, Full-Stack Developer, DevOps',
    edgeColor: '#0B2545',
    frontImage: '/assets/vinyl/grace.webp',
    backCell: [2, 1],
    mockups: [
      {
        id: 'grace-1',
        label: 'IT RISK MANAGEMENT DASHBOARD',
        caption: '16:9 mockup slot 01 — Internal IT Risk governance overview for XLSMART.',
      },
      {
        id: 'grace-2',
        label: 'GRC COMPLIANCE & ASSESSMENT',
        caption: '16:9 mockup slot 02 — Risk register matrix & mitigation workflow view.',
      },
      {
        id: 'grace-3',
        label: 'AUDIT TRAIL & SYSTEM ANALYTICS',
        caption: '16:9 mockup slot 03 — Role-based reporting & compliance analytics.',
      },
    ],
    synopsis:
      '[PLACEHOLDER] The latest flagship software platform focusing on refined user experience, structured governance workflows, high-reliability orchestration, and minimalist system design.',
    challenge:
      '[PLACEHOLDER] Complex multi-role operational platforms frequently suffer from cluttered dashboards and slow navigation under growing data volumes.',
    solution:
      '[PLACEHOLDER] Built a cohesive, performance-first platform architecture emphasizing clarity, modular role-based flows, and crisp visual hierarchy.',
    highlights: [
      '[PLACEHOLDER] Modular enterprise workspace with role-aware navigation & clarity',
      '[PLACEHOLDER] Strict TypeScript end-to-end data contracts and fast UI transitions',
      '[PLACEHOLDER] Engineered for reliability, maintainability, and scale into 2026+',
    ],
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Cloud Services', 'SQL'],
    demoUrl: '#contact',
    repoUrl: '#contact',
    isPlaceholderData: true,
  },
];

export const INITIAL_PROJECT_INDEX = 6; // Opens on Grace (latest flagship project)
