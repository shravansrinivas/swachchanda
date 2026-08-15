import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { imageForPath, imagesForMood } from './data/heroImages'
import { LanguageProvider } from './lib/LanguageProvider'
import { PlayerProvider } from './lib/PlayerProvider'
import { usePlayer } from './lib/player'
import { useHeroRotation } from './lib/useHeroRotation'
import { PlayerDock } from './components/PlayerDock'
import { SiteBackground } from './components/SiteBackground'
import { SiteFooter } from './components/SiteFooter'
import { SiteNav } from './components/SiteNav'
import { AboutPage } from './pages/AboutPage'
import { ArtistPage } from './pages/ArtistPage'
import { ArtistsPage } from './pages/ArtistsPage'
import { CreditsPage } from './pages/CreditsPage'
import { EkanthaPage } from './pages/EkanthaPage'
import { HomePage } from './pages/HomePage'
import { SongsPage } from './pages/SongsPage'

export default function App() {
  return (
    <LanguageProvider>
      <PlayerProvider>
        <BrowserRouter>
          <Shell />
        </BrowserRouter>
      </PlayerProvider>
    </LanguageProvider>
  )
}

/**
 * Inside the router so it can read the location, but outside <Routes> so the
 * nav and the deck are never unmounted, that's what keeps a song playing
 * while you move between pages.
 */
function Shell() {
  const { nowPlaying, filters } = usePlayer()
  const { pathname } = useLocation()

  // The rotation lives here rather than in HomePage so it keeps advancing while
  // you're on another page. Its pool follows the chosen mood, so the photograph
  // answers the filter wherever the filter was set.
  const mood = filters.moods.length === 1 ? filters.moods[0] : null
  const pool = imagesForMood(mood)
  const rotating = useHeroRotation(pool, nowPlaying?.key ?? null)

  // Inner pages hold one fixed frame; only home rotates.
  const fixed = imageForPath(pathname)
  const activeImage = fixed ?? rotating
  const activePool = fixed ? [fixed] : pool

  const isHome = pathname === '/'
  // Ekantha is the whole screen: no nav, no footer, no pinned deck.
  const isEkantha = pathname === '/ekantha'

  return (
    // Home is locked to exactly one viewport: a flex column of 100svh with the
    // scroll clipped, so it cannot scroll whatever height the nav ends up being
    // in either language. Every other route scrolls normally.
    <div
      className={
        isHome ? 'flex h-[100svh] flex-col overflow-hidden' : 'min-h-screen'
      }
    >
      {/* Behind every route, not just the front page. */}
      <SiteBackground
        pool={activePool}
        active={activeImage}
        scrim={isEkantha ? 'calm' : isHome ? 'hero' : 'page'}
      />

      {!isEkantha && <SiteNav />}
      <ScrollToTop />

      {/* Every route but home pads for the deck, and the padding carries the
          safe-area inset so the deck clears a home indicator. Home sizes itself
          to exactly one viewport and carries its own clearance, so it never
          scrolls. */}
      <main
        className={
          isHome
            ? 'min-h-0 flex-1'
            : isEkantha
              ? ''
              : 'pb-[calc(7rem+env(safe-area-inset-bottom))]'
        }
      >
        <Routes>
          <Route path="/" element={<HomePage active={rotating} />} />
          <Route path="/artists" element={<ArtistsPage />} />
          <Route path="/artists/:artistId" element={<ArtistPage />} />
          <Route path="/songs" element={<SongsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/credits" element={<CreditsPage />} />
          <Route path="/ekantha" element={<EkanthaPage />} />
          {/* Anything unrecognised falls back to the front page. */}
          <Route path="*" element={<HomePage active={rotating} />} />
        </Routes>

        {/* Home is a fixed single screen, and about/credits carry their own
            sign-off, so none of the three want a footer under them. */}
        {!['/', '/about', '/credits', '/ekantha'].includes(pathname) && <SiteFooter />}
      </main>

      {!isEkantha && <PlayerDock />}
    </div>
  )
}

/** Browsers restore scroll on history nav; a route change should start at the top. */
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
