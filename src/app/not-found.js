import Link from "next/link";
import Shell from "@/components/onboarding/Shell";
import { INTRO_PATH } from "@/constants/routes";

export const metadata = { title: "Halaman tidak ditemukan", robots: { index: false } };

export default function NotFound() {
  return (
    <Shell>
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="text-5xl font-bold text-accent">404</p>
        <h1 className="mt-3 text-xl font-bold text-ink">Halaman tidak ditemukan</h1>
        <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">
          Page yang kamu buka tidak ada.
        </p>
      </div>
    </Shell>
  );
}
