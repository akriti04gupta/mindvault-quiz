import { useCallback, useRef, useEffect } from 'react';

// Web Audio API based sound effects for premium game experience
const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize audio context on first user interaction
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };
    
    window.addEventListener('click', initAudio, { once: true });
    return () => window.removeEventListener('click', initAudio);
  }, []);

  const getContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Correct answer sound - triumphant ascending tone
  const playCorrect = useCallback(() => {
    const ctx = getContext();
    const now = ctx.currentTime;
    
    // Main tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.setValueAtTime(659.25, now + 0.1); // E5
    osc1.frequency.setValueAtTime(783.99, now + 0.2); // G5
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.setTargetAtTime(0.01, now + 0.4, 0.1);
    
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.5);
    
    // Harmony
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(392, now); // G4
    osc2.frequency.setValueAtTime(493.88, now + 0.1); // B4
    osc2.frequency.setValueAtTime(587.33, now + 0.2); // D5
    gain2.gain.setValueAtTime(0.15, now);
    gain2.gain.setTargetAtTime(0.01, now + 0.4, 0.1);
    
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now);
    osc2.stop(now + 0.5);
  }, [getContext]);

  // Wrong answer sound - descending buzzer
  const playWrong = useCallback(() => {
    const ctx = getContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.3);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.setTargetAtTime(0.01, now + 0.25, 0.05);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  }, [getContext]);

  // Timer tick sound
  const playTick = useCallback(() => {
    const ctx = getContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.setTargetAtTime(0.01, now + 0.05, 0.02);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }, [getContext]);

  // Timer warning sound (last 10 seconds)
  const playWarningTick = useCallback(() => {
    const ctx = getContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(600, now);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.setTargetAtTime(0.01, now + 0.08, 0.02);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }, [getContext]);

  // Timer danger sound (last 5 seconds)
  const playDangerTick = useCallback(() => {
    const ctx = getContext();
    const now = ctx.currentTime;
    
    // Double beep for urgency
    for (let i = 0; i < 2; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now + i * 0.08);
      gain.gain.setValueAtTime(0.15, now + i * 0.08);
      gain.gain.setTargetAtTime(0.01, now + 0.05 + i * 0.08, 0.01);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + 0.06 + i * 0.08);
    }
  }, [getContext]);

  // Button click/select sound
  const playClick = useCallback(() => {
    const ctx = getContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(550, now + 0.02);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.setTargetAtTime(0.01, now + 0.05, 0.02);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }, [getContext]);

  // Game start fanfare
  const playGameStart = useCallback(() => {
    const ctx = getContext();
    const now = ctx.currentTime;
    
    const notes = [392, 440, 523.25, 659.25]; // G4, A4, C5, E5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.12);
      gain.gain.setValueAtTime(0.2, now + i * 0.12);
      gain.gain.setTargetAtTime(0.01, now + 0.15 + i * 0.12, 0.05);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + 0.2 + i * 0.12);
    });
  }, [getContext]);

  // Victory fanfare for game end
  const playVictory = useCallback(() => {
    const ctx = getContext();
    const now = ctx.currentTime;
    
    const melody = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.15);
      gain.gain.setValueAtTime(0.25, now + i * 0.15);
      gain.gain.setTargetAtTime(0.01, now + 0.3 + i * 0.15, 0.1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.15);
      osc.stop(now + 0.4 + i * 0.15);
    });
  }, [getContext]);

  // Game over sound
  const playGameOver = useCallback(() => {
    const ctx = getContext();
    const now = ctx.currentTime;
    
    const melody = [392, 349.23, 311.13, 293.66]; // G4, F4, Eb4, D4
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.2);
      gain.gain.setValueAtTime(0.2, now + i * 0.2);
      gain.gain.setTargetAtTime(0.01, now + 0.25 + i * 0.2, 0.1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.2);
      osc.stop(now + 0.35 + i * 0.2);
    });
  }, [getContext]);

  // Time up sound
  const playTimeUp = useCallback(() => {
    const ctx = getContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.5);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.setTargetAtTime(0.01, now + 0.4, 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.6);
  }, [getContext]);

  return {
    playCorrect,
    playWrong,
    playTick,
    playWarningTick,
    playDangerTick,
    playClick,
    playGameStart,
    playVictory,
    playGameOver,
    playTimeUp,
  };
};

export default useSoundEffects;
