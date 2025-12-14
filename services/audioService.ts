
// Simple Web Audio API Synthesizer to avoid external assets dependency

let audioCtx: AudioContext | null = null;

const getContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

const resumeContext = () => {
  const ctx = getContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
};

export const playClick = () => {
  try {
    resumeContext();
    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) { console.error(e); }
};

export const playSoftClick = () => {
  try {
    resumeContext();
    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) { console.error(e); }
};

export const playReveal = () => {
  try {
    resumeContext();
    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(100, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.5);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.2);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);

    osc.start();
    osc.stop(ctx.currentTime + 1.5);
  } catch (e) { console.error(e); }
};

export const playTick = () => {
  try {
    resumeContext();
    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'square';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) { console.error(e); }
};

export const playAlarm = () => {
  try {
    resumeContext();
    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.3);
    
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
    
    // Play a second beep
    setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(400, ctx.currentTime);
        osc2.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.3);
        gain2.gain.setValueAtTime(0.2, ctx.currentTime);
        gain2.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.3);
    }, 400);
  } catch (e) { console.error(e); }
};

export const playWin = (isCitizens: boolean) => {
  try {
    resumeContext();
    const ctx = getContext();
    
    const notes = isCitizens 
      ? [523.25, 659.25, 783.99, 1046.50] // C Major (Happy)
      : [392.00, 311.13, 293.66, 261.63]; // Diminished/Minor (Ominous/Impostor)

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = isCitizens ? 'sine' : 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + (i * 0.15));
      
      gain.gain.setValueAtTime(0, ctx.currentTime + (i * 0.15));
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + (i * 0.15) + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (i * 0.15) + 0.5);
      
      osc.start(ctx.currentTime + (i * 0.15));
      osc.stop(ctx.currentTime + (i * 0.15) + 0.6);
    });
  } catch (e) { console.error(e); }
};
