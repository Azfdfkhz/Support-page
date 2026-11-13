import ImageWithFallback from "@/components/ui/ImageWithFallback";
import ShareButton from "./ShareButton";
import VerifiedBadge from "./VerifiedBadge";
import SocialLinks from "./SocialLinks";

export default function ProfileHeader({ creator }) {
  const { name, role, bio, isVerified, coverImageUrl, avatarImageUrl, socials } = creator;

  return (
    <header className="relative z-10 border-b border-line bg-surface pb-4 shadow-[0_4px_10px_-4px_rgba(23,37,74,0.14)]">
      <div className="relative h-[120px] w-full overflow-hidden">
        <ImageWithFallback src={coverImageUrl} alt="" sizes="414px" priority />
      </div>

      <ShareButton title={`Support ${name}`} />

      <div className="flex flex-col items-center px-6 text-center">
        <div className="relative -mt-8 size-[88px] overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-sm">
          <ImageWithFallback src={avatarImageUrl} alt={name} sizes="88px" priority />
        </div>

        <div className="mt-1.5 flex items-center gap-2">
          <h1 className="text-xl font-bold text-ink">{name}</h1>
          {isVerified ? <VerifiedBadge /> : null}
        </div>

        <p className="mt-1 text-base font-medium text-brand">{role}</p>
        <p className="mt-2 text-[13px] leading-[1.45] text-muted">{bio}</p>

        <div className="mt-3.5">
          <SocialLinks instagram={socials?.instagram} tiktok={socials?.tiktok} />
        </div>
      </div>
    </header>
  );
}
