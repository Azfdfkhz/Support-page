"use client";

import { useState } from "react";
import Link from "next/link";
import { creatorPath } from "@/constants/routes";
import { SHORT_DOMAIN, SITE_URL } from "@/lib/config";

export default function ReadyActions({ slug }) {
  const [copied, setCopied] = useState(false);
  const display = `${SHORT_DOMAIN}/${slug}`;
  const shareUrl = `${SITE_URL}${creatorPath(slug)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context or permission): nothing else to do.
    }
  }

  async function handleShare() {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "Support Page", url: shareUrl });
      } catch {
        // The user cancelled sharing.
      }
      return;
    }
    await copyLink();
  }

  return (
    <>
      <div className="mt-10 w-full">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wide text-muted">Link halaman</p>
        <div className="mt-1.5 flex h-11 items-center justify-between rounded-full border border-ink bg-white pl-4 pr-4">
          <span className="truncate text-[13px] font-semibold text-ink">{display}</span>
          <button type="button" onClick={copyLink} className="shrink-0 pl-3 text-[13px] font-semibold text-accent" aria-live="polite">
            {copied ? "Tersalin" : "Salin"}
          </button>
        </div>
      </div>

      <div className="mt-10 w-full space-y-2.5">
        <button
          type="button"
          onClick={handleShare}
          className="h-[52px] w-full rounded-xl bg-brand text-base font-semibold text-white shadow-[0_6px_14px_rgba(46,104,178,0.3)] transition-colors hover:bg-brand-dark"
        >
          Bagikan Halaman
        </button>
        <Link
          href={creatorPath(slug)}
          className="flex h-[52px] w-full items-center justify-center rounded-xl border border-line bg-white text-base font-semibold text-ink"
        >
          Lihat halaman
        </Link>
      </div>
    </>
  );
}
