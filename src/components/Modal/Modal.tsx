"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

function CloseIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
}

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  id?: string;
  ariaLabelledBy?: string;
  backdropAriaLabel?: string;
  panelClassName?: string;
  contentClassName?: string;
  closeOnEscape?: boolean;
};

/**
 * Reusable modal: rendered with a portal to `document.body` so it escapes
 * parent stacking contexts and overflow. Backdrop, panel, close control,
 * Escape to close. Body scroll: parent should set `overflow: hidden` on
 * `document.body` when open if needed (e.g. when stacking with a mobile menu).
 */
export default function Modal({
  open,
  onClose,
  children,
  id,
  ariaLabelledBy,
  backdropAriaLabel = "Close dialog",
  panelClassName = "",
  contentClassName = "",
  closeOnEscape = true,
}: ModalProps) {
  useEffect(() => {
    if (!open || !closeOnEscape) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, closeOnEscape]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-200 flex items-center justify-center p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
      id={id}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-pointer bg-black/50"
        onClick={onClose}
        aria-label={backdropAriaLabel}
      />

      <div
        className={`relative z-10 flex w-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xl ${panelClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        <div className={`overflow-y-auto p-6 md:p-8 ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
