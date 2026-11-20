import Image from "next/image";
import { assetPath } from "@/lib/config";

/**
 * Renders an image that fills its parent, or a neutral placeholder when src is empty.
 * The parent must be `relative` and have a size.
 */
export default function ImageWithFallback({ src, alt = "", className = "", sizes, priority = false }) {
  if (!src) {
    return <div className={`absolute inset-0 bg-slate-200 ${className}`} aria-hidden="true" />;
  }
  return (
    <Image
      src={assetPath(src)}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized
      className={`object-cover ${className}`}
    />
  );
}
