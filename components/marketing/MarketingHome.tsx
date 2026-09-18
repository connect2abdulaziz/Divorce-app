"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/marketing/layout/Footer";
import { Header } from "@/components/marketing/layout/Header";
import { MobileNav } from "@/components/marketing/layout/MobileNav";
import { SkipLink } from "@/components/marketing/layout/SkipLink";
import { ArizonaSection } from "@/components/marketing/sections/ArizonaSection";
import { ClosingSection } from "@/components/marketing/sections/ClosingSection";
import { ComparisonSection } from "@/components/marketing/sections/ComparisonSection";
import { FaqSection } from "@/components/marketing/sections/FaqSection";
import { HeroSection } from "@/components/marketing/sections/HeroSection";
import { PricingSection } from "@/components/marketing/sections/PricingSection";
import { ProcessSection } from "@/components/marketing/sections/ProcessSection";
import { QualificationSection } from "@/components/marketing/sections/QualificationSection";
import { ReviewsSection } from "@/components/marketing/sections/ReviewsSection";
import { WhySection } from "@/components/marketing/sections/WhySection";
import { usePageMotion } from "@/components/marketing/hooks/usePageMotion";

export function MarketingHome() {
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const [presetHelp, setPresetHelp] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  usePageMotion();

  const closeNavigation = useCallback(() => setNavOpen(false), []);

  const goAuth = useCallback(() => {
    setNavOpen(false);
    setAuthLoading(true);
    router.push("/login");
  }, [router]);

  const startDivorce = useCallback(
    (helpPreference: string | null = null) => {
      setNavOpen(false);
      if (typeof helpPreference === "string") {
        setPresetHelp(helpPreference);
        document.getElementById("qualify")?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      setAuthLoading(true);
      router.push("/login");
    },
    [router]
  );

  const handleQualificationComplete = useCallback(
    (answers: { children: string | null; property: string | null; help: string | null }) => {
      const params = new URLSearchParams();
      if (answers.children) params.set("children", answers.children);
      if (answers.property) params.set("property", answers.property);
      if (answers.help) params.set("help", answers.help);
      setAuthLoading(true);
      router.push(`/signup?${params.toString()}`);
    },
    [router]
  );

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) closeNavigation();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeNavigation();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeNavigation]);

  return (
    <div className="marketing-site">
      <SkipLink />
      <Header
        navOpen={navOpen}
        onToggleNav={() => setNavOpen((open) => !open)}
        onStart={() => startDivorce()}
        onSignIn={goAuth}
        loading={authLoading}
      />
      <MobileNav
        open={navOpen}
        onClose={closeNavigation}
        onStart={() => startDivorce()}
        onSignIn={goAuth}
        loading={authLoading}
      />
      <main id="main">
        <HeroSection onStart={() => startDivorce()} loading={authLoading} />
        <QualificationSection
          presetHelp={presetHelp}
          onComplete={handleQualificationComplete}
          loading={authLoading}
        />
        <WhySection onStart={() => startDivorce()} loading={authLoading} />
        <ProcessSection onStart={() => startDivorce()} loading={authLoading} />
        <PricingSection onStart={startDivorce} loading={authLoading} />
        <ArizonaSection onStart={() => startDivorce()} loading={authLoading} />
        <ComparisonSection onStart={() => startDivorce()} loading={authLoading} />
        <ReviewsSection />
        <FaqSection />
        <ClosingSection onStart={() => startDivorce()} loading={authLoading} />
      </main>
      <Footer onSignIn={goAuth} />
    </div>
  );
}
