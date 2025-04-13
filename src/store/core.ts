import { signal } from "@preact/signals-react";
import type { CipherState, ModuleConfig } from "~/lib/types";
import { constants, STATE_VERSION } from "./constants";
import { v4 as uuidv4 } from "uuid";

// Helper method to update state safely
export function updateState(updater: (state: CipherState) => void): void {
  const newState = { ...cipherState.value };
  updater(newState);
  cipherState.value = newState;
}

// Create default plugboard mapping
export const createDefaultPlugboardMapping = (): Record<string, string> => {
  const mapping: Record<string, string> = {};
  constants.ALPHABET.split("").forEach((letter) => {
    mapping[letter] = letter;
  });
  return mapping;
};

// Preset module configurations
const enigmaPreset: ModuleConfig[] = [
  {
    id: uuidv4(),
    type: "plugboard",
    enabled: true,
    mapping: createDefaultPlugboardMapping(),
  },
  {
    id: uuidv4(),
    type: "rotors",
    enabled: true,
    rotorSettings: [
      { rotor: "I", ringSetting: 0 },
      { rotor: "II", ringSetting: 0 },
      { rotor: "III", ringSetting: 0 },
    ],
  },
  {
    id: uuidv4(),
    type: "reflector",
    enabled: true,
    reflectorType: "standard",
  },
];

const caesarPreset: ModuleConfig[] = [
  {
    id: uuidv4(),
    type: "shifter",
    enabled: true,
    shift: 3,
  },
];

const vigenerePreset: ModuleConfig[] = [
  {
    id: uuidv4(),
    type: "vigenere",
    enabled: true,
    keyword: "KEY",
  },
];

// Initial state with module chain approach
export const initialState: CipherState = {
  activePreset: "enigma",
  presets: {
    enigma: enigmaPreset,
    caesar: caesarPreset,
    vigenere: vigenerePreset,
  },
  moduleChain: [...enigmaPreset], // Start with Enigma preset
  messages: {
    input: "",
    output: "",
  },
  ui: {
    activeLamp: null,
    uiStyle: "modern",
  },
  version: STATE_VERSION,
};

// Main state container
export const cipherState = signal<CipherState>({ ...initialState });
