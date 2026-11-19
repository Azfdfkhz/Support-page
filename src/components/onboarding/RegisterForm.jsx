"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import AccountAvatar from "./AccountAvatar";
import ProgressLine from "./ProgressLine";
import { READY_PATH } from "@/constants/routes";
import { SHORT_DOMAIN } from "@/lib/config";
import { ApiError } from "@/lib/api";
import { defaultSlug } from "@/lib/slug";
import { normalizeHandle, validateSlug } from "@/lib/validators";
import { registerSupportPage } from "@/services/registerService";

const MAX_BIO = 300;
// Batas upload saat pendaftaran sengaja lebih kecil (1 MB) agar onboarding lebih cepat.
// Di halaman pengaturan dashboard (PageSettingsForm) batasnya 5 MB karena koneksi lebih stabil.
// Sesuaikan batas di backend untuk masing-masing endpoint:
//   POST /support-pages  → terima s/d 1 MB
//   PATCH /support-pages/me → terima s/d 5 MB
const MAX_PHOTO_BYTES = 1 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png"];

const labelClass = "block text-[0.8125rem] font-semibold text-ink";
const inputClass =
  "mt-1.5 h-11 w-full rounded-xl border border-line bg-white px-3.5 text-[0.8125rem] text-ink placeholder:text-muted outline-none transition-colors focus:border-accent aria-[invalid=true]:border-red-500";

function FieldError({ id, message }) {
  return message ? (
    <p id={id} role="alert" className="mt-1 text-xs text-red-600">
      {message}
    </p>
  ) : null;
}

function SocialField({ id, label, value, error, onChange }) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label} <span className="font-normal text-muted">(opsional)</span>
      </label>
      <input
        id={id}
        name={id}
        type="text"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        maxLength={31}
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

export default function RegisterForm({ account }) {
  const router = useRouter();
  const fileInput = useRef(null);
  const [photo, setPhoto] = useState(null); // { file, url } where url is the local preview
  const photoRef = useRef(null);
  const [bio, setBio] = useState("");
  const [social, setSocial] = useState({ instagram: "", tiktok: "", facebook: "" });
  const [slug, setSlug] = useState(() => defaultSlug(account));
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // creating the page (API call)
  const [isNavigating, startTransition] = useTransition(); // moving on to the ready page
  const isBusy = isSubmitting || isNavigating;

  // The preview URL is created when a photo is chosen; release the last one when leaving the page.
  useEffect(
    () => () => {
      if (photoRef.current) URL.revokeObjectURL(photoRef.current.url);
    },
    [],
  );

  function setError(field, message) {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }

  function handlePhoto(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("photo", "Format harus JPG atau PNG.");
    } else if (file.size > MAX_PHOTO_BYTES) {
      setError("photo", "Ukuran foto maksimal 1 MB.");
    } else {
      setError("photo", "");
      if (photoRef.current) URL.revokeObjectURL(photoRef.current.url);
      photoRef.current = { file, url: URL.createObjectURL(file) };
      setPhoto(photoRef.current);
    }
  }

  function handleSocialChange(field, value) {
    setSocial((prev) => ({ ...prev, [field]: value }));
    setError(field, "");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isBusy) return;

    const next = {};
    const handles = {};
    for (const field of ["instagram", "tiktok", "facebook"]) {
      const { value, error } = normalizeHandle(social[field]);
      handles[field] = value;
      if (error) next[field] = error;
    }
    const slugError = validateSlug(slug.trim());
    if (slugError) next.slug = slugError;
    if (!photo) next.photo = "Foto sampul wajib diunggah.";
    if (!bio.trim()) next.bio = "Bio wajib diisi.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      // Bring the first problem into view, in on-screen order.
      const first = ["photo", "bio", "instagram", "tiktok", "facebook", "slug"].find((field) => next[field]);
      const target = first === "photo" ? fileInput.current?.nextElementSibling : document.getElementById(first);
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (first !== "photo") target?.focus({ preventScroll: true });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await registerSupportPage({ photo: photo.file, bio: bio.trim(), ...handles, slug: slug.trim(), account });
      // Hand over to the navigation state in the same update (see SupportForm for why).
      setIsSubmitting(false);
      startTransition(() => {
        router.push(`${READY_PATH}?slug=${encodeURIComponent(result.slug)}`);
      });
    } catch (error) {
      if (error instanceof ApiError && (error.status === 409 || error.code === "SLUG_TAKEN")) {
        setError("slug", "Link ini sudah dipakai. Coba yang lain.");
      } else if (error instanceof ApiError && error.status === 422 && error.message) {
        setError("submit", error.message);
      } else {
        setError("submit", "Gagal membuat support page. Periksa koneksi lalu coba lagi.");
      }
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col px-5 pb-8 pt-5">
      <ProgressLine progress={0.54} label="Langkah 1 dari 2" />

      <h1 className="mt-6 text-[1.375rem] font-bold leading-tight text-ink">Daftar Support Page</h1>

      <div className="mt-4 flex items-center gap-3">
        <AccountAvatar name={account.name} avatarUrl={account.avatarUrl} size={56} />
        <div className="min-w-0">
          <p className="truncate text-xl font-semibold leading-tight text-ink">{account.name}</p>
          <p className="text-[0.6875rem] leading-snug text-muted">Menggunakan nama dan foto profil di akun Sharing Happiness</p>
        </div>
      </div>

      <div className="mt-5">
        <span className={labelClass}>Foto sampul <span className="text-red-600" aria-hidden="true">*</span></span>
        <input ref={fileInput} type="file" accept="image/jpeg,image/png" onChange={handlePhoto} className="sr-only" tabIndex={-1} aria-label="Pilih foto sampul" />
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          aria-describedby={errors.photo ? "photo-error" : undefined}
          data-invalid={Boolean(errors.photo)}
          className="relative mt-1.5 flex h-[6.25rem] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#b9dcf5] bg-brand-soft/60 text-center data-[invalid=true]:border-red-500"
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo.url} alt="Pratinjau foto sampul" className="absolute inset-0 size-full object-cover" />
          ) : (
            <>
              <span aria-hidden="true" className="text-2xl font-light leading-none text-accent">+</span>
              <span className="mt-1.5 text-[0.8125rem] font-semibold text-ink">Unggah Foto Sampul</span>
              <span className="mt-0.5 text-[0.6875rem] text-muted">JPG atau PNG · maks. 1 MB</span>
            </>
          )}
        </button>
        <FieldError id="photo-error" message={errors.photo} />
      </div>

      <div className="mt-4">
        <label htmlFor="bio" className={labelClass}>Bio <span className="text-red-600" aria-hidden="true">*</span></label>
        <div className="relative mt-1.5">
          <textarea
            id="bio"
            name="bio"
            rows={4}
            maxLength={MAX_BIO}
            value={bio}
            onChange={(event) => { setBio(event.target.value); setError("bio", ""); }}
            aria-invalid={Boolean(errors.bio)}
            aria-describedby={errors.bio ? "bio-error" : undefined}
            placeholder="Tuliskan hal yang ingin orang tahu tentangmu..."
            className="block w-full resize-none rounded-xl border border-line bg-white px-3.5 pb-7 pt-3 text-[0.8125rem] text-ink outline-none placeholder:text-muted focus:border-accent aria-[invalid=true]:border-red-500"
          />
          <span className="pointer-events-none absolute bottom-2.5 right-3.5 text-[0.6875rem] text-muted">{bio.length} / {MAX_BIO}</span>
        </div>
        <FieldError id="bio-error" message={errors.bio} />
      </div>

      <div className="mt-4 space-y-4">
        <SocialField id="instagram" label="Instagram" value={social.instagram} error={errors.instagram} onChange={(v) => handleSocialChange("instagram", v)} />
        <SocialField id="tiktok" label="TikTok" value={social.tiktok} error={errors.tiktok} onChange={(v) => handleSocialChange("tiktok", v)} />
        <SocialField id="facebook" label="Facebook" value={social.facebook} error={errors.facebook} onChange={(v) => handleSocialChange("facebook", v)} />
      </div>

      <div className="mt-4">
        <label htmlFor="slug" className={labelClass}>Link Support Page</label>
        <div className="mt-1.5 flex h-11 overflow-hidden rounded-xl border border-line bg-white">
          <span className="grid shrink-0 place-items-center bg-brand-soft px-4 text-[0.8125rem] font-medium text-ink">{SHORT_DOMAIN}/</span>
          <span
            id="slug"
            aria-readonly="true"
            className="flex flex-1 items-center bg-white px-3.5 text-[0.8125rem] font-medium text-muted select-all"
          >
            {slug}
          </span>
        </div>
        <FieldError id="slug-error" message={errors.slug} />
      </div>

      <button
        type="submit"
        disabled={isBusy}
        className="mt-6 h-[3.25rem] w-full rounded-xl bg-brand text-base font-semibold text-white shadow-[0_0.375rem_0.875rem_rgba(46,104,178,0.3)] transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {isBusy ? "Membuat..." : "Buat Support Page"}
      </button>
      <p role="alert" className="mt-2 min-h-4 text-center text-xs text-red-600">{errors.submit}</p>
    </form>
  );
}
