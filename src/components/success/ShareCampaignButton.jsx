"use client";

import ShareIcon from "@/components/icons/ShareIcon";
import ShareDialog from "@/components/share/ShareDialog";
import { useShareDialog } from "@/components/share/useShareDialog";

export default function ShareCampaignButton({ title, url }) {
  const { openShare, dialogProps } = useShareDialog({ url, title });

  return (
    <>
      <button
        type="button"
        onClick={openShare}
        aria-haspopup="dialog"
        className="flex h-[3.25rem] w-full items-center justify-center gap-2.5 rounded-xl bg-brand text-base font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        <ShareIcon className="size-[1.125rem]" />
        Bagikan Campaign
      </button>
      <ShareDialog {...dialogProps} />
    </>
  );
}
