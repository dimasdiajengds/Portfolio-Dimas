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
  whatIDo: string;
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
    title: 'SEBATIK',
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
      'Sebatik is an Android mobile app that identifies Indonesian batik motifs from photos, explains regional patterns and heritage, displays available stock, and directs users straight to sales.',
    whatIDo:
      'I handled the backend by building a prediction API to serve the Machine Learning model directly to the mobile app. I also developed database API endpoints to fetch and display stored batik catalog data, and designed the cloud compute architecture on Google Cloud Platform (GCP).',
    techStack: ['React', 'JavaScript', 'Tailwind CSS', 'REST API', 'MySQL'],
    demoUrl: '#contact',
    repoUrl: '#contact',
    isPlaceholderData: true,
  },
  {
    id: 'skynet',
    index: 1,
    code: 'D! / 02',
    title: 'SKYNET',
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
      'SKYNET is a customer experience solution built on Genesys Cloud that connects customers directly with CS agents. It enables full CRUD management for customer profiles, payment records, activity logs, and more.',
    whatIDo:
      'I designed the core system architecture framework to ensure smooth implementation on the Genesys Cloud platform. I also handled the technical integration between Genesys Cloud and our custom system services, enabling seamless data exchange and real-time workflows.',
    techStack: ['Genesys Cloud CX', 'Node.js', 'REST API', 'Webhooks', 'Cloud Routing'],
    demoUrl: '#contact',
    repoUrl: '#contact',
    isPlaceholderData: true,
  },
  {
    id: 'psychobot',
    index: 2,
    code: 'D! / 03',
    title: 'PSYCHOBOT',
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
      'Psychobot is a web-based system designed to identify signs of social media addiction by analyzing users behavioral patterns across the social media apps they actively use, helping raise mental health awareness.',
    whatIDo:
      'I integrated the Gemini LLM into the Psychobot website by implementing a clean, configurable API key placeholder for flexible and secure setup. On the frontend, I also wrote custom design scripts to style the website border lines, giving the interface a polished, structured look.',
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
      'NATASHA is a desktop app for womens boarding houses that manages finances, generates reports, recommends maintenance decisions from cash flow, tracks tenant records, and simplifies monthly transfer notifications.',
    whatIDo:
      'I built the entire application independently from end to end, owning every stage of the product lifecycle. This included system design, UI creation, development, operational management logic, and final deployment to deliver a complete, ready-to-use desktop solution.',
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
      'ESC is a desktop app for Echo Space Coffee Shop that streamlines daily cash flow management, generates monthly financial reports, and supports decision-making to identify the best-performing employee across key criteria.',
    whatIDo:
      'I designed the complete visual experience from initial mockups and styling to interactive animations. I also built key frontend features like PDF report generation and integrated backend API endpoints to power the desktop app with live data.',
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
      'LogHub is an all-in-one web app built for MagangHub interns to streamline daily logbooks, attendance tracking, activity recaps, report generation, schedule calendars, and automated email notifications.',
    whatIDo:
      'I developed the user interface, architected the web deployment setup, and designed the payment system. I also integrated payment features, email alerts, and deployment workflows, while migrating the backend to Golang for stronger performance.',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
    demoUrl: '#contact',
    repoUrl: '#contact',
    isPlaceholderData: true,
  },
  {
    id: 'grace',
    index: 6,
    code: 'D! / 07',
    title: 'GRACE',
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
      'GRACE is an internal web platform for XLSMART IT Risk team under IT Security. It manages GRC data, monitors Risk and KRI metrics, produces reports and summaries, and uses XLSMART local LLM for AI support.',
    whatIDo:
      'I built interactive UI and dashboards featuring matrix views, Sankey diagrams, and report lists, and integrated backend APIs alongside XLSMART local AI. I also handled internal server deployment, monitored performance, and developed custom features and menus for IT Security.',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Cloud Services', 'SQL'],
    demoUrl: '#contact',
    repoUrl: '#contact',
    isPlaceholderData: true,
  },
];

export const INITIAL_PROJECT_INDEX = 6; // Opens on Grace (latest flagship project)
