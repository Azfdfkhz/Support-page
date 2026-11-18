import SupportsView from "@/components/dashboard/SupportsView";
import { getSupports } from "@/services/dashboardService";

export const metadata = { title: "Dukungan" };

export default async function DashboardSupportsPage() {
  const { totalSupport, items, nextCursor } = await getSupports();

  return (
    <div className="mx-auto w-full max-w-auto md:mx-0">
      <h1 className="text-[1.75rem] font-bold leading-tight text-ink md:text-[2rem]">Dukungan</h1>
      <p className="mt-1 text-base text-muted">Lihat Gift dan pesan yang kamu terima.</p>
      <SupportsView totalSupport={totalSupport} items={items} nextCursor={nextCursor} />
    </div>
  );
}
