// Dashboard navigation icons. They use currentColor so the nav sets active/idle colors.

export function SummaryIcon({ className = "size-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <rect x="3" y="3" width="4.5" height="18" rx="2.25" />
      <rect x="9.75" y="9" width="4.5" height="12" rx="2.25" />
      <rect x="16.5" y="14" width="4.5" height="7" rx="2.25" />
    </svg>
  );
}

export function SupportIcon({ className = "size-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
        d="M9 2.5h6a1 1 0 0 1 1 1V4h1.5A3.5 3.5 0 0 1 21 7.5v10A3.5 3.5 0 0 1 17.5 21h-11A3.5 3.5 0 0 1 3 17.5v-10A3.5 3.5 0 0 1 6.5 4H8v-.5a1 1 0 0 1 1-1Zm.5 1.5v1h5V4h-5Zm2.5 5.6c.45-.62 1.1-.95 1.85-.95 1.3 0 2.3 1.02 2.3 2.3 0 1.9-2.2 3.4-4.15 4.9-1.95-1.5-4.15-3-4.15-4.9 0-1.28 1-2.3 2.3-2.3.75 0 1.4.33 1.85.95Z"
      />
    </svg>
  );
}

export function PageIcon({ className = "size-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 12v5.5a3.5 3.5 0 0 1-3.5 3.5h-9A3.5 3.5 0 0 1 4 17.5v-11A3.5 3.5 0 0 1 7.5 3H13" />
      <path d="M8 9.5h3.5M8 13.5h3.5M8 17h5" />
      <path d="M15 9.5h2.5M16.25 6h-.01" strokeWidth="1.2" />
      <rect x="15.5" y="2.5" width="5" height="7" rx="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
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
