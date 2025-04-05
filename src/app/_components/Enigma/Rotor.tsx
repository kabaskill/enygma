import { X } from "lucide-react";
import {
  rotorSettings,
  setRotorSettings,
  updateRotor,
  removeRotor,
  getAvailableRotors,
} from "../../../store/StateManager";

interface RotorProps {
  index: number;
}

export default function Rotor({ index }: RotorProps) {
  const currentRotor = rotorSettings.value[index].rotor;
  const availableRotors = getAvailableRotors(currentRotor);

  const reverseIndex = rotorSettings.value.length - index - 1;

  function handleRotorTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    updateRotor(index, e.target.value);
  }

  function handleRingSettingChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newSettings = [...rotorSettings.value];
    newSettings[reverseIndex].ringSetting = parseInt(e.target.value);
    setRotorSettings(newSettings);
  }

  function handleRemove() {
    removeRotor(index);
  }

  const rotorNumber = rotorSettings.value.length - index;

  return (
    <div className="enigma-rotor">
      <div className="flex w-full items-center justify-between">
        <p className="enigma-label">Rotor {rotorNumber}</p>
        {rotorSettings.value.length > 1 && (
          <button
            onClick={handleRemove}
            className="cursor-pointer text-red-500 hover:text-red-700"
            title="Remove rotor"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <select
        value={currentRotor}
        onChange={handleRotorTypeChange}
        className="enigma-input mb-3 w-full py-1 text-center"
      >
        <option value={currentRotor}>{currentRotor}</option>
        {availableRotors
          .filter((rotor) => rotor !== currentRotor)
          .map((rotorType) => (
            <option key={rotorType} value={rotorType}>
              {rotorType}
            </option>
          ))}
      </select>

      <div className="flex w-full items-center justify-between">
        <span className="enigma-label text-xs">Ring:</span>
        <input
          type="number"
          min="0"
          max="25"
          value={rotorSettings.value[reverseIndex].ringSetting}
          onChange={handleRingSettingChange}
          className="enigma-input py-1 text-center"
        />
      </div>
    </div>
  );
}
