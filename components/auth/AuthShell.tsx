import Image from "next/image";
import Link from "next/link";
import { Brand } from "@/components/marketing/ui/Brand";

/** Right-panel hero — swap path here to change auth imagery without layout changes. */
const AUTH_VISUAL_IMAGE = "/assets/justice-detail.webp";

export function AuthShell({
  title,
  subtitle,
  variant,
  visualTitle,
  visualSubtitle,
  backHref,
  children,
}: {
  title: string;
  subtitle: string;
  variant: "login" | "signup";
  visualTitle: string;
  visualSubtitle: string;
  backHref: string;
  children: React.ReactNode;
}) {
  const imageAlt =
    variant === "login"
      ? "Calm legal document preparation workspace"
      : "Professional document preparation setting";

  return (
    <main className="auth-screen" data-auth-variant={variant}>
      <div className="auth-layout">
        <div className="auth-layout-form">
          <div className="auth-form-stack">
            <Link href={backHref} className="auth-back">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M19 12H5M5 12l6-6M5 12l6 6"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to home
            </Link>
            <Brand className="auth-brand" />
            <h1 className="auth-title">{title}</h1>
            <p className="auth-subtitle">{subtitle}</p>
            {children}
          </div>
        </div>

        <aside className="auth-layout-visual" aria-label="Legal Divorce Docs">
          <Image
            src={AUTH_VISUAL_IMAGE}
            alt={imageAlt}
            fill
            className="auth-visual-image"
            sizes="(min-width: 1024px) 55vw, 0px"
            priority={variant === "login"}
          />
          <div className="auth-visual-overlay" aria-hidden="true" />
          <div className="auth-visual-copy">
            <p className="auth-visual-heading">{visualTitle}</p>
            <p className="auth-visual-text">{visualSubtitle}</p>
          </div>
        </aside>
      </div>
    </main>
  );
}