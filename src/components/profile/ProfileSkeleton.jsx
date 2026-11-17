import CampaignListSkeleton from "@/components/campaign/CampaignListSkeleton";
import Skeleton from "@/components/ui/Skeleton";

// Loading state of the public support page. Mirrors ProfileHeader, SupportForm and the campaign
// list (same widths, heights and spacing) so nothing jumps when the real content arrives.
export default function ProfileSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-label="Memuat halaman">
      <header className="relative z-10 border-b border-line bg-surface pb-4 shadow-[0_0.25rem_0.625rem_-0.25rem_rgba(23,37,74,0.14)]">
        <Skeleton className="h-[7.5rem] w-full rounded-none" />
        <div className="flex flex-col items-center px-6">
          <div className="-mt-8 size-[5.5rem] rounded-full border-4 border-white bg-white shadow-sm">
            <Skeleton className="size-full rounded-full" />
          </div>
          <Skeleton className="mt-1.5 h-7 w-40" />
          <Skeleton className="mt-1 h-6 w-32" />
          <div className="mt-2 w-full space-y-1.5">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-11/12" />
            <Skeleton className="mx-auto h-3.5 w-2/3" />
          </div>
          <div className="mt-3.5 flex gap-2">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="size-8 rounded-full" />
          </div>
        </div>
      </header>

      <div className="mx-3 mt-4 rounded-2xl border border-line bg-surface p-4 shadow-[0_0.125rem_0.625rem_rgba(23,37,74,0.05)]">
        <Skeleton className="mb-3 h-7 w-44" />
        <div className="grid grid-cols-3 gap-2.5">
          <Skeleton className="h-10 rounded-[0.625rem]" />
          <Skeleton className="h-10 rounded-[0.625rem]" />
          <Skeleton className="h-10 rounded-[0.625rem]" />
        </div>
        <Skeleton className="mt-2.5 h-10 w-full rounded-[0.625rem]" />
        <div className="mt-4 rounded-xl border border-line bg-white p-3.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-1.5 h-[6.25rem] w-full rounded-xl" />
        </div>
        <Skeleton className="mt-4 h-[3.25rem] w-full rounded-full" />
      </div>

      <CampaignListSkeleton />
    </div>
  );
}
