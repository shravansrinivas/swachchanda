/**
 * Find which tracks YouTube refuses to embed.
 *
 *     pnpm check:embeds
 *
 * `verify:tracks` asks oEmbed whether a video exists. That is a different
 * question from whether it will *play here*: an uploader can disable embedding
 * on a perfectly live video, and oEmbed will still happily describe it. The
 * only reliable answer comes from the player itself, so this boots a real
 * IFrame player per id and records what the API reports.
 *
 * Errors 101 and 150 both mean embedding is disabled. 100 means the video is
 * gone, 2 means the id is malformed.
 *
 * Prints the ids to mark `unplayable: true` in src/data/artists.ts. It does not
 * edit the file: a network blip should never silently delete songs from the
 * roster, so the decision stays yours.
 */
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ARTISTS = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'artists.ts')
const PER_VIDEO_TIMEOUT = 12000
const CONCURRENCY = 4

const ERROR_MEANING = {
  2: 'malformed id',
  5: 'html5 player error',
  100: 'video removed or private',
  101: 'embedding disabled by uploader',
  150: 'embedding disabled by uploader',
  // 153 is not an embedding verdict at all, it is YouTube rejecting the page's
  // origin. It appears for every video if the harness runs from about:blank or
  // a data: URL, which is why this script serves itself over real http.
  153: 'INVALID ORIGIN, not a verdict about this video',
}

function idsFromSource() {
  const text = readFileSync(ARTISTS, 'utf8')
  const ids = [...text.matchAll(/youtubeId:\s*['"]([\w-]{11})['"]/g)].map((m) => m[1])
  return [...new Set(ids)]
}

const HARNESS = `<!doctype html><html><body><div id="host"></div>
<script src="https://www.youtube.com/iframe_api"></script>
<script>
  window.__check = (videoId) => new Promise((resolve) => {
    const mount = document.createElement('div')
    document.getElementById('host').appendChild(mount)
    let settled = false
    const done = (result) => {
      if (settled) return
      settled = true
      try { player.destroy() } catch {}
      resolve(result)
    }
    const player = new YT.Player(mount, {
      videoId,
      height: 200, width: 200,
      playerVars: { enablejsapi: 1, playsinline: 1, origin: location.origin },
      events: {
        // Reaching a real playback state proves the embed is allowed.
        onStateChange: (e) => { if ([1, 3, 5].includes(e.data)) done({ ok: true }) },
        onReady: () => { try { player.mute(); player.playVideo() } catch {} },
        onError: (e) => done({ ok: false, code: e.data }),
      },
    })
  })
</script></body></html>`

async function checkBatch(browser, ids, origin) {
  const page = await browser.newPage()
  await page.goto(origin, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction('typeof window.__check === "function" && window.YT && window.YT.Player', {
    timeout: 30000,
  })

  const out = []
  for (const id of ids) {
    let result
    try {
      result = await page.evaluate(
        ([videoId, ms]) =>
          Promise.race([
            window.__check(videoId),
            new Promise((r) => setTimeout(() => r({ ok: null }), ms)),
          ]),
        [id, PER_VIDEO_TIMEOUT],
      )
    } catch (err) {
      result = { ok: null, code: String(err).slice(0, 40) }
    }
    out.push({ id, ...result })
    const mark = result.ok === true ? ' ok ' : result.ok === false ? 'BLOCKED' : ' ?? '
    const why = result.code ? `  (${ERROR_MEANING[result.code] ?? `code ${result.code}`})` : ''
    console.log(`  ${mark}  ${id}${why}`)
  }

  await page.close()
  return out
}

const ids = idsFromSource()
if (!ids.length) {
  console.error('no youtubeId values found')
  process.exit(1)
}
console.log(`checking ${ids.length} videos, ${CONCURRENCY} at a time\n`)

// The harness must be served over a real origin: from about:blank or a data:
// URL every video comes back as error 153.
//
// It must also be *localhost*, not 127.0.0.1. YouTube rejects a raw-IP origin
// and reports it as error 150, which is the same code it uses for a genuine
// "embedding disabled by the uploader". Served from 127.0.0.1 this script
// declares the entire roster unplayable, and every one of those verdicts is
// wrong. Verified by running the same ids against both origins.
const server = createServer((_req, res) => {
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
  res.end(HARNESS)
})
await new Promise((r) => server.listen(0, '127.0.0.1', r))
const origin = `http://localhost:${server.address().port}/`

const browser = await chromium.launch()
const lanes = Array.from({ length: CONCURRENCY }, (_, lane) =>
  ids.filter((_, i) => i % CONCURRENCY === lane),
)
const results = (await Promise.all(lanes.map((lane) => checkBatch(browser, lane, origin)))).flat()
await browser.close()
server.close()

const blocked = results.filter((r) => r.ok === false)
const unknown = results.filter((r) => r.ok === null)

console.log(`\n${results.length - blocked.length - unknown.length}/${results.length} embeddable`)

if (unknown.length) {
  console.log(`\n${unknown.length} timed out (inconclusive, re-run before acting on these):`)
  console.log('  ' + unknown.map((r) => r.id).join(' '))
}

if (blocked.length) {
  console.log('\nMark these `unplayable: true` in src/data/artists.ts:')
  for (const r of blocked) {
    console.log(`  ${r.id}  ${ERROR_MEANING[r.code] ?? `code ${r.code}`}`)
  }
  process.exitCode = 1
} else {
  console.log('\nnothing to mark unplayable')
}
