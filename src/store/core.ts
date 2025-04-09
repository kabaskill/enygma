import { signal } from "@preact/signals-react";
import type { EnigmaState } from "~/lib/types";
import {  createDefaultPlugboardMapping, STATE_VERSION } from "./constants";

// Initial state
export const initialState: EnigmaState = {
  machine: {
    rotorSettings: [
      { rotor: "I", ringSetting: 0 },
      { rotor: "II", ringSetting: 0 },
      { rotor: "III", ringSetting: 0 },
    ],
    plugboardMapping: createDefaultPlugboardMapping(),
  },
  messages: {
    input: "",
    output: "",
  },
  ui: {
    activeLamp: null,
    uiStyle: "modern",
    controls: {
      rotors: { show: true, active: true },
      reflector: { show: true, active: true },
      plugboard: { show: true, active: true },
      lampboard: { show: true, active: true },
      keyboard: { show: true, active: true },
      input: { show: true, active: true },
      output: { show: true, active: true },
    },
  },
  version: STATE_VERSION,
};

// Main state container
export const enigmaState = signal<EnigmaState>({ ...initialState });

// Helper method to update state safely
export function updateState(updater: (state: EnigmaState) => void): void {
  const newState = { ...enigmaState.value };
  updater(newState);
  enigmaState.value = newState;
}