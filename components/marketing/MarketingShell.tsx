"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/marketing/layout/Footer";
import { Header } from "@/components/marketing/layout/Header";
import { MobileNav } from "@/components/marketing/layout/MobileNav";
import { SkipLink } from "@/components/marketing/layout/SkipLink";
import { ServiceDialog } from "@/components/marketing/ui/ServiceDialog";
import { usePageMotion } from "@/components/marketing/hooks/usePageMotion";

type DialogKey = "start" | "portal" | "quote" | null;

export function MarketingShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState<DialogKey>(null);

  usePageMotion();

  const closeNavigation = useCallback(() => setNavOpen(false), []);

  const openDialog = useCallback((key: Exclude<DialogKey, null>) => {
    setNavOpen(false);
    setDialogKey(key);
  }, []);

  const startDivorce = useCallback(() => {
    setNavOpen(false);
    router.push("/#qualify");
  }, [router]);

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
    <div className={navOpen ? "marketing-site nav-open" : "marketing-site"}>
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
      <main id="main">{children}</main>
      <Footer onSignIn={() => openDialog("portal")} />
      <ServiceDialog dialogKey={dialogKey} qualification={null} onClose={() => setDialogKey(null)} />
    </div>
  );
}
