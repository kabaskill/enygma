import { controls } from "~/store/StateManager";
import Controls from "./Controls";
import type { Modules } from "~/lib/types";
import { cn } from "~/lib/utils";

export default function ModuleWrapper({
  children,
  modName,
}: {
  children: React.ReactNode;
  modName: Modules;
}) {
  return (
    <div className="enigma-panel flex flex-col items-center">
      <Controls modName={modName} />

      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          controls.value[modName].active
            ? "max-h-screen rotate-x-0"
            : "max-h-0 -rotate-x-90 overflow-hidden",
        )}
      >
        {children}
      </div>
    </div>
  );
}
