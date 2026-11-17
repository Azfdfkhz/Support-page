"use client";

import { useCallback, useState } from "react";
import { copyToClipboard } from "@/lib/clipboard";

/**
 * Copies `url` to the clipboard and opens the share popup.
 *
 *   const { openShare, dialogProps } = useShareDialog({ url, title });
 *   <button onClick={openShare}>Bagikan</button>
 *   <ShareDialog {...dialogProps} />
 *
 * The popup says "copied" only when the copy really succeeded; otherwise it still opens with the
 * link, a Salin button and the WhatsApp / native share options.
 */
export function useShareDialog({ url, title }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const openShare = useCallback(async () => {
    // Copy first, inside the click, so the browser still treats it as a user action.
    setCopied(await copyToClipboard(url));
    setOpen(true);
  }, [url]);

  const close = useCallback(() => setOpen(false), []);

  return { openShare, dialogProps: { open, copied, url, title, onClose: close, onCopied: setCopied } };
}
