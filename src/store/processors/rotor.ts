import type { ModuleProcessor, ProcessingContext } from "./base";
import {
  charIndex,
  charAtIndex,
  getAlphabetForCharSet,
  preserveCase,
} from "./base";
import type { RotorModuleConfig, ModuleConfig, Rotor } from "../types";

interface RotorState {
  positions: Record<string, number>;
  lastProcessedCharSet: string; // Track last used character set
}

// Pre-defined historical rotor wirings
const ROTOR_WIRINGS: Record<Rotor, string> = {
  I: "EKMFLGDQVZNTOWYHXUSPAIBRCJ",
  II: "AJDKSIRUXBLHWTMCQGZNPYFVOE",
  III: "BDFHJLCPRTXVZNYEIWGAKMUSQO",
  IV: "ESOVPZJAYQUIRHXLNFTGKDCMWB",
  V: "VZBRGITYUPSDNHLXAWMJQOFECK",
};

export class RotorProcessor implements ModuleProcessor {
  private state: RotorState = {
    positions: {},
    lastProcessedCharSet: "uppercase",
  };

  process(
    char: string,
    position: number,
    config: ModuleConfig,
    context: Partial<ProcessingContext>,
  ): string {
    if (config.type !== "rotors") return char;

    const rotorConfig = config as RotorModuleConfig;
    const currentCharSet = context.characterSet || "uppercase";
    const alphabet = getAlphabetForCharSet(currentCharSet);

    // Check if character set has changed since last processing
    if (currentCharSet !== this.state.lastProcessedCharSet) {
      // Update the tracked character set
      this.state.lastProcessedCharSet = currentCharSet;

      // Reinitialize positions if character set changed to maintain proper behavior
      this.updateState(config.id, config);
    }

    // Skip non-alphabet characters
    if (alphabet.indexOf(char.toUpperCase()) === -1) return char;

    // Get the original case to preserve it
    const upperChar = char.toUpperCase();

    // Initialize positions for this module if not set
    if (!this.state.positions[`${config.id}-0`]) {
      // For each rotor in the configuration, initialize position
      rotorConfig.rotorSettings.forEach((setting, idx) => {
        const key = `${config.id}-${idx}`;
        this.state.positions[key] = setting.ringSetting || 0;
      });
    }

    // Step the rotors BEFORE processing the character
    this.stepRotors(config.id, rotorConfig, alphabet.length);

    let result = upperChar;

    // Process through each rotor in forward direction (right to left)
    for (let i = rotorConfig.rotorSettings.length - 1; i >= 0; i--) {
      const setting = rotorConfig.rotorSettings[i];
      const rotorKey = `${config.id}-${i}`;
      const rotorPos = this.state.positions[rotorKey] || 0;

      // Get rotor wiring
      const wiring = ROTOR_WIRINGS[setting.rotor];

      // Process through rotor
      const charPos = alphabet.indexOf(result);
      if (charPos === -1) continue; // Skip if not in alphabet

      const wiringPos = (charPos + rotorPos) % alphabet.length;
      if (wiringPos >= 0 && wiringPos < wiring.length) {
        // For extended character sets, we need to map between alphabet index and rotor wiring
        // The rotor wiring is defined for the standard 26-letter alphabet
        // We need to map between the current alphabet's index and the standard alphabet
        const standardAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const wireLetter = wiring.charAt(wiringPos % 26);
        const wireIndex = standardAlphabet.indexOf(wireLetter);

        // Map back to the current alphabet
        if (wireIndex >= 0 && wireIndex < alphabet.length) {
          result = alphabet[wireIndex];
        } else {
          // Fallback if the mapped letter isn't in our alphabet
          result = alphabet[wiringPos % alphabet.length];
        }
      }

      // Adjust for rotor position
      const alphabetPos = alphabet.indexOf(result);
      if (alphabetPos !== -1) {
        result =
          alphabet[
            (alphabetPos - rotorPos + alphabet.length) % alphabet.length
          ];
      }
    }

    return preserveCase(char, result);
  }

  // Improved stepping function with proper cascading across rotors
  private stepRotors(
    moduleId: string,
    config: RotorModuleConfig,
    alphabetLength: number,
  ): void {
    if (config.rotorSettings.length === 0) return;

    // First, determine which rotors need to step in this iteration
    const shouldStep: boolean[] = Array(config.rotorSettings.length).fill(
      false,
    );

    // The rightmost (fastest) rotor always steps
    const lastIndex = config.rotorSettings.length - 1;
    shouldStep[lastIndex] = true;

    // Check if middle and left rotors should step based on turnover positions
    for (let i = lastIndex; i > 0; i--) {
      const rotorKey = `${moduleId}-${i}`;
      const currentPos = this.state.positions[rotorKey] || 0;

      // If this rotor is at the turnover position, the rotor to its left should step
      if ((currentPos + 1) % alphabetLength === 0) {
        shouldStep[i - 1] = true;
      }
    }

    // Now step all rotors that should move
    for (let i = 0; i < config.rotorSettings.length; i++) {
      if (shouldStep[i]) {
        const rotorKey = `${moduleId}-${i}`;
        const currentPos = this.state.positions[rotorKey] || 0;
        this.state.positions[rotorKey] = (currentPos + 1) % alphabetLength;
      }
    }
  }

  // This is used for manual stepping and initialization
  updateState(moduleId: string, config: ModuleConfig): boolean {
    if (config.type !== "rotors") return false;

    const rotorConfig = config as RotorModuleConfig;
    const characterSet = this.state.lastProcessedCharSet; // Use tracked character set
    const alphabet = getAlphabetForCharSet(characterSet);

    // Initialize rotor positions from config
    rotorConfig.rotorSettings.forEach((setting, idx) => {
      const key = `${moduleId}-${idx}`;
      this.state.positions[key] = setting.ringSetting || 0;
    });

    return true;
  }

  getState(): RotorState {
    return this.state;
  }

  reset(): void {
    this.state = {
      positions: {},
      lastProcessedCharSet: "uppercase",
    };
  }
}
