import { KEYBOARD } from "~/data/constants";
import { activeLamp } from "../../../store/StateManager";
import ModuleWrapper from "./ModuleWrapper";
import { cn } from "~/lib/utils";

export default function Lampboard() {
  return (
    <ModuleWrapper modName="lampboard">
      <div className="flex flex-col items-center gap-2">
        {Object.keys(KEYBOARD).map((row) => (
          <div key={row} className="flex gap-1.5">
             {KEYBOARD[row as keyof typeof KEYBOARD].split("").map((char) => (
              <div
                key={char}
                className={cn(
                  "enigma-lamp flex h-14 w-14 items-center justify-center rounded-full font-medium",
                  "border border-zinc-700 bg-zinc-800 text-zinc-400 transition-all duration-200",
                  "shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)]",
                  activeLamp.value === char
                    ? "enigma-lamp-active bg-amber-400 text-zinc-900 shadow-[0_0_15px_rgba(251,191,36,0.7)]"
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
