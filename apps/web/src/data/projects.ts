export type ProjectId =
  | 'sebatik'
  | 'skynet'
  | 'psychobot'
  | 'javaskripsi'
  | 'esc'
  | 'loghub'
  | 'grace';

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
    code: 'D! — 01',
    title: 'Sebatik',
    subtitle: 'INDONESIAN BATIK DIGITAL PLATFORM',
    year: 2023,
    timelineYear: 2023.0,
    theme: 'Heritage & Web App',
    role: 'Full-Stack Developer',
    edgeColor: '#1D140B',
    frontImage: '/assets/vinyl/sebatik.webp',
    backCell: [0, 0],
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
    code: 'D! — 02',
    title: 'Skynet - Genesys Cloud',
    subtitle: 'GENESYS CLOUD CX INTEGRATION',
    year: 2023,
    timelineYear: 2023.5,
    theme: 'Cloud & Contact Center',
    role: 'Cloud Engineer (MSIB · Solutif)',
    edgeColor: '#0A1622',
    frontImage: '/assets/vinyl/skynet.webp',
    backCell: [1, 0],
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
    code: 'D! — 03',
    title: 'Psychobot',
    subtitle: 'AI MENTAL HEALTH COMPANION',
    year: 2024,
    timelineYear: 2024.0,
    theme: 'AI & Conversational',
    role: 'AI & Application Developer',
    edgeColor: '#151034',
    frontImage: '/assets/vinyl/psychobot.webp',
    backCell: [2, 0],
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
    code: 'D! — 04',
    title: 'NATASHA',
    subtitle: 'PONDOK KOS MANAGEMENT SYSTEM',
    year: 2024,
    timelineYear: 2024.5,
    theme: 'Desktop & Core Java',
    role: 'Lead Author (Academic Thesis)',
    edgeColor: '#262E2F',
    frontImage: '/assets/vinyl/natasha.webp',
    backCell: [3, 0],
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
    code: 'D! — 05',
    title: 'ESC - Echo Space Coffee',
    subtitle: 'COFFEE SHOP POS & BRAND EXPERIENCE',
    year: 2025,
    timelineYear: 2025.0,
    theme: 'Hospitality & Web App',
    role: 'Full-Stack Developer',
    edgeColor: '#F9F9F9',
    frontImage: '/assets/vinyl/esc.webp',
    backCell: [0, 1],
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
    code: 'D! — 06',
    title: 'LogHub',
    subtitle: 'CENTRALIZED LOGBOOK & JOURNAL HUB',
    year: 2025,
    timelineYear: 2025.5,
    theme: 'Productivity & Logging',
    role: 'System Architect & Developer',
    edgeColor: '#F6F7F2',
    frontImage: '/assets/vinyl/loghub.webp',
    backCell: [1, 1],
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
    code: 'D! — 07',
    title: 'Grace',
    subtitle: 'MODERN ENTERPRISE WORKSPACE',
    year: 2026,
    timelineYear: 2026.0,
    theme: 'Flagship Platform',
    role: 'Full-Stack Developer',
    edgeColor: '#0B2545',
    frontImage: '/assets/vinyl/grace.webp',
    backCell: [2, 1],
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

export const INITIAL_PROJECT_INDEX = 3; // Opens on NATASHA (center of 7 projects)
