"use client";

import { useState } from "react";
import TextAreaField from "@/components/ui/TextAreaField";
import { MAX_SUPPORT_AMOUNT, MIN_SUPPORT_AMOUNT, SUPPORT_AMOUNT_PRESETS } from "@/constants/supportAmounts";
import { formatCurrency } from "@/utils/formatCurrency";
import AmountSelector from "./AmountSelector";

export default function SupportForm({ creatorName, creatorSlug }) {
  const [presetAmount, setPresetAmount] = useState(null);
  const [isCustom, setIsCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const amount = isCustom ? Number(customAmount) : presetAmount;

  function clearError(field) {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }

  function handleSelectPreset(value) {
    setIsCustom(false);
    setPresetAmount(value);
    clearError("amount");
  }

  function handleCustomAmountChange(value) {
    setCustomAmount(value);
    if (value) clearError("amount");
  }

  function handleCustomAmountBlur() {
    if (!customAmount) return;
    const value = Number(customAmount);
    if (value < MIN_SUPPORT_AMOUNT) {
      setErrors((prev) => ({ ...prev, amount: `Nominal minimal ${formatCurrency(MIN_SUPPORT_AMOUNT)}.` }));
    } else if (value > MAX_SUPPORT_AMOUNT) {
      setErrors((prev) => ({ ...prev, amount: `Nominal maksimal ${formatCurrency(MAX_SUPPORT_AMOUNT)}.` }));
    }
  }

  function validate() {
    const next = {};
    if (!amount) next.amount = "Pilih atau isi nominal support.";
    else if (amount < MIN_SUPPORT_AMOUNT) next.amount = `Nominal minimal ${formatCurrency(MIN_SUPPORT_AMOUNT)}.`;
    else if (amount > MAX_SUPPORT_AMOUNT) next.amount = `Nominal maksimal ${formatCurrency(MAX_SUPPORT_AMOUNT)}.`;
    return next;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // Submit handler — belum disambungkan ke halaman pembayaran/konfirmasi
  }

  return (
    <section
      aria-labelledby="support-title"
      className="mx-3 mt-4 rounded-2xl border border-line bg-surface p-4 shadow-[0_0.125rem_0.625rem_rgba(23,37,74,0.05)]"
    >
      <h2 id="support-title" className="mb-3 text-lg font-bold text-ink">
        Support {creatorName}
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        <AmountSelector
          presets={SUPPORT_AMOUNT_PRESETS}
          selectedAmount={presetAmount}
          isCustom={isCustom}
          customValue={customAmount}
          onSelectPreset={handleSelectPreset}
          onSelectCustom={() => setIsCustom(true)}
          onCustomChange={handleCustomAmountChange}
          onCustomBlur={handleCustomAmountBlur}
        />
        {errors.amount ? <p className="mt-1.5 text-xs text-red-600">{errors.amount}</p> : null}

        <div className="mt-4 rounded-xl border border-line bg-white p-3.5">
          <TextAreaField
            id="message"
            maxLength={500}
            label="Pesan"
            hint="Opsional"
            value={message}
            onChange={setMessage}
            placeholder="Tulis sesuatu yang menyemangati..."
          />
        </div>

        <button
          type="submit"
          className="mt-4 h-[3.25rem] w-full rounded-full bg-brand text-base font-bold text-white shadow-[0_0.375rem_0.875rem_rgba(47,103,178,0.3)] transition-colors hover:bg-brand-dark"
        >
          Kirim Support
        </button>
      </form>
    </section>
  );
}
