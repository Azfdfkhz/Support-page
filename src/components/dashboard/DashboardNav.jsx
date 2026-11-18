"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DASHBOARD_PAGE_PATH, DASHBOARD_SUMMARY_PATH, DASHBOARD_SUPPORTS_PATH } from "@/constants/routes";
import { PageIcon, SummaryIcon, SupportIcon } from "./NavIcons";

const ITEMS = [
  { href: DASHBOARD_SUMMARY_PATH, label: "Ringkasan", Icon: SummaryIcon },
  { href: DASHBOARD_SUPPORTS_PATH, label: "Dukungan", Icon: SupportIcon },
  { href: DASHBOARD_PAGE_PATH, label: "Halaman", Icon: PageIcon },
];

function useActive() {
  const pathname = usePathname();
  return (item) => pathname === item.href || pathname.startsWith(`${item.href}/`);
}

// Active #2E68B2, idle #686C71 (nav-active / nav-idle theme colors).
const tone = (active) => (active ? "text-nav-active" : "text-nav-idle");

/** Mobile: floating tab bar at the bottom of the screen. */
export function BottomNav() {
  const isActive = useActive();
  return (
    <nav
      aria-label="Menu dashboard"
      className="fixed inset-x-3.5 bottom-4 z-20 mx-auto max-w-[25.875rem] rounded-[1.5rem] border border-line bg-white px-2 py-2.5 md:hidden"
    >
      <ul className="grid grid-cols-3">
        {ITEMS.map((item) => {
          const active = isActive(item);
          return (
            <li key={item.href}>
              <Link href={item.href} aria-current={active ? "page" : undefined} className={`flex flex-col items-center gap-1 py-1 text-[0.8125rem] font-semibold ${tone(active)}`}>
                <item.Icon className="size-6" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Desktop: vertical menu in the sidebar, with a bar on the left edge for the current page. */
export function SideNav() {
  const isActive = useActive();
  return (
    <nav aria-label="Menu dashboard">
      <ul className="space-y-2">
        {ITEMS.map((item) => {
          const active = isActive(item);
          return (
            <li key={item.href} className="relative">
              {active && <span aria-hidden="true" className="absolute inset-y-1 left-0 w-1 rounded-r-full bg-nav-active" />}
              <Link href={item.href} aria-current={active ? "page" : undefined} className={`flex items-center gap-3.5 px-5 py-3 text-sm font-semibold ${tone(active)}`}>
                <item.Icon className="size-6 shrink-0" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
