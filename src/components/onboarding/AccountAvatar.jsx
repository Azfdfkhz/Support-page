import Image from "next/image";

// Account photo, or the No-profil image on a #2858A4 circle when there is none.
// `size` is in px at the 414px design width; it is rendered in rem so it scales with the page.
export default function AccountAvatar({ name, avatarUrl, size = 56 }) {
  const dimension = `${size / 16}rem`;
  return (
    <div className="relative shrink-0 overflow-hidden rounded-full bg-avatar" style={{ width: dimension, height: dimension }}>
      {avatarUrl ? (
        <Image src={avatarUrl} alt={name} fill unoptimized sizes={`${size}px`} className="object-cover" />
      ) : (
        <Image
          src="/No-profil.png"
          alt=""
          aria-hidden="true"
          width={47}
          height={47}
          className="absolute left-1/2 top-1/2 h-auto w-[72%] -translate-x-1/2 -translate-y-1/2"
        />
      )}
    </div>
  );
}
