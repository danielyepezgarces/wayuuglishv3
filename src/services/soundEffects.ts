/**
 * Web Audio API synthesized sound effects and speech synthesis
 * Zero external audio file dependencies - 100% offline-ready!
 */

class SoundService {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  // Click / tap tile sound
  public playPop() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // AudioContext policy catch
    }
  }

  // Correct answer - Duolingo-style bright ascending chord
  public playCorrect() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.15, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    } catch {
      // Ignore
    }
  }

  // Incorrect answer - Friendly soft bump/buzz
  public playWrong() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(146.83, now + 0.25); // D3

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    } catch {
      // Ignore
    }
  }

  // Level complete fanfare
  public playComplete() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const chords = [
        { freqs: [392.0, 523.25, 659.25], time: 0 },
        { freqs: [440.0, 587.33, 698.46], time: 0.15 },
        { freqs: [523.25, 659.25, 783.99], time: 0.3 },
        { freqs: [659.25, 783.99, 1046.5], time: 0.55 },
      ];

      chords.forEach(({ freqs, time }) => {
        freqs.forEach((f) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + time);
          gain.gain.setValueAtTime(0.1, now + time);
          gain.gain.exponentialRampToValueAtTime(0.001, now + time + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + time);
          osc.stop(now + time + 0.45);
        });
      });
    } catch {
      // Ignore
    }
  }

  // Text-To-Speech for English and Spanish, with phonetic pronunciation guide for Wayuunaiki
  public speak(text: string, lang: 'en' | 'es' | 'wayuu' = 'en') {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();

      if (lang === 'wayuu') {
        // Wayuunaiki: uses phonetically adapted Spanish synthesizer voice or audible guide
        const utterance = new SpeechSynthesisUtterance(this.adaptWayuuPhonetics(text));
        utterance.lang = 'es-CO'; // Colombian indigenous accent approximation
        utterance.rate = 0.82; // Slightly slower for clear syllabification
        utterance.pitch = 1.05;
        window.speechSynthesis.speak(utterance);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'en' ? 'en-US' : 'es-ES';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore
    }
  }

  // Prepares Wayuunaiki text for clear Spanish acoustic engine pronunciation
  private adaptWayuuPhonetics(text: string): string {
    return text
      .replace(/wü/gi, 'gü')
      .replace(/ü/gi, 'u')
      .replace(/sh/gi, 'sh')
      .replace(/’/g, ' ')
      .replace(/'/g, ' ');
  }
}

export const sounds = new SoundService();
