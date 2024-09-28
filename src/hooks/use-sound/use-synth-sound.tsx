import { useEffect, useRef, useCallback, useState } from "react";
import * as Tone from "tone";
import { useRawMIDI } from "@/hooks/use-midi/midi-hooks";
import { NoteMessageEvent } from "webmidi";
import { midiToNoteName } from "@/utils/note-utils";

export const useSynthSound = () => {
  const sampler = useRef<Tone.Sampler | null>(null);
  const volumeNode = useRef<Tone.Volume | null>(null);
  const activeNotes = useRef<Set<string>>(new Set());
  const isSynthInitialized = useRef(false);

  const [volume, setVolume] = useState(100);

  const { onMIDIMessage, isMIDIDeviceConnected } = useRawMIDI();

  useEffect(() => {
    if (!isSynthInitialized.current) {
      volumeNode.current = new Tone.Volume(0).toDestination();

      sampler.current = new Tone.Sampler(
        {
          C3: "https://tonejs.github.io/audio/salamander/C3.mp3",
          "D#3": "https://tonejs.github.io/audio/salamander/Ds3.mp3",
          "F#3": "https://tonejs.github.io/audio/salamander/Fs3.mp3",
          A3: "https://tonejs.github.io/audio/salamander/A3.mp3",
          C4: "https://tonejs.github.io/audio/salamander/C4.mp3",
          "D#4": "https://tonejs.github.io/audio/salamander/Ds4.mp3",
          "F#4": "https://tonejs.github.io/audio/salamander/Fs4.mp3",
          A4: "https://tonejs.github.io/audio/salamander/A4.mp3",
        },
        () => {
          console.log("Sampler loaded!");
        },
      ).connect(volumeNode.current);

      sampler.current.set({ release: 2 });

      isSynthInitialized.current = true;
    }

    const startTone = async () => {
      if (Tone.getContext().state !== "running") {
        await Tone.start();
      }
    };

    window.addEventListener("click", startTone, { once: true });

    return () => {
      window.removeEventListener("click", startTone);
      if (sampler.current) {
        sampler.current.dispose();
        sampler.current = null;
        isSynthInitialized.current = false;
      }
      if (volumeNode.current) {
        volumeNode.current.dispose();
        volumeNode.current = null;
      }
    };
  }, []);

  const changeVolume = useCallback((percent: number) => {
    setVolume(percent);
    if (volumeNode.current) {
      const dbValue: number =
        percent === 0 ? -Infinity : 20 * Math.log10(percent / 100);
      volumeNode.current.volume.value = dbValue;
    }
  }, []);

  const handleMIDIMessage = useCallback((event: NoteMessageEvent) => {
    if (!sampler.current || !isSynthInitialized.current) return;

    const { note, type } = event;
    const noteName = midiToNoteName(note.number);

    if (type === "noteon" && note.attack > 0) {
      if (!activeNotes.current.has(noteName)) {
        sampler.current?.triggerAttack(noteName, undefined, note.attack);
        activeNotes.current.add(noteName);
      }
    } else if (type === "noteoff" || (type === "noteon" && note.attack === 0)) {
      if (activeNotes.current.has(noteName)) {
        sampler.current?.triggerRelease(noteName);
        activeNotes.current.delete(noteName);
      }
    }
  }, []);

  const playNote = useCallback(
    async (noteName: string) => {
      if (!sampler.current || !isSynthInitialized.current) return;

      if (!activeNotes.current.has(noteName)) {
        sampler.current.triggerAttackRelease(noteName, "8n", undefined, 1);
      }
    },
    [sampler],
  );

  useEffect(() => {
    const unsubscribe = onMIDIMessage(handleMIDIMessage);
    return () => {
      unsubscribe();
    };
  }, [onMIDIMessage, handleMIDIMessage]);

  return {
    isMIDIDeviceConnected,
    volume,
    changeVolume,
    playNote,
  };
};
