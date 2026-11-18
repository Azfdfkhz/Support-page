"use client";

import { useEffect, useRef, useState } from "react";
import { copyToClipboard } from "@/lib/clipboard";

const LABELS = {
  text: { idle: "Salin", copied: "Tersalin", failed: "Gagal" },
  outline: { idle: "Salin link", copied: "Link tersalin", failed: "Gagal menyalin" },
};

const STYLES = {
  text: "shrink-0 pl-3 text-base font-semibold text-accent",
  outline: "h-11 shrink-0 rounded-xl border border-brand bg-white px-6 text-sm font-semibold text-brand transition-colors hover:bg-brand-soft",
};

/** Copies `url`. `variant="text"` is the mobile text link, `"outline"` the desktop button. */
export default function CopyLinkButton({ url, variant = "text", className = "" }) {
  const [state, setState] = useState("idle");
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    const ok = await copyToClipboard(url);
    setState(ok ? "copied" : "failed");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2000);
  }

  return (
    <button type="button" onClick={copy} aria-live="polite" className={`${STYLES[variant]} ${className}`}>
      {LABELS[variant][state]}
    </button>
  );
}
