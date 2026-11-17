"use client";

import ShareIcon from "@/components/icons/ShareIcon";
import ShareDialog from "@/components/share/ShareDialog";
import { useShareDialog } from "@/components/share/useShareDialog";

// `url` is the canonical public link (SITE_URL + /slug), not window.location, so it is the same
// everywhere (no dev host, no tracking query) and the button needs no browser-only code to build it.
export default function ShareButton({ title, url }) {
  const { openShare, dialogProps } = useShareDialog({ url, title });

  return (
    <>
      <button
        type="button"
        onClick={openShare}
        aria-label="Bagikan halaman"
        aria-haspopup="dialog"
        className="absolute right-1.5 top-[7.25rem] grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-brand-soft active:bg-brand-soft"
      >
        <ShareIcon />
      </button>
      <ShareDialog {...dialogProps} />
    </>
  );
}
