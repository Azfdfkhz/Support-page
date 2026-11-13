// Top progress line, 4px high. `progress` is 0 to 1.
// Filled part #1A73EB on a #E5F5FF track (hex set directly so it never depends on theme tokens).
export default function ProgressLine({ progress = 0.5, label }) {
  const percent = Math.min(100, Math.max(0, progress * 100));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
      className="mx-1 h-1 overflow-hidden rounded-full bg-[#E5F5FF]"
    >
      <div className="h-full rounded-full bg-[#1A73EB]" style={{ width: `${percent}%` }} />
    </div>
  );
}
