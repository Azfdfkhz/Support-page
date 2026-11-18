import { Suspense } from "react";
import { BottomNav } from "@/components/dashboard/DashboardNav";
import { MobileTopBar, Sidebar } from "@/components/dashboard/DashboardSide";
import { creatorPath } from "@/constants/routes";
import { pageSlug } from "@/lib/slug";
import { getAccount } from "@/services/accountService";

export const metadata = { title: "Dashboard", robots: { index: false } };

function DashboardSkeleton() {
  return (
    <div className="mx-auto min-h-dvh max-w-[25.875rem] px-7 pt-20 md:ml-44 md:max-w-none md:px-10 md:pt-10" aria-busy="true">
      <div className="h-8 w-40 animate-pulse rounded-lg bg-skeleton" />
      <div className="mt-3 h-4 w-56 animate-pulse rounded-lg bg-skeleton" />
      <div className="mt-8 h-16 animate-pulse rounded-[1.25rem] bg-skeleton" />
      <div className="mt-5 h-24 animate-pulse rounded-[1.25rem] bg-skeleton" />
    </div>
  );
}

// Dashboard is full width on desktop, so it does not use the 414px `.app-shell` column.
// Account and page data are read per request, so everything sits inside one Suspense boundary.
async function DashboardFrame({ children }) {
  const account = await getAccount();
  const backHref = pageSlug(account) ? creatorPath(pageSlug(account)) : "/";

  return (
    <div className="flex min-h-dvh bg-white md:bg-dash-bg">
      <Sidebar backHref={backHref} />
      <div className="mx-auto flex min-w-0 max-w-[25.875rem] flex-1 flex-col md:mx-0 md:max-w-none">
        <MobileTopBar backHref={backHref} />
        <main className="flex-1 px-7 pb-32 pt-7 md:px-10 md:pb-12 md:pt-10">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardFrame>{children}</DashboardFrame>
    </Suspense>
  );
}
