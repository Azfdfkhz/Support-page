// Dashboard icons.

// Official single-color icons from /public/images. They are drawn as a mask, so the nav can tint them
// with the current text color (active #2E68B2, idle #686C71) without separate files per state.
function MaskIcon({ src, className }) {
  const mask = `url(${src}) center / contain no-repeat`;
  return <span aria-hidden="true" className={`inline-block bg-current ${className}`} style={{ mask, WebkitMask: mask }} />;
}

export function SummaryIcon({ className = "size-6" }) {
  return <MaskIcon src="/images/summary.svg" className={className} />;
}

export function SupportIcon({ className = "size-6" }) {
  return <MaskIcon src="/images/support.svg" className={className} />;
}

export function PageIcon({ className = "size-6" }) {
  return <MaskIcon src="/images/page.png" className={className} />;
}

export function BackArrowIcon({ className = "size-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 12H4M10 6l-6 6 6 6" />
    </svg>
  );
}

export function HeartOutlineIcon({ className = "size-9" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 20.5C6 15.6 3 12.7 3 9a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1c0 3.7-3 6.6-9 11.5Z" />
    </svg>
  );
}

export function SendIcon({ className = "size-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M21 3 10 14M21 3l-6.5 18-3.5-7-7-3.5L21 3Z" />
    </svg>
  );
}

export function PencilIcon({ className = "size-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 20h16M5.5 16.5 16.8 5.2a1.8 1.8 0 0 1 2.5 0l.5.5a1.8 1.8 0 0 1 0 2.5L8.5 19.5 4.5 20l1-3.5Z" />
    </svg>
  );
}
