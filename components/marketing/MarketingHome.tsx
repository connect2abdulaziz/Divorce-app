"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/marketing/layout/Footer";
import { Header } from "@/components/marketing/layout/Header";
import { MobileNav } from "@/components/marketing/layout/MobileNav";
import { SkipLink } from "@/components/marketing/layout/SkipLink";
import { ClosingSection } from "@/components/marketing/sections/ClosingSection";
import { ComparisonSection } from "@/components/marketing/sections/ComparisonSection";
import { MissionStatementSection } from "@/components/marketing/sections/MissionStatementSection";
import { HomeServicesSection } from "@/components/marketing/sections/HomeServicesSection";
import { FaqSection } from "@/components/marketing/sections/FaqSection";
import { HeroSection } from "@/components/marketing/sections/HeroSection";
import { TrustStripSection } from "@/components/marketing/sections/TrustStripSection";
import { WhatWeDoSection } from "@/components/marketing/sections/WhatWeDoSection";
import { QuickCtaSection } from "@/components/marketing/sections/QuickCtaSection";
import { PricingSection } from "@/components/marketing/sections/PricingSection";
import { ProcessSection } from "@/components/marketing/sections/ProcessSection";
import { QualificationSection } from "@/components/marketing/sections/QualificationSection";
import { ReviewsSection } from "@/components/marketing/sections/ReviewsSection";
import { WhySection } from "@/components/marketing/sections/WhySection";
import { ServiceDialog } from "@/components/marketing/ui/ServiceDialog";
import { usePageMotion } from "@/components/marketing/hooks/usePageMotion";
import { useScrollLock } from "@/components/marketing/hooks/useScrollLock";

type DialogKey = "start" | "portal" | "quote" | null;
type Qualification = {
  children: string | null;
  property: string | null;
  help: string | null;
};

export function MarketingHome() {
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState<DialogKey>(null);
  const [qualification, setQualification] = useState<Qualification | null>(null);
  const [presetHelp, setPresetHelp] = useState<string | null>(null);

  usePageMotion();
  useScrollLock(navOpen || dialogKey !== null);

  const closeNavigation = useCallback(() => setNavOpen(false), []);

  const openDialog = useCallback((key: Exclude<DialogKey, null>) => {
    setNavOpen(false);
    setDialogKey(key);
  }, []);

  const startDivorce = useCallback((helpPreference: string | null = null) => {
    setNavOpen(false);
    if (typeof helpPreference === "string") setPresetHelp(helpPreference);
    document.getElementById("qualify")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const goSignIn = useCallback(() => {
    setNavOpen(false);
    setDialogKey(null);
    router.push("/login");
  }, [router]);

  const handleQualificationComplete = useCallback(
    (answers: Qualification) => {
      setQualification(answers);
      openDialog(answers.help === "guided" ? "quote" : "start");
    },
    [openDialog]
  );

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 1100) closeNavigation();
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
    <div
      className={[
        "marketing-site",
        navOpen ? "nav-open" : "",
        navOpen || dialogKey !== null ? "marketing-site--scroll-locked" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <SkipLink />
      <Header
        navOpen={navOpen}
        onToggleNav={() => setNavOpen((open) => !open)}
        onStart={startDivorce}
        onSignIn={goSignIn}
      />
      <MobileNav
        open={navOpen}
        onClose={closeNavigation}
        onStart={startDivorce}
        onSignIn={goSignIn}
      />
      <main id="main">
        <HeroSection onStart={startDivorce} />
        <TrustStripSection />
        <WhatWeDoSection />
        <QuickCtaSection onStart={startDivorce} />
        <WhySection />
        <ComparisonSection />
        <MissionStatementSection onContinue={() => startDivorce()} />
        <HomeServicesSection />
        <ProcessSection />
        <QualificationSection presetHelp={presetHelp} onComplete={handleQualificationComplete} />
        <PricingSection onStart={startDivorce} />
        <ReviewsSection />
        <FaqSection />
        <ClosingSection onStart={startDivorce} />
      </main>
      <Footer onSignIn={goSignIn} />
      <ServiceDialog
        dialogKey={dialogKey}
        qualification={qualification}
        onClose={() => setDialogKey(null)}
      />
    </div>
  );
}
