import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useLanguage } from '../lib/language'
import { EkanthaIcon } from './EkanthaIcon'
import { LanguageToggle } from './LanguageToggle'

/**
 * Nav as a tape counter: hand-numbered stops along a hairline, with an amber
 * needle that slides to whichever one you're on.
 *
 * The needle is measured rather than CSS-only because the labels change width
 * between scripts, ಕೃತಜ್ಞತೆ and "Credits" are nowhere near the same size, so a
 * fixed-width indicator would sit wrong in one language or the other.
 */
export function SiteNav() {
  const { lang, setLang, t, kn } = useLanguage()
  const { pathname } = useLocation()

  const listRef = useRef<HTMLUListElement>(null)
  const [needle, setNeedle] = useState<{ left: number; width: number } | null>(null)

  const routes = [
    { to: '/', label: t.navHome, end: true },
    { to: '/artists', label: t.navArtists, end: false },
    { to: '/songs', label: t.navSongs, end: false },
    { to: '/about', label: t.navAbout, end: false },
    { to: '/credits', label: t.navCredits, end: false },
  ]

  useLayoutEffect(() => {
    const list = listRef.current
    const active = list?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!list || !active) {
      setNeedle(null)
      return
    }
    setNeedle({ left: active.offsetLeft, width: active.offsetWidth })
  }, [pathname, lang])

  // Keep the active stop on screen when the strip has to scroll on a phone.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>('[aria-current="page"]')
      ?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [pathname])

  return (
    <header className="sticky top-0 z-40 border-b border-dust/15 bg-tape/92 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3 px-5 pt-2.5 pb-2">
        <Link to="/" className="group flex shrink-0 items-center gap-2" aria-label={t.siteName}>
          {/* The ಸ್ವ mark, same glyph as the favicon. */}
          <span className="kn-display grid h-7 w-7 shrink-0 place-items-center rounded-[5px] bg-dial text-[15px] leading-none text-tape">
            ಸ್ವ
          </span>
          {/* The wordmark steps aside on a narrow phone so Ekantha can keep its
              label. The mark alone still reads as the way home, and on the front
              page the full name is set in display size directly below. */}
          <span className="kn-display hidden text-lg leading-none text-label transition-colors group-hover:text-dial min-[400px]:block">
            ಸ್ವಚ್ಛಂದ
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <LanguageToggle lang={lang} onChange={setLang} />
          {/* Ekantha is the rightmost thing in the header and the only amber
              control in it, because it is an invitation rather than a sixth
              page: everything else up here moves you around the site, this
              offers to take the site away. It carries its name rather than a
              bare glyph, since an unlabelled icon for a word most people have
              not met on a music site explains nothing. */}
          {/* A plain Link, not a NavLink: this header is not rendered on
              /ekantha at all, so an "active" state here could never be seen. */}
          <Link
            to="/ekantha"
            aria-label={t.ekanthaEnter}
            title={`${t.ekanthaEnter} · ${t.ekanthaNameAlt}`}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-dial/50 bg-dial/10 px-3 py-1.5 text-dial transition-colors hover:bg-dial hover:text-tape"
          >
            <EkanthaIcon size={15} />
            {/* Below 360px the three controls cannot all keep their words, and
                the language picker's cannot be cut. The icon holds the spot. */}
            <span className={`hidden text-sm leading-none min-[360px]:block ${kn ? 'kn' : 'font-display'}`}>
              {t.ekanthaName}
            </span>
          </Link>
        </div>
      </div>

      <nav aria-label={t.navHome} className="relative">
        <ul
          ref={listRef}
          // Five Kannada labels overflow a 390px strip, so it scrolls. The mask
          // fades both edges: without it a half-clipped label reads as a bug
          // rather than as "there is more this way".
          className="relative flex gap-5 overflow-x-auto px-5 pb-2.5 [mask-image:linear-gradient(to_right,transparent,black_18px,black_calc(100%-18px),transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {routes.map((route, i) => (
            <li key={route.to} className="shrink-0">
              <NavLink
                to={route.to}
                end={route.end}
                className={({ isActive }) =>
                  `flex items-baseline gap-1.5 whitespace-nowrap transition-colors ${
                    isActive ? 'text-dial' : 'text-dust hover:text-label'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`font-mono text-[10px] tabular-nums ${
                        isActive ? 'text-dial/70' : 'text-dust/75'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={`text-sm ${kn ? 'kn' : 'font-display'}`}>{route.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}

          {/* The needle. Sits inside the scroll container so it travels with it. */}
          {needle && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 h-[2px] rounded-full bg-dial transition-[left,width] duration-300 ease-out"
              style={{ left: needle.left, width: needle.width }}
            />
          )}
        </ul>
      </nav>
    </header>
  )
}
