"use client";

import { ReactNode } from "react";
import { Icon } from "./Icon";

export function TextLink({
  href,
  children,
  className = "text-link",
  icon,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  icon?: string;
}) {
  return (
    <a className={className} href={href}>
      {children}
      {icon ? <Icon name={icon} size={16} /> : null}
    </a>
  );
}
