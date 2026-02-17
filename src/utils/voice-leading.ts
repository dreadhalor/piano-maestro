/**
 * Compute the intervals for a given inversion of a chord.
 * E.g., major [0,4,7] inversion 1 → [0,3,8] (1st inversion)
 */
export function getInversionIntervals(
  intervals: readonly number[],
  inversion: number,
): number[] {
  const N = intervals.length;
  const bassOffset = intervals[inversion];
  const result: number[] = [];
  for (let j = 0; j < N; j++) {
    let offset =
      (intervals[(inversion + j) % N] - bassOffset + 12) % 12;
    if (j > 0 && offset <= result[j - 1]) {
      offset += 12;
    }
    result.push(offset);
  }
  return result;
}

/**
 * Generate all valid voicings (all inversions × all octaves) within a MIDI range.
 */
export function generateAllVoicings(
  rootPitchClass: number,
  intervals: readonly number[],
  lowKey: number,
  highKey: number,
): number[][] {
  const N = intervals.length;
  const candidates: number[][] = [];

  for (let inv = 0; inv < N; inv++) {
    const invIntervals = getInversionIntervals(intervals, inv);
    const bassPitchClass = (rootPitchClass + intervals[inv]) % 12;

    for (let octave = 0; octave <= 10; octave++) {
      const bass = bassPitchClass + octave * 12;
      const notes = invIntervals.map((i) => bass + i);

      if (notes[0] >= lowKey && notes[notes.length - 1] <= highKey) {
        candidates.push(notes);
      }
    }
  }

  return candidates;
}

/**
 * Score a voicing transition by total voice movement (lower = smoother).
 */
export function voiceMovementScore(
  prevNotes: number[],
  nextNotes: number[],
): number {
  const a = [...prevNotes].sort((x, y) => x - y);
  const b = [...nextNotes].sort((x, y) => x - y);
  let total = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    total += Math.abs(a[i] - b[i]);
  }
  total += Math.abs(a.length - b.length) * 12;
  return total;
}

/**
 * Find the optimal voicing that minimizes voice movement from the previous chord.
 */
export function findOptimalVoicing(
  prevNotes: number[],
  rootPitchClass: number,
  intervals: readonly number[],
  lowKey: number,
  highKey: number,
): number[] {
  const candidates = generateAllVoicings(
    rootPitchClass,
    intervals,
    lowKey,
    highKey,
  );

  if (candidates.length === 0) {
    return findInitialVoicing(rootPitchClass, intervals, 60, lowKey, highKey);
  }

  let bestVoicing = candidates[0];
  let bestScore = voiceMovementScore(prevNotes, candidates[0]);

  for (let i = 1; i < candidates.length; i++) {
    const score = voiceMovementScore(prevNotes, candidates[i]);
    if (score < bestScore) {
      bestScore = score;
      bestVoicing = candidates[i];
    }
  }

  return bestVoicing;
}

/**
 * Find a root-position voicing centered near a target pitch.
 */
export function findInitialVoicing(
  rootPitchClass: number,
  intervals: readonly number[],
  centerPitch: number,
  lowKey: number,
  highKey: number,
): number[] {
  let bestRoot = rootPitchClass;
  let bestDist = Infinity;

  for (let octave = 0; octave <= 10; octave++) {
    const root = rootPitchClass + octave * 12;
    const notes = intervals.map((i) => root + i);
    if (notes[0] >= lowKey && notes[notes.length - 1] <= highKey) {
      const chordCenter = (notes[0] + notes[notes.length - 1]) / 2;
      const dist = Math.abs(chordCenter - centerPitch);
      if (dist < bestDist) {
        bestDist = dist;
        bestRoot = root;
      }
    }
  }

  return intervals.map((i) => bestRoot + i);
}

/**
 * Check if played notes match a chord's pitch classes (any inversion/octave).
 */
export function matchesPitchClasses(
  playedNotes: number[],
  rootPitchClass: number,
  intervals: readonly number[],
): boolean {
  if (playedNotes.length !== intervals.length) return false;

  const playedPCs = playedNotes
    .map((n) => ((n % 12) + 12) % 12)
    .sort((a, b) => a - b);
  const targetPCs = intervals
    .map((i) => (((rootPitchClass + i) % 12) + 12) % 12)
    .sort((a, b) => a - b);

  return playedPCs.every((pc, i) => pc === targetPCs[i]);
}

/**
 * Check if played notes match exact MIDI notes (for smooth voicing mode).
 */
export function matchesExactVoicing(
  playedNotes: number[],
  targetNotes: number[],
): boolean {
  if (playedNotes.length !== targetNotes.length) return false;

  const sorted = [...playedNotes].sort((a, b) => a - b);
  const target = [...targetNotes].sort((a, b) => a - b);

  return sorted.every((n, i) => n === target[i]);
}

/**
 * Describe the inversion of a voicing relative to the chord's root pitch class.
 */
export function describeInversion(
  voicing: number[],
  rootPitchClass: number,
): string {
  const sorted = [...voicing].sort((a, b) => a - b);
  const N = sorted.length;
  const rootIndex = sorted.findIndex((n) => n % 12 === rootPitchClass);

  if (rootIndex === -1) return "";

  const inversion = (N - rootIndex) % N;

  if (inversion === 0) return "Root position";
  if (inversion === 1) return "1st inversion";
  if (inversion === 2) return "2nd inversion";
  if (inversion === 3) return "3rd inversion";
  return `${inversion}th inversion`;
}
