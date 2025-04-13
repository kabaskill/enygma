import { computed, signal } from "@preact/signals-react";
import { cipherState } from "./core";
import type { Rotor, RotorModuleConfig } from "~/lib/types";
import { updateState } from "./core";

// Export the main state signal and core functions
export { cipherState, updateState } from "./core";

// Export state modules
export { messageState } from "./messageState";
export { uiState } from "./uiState";
export { persistenceState } from "./persistenceState";
export { appActions } from "./appActions";
export { moduleState } from "./moduleState";
export { encryptionProcessor } from "./encryptionProcessor";

// Export constants
export { constants } from "./constants";

// Export commonly used computed signals for convenience
export const input = computed(() => cipherState.value.messages.input);
export const output = computed(() => cipherState.value.messages.output);
export const moduleChain = computed(() => cipherState.value.moduleChain);
export const activePreset = computed(() => cipherState.value.activePreset);
export const activeLamp = computed(() => cipherState.value.ui.activeLamp);

// Rotor-related signals and functions
export const rotorSettings = computed(() => {
  const rotorModule = cipherState.value.moduleChain.find(
    (module) => module.type === "rotors" && module.enabled,
  ) as RotorModuleConfig | undefined;

  return rotorModule?.rotorSettings || [];
});

export const plugboardMapping = computed(() => {
  const plugboardModule = cipherState.value.moduleChain.find(
    (module) => module.type === "plugboard" && module.enabled,
  );

  if (plugboardModule?.type === "plugboard") {
    return plugboardModule.mapping;
  }

  return {};
});

// Get available rotors that are not already in use
export function getAvailableRotors(currentRotor?: Rotor): Rotor[] {
  const allRotors: Rotor[] = ["I", "II", "III", "IV", "V"];
  const usedRotors = new Set<Rotor>();

  // If we have a current rotor, don't count it as used
  rotorSettings.value.forEach((setting) => {
    if (setting.rotor !== currentRotor) {
      usedRotors.add(setting.rotor);
    }
  });

  return allRotors.filter((rotor) => !usedRotors.has(rotor));
}

// Add a new rotor to the module
export function addRotor(): void {
  updateState((state) => {
    const rotorModule = state.moduleChain.find(
      (module) => module.type === "rotors" && module.enabled,
    ) as RotorModuleConfig | undefined;

    if (rotorModule) {
      const availableRotors = getAvailableRotors();
      if (availableRotors.length > 0) {
        rotorModule.rotorSettings.push({
          rotor: availableRotors[0],
          ringSetting: 0,
        });
      }
    }
  });
}

// Update a rotor type
export function updateRotor(index: number, rotorType: Rotor): void {
  updateState((state) => {
    const rotorModule = state.moduleChain.find(
      (module) => module.type === "rotors" && module.enabled,
    ) as RotorModuleConfig | undefined;

    if (rotorModule && rotorModule.rotorSettings[index]) {
      rotorModule.rotorSettings[index].rotor = rotorType;
    }
  });
}

// Remove a rotor from the module
export function removeRotor(index: number): void {
  updateState((state) => {
    const rotorModule = state.moduleChain.find(
      (module) => module.type === "rotors" && module.enabled,
    ) as RotorModuleConfig | undefined;

    if (rotorModule && rotorModule.rotorSettings.length > 1) {
      rotorModule.rotorSettings.splice(index, 1);
    }
  });
}

// Update all rotor settings
export function setRotorSettings(settings: typeof rotorSettings.value): void {
  updateState((state) => {
    const rotorModule = state.moduleChain.find(
      (module) => module.type === "rotors" && module.enabled,
    ) as RotorModuleConfig | undefined;

    if (rotorModule) {
      rotorModule.rotorSettings = settings;
    }
  });
}

// Plugboard-related functions
export function connectPlugboardPair(letter1: string, letter2: string): void {
  updateState((state) => {
    const plugboardModule = state.moduleChain.find(
      (module) => module.type === "plugboard" && module.enabled,
    );

    if (plugboardModule?.type === "plugboard") {
      // First, reset any existing connections for these letters
      disconnectPlugboardLetter(letter1);
      disconnectPlugboardLetter(letter2);

      // Then create the new connection
      plugboardModule.mapping[letter1] = letter2;
      plugboardModule.mapping[letter2] = letter1;
    }
  });
}

export function disconnectPlugboardLetter(letter: string): void {
  updateState((state) => {
    const plugboardModule = state.moduleChain.find(
      (module) => module.type === "plugboard" && module.enabled,
    );

    if (plugboardModule?.type === "plugboard") {
      const pairedLetter = plugboardModule.mapping[letter];

      // Reset both letters to themselves
      if (pairedLetter && pairedLetter !== letter) {
        plugboardModule.mapping[letter] = letter;
        plugboardModule.mapping[pairedLetter] = pairedLetter;
      }
    }
  });
}
