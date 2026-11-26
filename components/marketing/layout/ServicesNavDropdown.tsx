"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { SERVICES_DROPDOWN_ITEMS } from "@/lib/marketing/content";
import { Icon } from "@/components/marketing/ui/Icon";

export function ServicesNavDropdown() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const root = rootRef.current;
      if (root && !root.contains(event.target as Node)) close();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  return (
    <div className="header-services" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="header-services__trigger"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="true"
        onClick={() => setOpen((current) => !current)}
      >
        <span>Services</span>
        <Icon name="chevronDown" size={14} className={open ? "header-services__chevron is-open" : "header-services__chevron"} />
      </button>

      <div
        id={panelId}
        className={["header-services__panel", open ? "header-services__panel--open" : ""]
          .filter(Boolean)
          .join(" ")}
        hidden={!open}
        role="menu"
        aria-label="Services"
      >
        {SERVICES_DROPDOWN_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="header-services__item"
            role="menuitem"
            onClick={close}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
}