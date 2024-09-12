import { useGameLogic } from "@/hooks/use-game-logic";

export const Playground = () => {
  const { pressedNotes } = useGameLogic({ mode: "playground" });

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold">MIDI Playground</h2>
      <p>Play freely on your MIDI keyboard!</p>
      <h3>
        Currently Pressed Notes:{" "}
        {pressedNotes && pressedNotes.length > 0
          ? pressedNotes.join(", ")
          : "None"}
      </h3>
    </div>
  );
};
