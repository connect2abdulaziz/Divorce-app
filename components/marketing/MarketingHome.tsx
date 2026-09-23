"use client";

import { useCallback, useEffect, useState } from "react";
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
import { ServiceDialog } from "@/components/marketing/ui/ServiceDialog";
import { usePageMotion } from "@/components/marketing/hooks/usePageMotion";

type DialogKey = "start" | "portal" | "quote" | null;
type Qualification = {
  children: string | null;
  property: string | null;
  help: string | null;
};

export function MarketingHome() {
  const [navOpen, setNavOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState<DialogKey>(null);
  const [qualification, setQualification] = useState<Qualification | null>(null);
  const [presetHelp, setPresetHelp] = useState<string | null>(null);

  usePageMotion();

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

  const handleQualificationComplete = useCallback(
    (answers: Qualification) => {
      setQualification(answers);
      openDialog(answers.help === "guided" ? "quote" : "start");
    },
    [openDialog]
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
        onStart={startDivorce}
        onSignIn={() => openDialog("portal")}
      />
      <MobileNav
        open={navOpen}
        onClose={closeNavigation}
        onStart={startDivorce}
        onSignIn={() => {
          closeNavigation();
          openDialog("portal");
        }}
      />
      <main id="main">
        <HeroSection onStart={startDivorce} />
        <QualificationSection presetHelp={presetHelp} onComplete={handleQualificationComplete} />
        <WhySection onStart={() => startDivorce()} />
        <ProcessSection onStart={() => startDivorce()} />
        <PricingSection onStart={startDivorce} />
        <ArizonaSection onStart={() => startDivorce()} />
        <ComparisonSection onStart={() => startDivorce()} />
        <ReviewsSection />
        <FaqSection />
        <ClosingSection onStart={startDivorce} />
      </main>
      <Footer onSignIn={() => openDialog("portal")} />
      <ServiceDialog
        dialogKey={dialogKey}
        qualification={qualification}
        onClose={() => setDialogKey(null)}
      />
    </div>
  );
}
