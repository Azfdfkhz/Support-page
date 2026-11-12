"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TextField from "@/components/ui/TextField";
import TextAreaField from "@/components/ui/TextAreaField";
import { SUPPORT_AMOUNT_PRESETS } from "@/constants/supportAmounts";
import { submitSupport } from "@/services/supportService";
import AmountSelector from "./AmountSelector";

export default function SupportForm({ creatorName }) {
  const router = useRouter();
  const [presetAmount, setPresetAmount] = useState(null);
  const [isCustom, setIsCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

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

  function handleNameChange(value) {
    setName(value);
    clearError("name");
  }

  function handleContactChange(value) {
    setContact(value);
    clearError("contact");
  }

  function validate() {
    const next = {};
    if (!amount) next.amount = "Pilih atau isi nominal support.";
    if (!name.trim()) next.name = "Nama wajib diisi.";
    if (!contact.trim()) next.contact = "No WhatsApp/Email wajib diisi.";
    return next;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    setSubmitError("");
    try {
      const { paymentPath } = await submitSupport({
        amount,
        name: name.trim(),
        contact: contact.trim(),
        message: message.trim(),
      });
      // Keep the button in its loading state while navigating to payment.
      router.push(paymentPath);
    } catch {
      setSubmitError("Gagal mengirim support. Silakan coba lagi.");
      setIsSubmitting(false);
    }
  }

  return (
    <section
      aria-labelledby="support-title"
      className="mx-3 mt-4 rounded-2xl border border-line bg-surface p-4 shadow-[0_2px_10px_rgba(23,37,74,0.05)]"
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
        />
        {errors.amount ? <p className="mt-1.5 text-xs text-red-600">{errors.amount}</p> : null}

        <div className="mt-4 space-y-4 rounded-xl border border-line bg-white p-3.5">
          <div className="space-y-4">
            <TextField id="name" label="Nama" value={name} onChange={handleNameChange} autoComplete="name" error={errors.name} />
            <TextField
              id="contact"
              label="No WhatsApp/Email"
              value={contact}
              onChange={handleContactChange}
              autoComplete="email"
              error={errors.contact}
            />
          </div>
          <TextAreaField
            id="message"
            label="Pesan"
            hint="Opsional"
            value={message}
            onChange={setMessage}
            placeholder="Tulis sesuatu yang menyemangati..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 h-[52px] w-full rounded-full bg-brand text-base font-bold text-white shadow-[0_6px_14px_rgba(47,103,178,0.3)] transition-colors hover:bg-brand-dark disabled:opacity-60"
        >
          {isSubmitting ? "Mengirim..." : "Kirim Support"}
        </button>

        <p role="alert" className="mt-2 text-center text-xs text-red-600">
          {submitError}
        </p>
      </form>
    </section>
  );
}
