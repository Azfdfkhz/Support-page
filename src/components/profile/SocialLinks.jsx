import FacebookIcon from "@/components/icons/FacebookIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";
import TikTokIcon from "@/components/icons/TikTokIcon";
import { resolveSocialLinks } from "@/lib/socials";

const linkClass = "grid size-8 place-items-center rounded-full text-white";

const PLATFORM_STYLE = {
  instagram: { Icon: InstagramIcon, background: "bg-[linear-gradient(45deg,#f9a825_0%,#e91e63_50%,#8e24aa_100%)]" },
  tiktok: { Icon: TikTokIcon, background: "bg-black" },
  facebook: { Icon: FacebookIcon, background: "bg-[#1877F2]" },
};

/**
 * One round icon per social account the creator filled in. `socials` holds usernames or profile
 * URLs: { instagram, tiktok, facebook }. Renders nothing when there are none.
 */
export default function SocialLinks({ socials }) {
  const links = resolveSocialLinks(socials);
  if (links.length === 0) return null;

  return (
    <ul className="mt-3.5 flex items-center justify-center gap-2">
      {links.map(({ platform, label, href }) => {
        const { Icon, background } = PLATFORM_STYLE[platform];
        return (
          <li key={platform}>
            <a href={href} target="_blank" rel="noopener noreferrer nofollow" aria-label={label} className={`${linkClass} ${background}`}>
              <Icon />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
