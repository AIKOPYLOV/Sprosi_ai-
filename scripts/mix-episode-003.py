"""Fit isolated lines to the edit, derive performance cues, and mix an original score and Foley."""
import argparse
import json
import pathlib
import subprocess
import wave

import numpy as np
from scipy.ndimage import gaussian_filter1d
from scipy.signal import butter, sosfilt

ROOT = pathlib.Path(__file__).resolve().parents[1]
RATE = 24000
parser = argparse.ArgumentParser()
parser.add_argument("provider", choices=["elevenlabs", "google", "google-public"])
provider = parser.parse_args().provider
folder = ROOT / "public/audio/episode-003" / provider
edit = json.loads((ROOT / "src/episodes/episode-003-cuts.json").read_text())
lines = {line["id"]: line for line in json.loads((ROOT / "src/episodes/episode-003-voice.json").read_text())["lines"]}
fps, cuts = edit["fps"], edit["cuts"]
duration = sum(cut["frames"] for cut in cuts) / fps
voice = np.zeros(round(duration * RATE))
foley = np.zeros((len(voice), 2))
music = np.zeros_like(foley)
rng = np.random.default_rng(203)


def samples(args, data=None):
    raw = subprocess.check_output(["ffmpeg", "-nostdin", "-loglevel", "error", *args,
                                   "-ac", "1", "-ar", str(RATE), "-f", "f32le", "pipe:1"], input=data)
    return np.frombuffer(raw, dtype="<f4").astype(float)


def fit_line(path, room):
    src = samples(["-i", str(path)])
    block = RATE // 100
    rms = np.sqrt(np.mean(np.reshape(np.pad(src, (0, -len(src) % block)), (-1, block)) ** 2, axis=1))
    active = np.flatnonzero(rms > max(0.003, np.max(rms) * 0.037))
    if not active.size:
        raise ValueError("Empty voice recording: " + path.name)
    src = src[max(0, active[0] * block - 800):min(len(src), (active[-1] + 1) * block + 1400)]
    speed = len(src) / (RATE * room)
    if speed > 1:
        src = samples(["-f", "f32le", "-ar", str(RATE), "-ac", "1", "-i", "pipe:0",
                       "-af", f"atempo={speed * 1.004:.6f}"], src.astype("<f4").tobytes())
    if len(src) > round(room * RATE) + 960:
        raise ValueError("Voice exceeds its shot: " + path.name)
    src[:144] *= np.linspace(0, 1, 144)
    src[-240:] *= np.linspace(1, 0, 240)
    return src


def animate_mouth(src, offset, frames):
    padded = np.pad(src, (round(offset * RATE), RATE))
    env, vowels = [], []
    n = round(RATE / fps)
    for frame in range(frames):
        start = round(frame * RATE / fps)
        section = padded[start:start + n]
        if len(section) < n:
            env.append(0)
            vowels.append(0)
            continue
        env.append(np.sqrt(np.mean(section ** 2)))
        bands = abs(np.fft.rfft(section * np.hanning(n)))
        # A rounded vowel concentrates energy below ~1 kHz. Sibilants are kept narrow.
        split = round(n * 1050 / RATE)
        vowels.append(bands[4:split].sum() / (0.001 + bands[4:round(n * 3900 / RATE)].sum()))
    scale = max(0.02, np.percentile(env, 90))
    level = np.clip((np.array(env) / scale - 0.048) * 1.17, 0, 1)
    return np.round(level * 100).astype(int), np.round(np.array(vowels) * 100).astype(int)


def place(arr, at, sound, level, pan=0):
    start = round(at * RATE)
    count = min(len(sound), len(arr) - start)
    if count <= 0:
        return
    sound = sound[:count] * level
    arr[start:start + count, 0] += sound * np.sqrt((1 - pan) / 2)
    arr[start:start + count, 1] += sound * np.sqrt((1 + pan) / 2)


def tone(freq, length, release, strike=0.008, overtone=0.14):
    t = np.arange(round(length * RATE)) / RATE
    envelope = (1 - np.exp(-t / strike)) * np.exp(-t / release)
    return (np.sin(2 * np.pi * freq * t) + overtone * np.sin(2 * np.pi * freq * 2 * t)) * envelope


def noise(length, frequency, release):
    t = np.arange(round(length * RATE)) / RATE
    sample = sosfilt(butter(2, frequency, fs=RATE, output="sos"), rng.normal(0, 1, len(t)))
    return sample * (1 - np.exp(-t / .003)) * np.exp(-t / release)


def effect(name, at, pan=0):
    if name == "paper":
        place(foley, at, noise(.25, 5200, .065), .075, pan)
    elif name == "step":
        place(foley, at, noise(.18, 560, .046), .22, pan)
        place(foley, at, tone(94, .15, .037), .1, pan)
    elif name == "scan":
        place(foley, at, tone(1120, .112, .085, .004, .07), .1, pan)
    elif name == "notify":
        place(foley, at, tone(742, .135, .07), .10, pan)
        place(foley, at + .10, tone(987, .24, .10), .083, pan)
    elif name == "stop":
        place(foley, at, tone(128, .13, .044), .11, pan)
        place(foley, at, noise(.072, 2700, .012), .10, pan)
    else:
        place(foley, at, noise(.09, 3200, .015), .12, pan)
        place(foley, at, tone(520, .07, .011), .04, pan)


offsets, timing = {}, {}
frame_start = 0
for cut in cuts:
    key, frames = cut["id"], cut["frames"]
    at, slot = frame_start / fps, frames / fps
    offsets[key] = at
    lead = .13 if key not in ("box", "found", "stop") else .23
    src = fit_line(folder / (key + ".mp3"), slot - lead - .13)
    if lines[key]["voice"] == "client":
        src = sosfilt(butter(2, [190, 4900], btype="bandpass", fs=RATE, output="sos"), src)
    windows = np.sqrt(np.mean(np.reshape(np.pad(src, (0, -len(src) % 480)), (-1, 480)) ** 2, axis=1))
    src *= min(4.5, .16 / max(.02, np.percentile(windows, 72)))
    pos = round((at + lead) * RATE)
    voice[pos:pos + len(src)] += src
    envelope, vowel = animate_mouth(src, lead, frames)
    first, second = cut["captions"]
    # Track the breath nearest the textual break; keep very short punchlines intact.
    target = lead * fps + len(src) / RATE * fps * len(first) / (len(first) + len(second))
    window = np.arange(max(4, int(target - .32 * fps)), min(frames - 3, int(target + .32 * fps) + 1))
    split = int(window[np.argmin(gaussian_filter1d(envelope.astype(float), .65)[window] / 100 + abs(window - target) * .028)])
    timing[key] = {"level": envelope.tolist(), "vowel": vowel.tolist(), "split": split,
                   "start": max(0, round(lead * fps) - 1), "end": min(frames, round((lead + len(src) / RATE) * fps) + 2)}
    frame_start += frames

events = {
    "buy": [(.25,"click"),(.48,"notify")], "shift": [(k * .37 + .12,"step") for k in range(10)],
    "secret": [(.40,"paper"),(.71,"paper"),(1.13,"paper")],
    "box": [(.20,"notify"),(.79,"scan"),(1.24,"scan")], "twice":[(1.86,"click")],
    "intro":[(.13,"scan")], "stop":[(.18,"stop")], "course":[(1.07,"click"),(2.89,"click")],
    "recut":[(.52,"click"),(1.62,"paper"),(2.22,"click")],
    "demo":[(.62,"scan"),(1.05,"scan")], "rule":[(.43,"click"),(1.65,"click"),(2.52,"click")],
    "publish":[(1.98,"click"),(2.27,"notify")], "found":[(.03,"notify")],
    "reply":[(.32,"paper"),(1.36,"paper"),(2.45,"paper")], "question":[(.19,"click")]
}
for key, cues in events.items():
    for i, (point, name) in enumerate(cues):
        effect(name, offsets[key] + point, .17 * (-1) ** i)

# A small original instrumental. A dry desk-tap and two plucked notes become a fuller
# chord only after Ilya starts editing. The awkward first take plays in room tone.
beat = 60 / 96
chords = [(50,57,60,64), (46,53,57,62), (53,60,64,67), (48,55,59,62)]
for i in range(int(duration / beat)):
    t = i * beat
    if t < 2 or offsets["intro"] <= t < offsets["course"]:
        continue
    chord = chords[(i // 8) % 4]
    gain = .62 if t < offsets["course"] else 1
    if t > offsets["question"]:
        gain *= max(.1, (duration - t) / 3)
    def note(m): return 440 * (2 ** ((m - 69) / 12))
    if i % 4 == 0:
        place(music, t, tone(note(chord[0] - 12), .77, .24), .12 * gain)
    if i % 2 == 1:
        place(music, t + .025, tone(note(chord[1 + i % 3]), .65, .15, .014, .19), .095 * gain, (-1) ** (i // 2) * .23)
    if t > offsets["course"] and i % 4 in (1, 3):
        place(music, t, noise(.1, 2400, .028), .049, -.23)
    if t > offsets["course"] and i % 8 in (2, 6):
        place(music, t + beat * .53, tone(note(chord[2] + 12), .43, .10), .041, .29)

voice_activity = gaussian_filter1d(abs(voice[::240]), 7)
duck = .99 - .43 * np.clip(np.interp(np.arange(len(voice)), np.arange(len(voice_activity)) * 240, voice_activity) / .12, 0, 1)
mix = voice[:,None] * .82 + music * duck[:,None] + foley
mix[-round(.28 * RATE):] *= np.linspace(1, 0, round(.28 * RATE))[:,None]
pcm = np.round(np.clip(mix, -.97, .97) * 32767).astype("<i2")
with wave.open(str(folder / "mix.wav"), "wb") as wav:
    wav.setparams((2, 2, RATE, 0, "NONE", "not compressed"))
    wav.writeframes(pcm.tobytes())
(folder / "acting.json").write_text(json.dumps(timing,separators=(",",":")))
print(f"{provider}: {len(cuts)} shots, {duration:.2f}s stereo, {len(timing)} sets of performance cues")
