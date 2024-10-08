import {
  AbstractNote,
  getRandomAbstractNote,
  mapStringToAbstractNote,
  NOTES,
  stepFromAbstractNote,
} from "./note-utils";

export const INTERVAL_TYPES = {
  "minor-2nd": { label: "Minor 2nd", shorthand: "m2", semitones: 1 },
  "major-2nd": { label: "Major 2nd", shorthand: "M2", semitones: 2 },
  "minor-3rd": { label: "Minor 3rd", shorthand: "m3", semitones: 3 },
  "major-3rd": { label: "Major 3rd", shorthand: "M3", semitones: 4 },
  "perfect-4th": { label: "Perfect 4th", shorthand: "P4", semitones: 5 },
  tritone: { label: "Tritone", shorthand: "TT", semitones: 6 },
  "perfect-5th": { label: "Perfect 5th", shorthand: "P5", semitones: 7 },
  "minor-6th": { label: "Minor 6th", shorthand: "m6", semitones: 8 },
  "major-6th": { label: "Major 6th", shorthand: "M6", semitones: 9 },
  "minor-7th": { label: "Minor 7th", shorthand: "m7", semitones: 10 },
  "major-7th": { label: "Major 7th", shorthand: "M7", semitones: 11 },
  octave: { label: "Octave", shorthand: "P8", semitones: 12 },
} as const;

export type IntervalKey = keyof typeof INTERVAL_TYPES;

export const INTERVAL_NAMES: Record<IntervalKey, string> = {
  "minor-2nd": "Minor 2nd",
  "major-2nd": "Major 2nd",
  "minor-3rd": "Minor 3rd",
  "major-3rd": "Major 3rd",
  "perfect-4th": "Perfect 4th",
  tritone: "Tritone",
  "perfect-5th": "Perfect 5th",
  "minor-6th": "Minor 6th",
  "major-6th": "Major 6th",
  "minor-7th": "Minor 7th",
  "major-7th": "Major 7th",
  octave: "Octave",
};

export type IntervalDirection = "ascending" | "descending";
export type IntervalDirections = IntervalDirection | "both";

export interface Interval {
  name: string;
  notes: number[];
  type: IntervalKey;
  steps: number;
  shorthand: string;
  direction: IntervalDirection;
}
export interface AbstractInterval extends Omit<Interval, "notes"> {
  notes: [AbstractNote, AbstractNote];
}

export const getRandomIntervalKey = ({
  currentInterval,
  enabledIntervals,
}: {
  currentInterval?: IntervalKey;
  enabledIntervals?: IntervalKey[];
} = {}) => {
  let randomInterval: IntervalKey;
  // If no enabled intervals, return the first interval
  if (enabledIntervals && enabledIntervals.length === 0) return "minor-2nd";
  // If only one interval is enabled, return that interval
  if (enabledIntervals && enabledIntervals.length === 1)
    return enabledIntervals[0];

  do {
    randomInterval = Object.keys(INTERVAL_TYPES)[
      Math.floor(Math.random() * Object.keys(INTERVAL_TYPES).length)
    ] as IntervalKey;
  } while (
    (currentInterval && randomInterval === currentInterval) ||
    (enabledIntervals && !enabledIntervals.includes(randomInterval))
  );
  return randomInterval;
};

const coerceDirection = (direction?: IntervalDirections) => {
  if (!direction) return "ascending";
  return direction === "both"
    ? Math.random() < 0.5
      ? "ascending"
      : "descending"
    : direction;
};

const getTrueRandomAbstractInterval = ({
  enabledIntervals,
  enabledRootNotes,
  direction,
}: {
  enabledIntervals?: IntervalKey[];
  enabledRootNotes?: AbstractNote[];
  direction?: IntervalDirections;
}) => {
  const randomIntervalKey = getRandomIntervalKey({
    enabledIntervals,
  });
  const randomRoot = getRandomAbstractNote({
    enabledNotes: enabledRootNotes,
  });
  const coercedDirection = coerceDirection(direction);

  const interval = INTERVAL_TYPES[randomIntervalKey];
  const secondNote = stepFromAbstractNote(
    randomRoot,
    interval.semitones,
    coercedDirection,
  );

  const notes = [randomRoot, secondNote] as [AbstractNote, AbstractNote];

  return {
    name: randomIntervalKey,
    notes,
    shorthand: interval.shorthand,
    steps: interval.semitones,
    type: randomIntervalKey,
    direction: coercedDirection,
  } satisfies AbstractInterval;
};

export const getRandomAbstractInterval = ({
  currentInterval,
  enabledIntervals,
  enabledRootNotes,
  direction,
}: {
  currentInterval?: AbstractInterval;
  enabledIntervals?: IntervalKey[];
  enabledRootNotes?: AbstractNote[];
  direction?: IntervalDirections;
}) => {
  const otherEnabledIntervals = (enabledIntervals ?? []).length > 1;
  const otherEnabledRootNotes = (enabledRootNotes ?? []).length > 1;
  const bothDirections = direction === "both";
  const onlyOneOption =
    !otherEnabledIntervals && !otherEnabledRootNotes && !bothDirections;
  if (onlyOneOption)
    return getTrueRandomAbstractInterval({
      enabledIntervals,
      enabledRootNotes,
      direction,
    });

  let result: AbstractInterval;

  let matchingKey, matchingRoot, matchingDirection, exactSameInterval;

  do {
    matchingKey = false;
    matchingRoot = false;
    matchingDirection = false;
    exactSameInterval = false;

    result = getTrueRandomAbstractInterval({
      enabledIntervals,
      enabledRootNotes,
      direction,
    });

    if (currentInterval) {
      if (result.type === currentInterval.type) matchingKey = true;
      if (result.notes[0] === currentInterval.notes[0]) matchingRoot = true;
      if (result.direction === currentInterval.direction)
        matchingDirection = true;
      if (matchingKey && matchingRoot && matchingDirection)
        exactSameInterval = true;
    }
  } while (exactSameInterval);

  return result;
};

export const calculateSteps = (
  note1: AbstractNote,
  note2: AbstractNote,
  direction?: IntervalDirection,
) => {
  const index1 = NOTES.indexOf(note1);
  const index2 = NOTES.indexOf(note2);
  const steps = (index2 - index1 + 12) % 12;
  return direction === "descending" ? 12 - steps : steps;
};

export const checkIntervalEquality = (
  // input is a string like "C# Eb"
  input: string,
  interval: AbstractInterval,
) => {
  const inputNotes = input
    .trim()
    .split(/\s+/) // Split by one or more whitespace characters
    .filter((note) => note.length > 0) // Remove empty strings, if any
    .map((note) => mapStringToAbstractNote(note));

  if (inputNotes.length !== 2) return false;

  const [note1, note2] = inputNotes;
  if (!note1 || !note2) return false;

  const correctSteps = calculateSteps(note1, note2);
  const correctNotes =
    interval.notes.includes(note1) && interval.notes.includes(note2);

  return (
    correctSteps === INTERVAL_TYPES[interval.type].semitones && correctNotes
  );
};

export const checkStepEquality = (
  steps: string,
  interval: Interval | AbstractInterval,
) => {
  return !Number.isNaN(steps) && Number.parseInt(steps) === interval.steps;
};
