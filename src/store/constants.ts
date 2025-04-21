// Core constants for the application

export const STATE_VERSION = 1;

export const constants = {
  ALPHABET: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  LOWERCASE: "abcdefghijklmnopqrstuvwxyz",
  KEYBOARD: {
    row1: "QWERTZUIO",
    row2: "ASDFGHJK",
    row3: "PYXCVBNML",
  },
  DIGITS: "1234567890",
  SPECIAL_CHARACTERS: "!@#$%^&*(){}[]=<>/,.;:\"'`~_-+\\|€£¥§©®",
  ROTORS: {
    I: "EKMFLGDQVZNTOWYHXUSPAIBRCJ",
    II: "AJDKSIRUXBLHWTMCQGZNPYFVOE",
    III: "BDFHJLCPRTXVZNYEIWGAKMUSQO",
    IV: "ESOVPZJAYQUIRHXLNFTGKDCMWB",
    V: "VZBRGITYUPSDNHLXAWMJQOFECK",
  },
  REFLECTOR: "YRUHQSLDPXNGOKMIEBFZCWVJAT",
  TOOLTIPS: {
    header:
      "This is a recreation of the famous Enigma machine used during World War II.",
    rotors:
      "Rotors are the heart of the Enigma machine. They scramble the letters based on their wiring.",
    reflector:
      "The reflector sends the signal back through the rotors, creating a symmetric encryption.",
    plugboard:
      "The plugboard allows for additional scrambling by swapping pairs of letters.",
    lampboard: "The lampboard shows which letter is currently being outputted.",
    keyboard: "The keyboard is where you input the letters to be encrypted.",
    input: "The input shows the letters you type on the keyboard.",
    output: "The output shows the encrypted letters as you type.",
    settings:
      "Settings allow you to configure the machine, including rotor positions and plugboard connections.",
  },
};

// Utility function to create default mapping (each letter maps to itself)
export const createDefaultAlphabetMapping = (): Record<string, string> => {
  const mapping: Record<string, string> = {};
  constants.ALPHABET.split("").forEach((letter) => {
    mapping[letter] = letter;
  });
  return mapping;
};
