// Lightweight WebAudio sound effects — no assets, generated on the fly.

let ctx: AudioContext | null = null;

function ac(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

type ToneOpts = {
  freq: number;
  to?: number;
  dur?: number;
  type?: OscillatorType;
  vol?: number;
  delay?: number;
};

function tone({ freq, to, dur = 0.18, type = 'sine', vol = 0.18, delay = 0 }: ToneOpts) {
  const a = ac();
  if (!a) return;
  const t0 = a.currentTime + delay;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(a.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export type SfxName =
  | 'tap'
  | 'beep'
  | 'success'
  | 'error'
  | 'alert'
  | 'scan'
  | 'toggle'
  | 'whoosh'
  | 'ding';

let enabled = true;
export function setSfxEnabled(on: boolean) {
  enabled = on;
}
export function isSfxEnabled() {
  return enabled;
}

export function sfx(name: SfxName) {
  if (!enabled) return;
  switch (name) {
    case 'tap':
      tone({ freq: 420, to: 540, dur: 0.06, type: 'triangle', vol: 0.08 });
      break;
    case 'beep':
      tone({ freq: 880, dur: 0.1, type: 'square', vol: 0.06 });
      break;
    case 'toggle':
      tone({ freq: 520, to: 740, dur: 0.12, type: 'sine', vol: 0.1 });
      break;
    case 'ding':
      tone({ freq: 1320, dur: 0.12, type: 'sine', vol: 0.09 });
      tone({ freq: 1760, dur: 0.12, type: 'sine', vol: 0.06, delay: 0.06 });
      break;
    case 'whoosh':
      tone({ freq: 200, to: 900, dur: 0.3, type: 'sawtooth', vol: 0.05 });
      break;
    case 'scan':
      tone({ freq: 600, to: 1200, dur: 0.5, type: 'sine', vol: 0.05 });
      tone({ freq: 900, dur: 0.5, type: 'sine', vol: 0.03, delay: 0.25 });
      break;
    case 'success':
      tone({ freq: 660, dur: 0.14, type: 'sine', vol: 0.14 });
      tone({ freq: 880, dur: 0.14, type: 'sine', vol: 0.14, delay: 0.12 });
      tone({ freq: 1320, dur: 0.26, type: 'sine', vol: 0.14, delay: 0.24 });
      break;
    case 'error':
      tone({ freq: 320, to: 180, dur: 0.32, type: 'sawtooth', vol: 0.12 });
      tone({ freq: 220, to: 120, dur: 0.32, type: 'square', vol: 0.08, delay: 0.08 });
      break;
    case 'alert':
      tone({ freq: 740, dur: 0.16, type: 'square', vol: 0.1 });
      tone({ freq: 520, dur: 0.16, type: 'square', vol: 0.1, delay: 0.18 });
      tone({ freq: 740, dur: 0.16, type: 'square', vol: 0.1, delay: 0.36 });
      break;
  }
}
