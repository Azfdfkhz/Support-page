import Link from "next/link";
import { BackArrowIcon } from "./NavIcons";
import { SideNav } from "./DashboardNav";

/** Mobile top bar: back arrow + "Profil". */
export function MobileTopBar({ backHref }) {
  return (
    <header className="sticky top-0 z-10 flex h-[3.0625rem] items-center gap-6 border-b border-line/60 bg-white px-6 md:hidden">
      <Link href={backHref} aria-label="Kembali" className="text-ink">
        <BackArrowIcon className="size-5" />
      </Link>
      <span className="text-base font-medium text-ink">Profil</span>
    </header>
  );
}

/** Desktop sidebar: back arrow, logo, menu. */
export function Sidebar({ backHref }) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-[11rem] shrink-0 flex-col bg-white shadow-[2px_0_8px_rgba(9,31,64,0.06)] md:flex">
      <div className="flex items-center gap-6 px-5 pb-6 pt-7">
        <Link href={backHref} aria-label="Kembali" className="text-ink">
          <BackArrowIcon className="size-5" />
        </Link>
          <div className="justify-self-center">
            <img
              src="/images/Logo-SH.png"
              alt="Sharing Happiness"
              className="h-auto w-auto object-contain"
            />
          </div>
      </div>
      <div className="mt-4">
        <SideNav />
      </div>
    </aside>
  );
}
