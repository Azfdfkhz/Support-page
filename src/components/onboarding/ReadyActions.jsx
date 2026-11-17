"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ShareDialog from "@/components/share/ShareDialog";
import { useShareDialog } from "@/components/share/useShareDialog";
import { creatorPath } from "@/constants/routes";
import { copyToClipboard } from "@/lib/clipboard";
import { SHORT_DOMAIN, SITE_URL } from "@/lib/config";

const COPY_LABEL = { idle: "Salin", copied: "Tersalin", failed: "Gagal" };

export default function ReadyActions({ slug }) {
  const [copyState, setCopyState] = useState("idle");
  const resetTimer = useRef(null);
  const display = `${SHORT_DOMAIN}/${slug}`;
  const shareUrl = `${SITE_URL}${creatorPath(slug)}`;
  const { openShare, dialogProps } = useShareDialog({ url: shareUrl, title: "Dukung aku lewat Support Page" });

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  async function copyLink() {
    const ok = await copyToClipboard(shareUrl);
    setCopyState(ok ? "copied" : "failed");
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopyState("idle"), 2000);
  }

  return (
    <>
      <div className="mt-10 w-full">
        <p className="px-3 text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">Link halaman</p>
        <div className="mt-1.5 flex h-11 items-center justify-between rounded-full border border-ink bg-white pl-4 pr-4">
          <span className="truncate text-[0.8125rem] font-semibold text-ink">{display}</span>
          <button type="button" onClick={copyLink} className="shrink-0 pl-3 text-[0.8125rem] font-semibold text-accent" aria-live="polite">
            {COPY_LABEL[copyState]}
          </button>
        </div>
      </div>

      <div className="mt-10 w-full space-y-2.5">
        <button
          type="button"
          onClick={openShare}
          className="h-[3.25rem] w-full rounded-xl bg-brand text-base font-semibold text-white shadow-[0_0.375rem_0.875rem_rgba(46,104,178,0.3)] transition-colors hover:bg-brand-dark"
        >
          Bagikan Halaman
        </button>
        <Link
          href={creatorPath(slug)}
          className="flex h-[3.25rem] w-full items-center justify-center rounded-xl border border-line bg-white text-base font-semibold text-ink"
        >
          Lihat halaman
        </Link>
      </div>

      <ShareDialog {...dialogProps} />
    </>
  );
}
