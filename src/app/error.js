"use client";

import Link from "next/link";
import Shell from "@/components/onboarding/Shell";
import { INTRO_PATH } from "@/constants/routes";

export default function RouteError({ reset }) {
  return (
    <Shell>
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="text-xl font-bold text-ink">Terjadi kesalahan</h1>
        <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">
          Halaman tidak dapat dimuat saat ini. Silakan coba lagi.
        </p>
        <button type="button" onClick={reset} className="mt-6 h-12 w-full rounded-xl bg-brand text-[0.9375rem] font-semibold text-white">
          Coba lagi
        </button>
        <Link href={INTRO_PATH} className="mt-4 text-[0.8125rem] font-semibold text-brand">
          Kembali ke awal
        </Link>
      </div>
    </Shell>
  );
}
