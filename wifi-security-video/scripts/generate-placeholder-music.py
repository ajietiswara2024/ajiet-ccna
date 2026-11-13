"""
Membuat musik latar placeholder (ambient lembut, 60 detik) tanpa aset eksternal.
Hasil: public/audio/background-music.mp3
Pakai: python3 scripts/generate-placeholder-music.py
"""
import subprocess, wave, numpy as np

SR = 44100
DUR = 62.0
BPM = 96
t = np.arange(int(SR * DUR)) / SR

def note(m):  # MIDI -> Hz
    return 440.0 * 2 ** ((m - 69) / 12)

# Progresi akor (Cmaj9 - Am9 - Fmaj7 - G6), tiap akor 2 bar
chords = [[48, 55, 64, 71, 74], [45, 52, 60, 67, 71], [41, 48, 57, 64, 69], [43, 50, 59, 64, 71]]
bar = 4 * 60 / BPM
chord_len = 2 * bar
out = np.zeros_like(t)

# Pad: sinus + detune dengan envelope lembut per akor
for i in range(int(DUR / chord_len) + 1):
    start = i * chord_len
    idx = (t >= start) & (t < start + chord_len + 1.5)
    tt = t[idx] - start
    env = np.minimum(1, tt / 1.2) * np.exp(-np.maximum(0, tt - chord_len) * 2.5)
    for m in chords[i % 4]:
        f = note(m)
        out[idx] += 0.05 * env * (np.sin(2 * np.pi * f * tt) + 0.5 * np.sin(2 * np.pi * f * 1.003 * tt + 1.3))

# Arpeggio pluck halus (seperdelapan)
step = 60 / BPM / 2
for k in range(int(DUR / step)):
    st = k * step
    ch = chords[int(st // chord_len) % 4]
    m = ch[[0, 2, 3, 4, 3, 2, 1, 2][k % 8]] + 12
    n = int(1.2 * SR)
    a = int(st * SR)
    if a + n > len(out):
        break
    tt = np.arange(n) / SR
    out[a:a + n] += 0.035 * np.exp(-tt * 4.5) * np.sin(2 * np.pi * note(m) * tt) * (1 - np.exp(-tt * 300))

# Kick & shaker lembut mulai bar ke-2
beat = 60 / BPM
for k in range(int(DUR / beat)):
    st = k * beat
    if st < bar:
        continue
    a = int(st * SR)
    n = int(0.35 * SR)
    if a + n > len(out):
        break
    tt = np.arange(n) / SR
    if k % 2 == 0:
        out[a:a + n] += 0.12 * np.exp(-tt * 14) * np.sin(2 * np.pi * (48 + 60 * np.exp(-tt * 30)) * tt)
    rng = np.random.default_rng(k)
    b = a + int(beat / 2 * SR)
    m2 = int(0.06 * SR)
    if b + m2 < len(out):
        out[b:b + m2] += 0.012 * rng.standard_normal(m2) * np.exp(-np.arange(m2) / SR * 60)

# Fade in/out + normalisasi
fade = np.minimum(1, t / 1.5) * np.minimum(1, (DUR - t) / 3)
out *= fade
out /= np.max(np.abs(out)) * 1.25
stereo = np.stack([out, np.roll(out, 300)], axis=1)
pcm = (stereo * 32767).astype(np.int16)
with wave.open('out/_music.wav', 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
subprocess.run(['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', '-i', 'out/_music.wav', '-c:a', 'libmp3lame', '-b:a', '192k', 'public/audio/background-music.mp3'], check=True)
print('Musik placeholder dibuat: public/audio/background-music.mp3')
