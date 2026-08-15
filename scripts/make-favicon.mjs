/**
 * Render the favicon from the Kannada glyph ಸ್ವ (the first syllable of
 * ಸ್ವಚ್ಛಂದ) using the real Baloo Tamma 2 webfont, and write PNGs.
 *
 *     node scripts/make-favicon.mjs
 *
 * PNG rather than an SVG <text> favicon on purpose: ಸ್ವ is a conjunct
 * (ಸ + virama + ವ) that needs font shaping, so an SVG referencing a font
 * family would render as tofu anywhere Kannada isn't installed. Rasterising
 * here bakes the shaped glyph in and it looks the same everywhere.
 *
 * Requires playwright (a devDependency) and network access for the font.
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public')
const TAPE = '#1B2029'
const DIAL = '#E8B25C'

/** size in px → output filename. */
const TARGETS = [
  [32, 'favicon-32.png'],
  [180, 'apple-touch-icon.png'],
  [512, 'icon-512.png'],
]

const page = await (await chromium.launch()).newPage()

for (const [size, file] of TARGETS) {
  await page.setViewportSize({ width: size, height: size })
  await page.setContent(`<!doctype html>
    <html><head><meta charset="utf-8">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Baloo+Tamma+2:wght@700&display=block" rel="stylesheet">
    <style>
      html,body{margin:0;padding:0;width:${size}px;height:${size}px;overflow:hidden}
      .box{
        width:${size}px;height:${size}px;
        background:${TAPE};
        border-radius:${Math.round(size * 0.22)}px;
        display:flex;align-items:center;justify-content:center;
      }
      .g{
        font-family:'Baloo Tamma 2',sans-serif;
        font-weight:700;
        color:${DIAL};
        font-size:${Math.round(size * 0.62)}px;
        /* Kannada ottu hangs below the baseline; nudge up so it sits centred. */
        line-height:1;
        transform:translateY(${-Math.round(size * 0.04)}px);
      }
    </style></head>
    <body><div class="box"><span class="g">ಸ್ವ</span></div></body></html>`)

  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(600)
  await page.screenshot({ path: resolve(OUT, file), omitBackground: false })
  console.log(`wrote public/${file} (${size}px)`)
}

await page.context().browser().close()
