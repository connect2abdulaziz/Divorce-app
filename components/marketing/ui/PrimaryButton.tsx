"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon } from "./Icon";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  icon?: string;
  variant?: "white" | string;
  className?: string;
};

export function PrimaryButton({
  children,
  icon,
  variant,
  className = "",
  type = "button",
  disabled = false,
  ...props
}: PrimaryButtonProps) {
  const classes = ["primary-button", variant === "white" && "white", className]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} disabled={disabled} {...props}>
      {icon ? <Icon name={icon} size={18} /> : null}
      {children}
    </button>
  );
}
