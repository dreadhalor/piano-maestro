import { useState, useCallback } from "react";
import { useSettings } from "@/hooks/use-settings";
import { useSound } from "@/hooks/use-sound/use-sound";
import { INTERVAL_TYPES, IntervalKey } from "@/utils/interval-utils";
import { midiToNoteName } from "@/utils/chord-utils";

// Extended Interface to store both notes of the interval
interface Interval {
  name: IntervalKey;
  semitones: number;
  direction: "ascending" | "descending";
  firstNote: number;
  secondNote: number;
}

type State = "initial" | "playing" | "answered";

export const useIntervalPractice = () => {
  const { lowKey, highKey, enabledIntervals, intervalDirection } =
    useSettings();
  const { playNote } = useSound();
  const [state, setState] = useState<State>("initial");

  const [currentInterval, setCurrentInterval] = useState<Interval | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  // Function to generate a random interval based on settings and ensure notes are within range
  const generateRandomInterval = useCallback((): Interval | null => {
    const availableIntervals = Array.from(enabledIntervals)
      .map((key) => INTERVAL_TYPES[key])
      .filter(
        (interval) => interval.semitones >= 1 && interval.semitones <= 12,
      ); // Ensuring minor 2nd (1) to octave (12)

    if (availableIntervals.length === 0) return null;

    // Shuffle the enabled intervals to randomize selection
    const shuffledIntervals = availableIntervals.sort(
      () => 0.5 - Math.random(),
    );

    for (const interval of shuffledIntervals) {
      const possibleDirections: Array<"ascending" | "descending"> = [];
      if (intervalDirection === "ascending" || intervalDirection === "both") {
        possibleDirections.push("ascending");
      }
      if (intervalDirection === "descending" || intervalDirection === "both") {
        possibleDirections.push("descending");
      }

      if (possibleDirections.length === 0) continue;

      // Shuffle directions to randomize selection
      const shuffledDirections = possibleDirections.sort(
        () => 0.5 - Math.random(),
      );

      for (const direction of shuffledDirections) {
        let rootMin = lowKey;
        let rootMax = highKey;

        if (direction === "ascending") {
          rootMax = highKey - interval.semitones;
        } else {
          rootMin = lowKey + interval.semitones;
        }

        if (rootMin > rootMax) continue; // No valid root note for this interval and direction

        const rootNote = getRandomRootNote(rootMin, rootMax);
        if (rootNote === null) continue;

        let secondNote: number;
        if (direction === "ascending") {
          secondNote = rootNote + interval.semitones;
        } else {
          secondNote = rootNote - interval.semitones;
        }

        // Final check to ensure both notes are within range
        if (secondNote < lowKey || secondNote > highKey) continue;

        return {
          name: getIntervalKeyBySemitones(interval.semitones),
          semitones: interval.semitones,
          direction,
          firstNote: rootNote,
          secondNote: secondNote,
        };
      }
    }

    return null;
  }, [enabledIntervals, intervalDirection, lowKey, highKey]);

  // Function to get IntervalKey by semitones (assuming unique semitones per interval)
  const getIntervalKeyBySemitones = (semitones: number): IntervalKey => {
    for (const [key, value] of Object.entries(INTERVAL_TYPES)) {
      if (value.semitones === semitones) return key as IntervalKey;
    }
    throw new Error(`No interval found with semitones: ${semitones}`);
  };

  // Function to get a random root note within specified min and max
  const getRandomRootNote = (min: number, max: number): number | null => {
    if (min > max) return null;
    const rangeSize = max - min + 1;
    return min + Math.floor(Math.random() * rangeSize);
  };

  // Function to play the current interval
  const playInterval = useCallback(() => {
    const interval = generateRandomInterval();
    if (!interval) {
      setFeedback("No intervals selected or invalid range.");
      return;
    }

    setCurrentInterval(interval);
    setFeedback("");

    // Play first note
    playNote(midiToNoteName(interval.firstNote));

    // Play second note after 1 second
    setTimeout(() => {
      playNote(midiToNoteName(interval.secondNote));
    }, 1000); // 1 second delay
  }, [generateRandomInterval, playNote]);

  // Function to replay the current interval
  const replayInterval = useCallback(() => {
    if (!currentInterval) {
      setFeedback("No interval to replay.");
      return;
    }

    // Play first note
    playNote(midiToNoteName(currentInterval.firstNote));

    // Play second note after 1 second
    setTimeout(() => {
      playNote(midiToNoteName(currentInterval.secondNote));
    }, 1000); // 1 second delay
  }, [currentInterval, playNote]);

  const nextInterval = useCallback(() => {
    setCurrentInterval(null);
    setFeedback("");
    setState("playing");
    playInterval();
  }, [playInterval]);

  // Function to submit user's answer
  const submitAnswer = (selectedIntervalKey: IntervalKey) => {
    if (!currentInterval) {
      setFeedback("Please play an interval first.");
      return;
    }

    if (selectedIntervalKey === currentInterval.name) setFeedback("Correct!");
    else setFeedback(`Incorrect :(`);

    setState("answered");
  };

  const start = useCallback(() => {
    setState("playing");
    playInterval();
  }, [playInterval]);

  return {
    state,
    start,
    feedback,
    playInterval,
    nextInterval,
    replayInterval,
    currentInterval,
    submitAnswer,
    enabledIntervals,
  };
};
