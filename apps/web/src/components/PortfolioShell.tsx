'use client';

import { useCallback, useState } from 'react';
import { INITIAL_PROJECT_INDEX } from '@/data/projects';
import { GlobalNavbar } from '@/components/layout/GlobalNavbar';
import { PaperGrainOverlay } from '@/components/layout/PaperGrainOverlay';
import { HeroSection } from '@/components/sections/HeroSection';
import { VinylShowcaseSection } from '@/components/sections/VinylShowcaseSection';
import { ProjectDetailSection } from '@/components/sections/ProjectDetailSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ContactFooterSection } from '@/components/sections/ContactFooterSection';

export function PortfolioShell() {
  const [activeIndex, setActiveIndex] = useState<number>(INITIAL_PROJECT_INDEX);
  const [externalJumpNonce, setExternalJumpNonce] = useState<number>(0);
  const [revealNonce, setRevealNonce] = useState<number>(0);

  // Clicking the active vinyl in Section 02 syncs & smoothly scrolls into Section 03!
  const handleOpenProject = useCallback((index: number) => {
    setActiveIndex(index);
    setRevealNonce((n) => n + 1);
    const target = document.getElementById('project-detail');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Prev/Next buttons inside Section 03 also glide the 3D vinyl shelf in Section 02
  const handleSelectFromDetail = useCallback((index: number) => {
    setActiveIndex(index);
    setRevealNonce((n) => n + 1);
    setExternalJumpNonce((n) => n + 1);
  }, []);

  return (
    <div className="relative min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <PaperGrainOverlay />
      <GlobalNavbar />
      <main>
        <HeroSection />
        <VinylShowcaseSection
          activeIndex={activeIndex}
          externalJumpNonce={externalJumpNonce}
          onActiveIndexChange={setActiveIndex}
          onOpenProject={handleOpenProject}
        />
        <ProjectDetailSection
          activeIndex={activeIndex}
          revealNonce={revealNonce}
          onSelectIndex={handleSelectFromDetail}
        />
        <AboutSection />
      </main>
      <ContactFooterSection />
    </div>
  );
}
