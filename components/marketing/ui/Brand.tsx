"use client";

import Link from "next/link";

export function Brand({
  href = "/",
  loading,
  className = "",
}: {
  href?: string;
  loading?: "lazy" | "eager";
  className?: string;
}) {
  return (
    <Link className={`brand ${className}`.trim()} href={href} aria-label="Legal Divorce Docs home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/logo-transparent.png" alt="LegalDivorceDocs.com" loading={loading} />
    </Link>
  );
}
