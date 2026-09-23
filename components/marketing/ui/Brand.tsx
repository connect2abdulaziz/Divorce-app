"use client";

import Image from "next/image";
import Link from "next/link";

function Logo({ loading }: { loading?: "lazy" | "eager" }) {
  return (
    <Image
      src="/assets/logo-transparent.png"
      alt="LegalDivorceDocs.com"
      width={2172}
      height={724}
      sizes="240px"
      priority={loading !== "lazy"}
      loading={loading === "lazy" ? "lazy" : undefined}
    />
  );
}

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
        <Logo loading={loading} />
      </a>
    );
  }

  return (
    <Link className={`brand ${className}`.trim()} href={href} aria-label="Legal Divorce Docs home">
      <Logo loading={loading} />
    </Link>
  );
}
