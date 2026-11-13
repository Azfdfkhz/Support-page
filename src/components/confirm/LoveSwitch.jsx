import HeartIcon from "@/components/icons/HeartIcon";

// Switch with a heart thumb. On: #EF3554 track with inner shadow, white thumb with #EF3554 heart.
export default function LoveSwitch({ checked, onChange, labelledBy }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-[52px] shrink-0 rounded-full transition-colors ${
        checked ? "bg-[#EF3554] shadow-[inset_0_2px_5px_rgba(0,0,0,0.25)]" : "bg-slate-300 shadow-[inset_0_2px_5px_rgba(0,0,0,0.15)]"
      }`}
    >
      <span
        className={`absolute top-1/2 grid size-[22px] -translate-y-1/2 place-items-center rounded-full bg-white text-[#EF3554] shadow transition-[left] ${
          checked ? "left-[27px]" : "left-[3px]"
        }`}
      >
        <HeartIcon className="size-3.5" />
      </span>
    </button>
  );
}
