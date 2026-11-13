"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HeartIcon from "@/components/icons/HeartIcon";
import LoveSwitch from "./LoveSwitch";
import { SUCCESS_PATH, creatorPath } from "@/constants/routes";
import { LOGIN_URL } from "@/lib/config";
import { ApiError } from "@/lib/api";
import { validateContact } from "@/lib/validators";
import { createDonation } from "@/services/donationService";
import { formatCurrency } from "@/utils/formatCurrency";

const MAX_NAME = 80;
const MAX_PRAYER = 500;

const underlineInput =
  "mt-0.5 w-full border-0 border-b border-brand bg-transparent pb-1 text-[13px] font-medium text-slate-700 outline-none aria-[invalid=true]:border-red-500";

export default function ConfirmForm({ creatorSlug, amount, initialPrayer = "" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [hideName, setHideName] = useState(false);
  const [prayer, setPrayer] = useState(initialPrayer);
  const [wantsUpdates, setWantsUpdates] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function setError(field, message) {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    const next = {};
    if (!name.trim()) next.name = "Nama wajib diisi.";
    const contactError = validateContact(contact);
    if (contactError) next.contact = contactError;
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setIsSubmitting(true);
    try {
      const { reference } = await createDonation({
        creatorSlug,
        amount,
        name: name.trim(),
        contact: contact.trim(),
        hideName,
        prayer: prayer.trim(),
        wantsUpdates,
        paymentMethod: "bca-transfer",
      });
      const query = new URLSearchParams({ ref: reference, creator: creatorSlug, amount: String(amount) });
      router.push(`${SUCCESS_PATH}?${query.toString()}`);
    } catch (error) {
      setError(
        "submit",
        error instanceof ApiError && error.status === 422 && error.message
          ? error.message
          : "Gagal melanjutkan pembayaran. Periksa koneksi lalu coba lagi.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col px-5 pb-8">
      <header className="flex items-center gap-3 pb-3 pt-4">
        <Link href={creatorPath(creatorSlug)} aria-label="Kembali" className="grid size-8 place-items-center text-ink">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-base font-medium text-ink">Pilih Opsi Pembayaran</h1>
      </header>

      <section aria-label="Nominal donasi" className="flex items-center justify-between overflow-hidden rounded-2xl border border-line bg-brand-soft/70 py-4 pl-4 pr-3">
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-brand">Kamu akan berdonasi sebesar:</p>
          <p className="mt-2 truncate text-[30px] font-bold leading-none text-brand">{formatCurrency(amount, { spaced: true })}</p>
        </div>
        <Image src="/donation_icon.png" alt="" width={60} height={74} className="shrink-0" />
      </section>

      <section aria-label="Metode pembayaran" className="mt-3 flex items-center gap-3 rounded-2xl border border-line bg-white p-3.5">
        <span className="grid h-10 w-[50px] shrink-0 place-items-center rounded-lg border border-line text-sm font-bold text-brand">BCA</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">Bank Transfer</p>
          <p className="text-xs font-medium text-[#059669]">Terverifikasi Manual 1x24 Jam</p>
        </div>
        {/* Only one payment method is available for now, so there is nothing to change to yet. */}
        <button type="button" disabled className="h-8 shrink-0 rounded-lg bg-brand px-3.5 text-xs font-semibold text-white opacity-60" aria-label="Ganti metode pembayaran (belum tersedia)">
          Ganti
        </button>
      </section>

      {LOGIN_URL ? (
        <p className="mt-3 text-center text-[13px] text-slate-500">
          <a href={LOGIN_URL} className="mr-1 rounded-md bg-brand-soft px-2.5 py-1 font-semibold text-brand">Masuk</a>
          atau lengkapi data dibawah ini
        </p>
      ) : (
        <p className="mt-3 text-center text-[13px] text-slate-500">Lengkapi data dibawah ini</p>
      )}

      <section aria-label="Data donatur" className="mt-3 rounded-2xl border border-line bg-white px-4 py-4 shadow-[0_2px_10px_rgba(9,31,64,0.05)]">
        <div>
          <label htmlFor="donor-name" className="block text-xs font-medium text-brand">Nama</label>
          <input
            id="donor-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={MAX_NAME}
            value={name}
            onChange={(event) => { setName(event.target.value); setError("name", ""); }}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "donor-name-error" : undefined}
            className={underlineInput}
          />
          {errors.name ? <p id="donor-name-error" role="alert" className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
        </div>

        <div className="mt-3.5">
          <label htmlFor="donor-contact" className="block text-xs font-medium text-brand">No WhatsApp/Email</label>
          <input
            id="donor-contact"
            name="contact"
            type="text"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            maxLength={120}
            value={contact}
            onChange={(event) => { setContact(event.target.value); setError("contact", ""); }}
            aria-invalid={Boolean(errors.contact)}
            aria-describedby={errors.contact ? "donor-contact-error" : undefined}
            className={underlineInput}
          />
          {errors.contact ? <p id="donor-contact-error" role="alert" className="mt-1 text-xs text-red-600">{errors.contact}</p> : null}
          <p className="mt-2 flex items-start gap-1.5 text-xs text-slate-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mt-0.5 size-3 shrink-0" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            Pastikan data yang kamu masukkan benar untuk menerima laporan donasi.
          </p>
        </div>

        <div className="mt-3.5 flex items-center justify-between gap-3">
          <label htmlFor="hide-name" className="min-w-0 flex-1">
            <span className="block text-[13px] font-semibold text-slate-600">Sembunyikan Nama Saya</span>
            <span className="block text-[11px] leading-snug text-muted">Ditampilkan sebagai “Teman Berbagi” di halaman Campaign</span>
          </label>
          <input
            id="hide-name"
            type="checkbox"
            checked={hideName}
            onChange={(event) => setHideName(event.target.checked)}
            className="size-7 shrink-0 cursor-pointer appearance-none rounded-lg border border-brand bg-slate-50 shadow-sm checked:bg-brand checked:bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22white%22%20stroke-width=%223%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%3E%3Cpath%20d=%22m5%2012.5%204.5%204.5L19%207%22/%3E%3C/svg%3E')] checked:bg-center checked:bg-no-repeat"
          />
        </div>
      </section>

      <section aria-label="Doa dan harapan" className="mt-3 rounded-2xl border border-line bg-white p-4 shadow-[0_2px_10px_rgba(9,31,64,0.05)]">
        <label htmlFor="prayer" className="block text-[13px] font-semibold text-ink">
          Tulis Doa atau Harapan kamu <span className="font-normal text-muted">(Opsional)</span>
        </label>
        <textarea
          id="prayer"
          name="prayer"
          rows={4}
          maxLength={MAX_PRAYER}
          value={prayer}
          onChange={(event) => setPrayer(event.target.value)}
          placeholder="Kamu bisa doakan penerima manfaat, keluarga, kerabat, atau untuk diri sendiri di sini. Doa baikmu akan menguatkan mereka..."
          className="mt-2.5 block w-full resize-none rounded-xl border border-line bg-brand-soft/40 px-3.5 py-2.5 text-[13px] text-ink outline-none placeholder:text-muted/70 focus:border-brand"
        />
        <p className="mt-2.5 flex items-start gap-2.5 rounded-xl border border-[#a9cdf0] bg-brand-soft/60 px-3 py-2.5 text-[13px] text-brand">
          <HeartIcon className="mt-0.5 size-3.5 shrink-0 text-red-600" />
          Doa yang tulus membawa keberkahan dan ketenangan hati.
        </p>
      </section>

      <div className="mt-5 flex items-center justify-between gap-4 px-1">
        <p id="updates-label" className="text-[13px] font-semibold text-slate-600">Bersedia dihubungi tentang program kebaikan lainnya.</p>
        <LoveSwitch checked={wantsUpdates} onChange={setWantsUpdates} labelledBy="updates-label" />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mx-auto mt-6 h-[52px] w-[70%] rounded-full bg-brand text-base font-semibold text-white shadow-[0_10px_20px_rgba(46,104,178,0.3)] transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {isSubmitting ? "Memproses..." : "Lanjut"}
      </button>
      <p role="alert" className="mt-2 min-h-4 text-center text-xs text-red-600">{errors.submit}</p>
    </form>
  );
}
