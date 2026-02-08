class AudioManager {
    private context: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private isMuted: boolean = false;
    private isInitialized: boolean = false;

    constructor() {
        // AudioContext must be resumed/created after user interaction
        // We'll initialize lazily on the first interaction
    }

    private init() {
        if (this.isInitialized) return;

        try {
            this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.masterGain = this.context.createGain();
            this.masterGain.connect(this.context.destination);
            this.masterGain.gain.value = 0.3; // Default volume (not too loud)
            this.isInitialized = true;
        } catch (e) {
            console.error("Web Audio API not supported", e);
        }
    }

    public toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGain) {
            this.masterGain.gain.value = this.isMuted ? 0 : 0.3;
        }
        return this.isMuted;
    }

    public getMutedState() {
        return this.isMuted;
    }

    public async resume() {
        if (!this.isInitialized) this.init();
        if (this.context?.state === 'suspended') {
            await this.context.resume();
            console.log("Audio Context Resumed");
        }
    }

    // Helper to generic synth sounds
    private playOscillator(type: OscillatorType, freq: number, duration: number, startTime: number = 0, vol: number = 1) {
        if (this.isMuted) return;

        if (!this.context || !this.masterGain) {
            if (!this.isInitialized) this.init(); // Try to init if not ready
            if (!this.context) return; // Still failed? abort
        }

        if (this.context?.state === 'suspended') {
            this.context.resume();
        }

        try {
            const osc = this.context!.createOscillator();
            const gain = this.context!.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.context!.currentTime + startTime);

            gain.gain.setValueAtTime(vol, this.context!.currentTime + startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.context!.currentTime + startTime + duration);

            osc.connect(gain);
            gain.connect(this.masterGain!);

            osc.start(this.context!.currentTime + startTime);
            osc.stop(this.context!.currentTime + startTime + duration);
        } catch (e) {
            console.error("Error playing sound:", e);
        }
    }

    // --- Sound Effects ---

    public playHover() {
        // High, short tech chirp
        this.playOscillator('sine', 800, 0.05, 0, 0.1);
    }

    public playClick() {
        // Mechanical click
        this.playOscillator('square', 200, 0.1, 0, 0.2);
    }

    public playFlip() {
        // "Woosh" - synthesized by sliding frequency
        if (this.isMuted || !this.context) {
            if (!this.isInitialized) this.init();
            if (!this.context) return;
        }
        if (this.context.state === 'suspended') this.context.resume();

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, this.context.currentTime);
        osc.frequency.linearRampToValueAtTime(600, this.context.currentTime + 0.2);

        gain.gain.setValueAtTime(0.2, this.context.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start();
        osc.stop(this.context.currentTime + 0.2);
    }

    public playMatch() {
        // Major Chord Arpeggio (Power up)
        this.playOscillator('sine', 523.25, 0.3, 0);       // C5
        this.playOscillator('sine', 659.25, 0.3, 0.1);     // E5
        this.playOscillator('sine', 783.99, 0.4, 0.2);     // G5
        this.playOscillator('triangle', 1046.50, 0.5, 0.3, 0.2); // C6 (Sparkle)
    }

    public playMismatch() {
        // Dissonant "Error" buzz
        this.playOscillator('sawtooth', 150, 0.3, 0);
        this.playOscillator('sawtooth', 140, 0.3, 0.05); // slight detune
    }

    public playLevelComplete() {
        // Victory Fanfare
        const now = 0;
        this.playOscillator('square', 523.25, 0.1, now);
        this.playOscillator('square', 523.25, 0.1, now + 0.1);
        this.playOscillator('square', 523.25, 0.1, now + 0.2);
        this.playOscillator('square', 659.25, 0.4, now + 0.3); // Long note
    }

    public playGameOver() {
        // Power down slide
        if (this.isMuted || !this.context) return;

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, this.context.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.context.currentTime + 1.5);

        gain.gain.setValueAtTime(0.5, this.context.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.context.currentTime + 1.5);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start();
        osc.stop(this.context.currentTime + 1.5);
    }
}

export const audioManager = new AudioManager();
