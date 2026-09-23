"use client";

import Link from "next/link";

export function Brand({
  href = "#main",
  loading,
  className = "",
}: {
  href?: string;
  loading?: "lazy" | "eager";
  className?: string;
}) {
  // Use <a> for in-page #main anchors; Link for app routes.
  if (href.startsWith("#")) {
    return (
      <a className={`brand ${className}`.trim()} href={href} aria-label="Legal Divorce Docs home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/logo-transparent.png" alt="LegalDivorceDocs.com" loading={loading} />
      </a>
    );
  }

  return (
    <Link className={`brand ${className}`.trim()} href={href} aria-label="Legal Divorce Docs home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/logo-transparent.png" alt="LegalDivorceDocs.com" loading={loading} />
    </Link>
  );
}
