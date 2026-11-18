import Link from "next/link";
import CopyLinkButton from "@/components/dashboard/CopyLinkButton";
import { HeartOutlineIcon } from "@/components/dashboard/NavIcons";
import { DASHBOARD_SUPPORTS_PATH, creatorPath } from "@/constants/routes";
import { DASHBOARD_DOMAIN, SITE_URL } from "@/lib/config";
import { formatCurrency } from "@/utils/formatCurrency";
import { pageSlug } from "@/lib/slug";
import { getAccount } from "@/services/accountService";
import { getDashboardSummary } from "@/services/dashboardService";

export const metadata = { title: "Ringkasan" };

const CARD = "rounded-[1.25rem] border border-line bg-white";

export default async function DashboardSummaryPage() {
  const [account, summary] = await Promise.all([getAccount(), getDashboardSummary()]);
  const slug = pageSlug(account);
  const pagePath = slug ? creatorPath(slug) : "/";
  const shareUrl = `${SITE_URL}${pagePath}`;
  const displayUrl = slug ? `${DASHBOARD_DOMAIN}/${slug}` : DASHBOARD_DOMAIN;

  return (
    <div className="mx-auto w-full max-w-[60rem] md:mx-0">
      <h1 className="text-[1.75rem] font-bold leading-tight text-ink md:text-[2rem]">
        Hai, {account.name}
        <span aria-hidden="true" className="md:hidden"> 👋</span>
      </h1>
      <p className="mt-1 text-base text-muted">
        <span className="md:hidden">Ini Ringkasan Support Page kamu.</span>
        <span className="hidden md:inline">Ini ringkasan Support Page kamu.</span>
      </p>

      {/* Page status */}
      <section className="mt-7 flex items-center justify-between rounded-[1.25rem] bg-brand-soft/70 px-6 py-4 md:mt-8 md:border md:border-line/70 md:px-4 md:py-4 md:pl-5">
        <p className="flex items-center gap-3 text-base font-semibold text-ink">
          <span aria-hidden="true" className={`size-3 rounded-full ${summary.isActive ? "bg-[#1FA463]" : "bg-muted"}`} />
          {summary.isActive ? "Support Page aktif" : "Support Page nonaktif"}
        </p>
        <Link
          href={pagePath}
          className="text-base font-semibold text-accent md:rounded-xl md:border md:border-brand md:bg-white md:px-6 md:py-2.5 md:text-sm md:text-brand md:transition-colors md:hover:bg-white/70"
        >
          Lihat<span className="hidden md:inline"> halaman</span>
        </Link>
      </section>

      {/* Share link */}
      <section className={`${CARD} mt-5 flex items-center justify-between gap-3 px-6 py-5 md:px-5 md:py-6`}>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-ink md:text-[0.9375rem]">Bagikan halamanmu</h2>
          <p className="mt-1 truncate text-base text-muted md:text-[0.9375rem]">{displayUrl}</p>
        </div>
        <CopyLinkButton url={shareUrl} variant="text" className="md:hidden" />
        <CopyLinkButton url={shareUrl} variant="outline" className="hidden md:block" />
      </section>

      {/* Stats */}
      <section aria-label="Statistik" className="mt-5 grid grid-cols-2 gap-4 md:gap-5">
        <div className={`${CARD} px-[1.0625rem] py-5 md:px-5`}>
          <p className="text-[0.9375rem] text-muted">Total Gift</p>
          <p className="mt-4 text-[1.75rem] font-bold leading-none text-ink md:mt-6">{formatCurrency(summary.totalGift)}</p>
        </div>
        <div className={`${CARD} px-[1.0625rem] py-5 md:px-5`}>
          <p className="text-[0.9375rem] text-muted">Pendukung</p>
          <p className="mt-4 text-[1.75rem] font-bold leading-none text-ink md:mt-6">{summary.supporterCount}</p>
        </div>
      </section>

      {/* Recent activity */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink">Aktivitas terbaru</h2>
          <Link href={DASHBOARD_SUPPORTS_PATH} className="text-[0.9375rem] font-semibold text-accent md:pr-6 md:text-sm md:text-brand">
            Lihat semua
          </Link>
        </div>

        {summary.activities.length === 0 ? (
          <div className="mt-4 flex flex-col items-center rounded-[1.25rem] bg-[#F6FAFF] px-6 pb-12 pt-10 text-center md:min-h-[13.5rem] md:justify-center md:border md:border-line/70 md:bg-white">
            <HeartOutlineIcon className="size-9 text-accent" />
            <h3 className="mt-3 text-lg font-semibold text-ink">Belum ada Support masuk</h3>
            <p className="mt-1 max-w-[18rem] text-[0.9375rem] leading-relaxed text-muted md:max-w-none">
              Support dan pesan dari pendukung akan muncul di sini.
            </p>
          </div>
        ) : (
          <ul className={`${CARD} mt-4 divide-y divide-line`}>
            {summary.activities.map((item) => (
              <li key={item.id} className="px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
                  <p className="shrink-0 text-sm font-semibold text-brand">{formatCurrency(item.amount)}</p>
                </div>
                {item.message && <p className="mt-1 text-sm text-muted">{item.message}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
