"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { DIALOG_MESSAGES, packageForHelp } from "@/lib/marketing/content";
import { Icon } from "./Icon";
import { PrimaryButton } from "./PrimaryButton";

type Qualification = {
  children: string | null;
  property: string | null;
  help: string | null;
};

function summarizeQualification(qualification: Qualification | null) {
  if (!qualification) return null;

  const children =
    qualification.children === "yes" ? "Children under 18: Yes" : "Children under 18: No";
  const property =
    qualification.property === "yes" ? "Property or debts: Yes" : "Property or debts: No";
  const help =
    qualification.help === "guided"
      ? "Help preference: Fully guided process"
      : "Help preference: Prepare documents online";

  return [children, property, help];
}

export function ServiceDialog({
  dialogKey,
  qualification,
  onClose,
}: {
  dialogKey: keyof typeof DIALOG_MESSAGES | null;
  qualification: Qualification | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const message = dialogKey ? DIALOG_MESSAGES[dialogKey] : null;
  const summary = summarizeQualification(qualification);
  const showPackage = dialogKey === "start" || dialogKey === "quote";
  const recommended = showPackage ? packageForHelp(qualification?.help) : null;
  const showQualificationSummary = showPackage && summary !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (message && !dialog.open) {
      if ("showModal" in dialog) {
        try {
          dialog.showModal({ preventScroll: true } as never);
        } catch {
          dialog.showModal();
        }
      } else {
        dialog.showModal();
      }
    }

    if (!message && dialog.open) {
      dialog.close();
    }
  }, [message]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target !== dialogRef.current || !dialogRef.current) return;

    const box = dialogRef.current.getBoundingClientRect();
    const clickedOutside =
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom;

    if (clickedOutside) onClose();
  };

  const handleContinue = () => {
    onClose();
    if (dialogKey === "portal") {
      router.push("/login");
      return;
    }
    const params = new URLSearchParams();
    if (qualification?.children) params.set("children", qualification.children);
    if (qualification?.property) params.set("property", qualification.property);
    if (qualification?.help) params.set("help", qualification.help);
    if (recommended?.id) params.set("package", recommended.id);
    const qs = params.toString();
    router.push(qs ? `/signup?${qs}` : "/signup");
  };

  const continueLabel =
    dialogKey === "portal" ? "Continue to sign in" : "Continue to sign up";

  return (
    <dialog
      id="service-dialog"
      className="service-dialog ldd-dialog"
      ref={dialogRef}
      aria-labelledby="dialog-title"
      aria-describedby={message ? "dialog-description" : undefined}
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      <div className="ldd-dialog__panel">
        <button
          type="button"
          className="ldd-dialog__close dialog-close"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <Icon name="close" size={18} />
        </button>

        <header className="ldd-dialog__header">
          <p className="ldd-dialog__eyebrow">
            {showPackage ? "Your match" : "Legal Divorce Docs"}
          </p>
          <h2 id="dialog-title" className="ldd-dialog__title">
            {message?.title ?? ""}
          </h2>
          <p id="dialog-description" className="ldd-dialog__lede">
            {message?.body ?? ""}
          </p>
        </header>

        {recommended ? (
          <div className="ldd-dialog__package" aria-label="Recommended package">
            <div className="ldd-dialog__package-head">
              <strong className="ldd-dialog__package-name">{recommended.name}</strong>
              <span className="ldd-dialog__package-price">{recommended.price}</span>
            </div>
            <p className="ldd-dialog__package-blurb">{recommended.blurb}</p>
            <ul className="ldd-dialog__package-features">
              {recommended.features.slice(0, 4).map((feature) => (
                <li key={feature}>
                  <Icon name="check" size={14} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {showQualificationSummary ? (
          <ul className="ldd-dialog__summary">
            {summary.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}

        <PrimaryButton
          className="ldd-dialog__submit dialog-done"
          icon="chevronDown"
          onClick={handleContinue}
        >
          {continueLabel}
        </PrimaryButton>
      </div>
    </dialog>
  );
}