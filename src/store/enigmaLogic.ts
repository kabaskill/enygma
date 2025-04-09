import { constants } from "./constants";
import type { RotorSetting } from "~/lib/types";


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
    reverse = false,
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
    plugboard: Record<string, string>,
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
        rotorSettings[i].ringSetting,
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
        true,
      );
    }

    return enigmaLogic.applyPlugboard(char, plugboard);
  },
};
