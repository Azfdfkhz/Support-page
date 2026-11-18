export default function CampaignProgress({ percent }) {
  const value = Math.min(100, Math.max(0, percent));
  const rounded = Math.round(value);
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={rounded}
      aria-valuetext={`${rounded}% terkumpul`}
      aria-label="Progres donasi"
      className="h-1.5 w-full overflow-hidden rounded-full bg-brand-soft"
    >
      <div className="h-full rounded-full bg-brand" style={{ width: `${value}%` }} />
    </div>
  );
}
