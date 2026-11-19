"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AccountAvatar from "@/components/onboarding/AccountAvatar";
import { PencilIcon } from "./NavIcons";
import { ApiError } from "@/lib/api";
import { SHORT_DOMAIN } from "@/lib/config";
import { normalizeHandle } from "@/lib/validators";
import { updateSupportPage } from "@/services/pageSettingsService";

const MAX_BIO = 300;
// Batas upload di halaman pengaturan lebih besar (5 MB) karena creator sudah login di dashboard.
// Saat pendaftaran batasnya 1 MB (lihat RegisterForm) agar onboarding lebih cepat.
// Backend endpoint yang perlu mendukung ukuran ini: PATCH /support-pages/me
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png"];

const labelClass = "block text-[0.9375rem] font-semibold text-ink";
const inputClass =
  "mt-2 h-12 w-full rounded-2xl border border-line bg-white px-4 text-[0.9375rem] text-ink outline-none transition-colors placeholder:text-muted read-only:cursor-default focus:border-accent aria-[invalid=true]:border-red-500 md:h-10 md:rounded-xl";
const cardClass = "md:rounded-[1.25rem] md:border md:border-line md:bg-white md:p-6";

function FieldError({ id, message }) {
  return message ? (
    <p id={id} role="alert" className="mt-1 text-xs text-red-600">
      {message}
    </p>
  ) : null;
}

function SocialField({ id, label, value, error, readOnly, onChange }) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label} (opsional)
      </label>
      <input
        id={id}
        name={id}
        type="text"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        maxLength={31}
        readOnly={readOnly}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="@username"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={inputClass}
      />
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

/**
 * Settings for the creator's support page. Starts read-only; "Ubah" switches to editing,
 * "Batal" restores the saved values and "Simpan" saves them.
 * `initial`: { bio, socials: { instagram, tiktok, facebook }, coverImageUrl }
 */
export default function PageSettingsForm({ account, slug, initial }) {
  const fileInput = useRef(null);
  const previewRef = useRef("");
  const router = useRouter();
  // The saved values always come from `initial` (the registered page), so the form and the page
  // created at registration can never drift apart.
  const saved = {
    bio: initial.bio,
    instagram: initial.socials.instagram,
    tiktok: initial.socials.tiktok,
    facebook: initial.socials.facebook,
    coverUrl: initial.coverImageUrl,
  };
  const [editing, setEditing] = useState(false);
  const [draft, setValues] = useState(saved);
  const values = editing ? draft : saved;
  const [photo, setPhoto] = useState(null); // { file, url } chosen in this edit session
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    },
    [],
  );

  const setError = (field, message) => setErrors((prev) => ({ ...prev, [field]: message }));
  const setValue = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setError(field, "");
  };

  function clearPreview() {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = "";
    setPhoto(null);
  }

  function startEditing() {
    setNotice("");
    setValues(saved);
    setEditing(true);
  }

  function cancelEditing() {
    clearPreview();
    setValues(saved);
    setErrors({});
    setEditing(false);
  }

  function handlePhoto(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) return setError("photo", "Format harus JPG atau PNG.");
    if (file.size > MAX_PHOTO_BYTES) return setError("photo", "Ukuran foto maksimal 5 MB.");
    setError("photo", "");
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = URL.createObjectURL(file);
    setPhoto({ file, url: previewRef.current });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!editing || isSaving) return;

    const next = {};
    const handles = {};
    for (const field of ["instagram", "tiktok", "facebook"]) {
      const { value, error } = normalizeHandle(values[field]);
      handles[field] = value;
      if (error) next[field] = error;
    }
    setErrors(next);
    const first = ["instagram", "tiktok", "facebook"].find((field) => next[field]);
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }

    setIsSaving(true);
    try {
      const bio = values.bio.trim();
      await updateSupportPage({
        slug,
        account,
        photo: photo?.file ?? null,
        keepCover: saved.coverUrl,
        bio,
        ...handles,
      });
      clearPreview();
      setEditing(false);
      setNotice("Perubahan tersimpan.");
      router.refresh(); // Demo mode updates `initial` by itself; with the API this reloads the saved page.
    } catch (error) {
      setError(
        "submit",
        error instanceof ApiError && error.status === 422 && error.message
          ? error.message
          : "Gagal menyimpan perubahan. Periksa koneksi lalu coba lagi.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  const coverUrl = photo?.url ?? values.coverUrl;

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Account */}
      <section className="mt-6 flex items-center gap-4 rounded-[1.25rem] bg-[#E3F4FF] px-6 py-6 md:mt-8 md:border md:border-line/70 md:py-4 md:pl-8">
        <AccountAvatar name={account.name} avatarUrl={account.avatarUrl} size={56} />
        <div className="min-w-0">
          <p className="truncate text-2xl font-semibold leading-tight text-ink md:text-xl">{account.name}</p>
          <p className="mt-0.5 hidden text-sm text-muted md:block">Menggunakan nama dan foto profil di akun Sharing Happiness</p>
        </div>
      </section>

      <div className="mt-5 grid gap-5 md:grid-cols-[1.4fr_1fr]">
        <section className={cardClass}>
          <h2 className="hidden text-xl font-bold text-ink md:block">Profil halaman</h2>

          <div className="md:mt-5">
            <span className={labelClass}>Foto sampul</span>
            <input ref={fileInput} type="file" accept="image/jpeg,image/png" onChange={handlePhoto} className="sr-only" tabIndex={-1} aria-label="Pilih foto sampul" />
            <button
              type="button"
              disabled={!editing}
              onClick={() => fileInput.current?.click()}
              aria-describedby={errors.photo ? "photo-error" : undefined}
              data-invalid={Boolean(errors.photo)}
              className="relative mt-2 flex h-[11.5rem] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#b9dcf5] bg-[#F3F9FF] text-center disabled:cursor-default data-[invalid=true]:border-red-500 md:h-[14.5rem]"
            >
              {coverUrl ? (
                <img src={coverUrl} alt="Pratinjau foto sampul" className="absolute inset-0 size-full object-cover" />
              ) : (
                <>
                  <span aria-hidden="true" className="text-[2.5rem] font-light leading-none text-accent">+</span>
                  <span className="mt-3 text-base font-semibold text-ink">Unggah Foto Sampul</span>
                  <span className="mt-1 text-[0.8125rem] text-muted">JPG atau PNG · maks. 5 MB</span>
                </>
              )}
            </button>
            <FieldError id="photo-error" message={errors.photo} />
          </div>

          <div className="mt-5">
            <label htmlFor="bio" className={labelClass}>Bio</label>
            <div className="relative mt-2">
              <textarea
                id="bio"
                name="bio"
                rows={5}
                maxLength={MAX_BIO}
                readOnly={!editing}
                value={values.bio}
                onChange={(event) => setValue("bio", event.target.value)}
                placeholder="Tuliskan hal yang ingin orang tahu tentangmu..."
                className="block h-[11.5rem] w-full resize-none rounded-2xl border border-line bg-white px-4 pb-9 pt-3.5 text-[0.9375rem] text-ink outline-none placeholder:text-muted read-only:cursor-default focus:border-accent md:h-[11rem] md:rounded-xl"
              />
              <span className="pointer-events-none absolute bottom-3 right-4 text-sm text-muted">{values.bio.length} / {MAX_BIO}</span>
            </div>
          </div>
        </section>

        <section className={`${cardClass} mt-5 space-y-5 md:mt-0`}>
          <h2 className="hidden text-xl font-bold text-ink md:block">Media sosial &amp; tautan</h2>
          <SocialField id="instagram" label="Instagram" value={values.instagram} error={errors.instagram} readOnly={!editing} onChange={(v) => setValue("instagram", v)} />
          <SocialField id="tiktok" label="TikTok" value={values.tiktok} error={errors.tiktok} readOnly={!editing} onChange={(v) => setValue("tiktok", v)} />
          <SocialField id="facebook" label="Facebook" value={values.facebook} error={errors.facebook} readOnly={!editing} onChange={(v) => setValue("facebook", v)} />

          <div>
            <span id="slug-label" className={labelClass}>Link Support Page</span>
            <div className="mt-2 flex h-12 overflow-hidden rounded-2xl border border-line bg-white md:h-10 md:rounded-xl">
              <span className="grid shrink-0 place-items-center bg-brand-soft px-5 text-[0.9375rem] font-medium capitalize text-ink">{SHORT_DOMAIN}/</span>
              <span aria-labelledby="slug-label" aria-readonly="true" className="flex flex-1 items-center px-4 text-[0.9375rem] text-muted">
                {slug}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Actions */}
      <section className="mt-6 md:flex md:items-center md:justify-between md:gap-4 md:rounded-[1.25rem] md:border md:border-line md:bg-white md:px-5 md:py-4">
        <p className="hidden text-[0.9375rem] text-muted md:block">
          {editing ? "Pastikan informasi halamanmu sudah sesuai." : "Perbarui Sampul dan Tautan Support Page kamu."}
        </p>

        {editing ? (
          <div className="grid grid-cols-[1fr_1.6fr] gap-5 md:flex md:gap-3">
            <button
              type="button"
              onClick={cancelEditing}
              disabled={isSaving}
              className="h-12 rounded-xl border border-brand bg-white text-base font-semibold text-brand transition-colors hover:bg-brand-soft md:h-10 md:px-7 md:text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="h-12 rounded-xl bg-brand text-base font-semibold text-white shadow-[0_0.5rem_1.25rem_rgba(46,104,178,0.3)] transition-colors hover:bg-brand-dark disabled:opacity-60 md:h-10 md:px-6 md:text-sm md:shadow-none"
            >
              {isSaving ? "Menyimpan..." : <>Simpan<span className="hidden md:inline"> perubahan</span></>}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={startEditing}
            className="flex h-12 items-center gap-3 rounded-xl bg-brand px-7 text-base font-semibold text-white shadow-[0_0.5rem_1.25rem_rgba(46,104,178,0.3)] transition-colors hover:bg-brand-dark md:h-10 md:px-6 md:text-sm md:shadow-none"
          >
            <PencilIcon className="size-5 md:hidden" />
            Ubah<span className="hidden md:inline"> halaman</span>
          </button>
        )}
      </section>

      <p role={errors.submit ? "alert" : "status"} className={`mt-3 min-h-5 text-sm ${errors.submit ? "text-red-600" : "text-muted"}`}>
        {errors.submit || notice}
      </p>
    </form>
  );
}
