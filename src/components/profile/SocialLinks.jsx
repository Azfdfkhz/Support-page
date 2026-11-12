import InstagramIcon from "@/components/icons/InstagramIcon";
import TikTokIcon from "@/components/icons/TikTokIcon";

const linkClass = "grid size-8 place-items-center rounded-full text-white";

export default function SocialLinks({ instagram, tiktok }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {instagram ? (
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className={`${linkClass} bg-[linear-gradient(45deg,#f9a825_0%,#e91e63_50%,#8e24aa_100%)]`}
        >
          <InstagramIcon />
        </a>
      ) : null}
      {tiktok ? (
        <a
          href={tiktok}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok"
          className={`${linkClass} bg-black`}
        >
          <TikTokIcon />
        </a>
      ) : null}
    </div>
  );
}
