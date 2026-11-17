import VerifiedIcon from "@/components/icons/VerifiedIcon";

export default function VerifiedBadge({ label = "Terverifikasi" }) {
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[0.4375rem] font-semibold leading-none text-emerald-700 ring-1 ring-emerald-200">
      <VerifiedIcon className="size-2 text-emerald-600" />
      {label}
    </span>
  );
}
