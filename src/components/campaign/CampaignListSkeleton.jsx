import Skeleton from "@/components/ui/Skeleton";

// Same geometry as CampaignList / CampaignCard: centered title, then image + text rows.
export default function CampaignListSkeleton({ count = 3 }) {
  return (
    <section role="status" aria-busy="true" aria-label="Memuat campaign" className="mt-6 px-4 pb-10">
      <Skeleton className="mx-auto h-[1.625rem] w-24" />
      <div className="mt-2 divide-y divide-line">
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="flex gap-2.5 py-4">
            <Skeleton className="h-[6.5rem] w-[11.375rem] shrink-0 rounded-md" />
            <div className="flex min-w-0 flex-1 flex-col">
              <Skeleton className="h-[1.125rem] w-full" />
              <Skeleton className="mt-2 h-[1.125rem] w-3/4" />
              <Skeleton className="mt-3 h-1.5 w-full rounded-full" />
              <div className="mt-2 flex justify-between gap-2">
                <div>
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="mt-1.5 h-4 w-12" />
                </div>
                <div className="flex flex-col items-end">
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="mt-1.5 h-4 w-20" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
