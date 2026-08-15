#!/usr/bin/env python3
"""Verify every youtubeId in src/data/artists.ts actually resolves.

YouTube's oEmbed endpoint 404s on dead, private, or deleted videos, so this
catches typos and takedowns before they reach the player. It does NOT prove a
video is embeddable, that only surfaces at runtime as an onError 101/150,
which the player handles with an "open on YouTube" fallback.

    pnpm verify:tracks            # check every track
    pnpm verify:tracks <id> ...   # check specific ids
"""

import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ARTISTS = Path(__file__).resolve().parent.parent / "src" / "data" / "artists.ts"
OEMBED = "https://www.youtube.com/oembed"


def lookup(video_id):
    url = f"{OEMBED}?" + urllib.parse.urlencode(
        {"url": f"https://www.youtube.com/watch?v={video_id}", "format": "json"}
    )
    try:
        with urllib.request.urlopen(url, timeout=15) as resp:
            data = json.load(resp)
        return video_id, data.get("author_name", "?"), data.get("title", "?")
    except urllib.error.HTTPError as err:
        return video_id, None, f"HTTP {err.code}"
    except Exception as err:  # network, timeout, bad JSON
        return video_id, None, str(err)


def ids_from_source():
    if not ARTISTS.exists():
        sys.exit(f"missing {ARTISTS}")
    text = ARTISTS.read_text(encoding="utf-8")
    # youtubeId: 'abc123', keep source order, drop duplicates
    found = re.findall(r"youtubeId:\s*['\"]([\w-]{11})['\"]", text)
    return list(dict.fromkeys(found))


def main():
    ids = sys.argv[1:] or ids_from_source()
    if not ids:
        sys.exit("no youtubeId values found")

    with ThreadPoolExecutor(max_workers=8) as pool:
        results = list(pool.map(lookup, ids))

    dead = []
    for video_id, author, title in results:
        if author is None:
            dead.append(video_id)
            print(f"  DEAD  {video_id}  {title}")
        else:
            print(f"   ok   {video_id}  [{author}] {title[:70]}")

    print(f"\n{len(results) - len(dead)}/{len(results)} resolved")
    if dead:
        print("dead ids: " + " ".join(dead))
        sys.exit(1)


if __name__ == "__main__":
    main()
