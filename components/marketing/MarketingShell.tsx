"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/marketing/layout/Footer";
import { Header } from "@/components/marketing/layout/Header";
import { MobileNav } from "@/components/marketing/layout/MobileNav";
import { SkipLink } from "@/components/marketing/layout/SkipLink";
import { ServiceDialog } from "@/components/marketing/ui/ServiceDialog";
import { usePageMotion } from "@/components/marketing/hooks/usePageMotion";
import { useScrollLock } from "@/components/marketing/hooks/useScrollLock";

type DialogKey = "start" | "portal" | "quote" | null;

export function MarketingShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState<DialogKey>(null);

  usePageMotion();
  useScrollLock(navOpen || dialogKey !== null);

  const closeNavigation = useCallback(() => setNavOpen(false), []);

  const openDialog = useCallback((key: Exclude<DialogKey, null>) => {
    setNavOpen(false);
    setDialogKey(key);
  }, []);

  const startDivorce = useCallback(() => {
    setNavOpen(false);
    router.push("/#qualify");
  }, [router]);

  const goSignIn = useCallback(() => {
    setNavOpen(false);
    setDialogKey(null);
    router.push("/login");
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
      <main id="main">{children}</main>
      <Footer onSignIn={goSignIn} />
      <ServiceDialog dialogKey={dialogKey} qualification={null} onClose={() => setDialogKey(null)} />
    </div>
  );
}
