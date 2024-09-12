import React from 'react';
import { Chord } from '../utils/chords';
import { midiToNoteName } from '../utils/chord-utils'; // Import the utility function

interface ChordDisplayProps {
  chord: Chord;
}

const ChordDisplay: React.FC<ChordDisplayProps> = ({ chord }) => {
  return (
    <div>
      <h2>Play this chord: {chord.name}</h2>
      <p>Notes: {chord.notes.map(midiToNoteName).join(', ')}</p>
    </div>
  );
};

export default ChordDisplay;
