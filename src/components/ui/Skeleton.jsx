// One placeholder block. Compose several to mirror the real layout (see ProfileSkeleton).
// The pulse is switched off for people who asked their system for reduced motion.
export default function Skeleton({ className = "" }) {
  return <div aria-hidden="true" className={`animate-pulse rounded bg-skeleton motion-reduce:animate-none ${className}`} />;
}
