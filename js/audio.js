let ctx;
let master, sfx, music;
let muted = false;
let musicTimer = 0;
let ambTimer = 0;

export function initAudio(settings) {
  if (ctx) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  ctx = new AC();
  master = ctx.createGain();
  sfx = ctx.createGain();
  music = ctx.createGain();
  sfx.connect(master);
  music.connect(master);
  master.connect(ctx.destination);
  applySettings(settings);
}

export function resumeAudio() {
  if (ctx && ctx.state === 'suspended') ctx.resume();
}

export function applySettings(s) {
  if (!master) return;
  master.gain.value = (s.master / 100) * (muted ? 0 : 1);
  sfx.gain.value = s.sfx / 100;
  music.gain.value = s.music / 100;
}

function beep(freq, dur, type, vol, dest) {
  if (!ctx) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type || 'square';
  o.frequency.value = freq;
  g.gain.value = vol;
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  o.connect(g); g.connect(dest || sfx);
  o.start(); o.stop(ctx.currentTime + dur);
}

function noiseBurst(dur, vol, hp) {
  if (!ctx) return;
  const n = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
  const d = n.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const src = ctx.createBufferSource();
  src.buffer = n;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = hp || 1800;
  const g = ctx.createGain();
  g.gain.value = vol;
  src.connect(filter); filter.connect(g); g.connect(sfx);
  src.start();
}

export function sfxShot(kind) {
  const f = kind === 'smg' ? 220 : kind === 'pistol' ? 280 : kind === 'carbine' ? 190 : 140;
  noiseBurst(kind === 'smg' ? 0.06 : 0.12, 0.45, kind === 'rifle' ? 900 : 1600);
  beep(f, 0.08, 'sawtooth', 0.12);
}

export function sfxReload() { beep(180, 0.08, 'square', 0.08); setTimeout(() => beep(240, 0.1, 'square', 0.1), 180); }
export function sfxHit() { beep(90, 0.07, 'sawtooth', 0.1); }
export function sfxHurt() { noiseBurst(0.15, 0.25, 400); }
export function sfxPickup() { beep(520, 0.08, 'triangle', 0.1); setTimeout(() => beep(740, 0.1, 'triangle', 0.1), 90); }
export function sfxUI() { beep(300, 0.05, 'square', 0.06); }
export function sfxExplode() { noiseBurst(0.45, 0.55, 500); beep(55, 0.3, 'sawtooth', 0.16); }
export function sfxStep() { noiseBurst(0.05, 0.08, 500); }

export function sfxRadio() {
  noiseBurst(0.2, 0.08, 2400);
  beep(420, 0.06, 'square', 0.05);
}

export function tickMusic(dt) {
  if (!ctx) return;
  musicTimer -= dt;
  if (musicTimer <= 0) {
    musicTimer = 3.2 + Math.random() * 2;
    const base = 90 + Math.floor(Math.random() * 3) * 20;
    beep(base, 1.6, 'sine', 0.04, music);
    beep(base * 1.5, 1.8, 'sine', 0.02, music);
  }
  ambTimer -= dt;
  if (ambTimer <= 0) {
    ambTimer = 2 + Math.random() * 4;
    if (Math.random() < 0.55) noiseBurst(0.2 + Math.random() * 0.3, 0.06, 700 + Math.random() * 800);
    else beep(70 + Math.random() * 40, 0.2, 'sawtooth', 0.03);
  }
}
