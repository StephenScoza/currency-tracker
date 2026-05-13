type IconName =
  | "alert"
  | "bell"
  | "cache"
  | "chart"
  | "chevronUp"
  | "clock"
  | "info"
  | "spark"
  | "wallet";

interface IconProps {
  name: IconName;
  className?: string;
}

const paths: Record<IconName, JSX.Element> = {
  alert: (
    <>
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.3 3.9 2.4 17.5A1.7 1.7 0 0 0 3.9 20h16.2a1.7 1.7 0 0 0 1.5-2.5L13.7 3.9a1.7 1.7 0 0 0-3.4 0Z" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
      <path d="M10 21h4" />
    </>
  ),
  cache: (
    <>
      <path d="M4 7c0-2.2 3.6-4 8-4s8 1.8 8 4-3.6 4-8 4-8-1.8-8-4Z" />
      <path d="M4 7v5c0 2.2 3.6 4 8 4s8-1.8 8-4V7" />
      <path d="M4 12v5c0 2.2 3.6 4 8 4s8-1.8 8-4v-5" />
    </>
  ),
  chart: (
    <>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="m7 15 4-4 3 3 5-7" />
    </>
  ),
  chevronUp: <path d="m6 15 6-6 6 6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6" />
      <path d="M12 7h.01" />
    </>
  ),
  spark: (
    <>
      <path d="M13 2 9 10l-7 3 7 3 4 8 4-8 7-3-7-3-4-8Z" />
      <path d="m19 3 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" />
    </>
  ),
  wallet: (
    <>
      <path d="M4 7a3 3 0 0 1 3-3h11v4H7a3 3 0 0 0 0 6h13v5a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V7Z" />
      <path d="M16 14h4v-4h-4a2 2 0 0 0 0 4Z" />
    </>
  ),
};

export const Icon = ({ name, className = "h-5 w-5" }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {paths[name]}
  </svg>
);
