import { useState, useCallback } from "react";
import { useSettings } from "@/hooks/use-settings";
import { useSound } from "@/hooks/use-sound/use-sound";
import { CHORD_TYPES, ChordTypeKey } from "@/utils/chords";
import { midiToNoteName } from "@/utils/note-utils";

interface RecognitionChord {
  type: ChordTypeKey;
  label: string;
  rootMidi: number;
  midiNotes: number[];
  inversion: number;
}

type State = "initial" | "playing" | "answered";

export const useChordRecognitionPractice = () => {
  const {
    lowKey,
    highKey,
    enabledChordRecognitionTypes: enabledTypes,
    chordRecognitionInversionsEnabled: inversionsEnabled,
    chordRecognitionPlaybackStyle: playbackStyle,
  } = useSettings();
  const { playNote } = useSound();

  const [state, setState] = useState<State>("initial");
  const [currentChord, setCurrentChord] = useState<RecognitionChord | null>(
    null,
  );
  const [feedback, setFeedback] = useState<string>("");

  const generateRandomChord = useCallback((): RecognitionChord | null => {
    const available = Array.from(enabledTypes);
    if (available.length === 0) return null;

    const typeKey = available[Math.floor(Math.random() * available.length)];
    const chordDef = CHORD_TYPES[typeKey];
    const intervals = chordDef.intervals;

    const inversion =
      inversionsEnabled ? Math.floor(Math.random() * intervals.length) : 0;

    // Compute the span of the chord (with inversion applied) to ensure it fits
    const invertedIntervals = intervals.map((interval) => {
      const shifted = interval - intervals[inversion];
      return ((shifted % 12) + 12) % 12;
    });
    invertedIntervals.sort((a, b) => a - b);
    const chordSpan = invertedIntervals[invertedIntervals.length - 1];

    const rootMin = lowKey;
    const rootMax = highKey - chordSpan;
    if (rootMin > rootMax) return null;

    const rootMidi =
      rootMin + Math.floor(Math.random() * (rootMax - rootMin + 1));

    const midiNotes = invertedIntervals.map((offset) => rootMidi + offset);

    const rootNoteName = midiToNoteName(rootMidi);
    const rootLetter = rootNoteName.slice(0, -1);
    const label = `${rootLetter}${chordDef.shorthand}`;

    return {
      type: typeKey,
      label,
      rootMidi,
      midiNotes,
      inversion,
    };
  }, [enabledTypes, inversionsEnabled, lowKey, highKey]);

  const playChordNotes = useCallback(
    (chord: RecognitionChord) => {
      if (playbackStyle === "block") {
        chord.midiNotes.forEach((midi) => {
          playNote(midiToNoteName(midi));
        });
      } else {
        chord.midiNotes.forEach((midi, i) => {
          setTimeout(() => {
            playNote(midiToNoteName(midi));
          }, i * 200);
        });
      }
    },
    [playbackStyle, playNote],
  );

  const playInterval = useCallback(() => {
    const chord = generateRandomChord();
    if (!chord) {
      setFeedback("No chord types selected or invalid range.");
      return;
    }
    setCurrentChord(chord);
    setFeedback("");
    playChordNotes(chord);
  }, [generateRandomChord, playChordNotes]);

  const replayChord = useCallback(() => {
    if (!currentChord) {
      setFeedback("No chord to replay.");
      return;
    }
    playChordNotes(currentChord);
  }, [currentChord, playChordNotes]);

  const nextChord = useCallback(() => {
    setCurrentChord(null);
    setFeedback("");
    setState("playing");
    playInterval();
  }, [playInterval]);

  const submitAnswer = (selectedType: ChordTypeKey): boolean => {
    if (!currentChord) {
      setFeedback("Please play a chord first.");
      return false;
    }

    const correct = selectedType === currentChord.type;
    if (correct) setFeedback("Correct!");
    else setFeedback("Incorrect :(");

    setState("answered");
    return correct;
  };

  const start = useCallback(() => {
    setState("playing");
    playInterval();
  }, [playInterval]);

  return {
    state,
    start,
    feedback,
    currentChord,
    nextChord,
    replayChord,
    submitAnswer,
    enabledTypes,
  };
};
