export const PROFILE = {
  fullName: 'Dimas Di Ajeng Duwi Saputra',
  shortName: 'DIMAS SAPUTRA',
  brandMark: 'D!',
  eyebrow: 'DIMAS DI AJENG DUWI SAPUTRA / SOFTWARE ENGINEER',
  location: 'Indonesia',
  availability: 'Available for Select Projects',
  hero: {
    staticPrefix: 'Engineering',
    typingPhrases: [
      'clean digital systems with purpose.',
      'fast interfaces that feel physical.',
      'reliable web & cloud architectures.',
    ],
    primaryCta: {
      label: 'Explore Projects',
      href: '#projects',
    },
    secondaryCta: {
      label: 'Get in Touch',
      href: '#contact',
    },
  },
  navLinks: [
    { label: 'Project', href: '#projects', id: 'projects' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ],
  navCta: {
    label: "Let's Talk",
    href: '#contact',
  },
  about: {
    sectionLabel: '04 / ABOUT & EXPERIENCE',
    headline:
      'Building software that balances architectural clarity with tactile, memorable craft.',
    paragraphs: [
      '[PLACEHOLDER] Saya Dimas Di Ajeng Duwi Saputra, seorang pengembang perangkat lunak yang fokus merancang dan membangun sistem digital dari sisi antarmuka hingga arsitektur backend dan cloud.',
      '[PLACEHOLDER] Berpengalaman mengerjakan proyek lintas domain mulai dari integrasi Genesys Cloud CX, asisten AI percakapan, sistem desktop Java, hingga aplikasi web modern berbasis Next.js dan TypeScript dengan standar performa tinggi.',
    ],
    experiences: [
      {
        period: '2025 - 2026',
        role: 'Full-Stack & Product Developer',
        org: 'Independent & Flagship Works (ESC · LogHub · Grace)',
        summary:
          '[PLACEHOLDER] Merancang dan membangun platform web modern, sistem logbook terpusat, serta pengalaman digital brand dengan fokus pada kecepatan dan keterbacaan.',
      },
      {
        period: '2024',
        role: 'Lead Developer / Academic Thesis & AI Projects',
        org: 'NATASHA Pondok Kos · Psychobot',
        summary:
          '[PLACEHOLDER] Mengembangkan sistem manajemen berbasis Java OOP dan mengeksplorasi integrasi percakapan AI untuk aplikasi screening psikologi.',
      },
      {
        period: '2023',
        role: 'Cloud & Contact Center Engineer (MSIB)',
        org: 'Solutif / Genesys Cloud CX (Skynet) · Sebatik',
        summary:
          '[PLACEHOLDER] Berkontribusi pada implementasi alur contact center Genesys Cloud melalui program MSIB Kampus Merdeka serta pengembangan platform katalog digital Sebatik.',
      },
    ],
    capabilities: [
      {
        category: 'Frontend & Interface',
        items: ['Next.js (App Router)', 'React 19', 'TypeScript', 'Tailwind CSS', 'CSS 3D & Web Animations'],
      },
      {
        category: 'Backend & Systems',
        items: ['Node.js', 'Java (OOP / Desktop)', 'REST APIs & Webhooks', 'PostgreSQL & MySQL', 'Prisma ORM'],
      },
      {
        category: 'Cloud & Intelligent Tools',
        items: ['Genesys Cloud CX', 'AI / LLM Integration', 'Git & Monorepo Tooling', 'Performance Engineering'],
      },
    ],
  },
  contact: {
    sectionLabel: '05 / CONTACT',
    headline: "Let's build something thoughtful together.",
    subtext:
      '[PLACEHOLDER] Terbuka untuk peluang kerja full-time, kolaborasi produk, maupun proyek pengembangan web & cloud. Klik email di bawah untuk menyalin langsung.',
    email: 'dimas.saputra@example.com',
    socials: [
      { label: 'GH', name: 'GitHub', href: 'https://github.com/' },
      { label: 'LI', name: 'LinkedIn', href: 'https://linkedin.com/' },
      { label: 'IG', name: 'Instagram', href: 'https://instagram.com/' },
    ],
  },
} as const;
