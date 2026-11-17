import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { creatorPath } from "@/constants/routes";
import { SITE_URL } from "@/lib/config";
import ShareButton from "./ShareButton";
import VerifiedBadge from "./VerifiedBadge";
import SocialLinks from "./SocialLinks";

export default function ProfileHeader({ creator, slug }) {
  const { name, role, bio, isVerified, coverImageUrl, avatarImageUrl, socials } = creator;

  return (
    <header className="relative z-10 border-b border-line bg-surface pb-4 shadow-[0_0.25rem_0.625rem_-0.25rem_rgba(23,37,74,0.14)]">
      <div className="relative h-[7.5rem] w-full overflow-hidden">
        <ImageWithFallback src={coverImageUrl} alt="" sizes="(min-width: 768px) 511px, 100vw" priority />
      </div>

      <ShareButton title={`Support ${name}`} url={`${SITE_URL}${creatorPath(slug)}`} />

      <div className="flex flex-col items-center px-6 text-center">
        <div className="relative -mt-8 size-[5.5rem] overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-sm">
          <ImageWithFallback src={avatarImageUrl} alt={name} sizes="88px" priority />
        </div>

        <div className="mt-1.5 flex items-center gap-2">
          <h1 className="text-xl font-bold text-ink">{name}</h1>
          {isVerified ? <VerifiedBadge /> : null}
        </div>

        {role ? <p className="mt-1 text-base font-medium text-brand">{role}</p> : null}
        {bio ? <p className="mt-2 text-[0.8125rem] leading-[1.45] text-muted">{bio}</p> : null}

        <SocialLinks socials={socials} />
      </div>
    </header>
  );
}
