export default function TextAreaField({ id, label, hint, value, onChange, placeholder, rows = 4, maxLength }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[0.8125rem] font-medium text-ink">
        {label} {hint ? <span className="font-normal text-muted">({hint})</span> : null}
      </label>
      <textarea
        id={id}
        name={id}
        rows={rows}
        maxLength={maxLength}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        style={{ outline: "none", boxShadow: "none" }}
        className="mt-1.5 block w-full resize-none rounded-xl border-0 bg-brand-soft/60 px-3.5 py-2.5 text-[0.8125rem] text-ink outline-none transition-colors placeholder:text-muted/70 focus:bg-[#dce8f7]"
      />
    </div>
  );
}
