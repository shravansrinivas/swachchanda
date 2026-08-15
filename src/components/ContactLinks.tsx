import { CONTACT_EMAIL, GITHUB_URL, instagramUrl } from '../data/copy'

/**
 * Instagram, email, GitHub as icons.
 *
 * Same three everywhere they appear, from one place, so the footnotes cannot
 * drift apart from each other.
 *
 * These live at the foot of every page and nowhere else. They were in the
 * header for a while and did not belong: contact is not navigation, and three
 * more icons up there competed with the one control in the header that is
 * actually worth pressing.
 *
 * /credits is the exception and spells the three out as readable addresses
 * instead. An icon is a fine shortcut; a page whose whole job is attribution
 * should print the address you would write down.
 */
const LINKS = [
  {
    key: 'instagram',
    label: 'Instagram',
    href: instagramUrl,
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="3.6" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    key: 'email',
    label: 'Email',
    href: `mailto:${CONTACT_EMAIL}`,
    path: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="M3.5 7.5 12 13l8.5-5.5" />
      </>
    ),
  },
  {
    key: 'github',
    label: 'GitHub',
    href: GITHUB_URL,
    path: (
      <path d="M9 19.2c-4 1.2-4-2.2-5.6-2.6M15 21v-3.3a2.9 2.9 0 0 0-.8-2.2c2.7-.3 5.4-1.3 5.4-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.4 2.8 5.4 3.1 5.4 3.1a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.7 2.7 5.7 5.4 6a2.9 2.9 0 0 0-.8 2.2V21" />
    ),
  },
] as const

export function ContactLinks({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {LINKS.map((link) => (
        <a
          key={link.key}
          href={link.href}
          target={link.href.startsWith('mailto:') ? undefined : '_blank'}
          rel="noreferrer"
          aria-label={link.label}
          title={link.label}
          className="grid h-8 w-8 place-items-center rounded-full text-dust transition-colors hover:text-dial"
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {link.path}
          </svg>
        </a>
      ))}
    </div>
  )
}
