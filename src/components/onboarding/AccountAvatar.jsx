import Image from "next/image";

// Account photo, or the No-profil image on a #2858A4 circle when there is none.
export default function AccountAvatar({ name, avatarUrl, size = 56 }) {
  return (
    <div className="relative shrink-0 overflow-hidden rounded-full bg-avatar" style={{ width: size, height: size }}>
      {avatarUrl ? (
        <Image src={avatarUrl} alt={name} fill unoptimized sizes={`${size}px`} className="object-cover" />
      ) : (
        <Image
          src="/No-profil.png"
          alt=""
          aria-hidden="true"
          width={Math.round(size * 0.72)}
          height={Math.round(size * 0.72)}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      )}
    </div>
  );
}
