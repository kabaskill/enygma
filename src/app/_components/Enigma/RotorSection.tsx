import {
  rotorSettings,
  addRotor,
  getAvailableRotors,
} from "~/store/StateManager";
import ModuleWrapper from "./ModuleWrapper";
import Rotor from "./Rotor";
import { Button } from "../ui/button";

export default function RotorSection() {
  const currentRotorCount = rotorSettings.value.length;
  const canAddRotor = currentRotorCount < 3 && getAvailableRotors().length > 0;

  return (
    <ModuleWrapper modName="rotors">
      <div className="grid grid-cols-3 gap-4">
        {rotorSettings.value.map((_, index) => (
          <Rotor key={index} index={index} />
        ))}
        {canAddRotor && (
          <Button
            variant="outline"
            onClick={addRotor}
            className="size-full cursor-pointer"
          >
            Add Rotor
          </Button>
        )}
      </div>
    </ModuleWrapper>
  );
}
