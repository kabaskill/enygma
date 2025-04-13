import { setActiveLamp } from "~/store/StateManager";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";

interface KeyboardProps {
  onButtonPress: (char: string) => void;
}

export default function Keyboard({ onButtonPress }: KeyboardProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      {Object.keys(KEYBOARD).map((row) => (
        <div key={row} className="flex gap-2">
          {KEYBOARD[row].split("").map((char) => (
            <Button
              key={char}
              variant="default"
              className="aspect-square max-w-12 grow"
              onClick={() => onButtonPress(char)}
            >
              {char}
            </Button>
          ))}
        </div>
      ))}
      <div className="mt-3">
        <Button
          variant="default"
          className="aspect-square max-w-12 grow"
          onMouseDown={() => onButtonPress(" ")}
          onMouseUp={() => setActiveLamp(null)}
          onMouseLeave={() => setActiveLamp(null)}
        >
          SPACE
        </Button>
      </div>
    </div>
  );
}
