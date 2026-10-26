import { Chord } from "tonal";
import { midiToAbstractNoteName } from "./note-utils";

export interface DetectedChord {
  name: string; // Best reading, e.g. "Cmaj7/E"
  alternatives: string[]; // Other valid readings of the same notes, e.g. "Am7/C" for "C6"
}

// Tonal writes major as "M" ("CM", "CMadd9", "CM13#11"); match the app's style instead
const formatSymbol = (symbol: string): string => {
  const [main, bass] = symbol.split("/");
  const { tonic } = Chord.get(main);
  if (!tonic) return symbol;

  let suffix = main.slice(tonic.length);
  if (suffix === "M") suffix = "";
  else if (/^M\d/.test(suffix)) suffix = `maj${suffix.slice(1)}`;
  else if (suffix.startsWith("M")) suffix = suffix.slice(1);

  return `${tonic}${suffix}${bass ? `/${bass}` : ""}`;
};

// Alternate readings are only worth showing when they're everyday chords (C6 ↔ Am7/C, Em7b5 ↔ Gm6/E);
// tonal also offers exotic ones like F#7#5b9#11/C that are technically valid but just noise
const COMMON_QUALITIES = new Set([
  "",
  "m",
  "6",
  "m6",
  "7",
  "maj7",
  "m7",
  "m7b5",
  "dim",
  "dim7",
  "aug",
  "sus2",
  "sus4",
  "7sus4",
  "9",
  "maj9",
  "m9",
]);
const isCommon = (name: string) => {
  const main = name.split("/")[0];
  return COMMON_QUALITIES.has(main.slice(Chord.get(main).tonic?.length ?? 0));
};

// A minor chord with a raised 5th (Em#5, Em7#5) is always better read as an inversion of a
// major chord (C/E, Cadd9/E), but tonal sometimes ranks it first
const isMisreadInversion = (symbol: string) => /m7?#5/.test(symbol);

export const detectChord = (midiNotes: number[]): DetectedChord | null => {
  // Bass first: tonal treats the first note as the bass when naming inversions
  const pitchClasses = [
    ...new Set(
      [...midiNotes].sort((a, b) => a - b).map(midiToAbstractNoteName),
    ),
  ];
  if (pitchClasses.length < 2) return null;

  const candidates = Chord.detect(pitchClasses);
  if (candidates.length === 0) return null;

  const ranked = [
    ...candidates.filter((symbol) => !isMisreadInversion(symbol)),
    ...candidates.filter(isMisreadInversion),
  ].map(formatSymbol);

  // Alternate readings of a triad are always contrived (Em#5/C for C), so only show them for 4+ notes
  const alternatives =
    pitchClasses.length >= 4
      ? ranked.slice(1).filter(isCommon).slice(0, 2)
      : [];

  return { name: ranked[0], alternatives };
};
