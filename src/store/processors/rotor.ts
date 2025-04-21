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
  lastProcessedCharSet: string;
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

    // Check if character set has changed
    if (currentCharSet !== this.state.lastProcessedCharSet) {
      this.state.lastProcessedCharSet = currentCharSet;
    }

    // Skip non-alphabet characters
    if (alphabet.indexOf(char.toUpperCase()) === -1) return char;

    // Get the original case to preserve it
    const upperChar = char.toUpperCase();

    // Initialize rotor positions if needed
    rotorConfig.rotorSettings.forEach((setting, idx) => {
      const key = `${config.id}-${idx}`;
      if (this.state.positions[key] === undefined) {
        this.state.positions[key] = setting.ringSetting || 0;
      }
    });

    // Step the rotors if this is a new character (not just changing settings)
    if (context.position !== undefined) {
      this.stepRotors(config.id, rotorConfig, alphabet.length);
    }

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

  // Step the rotors with proper cascade behavior
  private stepRotors(
    moduleId: string,
    config: RotorModuleConfig,
    alphabetLength: number,
  ): void {
    const rotorCount = config.rotorSettings.length;
    if (rotorCount === 0) return;

    // Step the rightmost rotor first (always steps)
    const rightmostKey = `${moduleId}-${rotorCount - 1}`;
    let shouldCascade =
      this.state.positions[rightmostKey] === alphabetLength - 1;
    this.state.positions[rightmostKey] =
      (this.state.positions[rightmostKey] + 1) % alphabetLength;

    // Step any additional rotors if they need to cascade
    for (let i = rotorCount - 2; i >= 0; i--) {
      const key = `${moduleId}-${i}`;

      if (shouldCascade) {
        shouldCascade = this.state.positions[key] === alphabetLength - 1;
        this.state.positions[key] =
          (this.state.positions[key] + 1) % alphabetLength;
      } else {
        break;
      }
    }
  }

  // Used for manual stepping and initialization
  updateState(moduleId: string, config: ModuleConfig): boolean {
    if (config.type !== "rotors") return false;

    const rotorConfig = config as RotorModuleConfig;

    // Set positions directly from config
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
