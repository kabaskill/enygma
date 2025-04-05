import {
  rotorSettings,
  addRotor,
  getAvailableRotors,
} from "~/store/StateManager";
import { cn } from "~/utils/cn";
import ModuleWrapper from "./ModuleWrapper";
import Rotor from "./Rotor";

export default function RotorSection() {
  const canAddRotor = getAvailableRotors().length > 0;

  return (
    <ModuleWrapper modName="rotors">
      <div className="flex w-full gap-4">
        {rotorSettings.value.map((_, index) => (
          <Rotor key={index} index={index} />
        ))}
        {canAddRotor && (
          <button
            onClick={addRotor}
            className={cn(
              "cursor-pointer rounded-lg border-2 border-dotted border-zinc-600 p-3",
              "grow shadow-md transition duration-200 ease-in-out hover:bg-zinc-700",
            )}
          >
            Add Rotor
          </button>
        )}
      </div>
    </ModuleWrapper>
  );
}
