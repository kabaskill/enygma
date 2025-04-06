import type { RotorSetting } from "./types";
import * as data from "./constants";

const { ALPHABET, ROTORS, REFLECTOR } = data;

/**
 * Applies the plugboard substitution to a character
 */
export function applyPlugboard(
  char: string,
  plugboard: Record<string, string>,
): string {
  return plugboard[char] ?? char;
}

/**
 * Passes a character through a rotor in either forward or reverse direction
 */
export function rotorPass(
  char: string,
  rotor: string,
  ringSetting: number,
  reverse = false,
): string {
  if (!ROTORS[rotor]) {
    console.error(`Invalid rotor: ${rotor}`);
    return char;
  }

  let index = ALPHABET.indexOf(char);
  if (index === -1) {
    console.error(`Character not in alphabet: ${char}`);
    return char;
  }

  index = (index + ringSetting + 26) % 26;

  if (reverse) {
    index = ROTORS[rotor].indexOf(ALPHABET[index]);
  } else {
    index = ALPHABET.indexOf(ROTORS[rotor][index]);
  }

  index = (index - ringSetting + 26) % 26;
  return ALPHABET[index];
}

/**
 * Processes a character through the entire Enigma machine
 */
export function cipher(
  char: string,
  rotorSettings: RotorSetting[],
  plugboard: Record<string, string>,
): string {
  if (!char || rotorSettings.length === 0) {
    return char;
  }

  char = char.toUpperCase();

  // Skip non-alphabet characters
  if (!ALPHABET.includes(char)) {
    return char;
  }

  char = applyPlugboard(char, plugboard);

  // Forward pass through rotors
  for (let i = 0; i < rotorSettings.length; i++) {
    char = rotorPass(
      char,
      rotorSettings[i].rotor,
      rotorSettings[i].ringSetting,
    );
  }

  // Reflector
  const reflectorIndex = ALPHABET.indexOf(char);
  if (reflectorIndex !== -1) {
    char = REFLECTOR[reflectorIndex];
  }

  // Backward pass through rotors
  for (let i = rotorSettings.length - 1; i >= 0; i--) {
    char = rotorPass(
      char,
      rotorSettings[i].rotor,
      rotorSettings[i].ringSetting,
      true,
    );
  }

  return applyPlugboard(char, plugboard);
}
