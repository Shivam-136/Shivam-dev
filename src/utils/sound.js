// src/utils/sound.js
// Shared, app-wide sound engine + mute state.
// No external audio file needed — the "click" is synthesized with Web Audio API.

const STORAGE_KEY = "mc-sound-muted";
let audioCtx = null;
let listeners = new Set();

function getAudioCtx() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    audioCtx = new Ctx();
  }
  return audioCtx;
}

export function isMuted() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

export function setMuted(next) {
  window.localStorage.setItem(STORAGE_KEY, String(next));
  listeners.forEach((cb) => cb(next));
  if (!next) playBlockClick(); // confirmation blip when turning sound back ON
}

export function toggleMuted() {
  const next = !isMuted();
  setMuted(next);
  return next;
}

// components can subscribe to mute changes (e.g. to update an icon)
export function onMuteChange(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function playBlockClick() {
  if (isMuted()) return;
  try {
    const ctx = getAudioCtx();
    if (ctx.state === "suspended") ctx.resume();

    const now = ctx.currentTime;
    const freqs = [880, 660]; // two quick layered blips = classic UI "click" pop

    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, now + i * 0.015);

      gain.gain.setValueAtTime(0.0001, now + i * 0.015);
      gain.gain.exponentialRampToValueAtTime(0.15, now + i * 0.015 + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.015 + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.015);
      osc.stop(now + i * 0.015 + 0.1);
    });
  } catch (e) {
    // audio blocked/unsupported — fail silently
  }
}