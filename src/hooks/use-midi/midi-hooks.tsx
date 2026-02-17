import { MIDIContext } from "@/providers/midi-provider";
import { useContext, useEffect, useState, useCallback } from "react";
import { NoteMessageEvent } from "webmidi";

export const useProcessedMIDI = () => {
  const context = useContext(MIDIContext);
  const inputs = context?.inputs;
  const [pressedNotes, setPressedNotes] = useState<number[]>([]);
  const [allKeysReleased, setAllKeysReleased] = useState<boolean>(true);

  useEffect(() => {
    if (!inputs?.length) return;

    const handleNoteOn = (event: NoteMessageEvent) => {
      setPressedNotes((prev) => {
        const newPressedNotes = [...prev, event.note.number];
        setAllKeysReleased(false);
        return newPressedNotes;
      });
    };

    const handleNoteOff = (event: NoteMessageEvent) => {
      setPressedNotes((prev) => {
        const newPressedNotes = prev.filter(
          (note) => note !== event.note.number,
        );
        if (newPressedNotes.length === 0) {
          setAllKeysReleased(true);
        }
        return newPressedNotes;
      });
    };

    inputs.forEach((input) => {
      input.addListener("noteon", handleNoteOn);
      input.addListener("noteoff", handleNoteOff);
    });

    return () => {
      inputs.forEach((input) => {
        input.removeListener("noteon", handleNoteOn);
        input.removeListener("noteoff", handleNoteOff);
      });
    };
  }, [inputs]);

  return {
    pressedNotes,
    allKeysReleased,
    isMIDIDeviceConnected: context?.isMIDIDeviceConnected ?? false,
  };
};

export const useRawMIDI = () => {
  const context = useContext(MIDIContext);
  const inputs = context?.inputs;

  const onMIDIMessage = useCallback(
    (callback: (event: NoteMessageEvent) => void) => {
      if (!inputs?.length) return () => {};

      const handleMessage = (event: NoteMessageEvent) => {
        callback(event);
      };

      inputs.forEach((input) => {
        input.addListener("noteon", handleMessage);
        input.addListener("noteoff", handleMessage);
      });

      return () => {
        inputs.forEach((input) => {
          input.removeListener("noteon", handleMessage);
          input.removeListener("noteoff", handleMessage);
        });
      };
    },
    [inputs],
  );

  return {
    onMIDIMessage,
    isMIDIDeviceConnected: context?.isMIDIDeviceConnected ?? false,
  };
};

export const useNotePressed = (callback: (note: number) => void) => {
  const context = useContext(MIDIContext);
  const inputs = context?.inputs;

  useEffect(() => {
    if (!inputs?.length) return;

    const handleNoteOn = (event: NoteMessageEvent) => {
      callback(event.note.number);
    };

    inputs.forEach((input) => {
      input.addListener("noteon", handleNoteOn);
    });

    return () => {
      inputs.forEach((input) => {
        input.removeListener("noteon", handleNoteOn);
      });
    };
  }, [callback, inputs]);
};
