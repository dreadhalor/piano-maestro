// midi-hooks.ts
import { MIDIContext } from "@/providers/midi-provider";
import { useContext, useEffect, useState, useCallback } from "react";
import { NoteMessageEvent } from "webmidi";

export const useProcessedMIDI = () => {
  const context = useContext(MIDIContext);
  const [pressedNotes, setPressedNotes] = useState<number[]>([]);
  const [allKeysReleased, setAllKeysReleased] = useState<boolean>(true);

  useEffect(() => {
    if (!context) return;

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

    context.inputs.forEach((input) => {
      input.addListener("noteon", handleNoteOn);
      input.addListener("noteoff", handleNoteOff);
    });

    return () => {
      context.inputs.forEach((input) => {
        input.removeListener("noteon", handleNoteOn);
        input.removeListener("noteoff", handleNoteOff);
      });
    };
  }, [context]);

  return {
    pressedNotes,
    allKeysReleased,
    isMIDIDeviceConnected: context?.isMIDIDeviceConnected ?? false,
  };
};

export const useRawMIDI = () => {
  const context = useContext(MIDIContext);

  const onMIDIMessage = useCallback(
    (callback: (event: NoteMessageEvent) => void) => {
      if (!context) return () => {};

      const handleMessage = (event: NoteMessageEvent) => {
        callback(event);
      };

      context.inputs.forEach((input) => {
        input.addListener("noteon", handleMessage);
        input.addListener("noteoff", handleMessage);
      });

      return () => {
        context.inputs.forEach((input) => {
          input.removeListener("noteon", handleMessage);
          input.removeListener("noteoff", handleMessage);
        });
      };
    },
    [context],
  );

  return {
    onMIDIMessage,
    isMIDIDeviceConnected: context?.isMIDIDeviceConnected ?? false,
  };
};

export const useNotePressed = (callback: (note: number) => void) => {
  const context = useContext(MIDIContext);

  useEffect(() => {
    if (!context) return;

    const handleNoteOn = (event: NoteMessageEvent) => {
      callback(event.note.number);
    };

    context.inputs.forEach((input) => {
      input.addListener("noteon", handleNoteOn);
    });

    return () => {
      context.inputs.forEach((input) => {
        input.removeListener("noteon", handleNoteOn);
      });
    };
  }, [callback, context]);
};
