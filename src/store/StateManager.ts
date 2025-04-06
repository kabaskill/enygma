import { signal, computed } from "@preact/signals-react";
import type {
  RotorSetting,
  UIStyle,
  EnigmaState,
  Control,
  Modules,
  SavedConfiguration,
} from "~/lib/types";
import { ALPHABET, ROTORS } from "~/lib/constants";
import { cipher } from "~/lib/enigmaHelpers";

// Current state version
const STATE_VERSION = 1;

// Create default plugboard mapping
const defaultPlugboardMapping: Record<string, string> = {};
ALPHABET.split("").forEach((letter) => {
  defaultPlugboardMapping[letter] = letter;
});

// Initial state
const initialState: EnigmaState = {
  machine: {
    rotorSettings: [
      { rotor: "I", ringSetting: 0 },
      { rotor: "II", ringSetting: 0 },
      { rotor: "III", ringSetting: 0 },
    ],
    plugboardMapping: { ...defaultPlugboardMapping },
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

// Convenience exports for backward compatibility
export const input = computed(() => enigmaState.value.messages.input);
export const output = computed(() => enigmaState.value.messages.output);
export const rotorSettings = computed(
  () => enigmaState.value.machine.rotorSettings,
);
export const activeLamp = computed(() => enigmaState.value.ui.activeLamp);
export const controls = computed(() => enigmaState.value.ui.controls);
export const uiStyle = computed(() => enigmaState.value.ui.uiStyle);
export const plugboardMapping = computed(
  () => enigmaState.value.machine.plugboardMapping,
);

// Enhanced state persistence with versioning
export function saveState(name: string): void {
  try {
    const config: SavedConfiguration = {
      name,
      timestamp: Date.now(),
      state: enigmaState.value,
    };

    const serializedState = JSON.stringify(config);
    localStorage.setItem(`enigma_state_${name}`, serializedState);
  } catch (error) {
    console.error("Failed to save state:", error);
  }
}

export function loadState(name: string): boolean {
  try {
    const savedState = localStorage.getItem(`enigma_state_${name}`);
    if (!savedState) return false;

    const config: SavedConfiguration = JSON.parse(savedState);

    // Handle version migrations if needed
    if (!config.state.version || config.state.version < STATE_VERSION) {
      config.state = migrateState(config.state);
    }

    enigmaState.value = config.state;
    return true;
  } catch (error) {
    console.error("Failed to load state:", error);
    return false;
  }
}

// Migrate older state versions to current version
function migrateState(oldState: EnigmaState): EnigmaState {
  const version = oldState.version || 0;

  // Clone the state to avoid mutations
  let state = JSON.parse(JSON.stringify(oldState));

  // Example migration from version 0 to 1
  if (version < 1) {
    // Add any missing properties from initial state
    state = {
      ...initialState,
      ...state,
      ui: {
        ...initialState.ui,
        ...state.ui,
        controls: {
          ...initialState.ui.controls,
          ...(state.ui?.controls || {}),
        },
      },
    };
  }

  // Set current version
  state.version = STATE_VERSION;

  return state;
}

export function getSavedStates(): string[] {
  return Object.keys(localStorage)
    .filter((key) => key.startsWith("enigma_state_"))
    .map((key) => key.replace("enigma_state_", ""));
}

export function deleteState(name: string): void {
  localStorage.removeItem(`enigma_state_${name}`);
}

// Export and import state to/from file
export function exportState(name: string): void {
  try {
    const config: SavedConfiguration = {
      name,
      timestamp: Date.now(),
      state: enigmaState.value,
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `enigma-${name}.json`;
    a.click();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to export state:", error);
  }
}

export function importState(file: File): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const config: SavedConfiguration = JSON.parse(
          e.target?.result as string,
        );

        if (!config.state) {
          reject(new Error("Invalid configuration file"));
          return;
        }

        // Handle version migrations if needed
        if (!config.state.version || config.state.version < STATE_VERSION) {
          config.state = migrateState(config.state);
        }

        enigmaState.value = config.state;
        resolve(true);
      } catch (error) {
        console.error("Failed to import state:", error);
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
}

// Helper method to update state safely
function updateState(updater: (state: EnigmaState) => void): void {
  const newState = { ...enigmaState.value };
  updater(newState);
  enigmaState.value = newState;
}

// Plugboard functions
export function connectPlugboardPair(letter1: string, letter2: string): void {
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
}

export function disconnectPlugboardLetter(letter: string): void {
  updateState((state) => {
    const newMapping = { ...state.machine.plugboardMapping };
    const connectedTo = newMapping[letter];

    newMapping[letter] = letter;
    newMapping[connectedTo] = connectedTo;

    state.machine.plugboardMapping = newMapping;
  });
}

export function resetPlugboard(): void {
  updateState((state) => {
    state.machine.plugboardMapping = { ...defaultPlugboardMapping };
  });
}

export function getPlugboardSubstitution(letter: string): string {
  return enigmaState.value.machine.plugboardMapping[letter] || letter;
}

// Message functions
export function setInput(value: string): void {
  updateState((state) => {
    state.messages.input = value;
  });
}

export function setOutput(value: string): void {
  updateState((state) => {
    state.messages.output = value;
  });
}

// Rotor functions
export function setRotorSettings(settings: RotorSetting[]): void {
  updateState((state) => {
    state.machine.rotorSettings = settings;
  });
}

export function getAvailableRotors(currentRotor?: string): string[] {
  const usedRotors = new Set(
    enigmaState.value.machine.rotorSettings.map((setting) => setting.rotor),
  );

  if (currentRotor) {
    usedRotors.delete(currentRotor);
  }

  return Object.keys(ROTORS).filter((rotor) => !usedRotors.has(rotor));
}

export function addRotor(): void {
  const availableRotors = getAvailableRotors();
  if (availableRotors.length === 0) return;

  updateState((state) => {
    state.machine.rotorSettings = [
      ...state.machine.rotorSettings,
      { rotor: availableRotors[0], ringSetting: 0 },
    ];
  });
}

export function removeRotor(index: number): void {
  updateState((state) => {
    if (state.machine.rotorSettings.length <= 1) return;

    const newSettings = [...state.machine.rotorSettings];
    newSettings.splice(index, 1);
    state.machine.rotorSettings = newSettings;
  });
}

export function updateRotor(index: number, newRotor: string): void {
  updateState((state) => {
    const usedRotors = new Set(
      state.machine.rotorSettings
        .filter((_, i) => i !== index)
        .map((setting) => setting.rotor),
    );

    if (usedRotors.has(newRotor)) return;

    const newSettings = [...state.machine.rotorSettings];
    newSettings[index] = { ...newSettings[index], rotor: newRotor };
    state.machine.rotorSettings = newSettings;
  });
}

// UI functions
export function setActiveLamp(lamp: string | null): void {
  updateState((state) => {
    state.ui.activeLamp = lamp;
  });
}

export function setUIStyle(style: UIStyle): void {
  updateState((state) => {
    state.ui.uiStyle = style;
  });
}

export function updateControls(
  controlName: Modules,
  updates: Partial<Control>,
): void {
  updateState((state) => {
    state.ui.controls[controlName] = {
      ...state.ui.controls[controlName],
      ...updates,
    };
  });
}

// Core functionality
export function processChar(character: string): void {
  const char = character.toUpperCase();
  if (ALPHABET.includes(char) || char === " ") {
    updateState((state) => {
      // Use plugboardMapping directly without converting to PlugboardPair
      const cipheredChar =
        char === " "
          ? " "
          : cipher(
              char,
              state.machine.rotorSettings,
              state.machine.plugboardMapping,
            );
      state.messages.input += char;
      state.messages.output += cipheredChar;
      state.ui.activeLamp = cipheredChar.toUpperCase();

      if (char !== " " && state.machine.rotorSettings.length > 0) {
        const newSettings = [...state.machine.rotorSettings];

        newSettings[0].ringSetting = (newSettings[0].ringSetting + 1) % 26;

        for (let i = 0; i < newSettings.length - 1; i++) {
          if (newSettings[i].ringSetting === 0) {
            newSettings[i + 1].ringSetting =
              (newSettings[i + 1].ringSetting + 1) % 26;
          } else {
            break;
          }
        }

        state.machine.rotorSettings = newSettings;
      }
    });
  }
}

export function reset(): void {
  enigmaState.value = {
    machine: {
      rotorSettings: [
        { rotor: "I", ringSetting: 0 },
        { rotor: "II", ringSetting: 0 },
        { rotor: "III", ringSetting: 0 },
      ],
      plugboardMapping: { ...defaultPlugboardMapping },
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
}
