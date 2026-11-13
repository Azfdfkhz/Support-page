"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AccountAvatar from "./AccountAvatar";
import ProgressLine from "./ProgressLine";
import { READY_PATH } from "@/constants/routes";
import { SHORT_DOMAIN } from "@/lib/config";
import { ApiError } from "@/lib/api";
import { normalizeHandle, sanitizeSlugInput, validateSlug } from "@/lib/validators";
import { registerSupportPage } from "@/services/registerService";

const MAX_BIO = 300;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png"];

const labelClass = "block text-[13px] font-semibold text-ink";
const inputClass =
  "mt-1.5 h-11 w-full rounded-xl border border-line bg-white px-3.5 text-[13px] text-ink placeholder:text-muted outline-none transition-colors focus:border-accent aria-[invalid=true]:border-red-500";

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
  const [photo, setPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [bio, setBio] = useState("");
  const [social, setSocial] = useState({ instagram: "", tiktok: "", facebook: "" });
  const [slug, setSlug] = useState(() => sanitizeSlugInput(account.name));
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preview URL for the chosen cover photo; revoked on change/unmount.
  useEffect(() => {
    if (!photo) {
      setPhotoUrl("");
      return undefined;
    }
    const url = URL.createObjectURL(photo);
    setPhotoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

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
      setError("photo", "Ukuran foto maksimal 5 MB.");
    } else {
      setError("photo", "");
      setPhoto(file);
    }
  }

  function handleSocialChange(field, value) {
    setSocial((prev) => ({ ...prev, [field]: value }));
    setError(field, "");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    const next = {};
    const handles = {};
    for (const field of ["instagram", "tiktok", "facebook"]) {
      const { value, error } = normalizeHandle(social[field]);
      handles[field] = value;
      if (error) next[field] = error;
    }
    const slugError = validateSlug(slug);
    if (slugError) next.slug = slugError;
    setErrors((prev) => ({ photo: prev.photo, ...next }));
    if (Object.keys(next).length > 0) return;

    setIsSubmitting(true);
    try {
      const result = await registerSupportPage({ photo, bio: bio.trim(), ...handles, slug: slug.trim() });
      router.push(`${READY_PATH}?slug=${encodeURIComponent(result.slug)}`);
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

      <h1 className="mt-6 text-[22px] font-bold leading-tight text-ink">Daftar Support Page</h1>

      <div className="mt-4 flex items-center gap-3">
        <AccountAvatar name={account.name} avatarUrl={account.avatarUrl} size={56} />
        <div className="min-w-0">
          <p className="truncate text-xl font-semibold leading-tight text-ink">{account.name}</p>
          <p className="text-[11px] leading-snug text-muted">Menggunakan nama dan foto profil di akun Sharing Happiness</p>
        </div>
      </div>

      <div className="mt-5">
        <span className={labelClass}>Foto sampul</span>
        <input ref={fileInput} type="file" accept="image/jpeg,image/png" onChange={handlePhoto} className="sr-only" tabIndex={-1} aria-label="Pilih foto sampul" />
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className="relative mt-1.5 flex h-[100px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#b9dcf5] bg-brand-soft/60 text-center"
        >
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="Pratinjau foto sampul" className="absolute inset-0 size-full object-cover" />
          ) : (
            <>
              <span aria-hidden="true" className="text-2xl font-light leading-none text-accent">+</span>
              <span className="mt-1.5 text-[13px] font-semibold text-ink">Unggah Foto Sampul</span>
              <span className="mt-0.5 text-[11px] text-muted">JPG atau PNG · maks. 5 MB</span>
            </>
          )}
        </button>
        <FieldError message={errors.photo} />
      </div>

      <div className="mt-4">
        <label htmlFor="bio" className={labelClass}>Bio</label>
        <div className="relative mt-1.5">
          <textarea
            id="bio"
            name="bio"
            rows={4}
            maxLength={MAX_BIO}
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            placeholder="Tuliskan hal yang ingin orang tahu tentangmu..."
            className="block w-full resize-none rounded-xl border border-line bg-white px-3.5 pb-7 pt-3 text-[13px] text-ink outline-none placeholder:text-muted focus:border-accent"
          />
          <span className="pointer-events-none absolute bottom-2.5 right-3.5 text-[11px] text-muted">{bio.length} / {MAX_BIO}</span>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <SocialField id="instagram" label="Instagram" value={social.instagram} error={errors.instagram} onChange={(v) => handleSocialChange("instagram", v)} />
        <SocialField id="tiktok" label="TikTok" value={social.tiktok} error={errors.tiktok} onChange={(v) => handleSocialChange("tiktok", v)} />
        <SocialField id="facebook" label="Facebook" value={social.facebook} error={errors.facebook} onChange={(v) => handleSocialChange("facebook", v)} />
      </div>

      <div className="mt-4">
        <label htmlFor="slug" className={labelClass}>Link Support Page</label>
        <div className="mt-1.5 flex h-11 overflow-hidden rounded-xl border border-line bg-white focus-within:border-accent">
          <span className="grid shrink-0 place-items-center bg-brand-soft px-4 text-[13px] font-medium text-ink">{SHORT_DOMAIN}/</span>
          <input
            id="slug"
            name="slug"
            type="text"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            value={slug}
            onChange={(event) => { setSlug(sanitizeSlugInput(event.target.value)); setError("slug", ""); }}
            aria-invalid={Boolean(errors.slug)}
            aria-describedby={errors.slug ? "slug-error" : undefined}
            className="min-w-0 flex-1 bg-transparent px-3.5 text-[13px] text-ink outline-none"
          />
        </div>
        <FieldError id="slug-error" message={errors.slug} />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 h-[52px] w-full rounded-xl bg-brand text-base font-semibold text-white shadow-[0_6px_14px_rgba(46,104,178,0.3)] transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {isSubmitting ? "Membuat..." : "Buat Support Page"}
      </button>
      <p role="alert" className="mt-2 min-h-4 text-center text-xs text-red-600">{errors.submit}</p>
    </form>
  );
}
