import { KEYBOARD } from "~/lib/constants";
import { setActiveLamp } from "../../../store/StateManager";
import { cn } from "~/lib/utils";

interface KeyboardProps {
  onButtonPress: (char: string) => void;
}

export default function Keyboard({ onButtonPress }: KeyboardProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      {Object.keys(KEYBOARD).map((row) => (
        <div key={row} className="flex gap-2">
          {KEYBOARD[row].split("").map((char) => (
            <Button key={char} char={char} onButtonPress={onButtonPress} />
          ))}
        </div>
      ))}
      <div className="mt-3">
        <button
          className={cn(
            "enigma-button h-12 w-32 text-sm transition-all duration-150",
            "border-2 border-zinc-600 bg-zinc-700 hover:bg-zinc-600",
            "text-amber-100 active:translate-y-0.5 active:shadow-inner",
          )}
          onMouseDown={() => onButtonPress(" ")}
          onMouseUp={() => setActiveLamp(null)}
          onMouseLeave={() => setActiveLamp(null)}
        >
          SPACE
        </button>
      </div>
    </div>
  );
}

function Button({
  char,
  onButtonPress,
}: {
  char: string;
  onButtonPress: (char: string) => void;
}) {
  return (
    <button
      className={cn(
        "enigma-button h-14 w-14 font-semibold text-amber-100",
        "border-2 border-zinc-600 bg-zinc-700 shadow-md",
        "hover:bg-zinc-600 active:translate-y-0.5 active:shadow-inner",
        "relative transition-all duration-150",
      )}
      onMouseDown={() => onButtonPress(char)}
      onMouseUp={() => setActiveLamp(null)}
      onMouseLeave={() => setActiveLamp(null)}
    >
      {char}
    </button>
  );
}
