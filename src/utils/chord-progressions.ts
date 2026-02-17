import { ChordTypeKey, CHORD_TYPES } from "./chords";
import { noteOffsets } from "./chord-utils";
import { NOTES, AbstractNote, midiToNoteName } from "./note-utils";
import {
  findInitialVoicing,
  findOptimalVoicing,
  describeInversion,
} from "./voice-leading";

// ---- Types ----

/** A chord in a progression template, defined by scale degree */
export interface ProgressionDegree {
  /** Semitone offset from the key root (0-11) */
  semitones: number;
  /** Chord quality */
  type: ChordTypeKey;
}

/** A key-independent progression pattern */
export interface ProgressionTemplate {
  /** Roman numeral display name, e.g., "I - IV - V - I" */
  name: string;
  /** The chords as scale-degree specs */
  degrees: ProgressionDegree[];
}

/** A chord realized with concrete MIDI notes via voice leading */
export interface VoicedChord {
  /** Display name, e.g., "F Major" */
  name: string;
  /** Root note name, e.g., "F" */
  rootName: string;
  /** Chord quality key */
  type: ChordTypeKey;
  /** Root pitch class (0-11) */
  rootPitchClass: number;
  /** Concrete MIDI notes (ascending) */
  midiNotes: number[];
  /** Human-readable note names, e.g., ["C4", "F4", "A4"] */
  noteNames: string[];
  /** Octave-free note names, e.g., ["C", "F", "A"] */
  abstractNoteNames: string[];
  /** E.g., "Root position", "1st inversion" */
  inversionLabel: string;
}

/** A fully realized progression ready for practice */
export interface RealizedProgression {
  /** The original template */
  template: ProgressionTemplate;
  /** Key root, e.g., "C" */
  key: string;
  /** Full display name, e.g., "I - IV - V - I in C" */
  displayName: string;
  /** Voiced chords with MIDI notes */
  chords: VoicedChord[];
}

// ---- Progression templates ----

export const PROGRESSION_TEMPLATES: ProgressionTemplate[] = [
  // Major key
  {
    name: "I - IV - V - I",
    degrees: [
      { semitones: 0, type: "major" },
      { semitones: 5, type: "major" },
      { semitones: 7, type: "major" },
      { semitones: 0, type: "major" },
    ],
  },
  {
    name: "I - V - vi - IV",
    degrees: [
      { semitones: 0, type: "major" },
      { semitones: 7, type: "major" },
      { semitones: 9, type: "minor" },
      { semitones: 5, type: "major" },
    ],
  },
  {
    name: "I - vi - IV - V",
    degrees: [
      { semitones: 0, type: "major" },
      { semitones: 9, type: "minor" },
      { semitones: 5, type: "major" },
      { semitones: 7, type: "major" },
    ],
  },
  {
    name: "ii - V - I",
    degrees: [
      { semitones: 2, type: "minor" },
      { semitones: 7, type: "major" },
      { semitones: 0, type: "major" },
    ],
  },
  {
    name: "I - IV - vi - V",
    degrees: [
      { semitones: 0, type: "major" },
      { semitones: 5, type: "major" },
      { semitones: 9, type: "minor" },
      { semitones: 7, type: "major" },
    ],
  },
  {
    name: "vi - IV - I - V",
    degrees: [
      { semitones: 9, type: "minor" },
      { semitones: 5, type: "major" },
      { semitones: 0, type: "major" },
      { semitones: 7, type: "major" },
    ],
  },
  {
    name: "I - iii - IV - V",
    degrees: [
      { semitones: 0, type: "major" },
      { semitones: 4, type: "minor" },
      { semitones: 5, type: "major" },
      { semitones: 7, type: "major" },
    ],
  },
  {
    name: "I - V - IV",
    degrees: [
      { semitones: 0, type: "major" },
      { semitones: 7, type: "major" },
      { semitones: 5, type: "major" },
    ],
  },
  {
    name: "I - IV - V - IV",
    degrees: [
      { semitones: 0, type: "major" },
      { semitones: 5, type: "major" },
      { semitones: 7, type: "major" },
      { semitones: 5, type: "major" },
    ],
  },
  // Minor key
  {
    name: "i - iv - V - i",
    degrees: [
      { semitones: 0, type: "minor" },
      { semitones: 5, type: "minor" },
      { semitones: 7, type: "major" },
      { semitones: 0, type: "minor" },
    ],
  },
  {
    name: "i - VI - III - VII",
    degrees: [
      { semitones: 0, type: "minor" },
      { semitones: 8, type: "major" },
      { semitones: 3, type: "major" },
      { semitones: 10, type: "major" },
    ],
  },
  {
    name: "i - VII - VI - V",
    degrees: [
      { semitones: 0, type: "minor" },
      { semitones: 10, type: "major" },
      { semitones: 8, type: "major" },
      { semitones: 7, type: "major" },
    ],
  },
  {
    name: "i - iv - VII - III",
    degrees: [
      { semitones: 0, type: "minor" },
      { semitones: 5, type: "minor" },
      { semitones: 10, type: "major" },
      { semitones: 3, type: "major" },
    ],
  },
];

// ---- Realization ----

function rootNameFromPitchClass(pc: number): string {
  return NOTES[((pc % 12) + 12) % 12];
}

function chordDisplayName(rootName: string, type: ChordTypeKey): string {
  return `${rootName} ${CHORD_TYPES[type].label}`;
}

/** Get note names without octave from root pitch class + intervals */
function getAbstractNoteNames(
  rootPitchClass: number,
  intervals: readonly number[],
): string[] {
  return intervals.map(
    (i) => NOTES[((rootPitchClass + i) % 12 + 12) % 12],
  );
}

/**
 * Realize a progression template in a specific key with voice-led voicings.
 */
export function realizeProgression(
  template: ProgressionTemplate,
  keyRoot: AbstractNote,
  lowKey: number,
  highKey: number,
): RealizedProgression {
  const keyPitchClass = noteOffsets[keyRoot];
  const centerPitch = Math.round((lowKey + highKey) / 2);

  const chords: VoicedChord[] = [];

  for (let i = 0; i < template.degrees.length; i++) {
    const degree = template.degrees[i];
    const rootPitchClass = (keyPitchClass + degree.semitones) % 12;
    const rootName = rootNameFromPitchClass(rootPitchClass);
    const intervals = CHORD_TYPES[degree.type].intervals;

    let midiNotes: number[];

    if (i === 0) {
      midiNotes = findInitialVoicing(
        rootPitchClass,
        intervals,
        centerPitch,
        lowKey,
        highKey,
      );
    } else {
      midiNotes = findOptimalVoicing(
        chords[i - 1].midiNotes,
        rootPitchClass,
        intervals,
        lowKey,
        highKey,
      );
    }

    const noteNames = [...midiNotes]
      .sort((a, b) => a - b)
      .map((n) => midiToNoteName(n));

    const abstractNoteNames = getAbstractNoteNames(rootPitchClass, intervals);
    const inversionLabel = describeInversion(midiNotes, rootPitchClass);

    chords.push({
      name: chordDisplayName(rootName, degree.type),
      rootName,
      type: degree.type,
      rootPitchClass,
      midiNotes,
      noteNames,
      abstractNoteNames,
      inversionLabel,
    });
  }

  return {
    template,
    key: keyRoot,
    displayName: `${template.name} in ${keyRoot}`,
    chords,
  };
}

/**
 * Re-realize a progression using the player's first chord as the anchor.
 * Subsequent chords are voice-led from the anchor notes.
 */
export function realizeProgressionFromAnchor(
  template: ProgressionTemplate,
  keyRoot: AbstractNote,
  anchorNotes: number[],
  lowKey: number,
  highKey: number,
): RealizedProgression {
  const keyPitchClass = noteOffsets[keyRoot];
  const chords: VoicedChord[] = [];

  for (let i = 0; i < template.degrees.length; i++) {
    const degree = template.degrees[i];
    const rootPitchClass = (keyPitchClass + degree.semitones) % 12;
    const rootName = rootNameFromPitchClass(rootPitchClass);
    const intervals = CHORD_TYPES[degree.type].intervals;

    let midiNotes: number[];

    if (i === 0) {
      // Use the player's actual notes as the anchor
      midiNotes = [...anchorNotes].sort((a, b) => a - b);
    } else {
      midiNotes = findOptimalVoicing(
        chords[i - 1].midiNotes,
        rootPitchClass,
        intervals,
        lowKey,
        highKey,
      );
    }

    const noteNames = [...midiNotes]
      .sort((a, b) => a - b)
      .map((n) => midiToNoteName(n));

    const abstractNoteNames = getAbstractNoteNames(rootPitchClass, intervals);
    const inversionLabel = describeInversion(midiNotes, rootPitchClass);

    chords.push({
      name: chordDisplayName(rootName, degree.type),
      rootName,
      type: degree.type,
      rootPitchClass,
      midiNotes,
      noteNames,
      abstractNoteNames,
      inversionLabel,
    });
  }

  return {
    template,
    key: keyRoot,
    displayName: `${template.name} in ${keyRoot}`,
    chords,
  };
}

// ---- Helpers ----

export function getRandomKey(): AbstractNote {
  return NOTES[Math.floor(Math.random() * NOTES.length)];
}

export function getRandomTemplate(
  current?: ProgressionTemplate,
  enabledNames?: Set<string>,
): ProgressionTemplate {
  const pool =
    enabledNames && enabledNames.size > 0
      ? PROGRESSION_TEMPLATES.filter((t) => enabledNames.has(t.name))
      : PROGRESSION_TEMPLATES;

  if (pool.length === 0) return PROGRESSION_TEMPLATES[0];
  if (pool.length === 1) return pool[0];

  let template: ProgressionTemplate;
  do {
    template = pool[Math.floor(Math.random() * pool.length)];
  } while (current && template.name === current.name);
  return template;
}
