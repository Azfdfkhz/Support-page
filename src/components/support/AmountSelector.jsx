import { formatCurrency, formatThousands } from "@/utils/formatCurrency";

const baseButton =
  "h-10 rounded-[10px] border text-sm font-semibold transition-colors";
const idleButton = "border-line bg-white text-brand hover:bg-brand-soft";
const activeButton = "border-brand bg-brand text-white";

export default function AmountSelector({
  presets,
  selectedAmount,
  isCustom,
  customValue,
  onSelectPreset,
  onSelectCustom,
  onCustomChange,
}) {
  return (
    <fieldset>
      <legend className="sr-only">Pilih nominal support</legend>

      <div className="grid grid-cols-3 gap-2.5">
        {presets.map((amount) => {
          const isActive = !isCustom && selectedAmount === amount;
          return (
            <button
              key={amount}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelectPreset(amount)}
              className={`${baseButton} ${isActive ? activeButton : idleButton}`}
            >
              {formatCurrency(amount)}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        aria-pressed={isCustom}
        onClick={onSelectCustom}
        className={`${baseButton} mt-2.5 w-full ${isCustom ? activeButton : idleButton}`}
      >
        Nominal Lain
      </button>

      {isCustom ? (
        <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-brand-soft/60 px-4 transition-colors focus-within:bg-[#dce8f7]">
          <span className="text-sm font-semibold text-brand">Rp</span>
          <input
            type="text"
            inputMode="numeric"
            autoFocus
            aria-label="Nominal support"
            value={formatThousands(customValue)}
            onChange={(event) => onCustomChange(event.target.value.replace(/\D/g, "").slice(0, 12))}
            placeholder="0"
            style={{ outline: "none", boxShadow: "none" }}
            className="h-11 w-full rounded-xl bg-transparent text-sm font-semibold text-ink outline-none"
          />
        </div>
      ) : null}
    </fieldset>
  );
}
