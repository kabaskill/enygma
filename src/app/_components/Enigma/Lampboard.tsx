import { activeLamp } from "~/store/StateManager";
import ModuleWrapper from "./ModuleWrapper";
import { cn } from "~/lib/utils";
import { constants } from "~/store/constants";

export default function Lampboard() {
  const KEYBOARD = constants.KEYBOARD;

  return (
    <ModuleWrapper modName="lampboard">
      <div className="flex flex-col items-center gap-2">
        {Object.keys(KEYBOARD).map((row) => (
          <div key={row} className="flex w-full justify-center gap-2">
            {KEYBOARD[row as keyof typeof KEYBOARD]
              .split("")
              .map((char: string) => (
                <div
                  key={char}
                  className={cn(
                    "flex aspect-square max-w-12 grow items-center justify-center",
                    "rounded-lg border border-zinc-700",
                    activeLamp.value === char
                      ? "repeat-1 animate-pulse border-amber-500 bg-amber-400 text-zinc-900"
                      : "",
                  )}
                >
                  {char}
                </div>
              ))}
          </div>
        ))}
      </div>
    </ModuleWrapper>
  );
}
