import { KEYBOARD } from "~/lib/constants";
import { activeLamp } from "~/store/StateManager";
import ModuleWrapper from "./ModuleWrapper";
import { cn } from "~/lib/utils";

export default function Lampboard() {
  return (
    <ModuleWrapper modName="lampboard">
      <div className="flex flex-col items-center gap-2">
        {Object.keys(KEYBOARD).map((row) => (
          <div key={row} className="flex w-full justify-center gap-2">
            {KEYBOARD[row].split("").map((char) => (
              <div
                key={char}
                className={cn(
                  "flex aspect-square max-w-12 grow items-center justify-center",
                  "border border-zinc-700 rounded-lg",
                  activeLamp.value === char
                    ? "animate-pulse repeat-1 border-amber-500 bg-amber-400 text-zinc-900"
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
