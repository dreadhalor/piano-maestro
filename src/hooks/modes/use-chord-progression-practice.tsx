import { useState, useCallback, useEffect, useRef } from "react";
import {
  ProgressionTemplate,
  RealizedProgression,
  VoicedChord,
  getRandomKey,
  getRandomTemplate,
  realizeProgression,
  realizeProgressionFromAnchor,
} from "@/utils/chord-progressions";
import { useProcessedMIDI } from "@/hooks/use-midi/midi-hooks";
import { useSettings } from "@/hooks/use-settings";
import { type AbstractNote, midiToNoteName } from "@/utils/note-utils";
import { CHORD_TYPES } from "@/utils/chords";
import { matchesPitchClasses, matchesExactVoicing } from "@/utils/voice-leading";
import { useSound } from "@/hooks/use-sound/use-sound";

export type VoicingMode = "any" | "smooth";

export const useChordProgressionPractice = () => {
  const { lowKey, highKey, enabledProgressions } = useSettings();
  const { pressedNotes, allKeysReleased } = useProcessedMIDI();
  const { playNote } = useSound();

  const [selectedKey, setSelectedKey] = useState<AbstractNote | "random">("C");
  const [voicingMode, setVoicingMode] = useState<VoicingMode>("smooth");

  const currentTemplateRef = useRef<ProgressionTemplate>(getRandomTemplate());

  const [progression, setProgression] = useState<RealizedProgression | null>(
    null,
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isChordComplete, setIsChordComplete] = useState(false);
  const [awaitingKeyRelease, setAwaitingKeyRelease] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isAnchored, setIsAnchored] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const playTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const pendingAutoPlayRef = useRef(false);

  const startNewProgression = useCallback(
    (template?: ProgressionTemplate) => {
      const t =
        template ?? getRandomTemplate(currentTemplateRef.current, enabledProgressions);
      currentTemplateRef.current = t;
      const key = selectedKey === "random" ? getRandomKey() : selectedKey;
      const realized = realizeProgression(t, key, lowKey, highKey);
      setProgression(realized);
      pendingAutoPlayRef.current = true;
      setCurrentIndex(0);
      setFeedback("");
      setIsChordComplete(false);
      setAwaitingKeyRelease(false);
      setIsAnchored(false);
    },
    [selectedKey, lowKey, highKey, enabledProgressions],
  );

  // Initialize and re-realize when key or range changes
  useEffect(() => {
    startNewProgression(currentTemplateRef.current);
  }, [startNewProgression]);

  const currentChord: VoicedChord | null =
    progression?.chords[currentIndex] ?? null;
  const nextChord: VoicedChord | null =
    progression?.chords[currentIndex + 1] ?? null;

  const goToNextChord = useCallback(() => {
    if (!progression) return;
    if (currentIndex < progression.chords.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setFeedback("");
      setIsChordComplete(false);
      setAwaitingKeyRelease(false);
    } else {
      startNewProgression();
    }
  }, [currentIndex, progression, startNewProgression]);

  const handleChordPlayed = useCallback(
    (playedNotes: number[]) => {
      if (!currentChord || !progression) return;

      if (isChordComplete && allKeysReleased && awaitingKeyRelease) {
        goToNextChord();
        return;
      }

      if (isChordComplete) {
        if (allKeysReleased) {
          setAwaitingKeyRelease(true);
        }
        return;
      }

      const intervals = CHORD_TYPES[currentChord.type].intervals;
      const expectedNoteCount = intervals.length;

      if (playedNotes.length === expectedNoteCount) {
        let correct: boolean;

        if (voicingMode === "any") {
          // Any mode: always accept any voicing (pitch-class match)
          correct = matchesPitchClasses(
            playedNotes,
            currentChord.rootPitchClass,
            intervals,
          );
        } else if (currentIndex === 0 && !isAnchored) {
          // Smooth mode, first chord, not anchored: accept any voicing
          correct = matchesPitchClasses(
            playedNotes,
            currentChord.rootPitchClass,
            intervals,
          );

          if (correct) {
            // Re-realize the progression voice-led from the player's starting chord
            const reRealized = realizeProgressionFromAnchor(
              progression.template,
              progression.key as AbstractNote,
              playedNotes,
              lowKey,
              highKey,
            );
            setProgression(reRealized);
            setIsAnchored(true);
          }
        } else {
          // Smooth mode, anchored: require exact voicing
          correct = matchesExactVoicing(playedNotes, currentChord.midiNotes);
        }

        if (correct) {
          setFeedback("Correct!");
          setIsChordComplete(true);
          setAwaitingKeyRelease(false);
          setCorrectCount((prev) => prev + 1);
        } else {
          setFeedback("Try Again!");
          setIncorrectCount((prev) => prev + 1);
        }
      }
    },
    [
      allKeysReleased,
      awaitingKeyRelease,
      currentChord,
      currentIndex,
      isAnchored,
      isChordComplete,
      goToNextChord,
      lowKey,
      highKey,
      progression,
      voicingMode,
    ],
  );

  const skipProgression = useCallback(() => {
    startNewProgression();
  }, [startNewProgression]);

  const skipChord = useCallback(() => {
    goToNextChord();
  }, [goToNextChord]);

  useEffect(() => {
    handleChordPlayed(pressedNotes);
  }, [pressedNotes, handleChordPlayed]);

  const clearPlayTimeouts = useCallback(() => {
    playTimeoutsRef.current.forEach(clearTimeout);
    playTimeoutsRef.current = [];
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearPlayTimeouts();
  }, [clearPlayTimeouts]);

  const playChordBlock = useCallback(
    (chord: VoicedChord) => {
      chord.midiNotes.forEach((midi) => {
        playNote(midiToNoteName(midi));
      });
    },
    [playNote],
  );

  /** Play the current chord audibly */
  const playCurrentChord = useCallback(() => {
    if (!currentChord) return;
    playChordBlock(currentChord);
  }, [currentChord, playChordBlock]);

  /** Play the entire progression chord by chord with a delay between each */
  const playProgression = useCallback(() => {
    if (!progression || isPlaying) return;

    clearPlayTimeouts();
    setIsPlaying(true);

    const chordDelay = 800; // ms between each chord

    progression.chords.forEach((chord, i) => {
      const timeout = setTimeout(() => {
        playChordBlock(chord);

        // Mark as done after the last chord
        if (i === progression.chords.length - 1) {
          const endTimeout = setTimeout(() => {
            setIsPlaying(false);
          }, chordDelay);
          playTimeoutsRef.current.push(endTimeout);
        }
      }, i * chordDelay);
      playTimeoutsRef.current.push(timeout);
    });
  }, [progression, isPlaying, playChordBlock, clearPlayTimeouts]);

  // Auto-play the progression when a new one is realized and autoPlay is enabled
  useEffect(() => {
    if (progression && pendingAutoPlayRef.current && autoPlay) {
      pendingAutoPlayRef.current = false;
      const timeout = setTimeout(() => {
        playProgression();
      }, 300);
      return () => clearTimeout(timeout);
    }
    pendingAutoPlayRef.current = false;
  }, [progression, autoPlay, playProgression]);

  return {
    progression,
    currentChord,
    nextChord,
    currentIndex,
    feedback,
    voicingMode,
    setVoicingMode,
    selectedKey,
    setSelectedKey,
    skipProgression,
    skipChord,
    correctCount,
    incorrectCount,
    playProgression,
    playCurrentChord,
    isPlaying,
    autoPlay,
    setAutoPlay,
    isAnchored,
  };
};
