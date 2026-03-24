"use client";

import { useEffect } from "react";

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

/**
 * Reusable modal: backdrop, panel, close control, Escape to close.
 * Body scroll: parent should set `overflow: hidden` on `body` when open if needed
 * (e.g. when stacking with a mobile menu).
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
}) {
  useEffect(() => {
    if (!open || !closeOnEscape) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, closeOnEscape]);

  if (!open) return null;

  return (
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
        <div className="flex shrink-0 items-center justify-end border-b border-neutral-100 px-2 py-2">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>
        <div
          className={`overflow-y-auto overscroll-contain px-4 pb-6 pt-2 md:px-8 md:pb-8 ${contentClassName}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
