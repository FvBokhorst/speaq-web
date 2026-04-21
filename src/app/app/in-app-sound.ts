/**
 * In-app notification chime.
 *
 * Generated via WebAudio (no bundled mp3 -- no copyright, no payload).
 * Plays only when the page is focused; if the page is hidden or the tab is
 * unfocused, the push notification handles the alert instead.
 */

let ctx: AudioContext | null = null;
let muted = false;
const MUTE_KEY = "speaq_sound_muted";

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    } catch {
      return null;
    }
  }
  return ctx;
}

export function loadMutedState(): boolean {
  if (typeof window === "undefined") return false;
  try { muted = localStorage.getItem(MUTE_KEY) === "1"; } catch {}
  return muted;
}

export function setMuted(next: boolean): void {
  muted = next;
  if (typeof window !== "undefined") {
    try { localStorage.setItem(MUTE_KEY, next ? "1" : "0"); } catch {}
  }
}

export function isMuted(): boolean { return muted; }

function playTone(freq: number, duration: number, delay: number): void {
  const audio = getContext();
  if (!audio) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const start = audio.currentTime + delay;
  const end = start + duration;
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.22, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(start);
  osc.stop(end + 0.05);
}

export function playIncoming(): void {
  if (muted) return;
  if (typeof document === "undefined") return;
  if (document.visibilityState !== "visible") return;
  // Two-tone chime (high then mid) -- short, non-intrusive
  playTone(880, 0.12, 0);
  playTone(660, 0.18, 0.12);
}
