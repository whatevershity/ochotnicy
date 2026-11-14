import { Suspense } from "react";
import { DabrowszczacySection } from "@/components/DabrowszczacySection";
import { DarowiznySection } from "@/components/DarowiznySection";
import { ManifestSection } from "@/components/ManifestSection";
import { NewsSection } from "@/components/NewsSection";
import { ProjektySection } from "@/components/ProjektySection";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/SiteFooter";

export default function Home() {
  return (
    <main className="relative flex w-full max-w-[100vw] flex-1 flex-col overflow-x-clip bg-[#fafaf7]">
      {/* Hero v1 ukryty — plik zostaje w src/components/Hero.tsx */}
      <ManifestSection />
      <Reveal>
        <DabrowszczacySection />
      </Reveal>
      <Reveal delay={60}>
        <Suspense
          fallback={
            <section className="news" aria-busy="true">
              <div className="news__inner">
                <p className="news__empty">Ładowanie aktualności…</p>
              </div>
            </section>
          }
        >
          <NewsSection />
        </Suspense>
      </Reveal>
      <Reveal delay={80}>
        <ProjektySection />
      </Reveal>
      <Reveal delay={40}>
        <DarowiznySection />
      </Reveal>
      <Reveal>
        <SiteFooter />
      </Reveal>
    </main>
  );
}
