#!/usr/bin/env python3
"""Generate the Episode 002 Russian narration using Microsoft Edge TTS."""

import asyncio
import json
import os
from pathlib import Path

import edge_tts


ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "src/episodes/episode-002-voice.json"
OUTPUT = ROOT / "public/audio/episode-002/edge"


async def main() -> None:
    source = json.loads(SCRIPT.read_text(encoding="utf-8"))
    proxy = os.environ.get("https_proxy") or os.environ.get("HTTPS_PROXY")
    OUTPUT.mkdir(parents=True, exist_ok=True)

    for line in source["lines"]:
        destination = OUTPUT / f"{line['id']}.mp3"
        for attempt in range(4):
            try:
                await edge_tts.Communicate(
                    line["text"],
                    source["voice"],
                    rate="+8%",
                    proxy=proxy,
                ).save(str(destination))
                if destination.stat().st_size > 1000:
                    print(f"Generated {line['id']}")
                    break
            except Exception as error:  # retry transient Edge TTS websocket failures
                destination.unlink(missing_ok=True)
                print(f"Retry {line['id']} ({attempt + 1}/4): {type(error).__name__}")
                await asyncio.sleep(2)
        else:
            raise RuntimeError(f"Edge TTS did not return audio for {line['id']}")


if __name__ == "__main__":
    asyncio.run(main())
