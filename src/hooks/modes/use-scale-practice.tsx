// use-scale-practice.ts
import { useState, useCallback, useEffect } from "react";
import { getRandomScale, Scale } from "@/utils/scale-utils";
import { useNotePressed, useProcessedMIDI } from "@/hooks/use-midi/midi-hooks";
import { useSettings } from "@/hooks/use-settings";

export const useScalePractice = () => {
  const { enabledScales } = useSettings();
  const [scale, setScale] = useState<Scale>(
    getRandomScale({ enabledScales: [...enabledScales] }),
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [feedback, setFeedback] = useState<string>("");
  const [isScaleComplete, setIsScaleComplete] = useState<boolean>(false);
  const { allKeysReleased } = useProcessedMIDI();

  const fullScale = [...scale.notes, ...scale.notes.slice(0, -1).reverse()];

  const currentNote = fullScale[currentIndex];
  const nextNote = fullScale[currentIndex + 1];

  const resetScale = useCallback((msg?: string) => {
    setCurrentIndex(0);
    setHighlightedIndex(-1);
    setFeedback(msg || "");
    setIsScaleComplete(false);
  }, []);
  const resetIndexToSecondNote = useCallback(() => {
    setCurrentIndex(1);
    setHighlightedIndex(0);
    setFeedback("Restarted Scale!");
    setIsScaleComplete(false);
  }, []);

  const advanceCurrentIndex = useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1;
      if (prev < scale.notes.length) setHighlightedIndex(prev);
      else setHighlightedIndex(fullScale.length - prev - 1);

      setFeedback("Correct!");
      if (nextIndex === fullScale.length) {
        setIsScaleComplete(true);
        return prev;
      }
      return nextIndex;
    });
  }, [scale.notes.length, fullScale.length]);

  useEffect(() => {
    if (isScaleComplete && allKeysReleased) {
      resetScale();
      setScale((prev) =>
        getRandomScale({
          currentScale: prev,
          enabledScales: [...enabledScales],
        }),
      );
    }
  }, [isScaleComplete, allKeysReleased, resetScale, enabledScales]);

  const handleNotePlayed = useCallback(
    (note: number) => {
      if (isScaleComplete) return;
      if (note === currentNote) return advanceCurrentIndex();
      if (note === scale.notes[0]) return resetIndexToSecondNote();
      resetScale("Try again!");
    },
    [
      isScaleComplete,
      currentNote,
      advanceCurrentIndex,
      resetIndexToSecondNote,
      resetScale,
      scale.notes,
    ],
  );

  const skipScale = useCallback(() => {
    resetScale();
    setScale((prev) =>
      getRandomScale({ currentScale: prev, enabledScales: [...enabledScales] }),
    );
  }, [resetScale, enabledScales]);

  useNotePressed(handleNotePlayed);

  return {
    currentNote,
    highlightedIndex,
    nextNote,
    feedback,
    scale,
    skipScale,
    isScaleComplete,
  };
};
