import { computed } from "@preact/signals-react";
import type { Rotor, RotorSetting } from "~/lib/types";
import { constants, createDefaultPlugboardMapping } from "./constants";
import { enigmaState, updateState } from "./core";

// Default plugboard mapping for resets
const defaultPlugboardMapping = createDefaultPlugboardMapping();

// Machine state and functions
export const machineState = {
  // State accessors
  rotorSettings: computed(() => enigmaState.value.machine.rotorSettings),
  plugboardMapping: computed(() => enigmaState.value.machine.plugboardMapping),
  
  // Rotor functions
  setRotorSettings(settings: RotorSetting[]): void {
    updateState((state) => {
      state.machine.rotorSettings = settings;
    });
  },
  
  getAvailableRotors(currentRotor?: Rotor): string[] {
    const usedRotors = new Set(
      enigmaState.value.machine.rotorSettings.map((setting) => setting.rotor),
    );

    if (currentRotor) {
      usedRotors.delete(currentRotor);
    }

    return Object.keys(constants.ROTORS).filter((rotor) => !usedRotors.has(rotor as Rotor)) as Rotor[];
  },
  
  addRotor(): void {
    const availableRotors = machineState.getAvailableRotors();
    if (availableRotors.length === 0) return;

    updateState((state) => {
      state.machine.rotorSettings = [
        ...state.machine.rotorSettings,
        { rotor: availableRotors[0] as Rotor, ringSetting: 0 },
      ];
    });
  },
  
  removeRotor(index: number): void {
    updateState((state) => {
      if (state.machine.rotorSettings.length <= 1) return;

      const newSettings = [...state.machine.rotorSettings];
      newSettings.splice(index, 1);
      state.machine.rotorSettings = newSettings;
    });
  },
  
  updateRotor(index: number, newRotor: string): void {
    updateState((state) => {
      const usedRotors = new Set(
        state.machine.rotorSettings
          .filter((_, i) => i !== index)
          .map((setting) => setting.rotor),
      );

      if (usedRotors.has(newRotor as Rotor)) return;

      const newSettings = [...state.machine.rotorSettings];
      newSettings[index] = { ...newSettings[index], rotor: newRotor as Rotor};
      state.machine.rotorSettings = newSettings;
    });
  },
  
  // Plugboard functions
  connectPlugboardPair(letter1: string, letter2: string): void {
    updateState((state) => {
      const newMapping = { ...state.machine.plugboardMapping };
      const oldConnection1 = newMapping[letter1];
      const oldConnection2 = newMapping[letter2];

      if (oldConnection1 !== letter1) {
        newMapping[oldConnection1] = oldConnection1;
      }

      if (oldConnection2 !== letter2) {
        newMapping[oldConnection2] = oldConnection2;
      }

      newMapping[letter1] = letter2;
      newMapping[letter2] = letter1;

      state.machine.plugboardMapping = newMapping;
    });
  },
  
  disconnectPlugboardLetter(letter: string): void {
    updateState((state) => {
      const newMapping = { ...state.machine.plugboardMapping };
      const connectedTo = newMapping[letter];

      newMapping[letter] = letter;
      newMapping[connectedTo] = connectedTo;

      state.machine.plugboardMapping = newMapping;
    });
  },
  
  resetPlugboard(): void {
    updateState((state) => {
      state.machine.plugboardMapping = { ...defaultPlugboardMapping };
    });
  },
  
  getPlugboardSubstitution(letter: string): string {
    return enigmaState.value.machine.plugboardMapping[letter] || letter;
  }
};