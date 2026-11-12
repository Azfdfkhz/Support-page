"use client";

import ShareIcon from "@/components/icons/ShareIcon";

export default function ShareButton({ title }) {
  async function handleShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // The user cancelled sharing; nothing to do.
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Share this page"
      className="absolute right-3 top-[122px] grid size-8 place-items-center rounded-full text-ink"
    >
      <ShareIcon />
    </button>
  );
}
