export default function TextField({ id, label, value, onChange, type = "text", autoComplete, error }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[0.8125rem] font-medium text-brand">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        style={{ outline: "none", boxShadow: "none" }}
        aria-describedby={error ? `${id}-error` : undefined}
        className="mt-1.5 w-full rounded-xl border-0 bg-brand-soft/60 px-3.5 py-2.5 text-base font-medium text-ink outline-none transition-colors placeholder:text-muted/60 focus:bg-[#dce8f7]"
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
