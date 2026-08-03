/**
 * Иконки админки. Свои SVG, а не библиотека: в проекте все иконки inline,
 * ради одной страницы тянуть зависимость незачем.
 */

type Props = { size?: number; className?: string; strokeWidth?: number };

function Svg({
  size = 16,
  className,
  strokeWidth = 2,
  children,
}: Props & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const IconUsers = (p: Props) => (
  <Svg {...p}>
    <path d="M16 19v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V19" />
    <circle cx="9" cy="7" r="3.2" />
    <path d="M22 19v-1.5a4 4 0 0 0-3-3.87M16.5 4.2a4 4 0 0 1 0 7.6" />
  </Svg>
);

export const IconCalendar = (p: Props) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2.5" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </Svg>
);

export const IconPlus = (p: Props) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const IconTrash = (p: Props) => (
  <Svg {...p}>
    <path d="M4 7h16M10 11v6M14 11v6" />
    <path d="M6 7l1 12.2A2 2 0 0 0 9 21h6a2 2 0 0 0 2-1.8L18 7M9 7V4.8A1.8 1.8 0 0 1 10.8 3h2.4A1.8 1.8 0 0 1 15 4.8V7" />
  </Svg>
);

export const IconChevron = ({ dir = 'up', ...p }: Props & { dir?: 'up' | 'down' }) => (
  <Svg {...p}>
    <path d={dir === 'up' ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6'} />
  </Svg>
);

export const IconCollapse = ({ dir = 'left', ...p }: Props & { dir?: 'left' | 'right' }) => (
  <Svg {...p}>
    {dir === 'left' ? (
      <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
    ) : (
      <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
    )}
  </Svg>
);

export const IconSun = (p: Props) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Svg>
);

export const IconMoon = (p: Props) => (
  <Svg {...p}>
    <path d="M20 14.5A8.2 8.2 0 0 1 9.5 4 8.3 8.3 0 1 0 20 14.5Z" />
  </Svg>
);

export const IconLogout = (p: Props) => (
  <Svg {...p}>
    <path d="M15 17l5-5-5-5M20 12H9M11 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5" />
  </Svg>
);

export const IconSave = (p: Props) => (
  <Svg {...p}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
    <path d="M17 21v-8H7v8M7 3v5h8" />
  </Svg>
);

export const IconCheck = (p: Props) => (
  <Svg {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
);

export const IconAlert = (p: Props) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5M12 16.2v.3" />
  </Svg>
);

export const IconMenu = (p: Props) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);

export const IconImage = (p: Props) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <circle cx="9" cy="10" r="1.6" />
    <path d="M4 17l4.5-4.5 4 4 3-2.5L20 18" />
  </Svg>
);

export const IconPin = (p: Props) => (
  <Svg {...p}>
    <path d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </Svg>
);

export const IconTag = (p: Props) => (
  <Svg {...p}>
    <path d="M20.5 13.5 13 21a2 2 0 0 1-2.8 0l-7-7A2 2 0 0 1 2.6 12l.4-7A2 2 0 0 1 5 3l7-.4a2 2 0 0 1 1.5.6l7 7a2 2 0 0 1 0 3.3Z" />
    <circle cx="7.8" cy="7.8" r="1.4" />
  </Svg>
);

export const IconQuote = (p: Props) => (
  <Svg {...p}>
    <path d="M9 7c-2.2 0-4 1.8-4 4s1.8 4 4 4c0 2-1.4 3.4-3 4M19 7c-2.2 0-4 1.8-4 4s1.8 4 4 4c0 2-1.4 3.4-3 4" />
  </Svg>
);

export const IconBuilding = (p: Props) => (
  <Svg {...p}>
    <path d="M4 21V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15M14 21V11h4a2 2 0 0 1 2 2v8M3 21h18" />
    <path d="M7.5 8.5h3M7.5 12.5h3M7.5 16.5h3" />
  </Svg>
);

export const IconHandshake = (p: Props) => (
  <Svg {...p}>
    <path d="m11 17 2 2a1.4 1.4 0 0 0 2-2l-1-1" />
    <path d="M14 16a1.4 1.4 0 0 0 2-2l-3.5-3.5" />
    <path d="M3 10.5 7 7l3 2.5a1.5 1.5 0 0 0 2 0L14 8l7 6.5" />
    <path d="M3 14.5 6 17M21 10.5 17.5 7" />
  </Svg>
);

export const IconLayout = (p: Props) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <path d="M3 15h18M9 15v5" />
  </Svg>
);

export const IconInbox = (p: Props) => (
  <Svg {...p}>
    <path d="M3 13h4l1.5 2.5h7L17 13h4" />
    <path d="M5.5 5h13l2.5 8v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4l2.5-8Z" />
  </Svg>
);

export const IconExternal = (p: Props) => (
  <Svg {...p}>
    <path d="M14 4h6v6M20 4l-8 8M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
  </Svg>
);
