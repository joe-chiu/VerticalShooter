export class AudioManager {
    private audioContext: AudioContext;
    private masterGain: GainNode;
    private musicGain: GainNode;
    private sfxGain: GainNode;
    private static instance: AudioManager;

    private musicSource: AudioBufferSourceNode | null = null;
    private musicStartTime: number = 0;
    private musicPaused: boolean = false;

    private constructor() {
        this.audioContext = new AudioContext();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.connect(this.audioContext.destination);

        this.musicGain = this.audioContext.createGain();
        this.musicGain.gain.value = 0.3;
        this.musicGain.connect(this.masterGain);

        this.sfxGain = this.audioContext.createGain();
        this.sfxGain.gain.value = 0.5;
        this.sfxGain.connect(this.masterGain);
    }

    public static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    public resume(): void {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    // Generate a simple chiptune-style background music
    public playBackgroundMusic(): void {
        this.stopBackgroundMusic();

        const melody = [
            // Raiden-inspired melody pattern - Extended version
            // Section 1
            { note: 'E4', duration: 0.25 },
            { note: 'G4', duration: 0.25 },
            { note: 'A4', duration: 0.25 },
            { note: 'C5', duration: 0.5 },
            { note: 'B4', duration: 0.25 },
            { note: 'A4', duration: 0.25 },
            { note: 'G4', duration: 0.5 },
            { note: 'E4', duration: 0.5 },

            { note: 'D4', duration: 0.25 },
            { note: 'F4', duration: 0.25 },
            { note: 'G4', duration: 0.25 },
            { note: 'B4', duration: 0.5 },
            { note: 'A4', duration: 0.25 },
            { note: 'G4', duration: 0.25 },
            { note: 'F4', duration: 0.5 },
            { note: 'D4', duration: 0.5 },

            // Section 2 - Higher energy
            { note: 'C5', duration: 0.25 },
            { note: 'D5', duration: 0.25 },
            { note: 'E5', duration: 0.5 },
            { note: 'D5', duration: 0.25 },
            { note: 'C5', duration: 0.25 },
            { note: 'B4', duration: 0.5 },
            { note: 'A4', duration: 0.5 },

            { note: 'G4', duration: 0.25 },
            { note: 'A4', duration: 0.25 },
            { note: 'B4', duration: 0.5 },
            { note: 'C5', duration: 0.5 },
            { note: 'B4', duration: 0.25 },
            { note: 'A4', duration: 0.25 },
            { note: 'G4', duration: 1.0 },

            // Section 3 - Variation
            { note: 'A4', duration: 0.25 },
            { note: 'B4', duration: 0.25 },
            { note: 'C5', duration: 0.25 },
            { note: 'D5', duration: 0.5 },
            { note: 'C5', duration: 0.25 },
            { note: 'B4', duration: 0.25 },
            { note: 'A4', duration: 0.5 },
            { note: 'G4', duration: 0.5 },

            { note: 'F4', duration: 0.25 },
            { note: 'G4', duration: 0.25 },
            { note: 'A4', duration: 0.25 },
            { note: 'C5', duration: 0.5 },
            { note: 'B4', duration: 0.25 },
            { note: 'A4', duration: 0.25 },
            { note: 'G4', duration: 0.5 },
            { note: 'E4', duration: 0.5 },

            // Section 4 - Build up
            { note: 'E5', duration: 0.25 },
            { note: 'D5', duration: 0.25 },
            { note: 'C5', duration: 0.25 },
            { note: 'B4', duration: 0.25 },
            { note: 'A4', duration: 0.5 },
            { note: 'G4', duration: 0.5 },
            { note: 'A4', duration: 1.0 },

            // Section 5 - Climax
            { note: 'C5', duration: 0.5 },
            { note: 'E5', duration: 0.5 },
            { note: 'D5', duration: 0.5 },
            { note: 'C5', duration: 0.5 },
            { note: 'B4', duration: 0.5 },
            { note: 'A4', duration: 0.5 },
            { note: 'G4', duration: 1.0 },
        ];

        const bass = [
            { note: 'A2', duration: 1 },
            { note: 'G2', duration: 1 },
            { note: 'F2', duration: 1 },
            { note: 'G2', duration: 1 },

            { note: 'C3', duration: 1 },
            { note: 'B2', duration: 1 },
            { note: 'A2', duration: 1 },
            { note: 'G2', duration: 1 },

            { note: 'F2', duration: 1 },
            { note: 'G2', duration: 1 },
            { note: 'A2', duration: 1 },
            { note: 'C3', duration: 1 },

            { note: 'D3', duration: 1 },
            { note: 'C3', duration: 1 },
            { note: 'B2', duration: 1 },
            { note: 'A2', duration: 1 },

            { note: 'G2', duration: 2 },
            { note: 'A2', duration: 2 },
        ];

        this.playMelodyLoop(melody, bass);
    }

    private playMelodyLoop(melody: Array<{ note: string, duration: number }>, bass: Array<{ note: string, duration: number }>): void {
        const tempo = 140; // BPM
        const beatDuration = 60 / tempo;

        let melodyIndex = 0;
        let bassIndex = 0;
        let melodyTimeAccum = 0;
        let bassTimeAccum = 0;

        const playNextMelodyNote = () => {
            const { note, duration } = melody[melodyIndex];
            this.playNote(note, this.audioContext.currentTime, duration * beatDuration, 'square', this.musicGain, 0.15);
            melodyTimeAccum += duration * beatDuration;
            melodyIndex = (melodyIndex + 1) % melody.length;
        };

        const playNextBassNote = () => {
            const { note, duration } = bass[bassIndex];
            this.playNote(note, this.audioContext.currentTime, duration * beatDuration, 'sawtooth', this.musicGain, 0.1);
            bassTimeAccum += duration * beatDuration;
            bassIndex = (bassIndex + 1) % bass.length;
        };

        // Start immediately
        playNextMelodyNote();
        playNextBassNote();

        // Schedule subsequent notes
        const melodyInterval = setInterval(() => {
            if (this.musicSource === null) {
                clearInterval(melodyInterval);
                return;
            }
            playNextMelodyNote();
        }, melody[0].duration * beatDuration * 1000);

        const bassInterval = setInterval(() => {
            if (this.musicSource === null) {
                clearInterval(bassInterval);
                return;
            }
            playNextBassNote();
        }, bass[0].duration * beatDuration * 1000);

        // Store intervals for cleanup (we'll use musicSource as a flag)
        this.musicSource = {} as AudioBufferSourceNode; // Dummy object to track music playing
    }

    public stopBackgroundMusic(): void {
        this.musicSource = null; // This will stop the intervals
    }

    private noteToFrequency(note: string): number {
        const notes: { [key: string]: number } = {
            'C2': 65.41, 'D2': 73.42, 'E2': 82.41, 'F2': 87.31, 'G2': 98.00, 'A2': 110.00, 'B2': 123.47,
            'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
            'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
            'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
        };
        return notes[note] || 440;
    }

    private playNote(note: string, startTime: number, duration: number, waveType: OscillatorType, destination: GainNode, volume: number = 0.3): void {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = waveType;
        osc.frequency.value = this.noteToFrequency(note);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        osc.connect(gain);
        gain.connect(destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    public playShootSound(): void {
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    public playExplosionSound(): void {
        const now = this.audioContext.currentTime;

        // Create noise for explosion
        const bufferSize = this.audioContext.sampleRate * 0.3;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, now);
        filter.frequency.exponentialRampToValueAtTime(100, now + 0.3);

        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        noise.start(now);
        noise.stop(now + 0.3);
    }

    public playBombSound(): void {
        const now = this.audioContext.currentTime;

        // Big explosion with rumble - Extended duration
        const osc1 = this.audioContext.createOscillator();
        const osc2 = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(150, now);
        osc1.frequency.exponentialRampToValueAtTime(30, now + 1.0);

        osc2.type = 'square';
        osc2.frequency.setValueAtTime(100, now);
        osc2.frequency.exponentialRampToValueAtTime(20, now + 1.0);

        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1.0);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.sfxGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.0);
        osc2.stop(now + 1.0);
    }
}
