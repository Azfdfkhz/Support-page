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
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          Link yang kamu buka tidak ada atau sudah tidak aktif.
        </p>
        <Link href={INTRO_PATH} className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-brand text-[15px] font-semibold text-white">
          Buat Support Page
        </Link>
      </div>
    </Shell>
  );
}
