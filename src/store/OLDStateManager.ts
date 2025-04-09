import { signal, computed } from "@preact/signals-react";
import type {
  RotorSetting,
  UIStyle,
  EnigmaState,
  Control,
  Modules,
  SavedConfiguration,
} from "~/lib/types";

// ==============================================
// Constants (moved from constants.ts)
// ==============================================
export const constants = {
  ALPHABET: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  KEYBOARD: {
    row1: "QWERTZUIO",
    row2: "ASDFGHJK",
    row3: "PYXCVBNML",
  },
  DIGITS: "1234567890",
  SPECIAL_CHARACTERS: "!@#$%^&*(){}[]=<>/,.",
  ROTORS: {
    I: "EKMFLGDQVZNTOWYHXUSPAIBRCJ",
    II: "AJDKSIRUXBLHWTMCQGZNPYFVOE",
    III: "BDFHJLCPRTXVZNYEIWGAKMUSQO",
    IV: "ESOVPZJAYQUIRHXLNFTGKDCMWB",
    V: "VZBRGITYUPSDNHLXAWMJQOFECK",
  },
  REFLECTOR: "YRUHQSLDPXNGOKMIEBFZCWVJAT",
  TOOLTIPS: {
    header: "This is a recreation of the famous Enigma machine used during World War II.",
    rotors: "Rotors are the heart of the Enigma machine. They scramble the letters based on their wiring.",
    reflector: "The reflector sends the signal back through the rotors, creating a symmetric encryption.",
    plugboard: "The plugboard allows for additional scrambling by swapping pairs of letters.",
    lampboard: "The lampboard shows which letter is currently being outputted.",
    keyboard: "The keyboard is where you input the letters to be encrypted.",
    input: "The input shows the letters you type on the keyboard.",
    output: "The output shows the encrypted letters as you type.",
    settings: "Settings allow you to configure the machine, including rotor positions and plugboard connections.",
  }
};

// Current state version
const STATE_VERSION = 1;

// Create default plugboard mapping
const defaultPlugboardMapping: Record<string, string> = {};
constants.ALPHABET.split("").forEach((letter) => {
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

// ==============================================
// Enigma Logic Helpers (moved from enigmaHelpers.ts)
// ==============================================
export const enigmaLogic = {
  // Applies the plugboard substitution to a character
  applyPlugboard(char: string, plugboard: Record<string, string>): string {
    return plugboard[char] ?? char;
  },

  // Passes a character through a rotor in either forward or reverse direction
  rotorPass(
    char: string,
    rotor: keyof typeof constants.ROTORS,
    ringSetting: number,
    reverse = false
  ): string {
    if (!constants.ROTORS[rotor]) {
      console.error(`Invalid rotor: ${rotor}`);
      return char;
    }

    let index = constants.ALPHABET.indexOf(char);
    if (index === -1) {
      console.error(`Character not in alphabet: ${char}`);
      return char;
    }

    index = (index + ringSetting + 26) % 26;

    if (reverse) {
      index = constants.ROTORS[rotor].indexOf(constants.ALPHABET[index]);
    } else {
      index = constants.ALPHABET.indexOf(constants.ROTORS[rotor][index]);
    }

    index = (index - ringSetting + 26) % 26;
    return constants.ALPHABET[index];
  },

  // Processes a character through the entire Enigma machine
  cipher(
    char: string,
    rotorSettings: RotorSetting[],
    plugboard: Record<string, string>
  ): string {
    if (!char || rotorSettings.length === 0) {
      return char;
    }

    char = char.toUpperCase();

    // Skip non-alphabet characters
    if (!constants.ALPHABET.includes(char)) {
      return char;
    }

    char = enigmaLogic.applyPlugboard(char, plugboard);

    // Forward pass through rotors
    for (let i = 0; i < rotorSettings.length; i++) {
      char = enigmaLogic.rotorPass(
        char,
        rotorSettings[i].rotor,
        rotorSettings[i].ringSetting
      );
    }

    // Reflector
    const reflectorIndex = constants.ALPHABET.indexOf(char);
    if (reflectorIndex !== -1) {
      char = constants.REFLECTOR[reflectorIndex];
    }

    // Backward pass through rotors
    for (let i = rotorSettings.length - 1; i >= 0; i--) {
      char = enigmaLogic.rotorPass(
        char,
        rotorSettings[i].rotor,
        rotorSettings[i].ringSetting,
        true
      );
    }

    return enigmaLogic.applyPlugboard(char, plugboard);
  }
};

// ==============================================
// State Management
// ==============================================

// Main state container
export const enigmaState = signal<EnigmaState>({ ...initialState });

// Helper method to update state safely
function updateState(updater: (state: EnigmaState) => void): void {
  const newState = { ...enigmaState.value };
  updater(newState);
  enigmaState.value = newState;
}

// ==============================================
// Organized State Management with Namespaces
// ==============================================

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
  
  getAvailableRotors(currentRotor?: string): string[] {
    const usedRotors = new Set(
      enigmaState.value.machine.rotorSettings.map((setting) => setting.rotor),
    );

    if (currentRotor) {
      usedRotors.delete(currentRotor);
    }

    return Object.keys(constants.ROTORS).filter((rotor) => !usedRotors.has(rotor));
  },
  
  addRotor(): void {
    const availableRotors = machineState.getAvailableRotors();
    if (availableRotors.length === 0) return;

    updateState((state) => {
      state.machine.rotorSettings = [
        ...state.machine.rotorSettings,
        { rotor: availableRotors[0], ringSetting: 0 },
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

      if (usedRotors.has(newRotor)) return;

      const newSettings = [...state.machine.rotorSettings];
      newSettings[index] = { ...newSettings[index], rotor: newRotor };
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

// Message/text functions
export const messageState = {
  // State accessors
  input: computed(() => enigmaState.value.messages.input),
  output: computed(() => enigmaState.value.messages.output),
  
  // Actions
  setInput(value: string): void {
    updateState((state) => {
      state.messages.input = value;
    });
  },
  
  setOutput(value: string): void {
    updateState((state) => {
      state.messages.output = value;
    });
  },
  
  processChar(character: string): void {
    const char = character.toUpperCase();
    if (constants.ALPHABET.includes(char) || char === " ") {
      updateState((state) => {
        const cipheredChar =
          char === " "
            ? " "
            : enigmaLogic.cipher(
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
};

// UI state and functions
export const uiState = {
  // State accessors
  activeLamp: computed(() => enigmaState.value.ui.activeLamp),
  controls: computed(() => enigmaState.value.ui.controls),
  uiStyle: computed(() => enigmaState.value.ui.uiStyle),
  
  // Actions
  setActiveLamp(lamp: string | null): void {
    updateState((state) => {
      state.ui.activeLamp = lamp;
    });
  },
  
  setUIStyle(style: UIStyle): void {
    updateState((state) => {
      state.ui.uiStyle = style;
    });
  },
  
  updateControls(controlName: Modules, updates: Partial<Control>): void {
    updateState((state) => {
      state.ui.controls[controlName] = {
        ...state.ui.controls[controlName],
        ...updates,
      };
    });
  }
};

// Persistence functions
export const persistenceState = {
  // Save state to localStorage
  saveState(name: string): void {
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
  },

  // Load state from localStorage
  loadState(name: string): boolean {
    try {
      const savedState = localStorage.getItem(`enigma_state_${name}`);
      if (!savedState) return false;

      const config: SavedConfiguration = JSON.parse(savedState);

      // Handle version migrations if needed
      if (!config.state.version || config.state.version < STATE_VERSION) {
        config.state = persistenceState.migrateState(config.state);
      }

      enigmaState.value = config.state;
      return true;
    } catch (error) {
      console.error("Failed to load state:", error);
      return false;
    }
  },

  // Migrate older state versions to current version
  migrateState(oldState: EnigmaState): EnigmaState {
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
  },

  getSavedStates(): string[] {
    return Object.keys(localStorage)
      .filter((key) => key.startsWith("enigma_state_"))
      .map((key) => key.replace("enigma_state_", ""));
  },

  deleteState(name: string): void {
    localStorage.removeItem(`enigma_state_${name}`);
  },

  // Export and import state to/from file
  exportState(name: string): void {
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
  },

  importState(file: File): Promise<boolean> {
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
            config.state = persistenceState.migrateState(config.state);
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
};

// Application-wide actions
export const appActions = {
  reset(): void {
    enigmaState.value = { ...initialState };
  }
};

// Convenience exports for backward compatibility
export const input = messageState.input;
export const output = messageState.output;
export const rotorSettings = machineState.rotorSettings;
export const activeLamp = uiState.activeLamp;
export const controls = uiState.controls;
export const uiStyle = uiState.uiStyle;
export const plugboardMapping = machineState.plugboardMapping;

// Re-export functions with original names for backward compatibility
export const {
  setRotorSettings,
  getAvailableRotors,
  addRotor,
  removeRotor,
  updateRotor,
  connectPlugboardPair,
  disconnectPlugboardLetter,
  resetPlugboard,
  getPlugboardSubstitution
} = machineState;

export const {
  setInput,
  setOutput,
  processChar
} = messageState;

export const {
  setActiveLamp,
  setUIStyle,
  updateControls
} = uiState;

export const {
  saveState,
  loadState,
  getSavedStates,
  deleteState,
  exportState,
  importState
} = persistenceState;

export const {
  reset
} = appActions;