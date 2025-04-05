// enigmaHelpers.ts
import type { RotorSetting } from "../data/types";
import * as data from "../data/constants";

const { ALPHABET, ROTORS, REFLECTOR } = data;

interface PlugboardPair {
  from: string;
  to: string;
}

export function applyPlugboard(
  char: string,
  plugboard: Record<string, string>,
): string {
  // Handle the new Record<string, string> format from StateManager

  return plugboard[char] ?? char;
}

export function rotorPass(
  char: string,
  rotor: string,
  ringSetting: number,
  reverse = false,
): string {
  let index = ALPHABET.indexOf(char);
  index = (index + ringSetting + 26) % 26;

  if (reverse) {
    index = ROTORS[rotor].indexOf(ALPHABET[index]);
  } else {
    index = ALPHABET.indexOf(ROTORS[rotor][index]);
  }

  index = (index - ringSetting + 26) % 26;
  return ALPHABET[index];
}

export function cipher(
  char: string,
  rotorSettings: RotorSetting[],
  plugboard: PlugboardPair[],
): string {
  char = char.toUpperCase();
  char = applyPlugboard(char, plugboard);

  // Forward pass through rotors
  for (let i = 0; i < 3; i++) {
    char = rotorPass(
      char,
      rotorSettings[i].rotor,
      rotorSettings[i].ringSetting,
    );
  }

  // Reflector
  char = REFLECTOR[ALPHABET.indexOf(char)];

  // Backward pass through rotors
  for (let i = 2; i >= 0; i--) {
    char = rotorPass(
      char,
      rotorSettings[i].rotor,
      rotorSettings[i].ringSetting,
      true,
    );
  }

  return applyPlugboard(char, plugboard);
}
