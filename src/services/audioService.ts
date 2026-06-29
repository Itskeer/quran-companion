export const SURAH_AYAH_COUNTS: number[] = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 110, 98,
  135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54,
  53, 89, 59, 37, 35, 38, 28, 28, 20, 56, 40, 56, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19,
  26, 30, 20, 15, 21, 11, 8, 5, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6,
  3, 5, 4, 5, 3, 6, 3, 5, 4, 5, 6, 12, 11, 6, 3, 5, 4, 7, 3, 6, 3, 5,
  4, 5, 3, 7, 5, 5, 8, 18, 12, 13, 11, 11, 8, 5, 5, 8, 3, 6, 3, 5, 4, 5,
  3, 7, 5, 5, 9, 12, 12, 7, 4,
];

export function getAbsoluteAyahNumber(surah: number, ayah: number): number {
  let count = 0;
  for (let i = 0; i < surah - 1; i++) count += SURAH_AYAH_COUNTS[i];
  return count + ayah;
}

export function getAyahCount(surah: number): number {
  if (surah < 1 || surah > 114) return 0;
  return SURAH_AYAH_COUNTS[surah - 1];
}

type AudioState = {
  isPlaying: boolean;
  currentSurah: number;
  currentAyah: number;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  repeatMode: "off" | "one" | "all";
};

type AudioCallback = (state: AudioState) => void;

const RECITERS = {
  alafasy: "ar.alafasy",
  sudais: "ar.abdurrahmaanassudais",
  husary: "ar.husary",
  minshawi: "ar.minshawi",
} as const;

type ReciterKey = keyof typeof RECITERS;

class AudioService {
  private audio: HTMLAudioElement | null = null;
  private state: AudioState = {
    isPlaying: false,
    currentSurah: 1,
    currentAyah: 1,
    currentTime: 0,
    duration: 0,
    volume: 1,
    playbackRate: 1,
    repeatMode: "off",
  };
  private callbacks: AudioCallback[] = [];
  private reciter: ReciterKey = "alafasy";
  private bitrate: number = 128;

  private constructor() {
    if (typeof window !== "undefined") {
      this.audio = new Audio();
      this.audio.addEventListener("timeupdate", this.handleTimeUpdate);
      this.audio.addEventListener("ended", this.handleEnded);
      this.audio.addEventListener("loadedmetadata", this.handleLoadedMetadata);
      this.audio.addEventListener("error", this.handleError);
    }
  }

  private static instance: AudioService;

  static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  subscribe(callback: AudioCallback): () => void {
    this.callbacks.push(callback);
    callback({ ...this.state });
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback);
    };
  }

  private notify() {
    const snapshot = { ...this.state };
    this.callbacks.forEach((cb) => cb(snapshot));
  }

  private getAudioUrl(surah: number, ayah: number): string {
    const absNum = getAbsoluteAyahNumber(surah, ayah);
    return `https://cdn.islamic.network/quran/audio/${this.bitrate}/${RECITERS[this.reciter]}/${absNum}.mp3`;
  }

  private handleTimeUpdate = () => {
    if (!this.audio) return;
    this.state.currentTime = this.audio.currentTime;
    this.notify();
  };

  private handleLoadedMetadata = () => {
    if (!this.audio) return;
    this.state.duration = this.audio.duration;
    this.notify();
  };

  private handleError = () => {
    this.state.isPlaying = false;
    this.notify();
  };

  private handleEnded = () => {
    if (this.state.repeatMode === "one") {
      this.play(this.state.currentSurah, this.state.currentAyah);
    } else if (this.state.repeatMode === "all" || this.hasNext()) {
      this.next();
    } else {
      this.state.isPlaying = false;
      this.notify();
    }
  };

  play(surah: number, ayah: number): void {
    if (!this.audio) return;

    const wasPlaying = this.state.isPlaying;
    const url = this.getAudioUrl(surah, ayah);

    this.state.currentSurah = surah;
    this.state.currentAyah = ayah;
    this.state.currentTime = 0;

    if (this.audio.src !== url) {
      this.audio.src = url;
      this.audio.load();
    }

    this.audio.playbackRate = this.state.playbackRate;
    this.audio.volume = this.state.volume;

    this.audio
      .play()
      .then(() => {
        this.state.isPlaying = true;
        this.notify();
      })
      .catch(() => {
        this.state.isPlaying = false;
        this.notify();
      });
  }

  pause(): void {
    if (!this.audio) return;
    this.audio.pause();
    this.state.isPlaying = false;
    this.notify();
  }

  resume(): void {
    if (!this.audio) return;
    this.audio.play()
      .then(() => {
        this.state.isPlaying = true;
        this.notify();
      })
      .catch(() => {
        this.state.isPlaying = false;
      });
  }

  togglePlayPause(): void {
    if (this.state.isPlaying) {
      this.pause();
    } else {
      this.resume();
    }
  }

  stop(): void {
    if (!this.audio) return;
    this.audio.pause();
    this.audio.currentTime = 0;
    this.state.isPlaying = false;
    this.state.currentTime = 0;
    this.notify();
  }

  seek(time: number): void {
    if (!this.audio) return;
    this.audio.currentTime = Math.max(0, Math.min(time, this.state.duration));
    this.state.currentTime = this.audio.currentTime;
    this.notify();
  }

  seekToAyah(surah: number, ayah: number): void {
    this.play(surah, ayah);
  }

  setVolume(vol: number): void {
    const clamped = Math.max(0, Math.min(1, vol));
    this.state.volume = clamped;
    if (this.audio) {
      this.audio.volume = clamped;
    }
    this.notify();
  }

  setPlaybackRate(rate: number): void {
    const clamped = Math.max(0.5, Math.min(2, rate));
    this.state.playbackRate = clamped;
    if (this.audio) {
      this.audio.playbackRate = clamped;
    }
    this.notify();
  }

  setRepeatMode(mode: "off" | "one" | "all"): void {
    this.state.repeatMode = mode;
    this.notify();
  }

  setReciter(reciter: ReciterKey): void {
    this.reciter = reciter;
    if (this.audio && this.state.isPlaying) {
      this.play(this.state.currentSurah, this.state.currentAyah);
    }
  }

  setBitrate(bitrate: number): void {
    this.bitrate = bitrate;
    if (this.audio && this.state.isPlaying) {
      this.play(this.state.currentSurah, this.state.currentAyah);
    }
  }

  hasNext(): boolean {
    const maxAyah = getAyahCount(this.state.currentSurah);
    if (this.state.currentAyah < maxAyah) return true;
    return this.state.currentSurah < 114;
  }

  hasPrevious(): boolean {
    return this.state.currentAyah > 1 || this.state.currentSurah > 1;
  }

  next(): void {
    const maxAyah = getAyahCount(this.state.currentSurah);
    if (this.state.currentAyah < maxAyah) {
      this.play(this.state.currentSurah, this.state.currentAyah + 1);
    } else if (this.state.currentSurah < 114) {
      this.play(this.state.currentSurah + 1, 1);
    }
  }

  previous(): void {
    if (this.state.currentAyah > 1) {
      this.play(this.state.currentSurah, this.state.currentAyah - 1);
    } else if (this.state.currentSurah > 1) {
      const prevSurah = this.state.currentSurah - 1;
      const prevAyahCount = getAyahCount(prevSurah);
      this.play(prevSurah, prevAyahCount);
    }
  }

  getState(): AudioState {
    return { ...this.state };
  }

  destroy(): void {
    if (!this.audio) return;
    this.audio.pause();
    this.audio.removeEventListener("timeupdate", this.handleTimeUpdate);
    this.audio.removeEventListener("ended", this.handleEnded);
    this.audio.removeEventListener("loadedmetadata", this.handleLoadedMetadata);
    this.audio.removeEventListener("error", this.handleError);
    this.audio.src = "";
    this.audio = null;
    this.callbacks = [];
  }
}

export const audioService = AudioService.getInstance();
export type { AudioState };
