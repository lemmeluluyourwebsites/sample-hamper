// Web Audio API synthesizer for instant, zero-latency tactile audio feedback
let audioCtx = null;

export function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Crisp soft bubble pop sound
export function playPopSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const startFreq = 420 + Math.random() * 80;
    const endFreq = 840 + Math.random() * 120;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (err) {
    console.error('Audio play error:', err);
  }
}

// Full 3-Octave Diatonic Major Scale (Do, Re, Mi, Fa, Sol, La, Ti)
export const DIATONIC_OCTAVES = [
  {
    name: 'Octave 3 (Warm & Low)',
    notes: [
      { solfege: 'Do', note: 'C3', freq: 130.81 },
      { solfege: 'Re', note: 'D3', freq: 146.83 },
      { solfege: 'Mi', note: 'E3', freq: 164.81 },
      { solfege: 'Fa', note: 'F3', freq: 174.61 },
      { solfege: 'Sol', note: 'G3', freq: 196.00 },
      { solfege: 'La', note: 'A3', freq: 220.00 },
      { solfege: 'Ti', note: 'B3', freq: 246.94 },
    ],
  },
  {
    name: 'Octave 4 (Melodic Mid)',
    notes: [
      { solfege: 'Do', note: 'C4', freq: 261.63 },
      { solfege: 'Re', note: 'D4', freq: 293.66 },
      { solfege: 'Mi', note: 'E4', freq: 329.63 },
      { solfege: 'Fa', note: 'F4', freq: 349.23 },
      { solfege: 'Sol', note: 'G4', freq: 392.00 },
      { solfege: 'La', note: 'A4', freq: 440.00 },
      { solfege: 'Ti', note: 'B4', freq: 493.88 },
    ],
  },
  {
    name: 'Octave 5 (Sparkling High)',
    notes: [
      { solfege: 'Do', note: 'C5', freq: 523.25 },
      { solfege: 'Re', note: 'D5', freq: 587.33 },
      { solfege: 'Mi', note: 'E5', freq: 659.25 },
      { solfege: 'Fa', note: 'F5', freq: 698.46 },
      { solfege: 'Sol', note: 'G5', freq: 783.99 },
      { solfege: 'La', note: 'A5', freq: 880.00 },
      { solfege: 'Ti', note: 'B5', freq: 987.77 },
      { solfege: 'Do', note: 'C6', freq: 1046.50 },
    ],
  },
];

// Rich crystalline harp / music box tone
export function playDiatonicNote(frequency) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const subOsc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(frequency * 2, ctx.currentTime);

    gain.gain.setValueAtTime(0.24, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);

    osc.connect(gain);
    subOsc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    subOsc.start();
    osc.stop(ctx.currentTime + 0.7);
    subOsc.stop(ctx.currentTime + 0.7);
  } catch (err) {
    console.error('Diatonic note error:', err);
  }
}

// Gentle soft chime for catching hearts
export function playHeartChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5];
    const note = notes[Math.floor(Math.random() * notes.length)];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(note, ctx.currentTime);

    gain.gain.setValueAtTime(0.22, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.42);
  } catch (err) {
    console.error('Audio chime error:', err);
  }
}

// Joyful high arpeggio chime for kiss bonus (+2)
export function playBonusChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [659.25, 1046.5, 1318.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
      gain.gain.setValueAtTime(0.22, ctx.currentTime + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.07);
      osc.stop(ctx.currentTime + idx * 0.07 + 0.38);
    });
  } catch (err) {
    console.error('Audio bonus error:', err);
  }
}

// Soft low thud for catching raincloud (-1)
export function playPenaltySound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.28, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch (err) {
    console.error('Audio penalty error:', err);
  }
}

// Fiery whoosh and ember burn sound for "Burn It"
export function playBurnSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 1.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(850, ctx.currentTime + 0.6);
    filter.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 1.4);
    filter.Q.value = 3.0;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + 1.5);
  } catch (err) {
    console.error('Audio burn error:', err);
  }
}

// Arrow shoot sound for Cupid's Worry Popper
export function playArrowShootSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  } catch (err) {
    console.error('Audio shoot error:', err);
  }
}

// Worry bubble pop & relief chime
export function playWorryPopSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.09);

    [523.25, 659.25, 783.99].forEach((f, i) => {
      const chime = ctx.createOscillator();
      const cGain = ctx.createGain();
      chime.type = 'triangle';
      chime.frequency.setValueAtTime(f, ctx.currentTime + 0.04);
      cGain.gain.setValueAtTime(0.15, ctx.currentTime + 0.04);
      cGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4 + i * 0.05);
      chime.connect(cGain);
      cGain.connect(ctx.destination);
      chime.start(ctx.currentTime + 0.04);
      chime.stop(ctx.currentTime + 0.45 + i * 0.05);
    });
  } catch (err) {
    console.error('Worry pop error:', err);
  }
}

// Petal pluck sound
export function playPetalPluckSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const freq = 580 + Math.random() * 120;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.07);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.22);
  } catch (err) {
    console.error('Petal pluck error:', err);
  }
}

// Paper rustle & unfold chime
export function playPaperRustleSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [440, 554.37, 659.25];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.06);
      osc.stop(ctx.currentTime + idx * 0.06 + 0.38);
    });
  } catch (err) {
    console.error('Paper sound error:', err);
  }
}
