// Neutral loading placeholder shown while a page loads its data.
export default function PageSkeleton() {
  return (
    <div className="flex flex-1 animate-pulse flex-col gap-4 px-5 pt-6" aria-busy="true" aria-label="Memuat">
      <div className="h-24 rounded-2xl bg-brand-soft" />
      <div className="h-5 w-2/3 rounded bg-brand-soft" />
      <div className="h-5 w-1/2 rounded bg-brand-soft" />
      <div className="h-40 rounded-2xl bg-brand-soft" />
    </div>
  );
}
