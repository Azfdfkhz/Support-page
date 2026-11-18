"use client";

import { useEffect, useId, useRef } from "react";
import ShareIcon from "@/components/icons/ShareIcon";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { copyToClipboard } from "@/lib/clipboard";

/**
 * Popup shown after the link is copied. Controlled through useShareDialog().
 * Uses the native <dialog> so focus trapping, Esc and the inert background come from the browser.
 */
export default function ShareDialog({ open, copied, url, title, onClose, onCopied }) {
  const dialogRef = useRef(null);
  const contentRef = useRef(null);
  const pressStart = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
      contentRef.current?.focus({ preventScroll: true });
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  async function handleCopyAgain() {
    onCopied(await copyToClipboard(url, dialogRef.current));
  }

  async function handleNativeShare() {
    try {
      await navigator.share({ title, url });
    } catch {
      // The user cancelled sharing.
    }
  }

  // Rendered only while open, so browser-only checks below never run during server rendering.
  const canNativeShare = open && typeof navigator !== "undefined" && typeof navigator.share === "function";
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`;

  return (
    // The click handler only closes on a backdrop click (the dialog element itself); Esc and the buttons cover the keyboard.
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClose={onClose}
      onMouseDown={(event) => {
        pressStart.current = event.target;
      }}
      onClick={(event) => {
        // Close only when the press and the release both happened on the backdrop (not a text-selection drag).
        if (event.target === event.currentTarget && pressStart.current === event.currentTarget) onClose();
      }}
      className="share-dialog m-auto w-[calc(100%-2.5rem)] max-w-[22rem] rounded-3xl border-0 bg-white p-0 text-ink shadow-[0_1.25rem_3rem_rgba(9,31,64,0.25)] backdrop:bg-ink/50"
    >
      {open ? (
        <div ref={contentRef} tabIndex={-1} className="px-5 pb-5 pt-6 text-center outline-none">
          <span
            className={`mx-auto grid size-12 place-items-center rounded-full ${copied ? "bg-emerald-50 text-[#059669]" : "bg-brand-soft text-brand"}`}
          >
            {copied ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="size-6" aria-hidden="true">
                <path d="m5 12.5 4.5 4.5L19 7" />
              </svg>
            ) : (
              <ShareIcon className="size-6" />
            )}
          </span>

          <h2 id={titleId} aria-live="polite" className="mt-3 text-lg font-bold leading-tight text-ink">
            {copied ? "Link berhasil disalin" : "Bagikan halaman ini"}
          </h2>
          <p id={descriptionId} className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">
            {copied
              ? "kamu dapat langsung membagikannya."
              : "Salin link di bawah ini, lalu kirim ke teman dan keluargamu."}
          </p>

          <div className="mt-4 flex h-11 items-center gap-2 rounded-xl border border-line bg-brand-soft/50 pl-3.5 pr-1.5">
            <input
              type="text"
              readOnly
              value={url}
              aria-label="Link halaman"
              onFocus={(event) => event.currentTarget.select()}
              className="min-w-0 flex-1 bg-transparent text-[0.8125rem] font-semibold text-ink outline-none"
            />
            <button
              type="button"
              onClick={handleCopyAgain}
              className="h-8 shrink-0 rounded-lg px-3 text-[0.8125rem] font-semibold text-accent transition-colors hover:bg-brand-soft"
            >
              {copied ? "Tersalin" : "Salin"}
            </button>
          </div>

          <div className="mt-4 grid gap-2.5">
            {canNativeShare ? (
              <button
                type="button"
                onClick={handleNativeShare}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand text-[0.9375rem] font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                <ShareIcon className="size-[1.125rem]" />
                Bagikan ke aplikasi lain
              </button>
            ) : null}
            <button type="button" onClick={onClose} className="h-10 text-[0.8125rem] font-semibold text-muted">
              Tutup
            </button>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
