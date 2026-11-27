"""Optional Google Translate speech variant. Gemini is recorded by generate-voice-variants.mjs."""
import json
import pathlib
import subprocess
import time
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
lines = json.loads((ROOT / "src/episodes/episode-003-voice.json").read_text())["lines"]
out = ROOT / "public/audio/episode-003/google-public"
out.mkdir(parents=True, exist_ok=True)
for line in lines:
    target = out / (line["id"] + ".mp3")
    if target.is_file() and target.stat().st_size > 1000:
        continue
    query = urllib.parse.urlencode({"ie": "UTF-8", "tl": "ru", "client": "tw-ob", "q": line["text"]})
    for attempt in range(3):
        try:
            with urllib.request.urlopen("https://translate.google.com/translate_tts?" + query, timeout=18) as reply:
                if not reply.headers.get_content_type().startswith("audio/"):
                    raise RuntimeError("Google did not return speech")
                speech = reply.read()
            pitch = "0.84" if line["voice"] == "hero" else "1.03"
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", "pipe:0",
                            "-af", "rubberband=pitch=" + pitch, "-q:a", "3", str(target)],
                           input=speech, check=True)
            break
        except (OSError, RuntimeError, subprocess.CalledProcessError):
            if attempt == 2:
                raise
            time.sleep(1 + attempt)
    print("Google Translate speech:", line["id"], flush=True)
