import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { formatCurrency } from "@/utils/formatCurrency";
import CampaignProgress from "./CampaignProgress";

/**
 * Props come from the campaign API:
 * { title, imageUrl, daysLeft, collectedAmount, targetAmount }
 */
export default function CampaignCard({ title, imageUrl, daysLeft, collectedAmount, targetAmount }) {
  const percent = targetAmount > 0 ? (collectedAmount / targetAmount) * 100 : 0;

  return (
    <article className="flex gap-2.5 py-4">
      <div className="relative h-[6.5rem] w-[11.375rem] shrink-0 overflow-hidden rounded-md bg-slate-200">
        <ImageWithFallback src={imageUrl} alt={title} sizes="182px" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="line-clamp-2 text-[0.9375rem] font-semibold leading-[1.55] text-ink">{title}</h3>

        <div className="mt-2">
          <CampaignProgress percent={percent} />
        </div>

        <dl className="mt-2 flex justify-between gap-2">
          <div>
            <dt className="text-xs text-muted">Sisa Waktu</dt>
            <dd className="text-sm font-bold text-ink">{daysLeft} hari</dd>
          </div>
          <div className="text-right">
            <dt className="text-xs text-muted">Terkumpul</dt>
            <dd className="text-sm font-bold text-ink">{formatCurrency(collectedAmount, { spaced: true })}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
