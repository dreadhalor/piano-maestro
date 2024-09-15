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
  const [currentScaleIndex, setCurrentScaleIndex] = useState<number>(0);
  const [previousScaleIndex, setPreviousScaleIndex] = useState<number>(-1);
  const [feedback, setFeedback] = useState<string>("");
  const [isScaleComplete, setIsScaleComplete] = useState<boolean>(false);
  const { allKeysReleased } = useProcessedMIDI();

  const fullScale = [...scale.notes, ...scale.notes.slice(0, -1).reverse()];

  const currentNote = fullScale[currentIndex];
  const nextNote = fullScale[currentIndex + 1];

  const resetScale = useCallback(() => {
    setCurrentIndex(0);
    setPreviousScaleIndex(-1);
    setFeedback("");
    setIsScaleComplete(false);
  }, []);

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

  useEffect(() => {
    setCurrentScaleIndex((prev) => {
      if (currentIndex > 0 || isScaleComplete) setPreviousScaleIndex(prev);
      return currentIndex < scale.notes.length
        ? currentIndex
        : fullScale.length - currentIndex - 1;
    });
  }, [currentIndex, fullScale.length, scale.notes.length, isScaleComplete]);

  const handleNotePlayed = useCallback(
    (note: number) => {
      if (isScaleComplete) return;

      if (note === currentNote) {
        setFeedback("Correct!");
        setCurrentIndex((prev) => {
          const nextIndex = prev + 1;
          if (nextIndex === fullScale.length) {
            setIsScaleComplete(true);
            return prev;
          }
          return nextIndex;
        });
      } else {
        resetScale();
        setFeedback("Try Again!");
      }
    },
    [currentNote, fullScale.length, isScaleComplete, resetScale],
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
    currentScaleIndex,
    previousScaleIndex,
    nextNote,
    feedback,
    scale,
    skipScale,
    isScaleComplete,
  };
};
