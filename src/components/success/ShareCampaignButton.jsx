"use client";

import { useState } from "react";
import ShareIcon from "@/components/icons/ShareIcon";

export default function ShareCampaignButton({ title, url }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
      } catch {
        // The user cancelled sharing.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: nothing else to do.
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex h-[52px] w-full items-center justify-center gap-2.5 rounded-xl bg-brand text-base font-semibold text-white transition-colors hover:bg-brand-dark"
      aria-live="polite"
    >
      <ShareIcon className="size-[18px]" />
      {copied ? "Tautan disalin" : "Bagikan Campaign"}
    </button>
  );
}
