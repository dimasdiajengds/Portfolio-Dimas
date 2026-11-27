'use client';

import { useCallback, useRef, useState } from 'react';
import { INITIAL_PROJECT_INDEX, PROJECTS } from '@/data/projects';
import { GlobalNavbar } from '@/components/layout/GlobalNavbar';
import { PaperGrainOverlay } from '@/components/layout/PaperGrainOverlay';
import { HeroSection } from '@/components/sections/HeroSection';
import { VinylShowcaseSection } from '@/components/sections/VinylShowcaseSection';
import { ProjectDetailSection } from '@/components/sections/ProjectDetailSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ContactFooterSection } from '@/components/sections/ContactFooterSection';
import {
  VinylFlightOverlay,
  type VinylFlightRequest,
  type VinylSourceRect,
} from '@/components/vinyl/VinylFlightOverlay';

export function PortfolioShell() {
  const [activeIndex, setActiveIndex] = useState<number>(INITIAL_PROJECT_INDEX);
  const [externalJumpNonce, setExternalJumpNonce] = useState<number>(0);
  const [revealNonce, setRevealNonce] = useState<number>(0);

  // Turntable flight handoff state
  const flightIdRef = useRef<number>(0);
  const [flightRequest, setFlightRequest] = useState<VinylFlightRequest | null>(null);
  const [landNonce, setLandNonce] = useState<number>(0);
  const [landAngleDeg, setLandAngleDeg] = useState<number>(0);

  const scrollToDetail = useCallback(() => {
    const target = document.getElementById('project-detail');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Clicking the active vinyl in Section 02 ejects the LP disc, glides it down into Section 03's turntable!
  const handleOpenProject = useCallback(
    (index: number, sourceRect?: VinylSourceRect) => {
      setActiveIndex(index);
      setRevealNonce((n) => n + 1);

      const project = PROJECTS[index] ?? PROJECTS[INITIAL_PROJECT_INDEX];
      if (sourceRect && sourceRect.width > 20 && sourceRect.height > 20) {
        flightIdRef.current += 1;
        setFlightRequest({
          id: flightIdRef.current,
          project,
          sourceRect,
        });
      } else {
        setFlightRequest(null);
        scrollToDetail();
      }
    },
    [scrollToDetail],
  );

  const handleVinylLand = useCallback((finalAngleDeg: number) => {
    setLandAngleDeg(finalAngleDeg);
    setLandNonce((n) => n + 1);
    setFlightRequest(null);
  }, []);

  // Prev/Next buttons inside Section 03 also glide the 3D vinyl shelf in Section 02
  const handleSelectFromDetail = useCallback((index: number) => {
    setActiveIndex(index);
    setRevealNonce((n) => n + 1);
    setExternalJumpNonce((n) => n + 1);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-[var(--ink)]">
      <PaperGrainOverlay />
      <GlobalNavbar />
      <VinylFlightOverlay flight={flightRequest} onLand={handleVinylLand} />
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
          incomingFlight={flightRequest !== null}
          landNonce={landNonce}
          landAngleDeg={landAngleDeg}
          onSelectIndex={handleSelectFromDetail}
        />
        <AboutSection />
      </main>
      <ContactFooterSection />
    </div>
  );
}
