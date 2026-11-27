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
  headerSocials: [
    { id: 'linkedin', name: 'LinkedIn', href: 'https://linkedin.com/' },
    { id: 'instagram', name: 'Instagram', href: 'https://instagram.com/' },
    { id: 'tiktok', name: 'TikTok', href: 'https://tiktok.com/' },
  ],
  about: {
    headline: "Hi, I'm\nDimas Saputra.",
    subheadline:
      'AI Engineer, Software Engineer, Cloud Engineer, Full-Stack Dev, Systems / Solutions Architect, Product Engineer.',
    rightHeadline:
      'I build complete Digital Systems bridging interactive interfaces, scalable Cloud architectures, and practical AI integrations.',
    rightHeadlineBold: ['digital systems', 'cloud', 'AI'],
    portraitSrc: '',
    experiences: [
      {
        period: '2022 Feb - 2022 Jul',
        role: 'Data Entry & Database Admin',
        org: 'Partai Ummat',
        summary:
          'Managed document data entry and SIPOL web database uploads, verifying records to eliminate errors and duplicates while performing regular security backups and preparing summary reports.',
      },
      {
        period: '2024 Feb - 2024 Aug',
        role: 'Cloud Computing Cohort',
        org: 'Bangkit Academy 2024 By Google, GoTo, Tokopedia, Traveloka - Cloud Computing',
        summary:
          'Deployed scalable JavaScript and Python backends using Compute Engine, Cloud Run, App Engine, Cloud SQL, Cloud Storage, Docker, and IAM to deliver reliable capstone APIs,and also Completed Bangkit Academy on time.',
      },
      {
        period: '2024 Sep - 2024 Dec',
        role: 'Systems Solutions Architect & Cloud Engineer',
        org: 'PT Solutif Tiga Selaras',
        summary:
          'Configured Genesys Cloud routing workflows, CRM API integrations, IVR scripts, and chatbots for Skynet to reduce wait times, track KPIs, and uphold strict security standards.',
      },
      {
        period: '2021 Aug - 2025 Aug',
        role: 'Graduate',
        org: 'Universitas Indraprasta PGRI',
        summary:
          '[PLACEHOLDER] Membangun dasar rekayasa perangkat lunak, pemrograman berorientasi objek, serta eksplorasi antarmuka web modern.',
      },
      {
        period: '2026 Aug - Present',
        role: 'Full-Stack Dev & DevOps',
        org: 'Digital Channel - PT. XLSMART Telecom Sejahter tbk. Batch 1 Maganghub',
        summary:
          '[PLACEHOLDER] Deskripsi pengalaman kerja, tanggung jawab utama, dan hasil proyek yang ingin ditampilkan di titik ke-5 ini.',
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
