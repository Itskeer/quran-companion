"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { audioService, AudioState } from "@/services/audioService";

export function useAudio() {
  const [state, setState] = useState<AudioState>(audioService.getState());

  useEffect(() => {
    return audioService.subscribe(setState);
  }, []);

  const play = useCallback(
    (surah: number, ayah: number = 1) => audioService.play(surah, ayah),
    []
  );
  const pause = useCallback(() => audioService.pause(), []);
  const stop = useCallback(() => audioService.stop(), []);
  const next = useCallback(() => audioService.next(), []);
  const prev = useCallback(() => audioService.previous(), []);
  const seek = useCallback((time: number) => audioService.seek(time), []);
  const setVolume = useCallback(
    (vol: number) => audioService.setVolume(vol),
    []
  );
  const setSpeed = useCallback(
    (rate: number) => audioService.setPlaybackRate(rate),
    []
  );
  const setRepeatMode = useCallback(
    (mode: AudioState["repeatMode"]) => audioService.setRepeatMode(mode),
    []
  );

  return {
    ...state,
    play,
    pause,
    stop,
    next,
    prev,
    seek,
    setVolume,
    setSpeed,
    setRepeatMode,
  };
}
