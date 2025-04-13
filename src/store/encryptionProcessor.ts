import type {
  ModuleConfig,
  RotorModuleConfig,
  PlugboardModuleConfig,
  ReflectorModuleConfig,
  ShifterModuleConfig,
  VigenereModuleConfig,
  SubstitutionModuleConfig,
} from "~/lib/types";
import { constants } from "./constants";

// The primary encryption engine that processes text through module chain
export const encryptionProcessor = {
  // Process a single character through the module chain
  processChar(
    char: string,
    position: number,
    moduleChain: ModuleConfig[],
  ): string {
    if (!char || char === " ") return char;

    char = char.toUpperCase();
    if (!constants.ALPHABET.includes(char)) return char;

    // Pass through each enabled module in the chain
    return moduleChain.reduce((currentChar, module) => {
      if (!module.enabled) return currentChar;

      return this.applyModule(currentChar, position, module);
    }, char);
  },

  // Process entire text through module chain
  processText(text: string, moduleChain: ModuleConfig[]): string {
    if (!text) return "";

    // Process each character in the text
    return text
      .split("")
      .map((char, index) => this.processChar(char, index, moduleChain))
      .join("");
  },

  // Apply a specific module to a character
  applyModule(char: string, position: number, module: ModuleConfig): string {
    if (!char || char === " ") return char;

    char = char.toUpperCase();
    if (!constants.ALPHABET.includes(char)) return char;

    switch (module.type) {
      case "plugboard":
        return this.applyPlugboard(
          char,
          (module as PlugboardModuleConfig).mapping,
        );

      case "rotors":
        return this.applyRotors(char, module as RotorModuleConfig, position);

      case "reflector":
        return this.applyReflector(
          char,
          (module as ReflectorModuleConfig).reflectorType,
        );

      case "shifter":
        return this.applyShifter(char, (module as ShifterModuleConfig).shift);

      case "vigenere":
        return this.applyVigenere(
          char,
          position,
          (module as VigenereModuleConfig).keyword,
        );

      case "substitution":
        return this.applySubstitution(
          char,
          (module as SubstitutionModuleConfig).mapping,
        );

      case "transposition":
        // Transposition works on blocks of text, not individual characters
        // In a real implementation, this would require special handling
        return char;

      default:
        return char;
    }
  },

  // Apply plugboard substitutions
  applyPlugboard(char: string, mapping: Record<string, string>): string {
    return mapping[char] || char;
  },

  // Apply rotor substitutions (simulated Enigma rotors)
  applyRotors(
    char: string,
    rotorModule: RotorModuleConfig,
    position: number,
  ): string {
    // This is a simplified implementation - in a real Enigma, rotors would rotate
    // with each character and stepping would be handled

    const { rotorSettings } = rotorModule;

    // Forward pass through rotors
    for (let i = 0; i < rotorSettings.length; i++) {
      const setting = rotorSettings[i];
      const rotor = constants.ROTORS[setting.rotor];
      const offset = setting.ringSetting;

      // Apply rotor wiring substitution
      const charIndex = constants.ALPHABET.indexOf(char);
      const shiftedIndex = (charIndex + offset) % 26;
      const substitutedChar = rotor[shiftedIndex];
      const finalIndex =
        (constants.ALPHABET.indexOf(substitutedChar) - offset + 26) % 26;
      char = constants.ALPHABET[finalIndex];
    }

    return char;
  },

  // Apply reflector (simulated Enigma reflector)
  applyReflector(char: string, reflectorType: string): string {
    const reflector = constants.REFLECTOR;
    const charIndex = constants.ALPHABET.indexOf(char);
    return reflector[charIndex];
  },

  // Apply Caesar shift
  applyShifter(char: string, shift: number): string {
    const charIndex = constants.ALPHABET.indexOf(char);
    const shiftedIndex = (charIndex + shift) % 26;
    return constants.ALPHABET[shiftedIndex];
  },

  // Apply Vigenere encryption
  applyVigenere(char: string, position: number, keyword: string): string {
    if (!keyword) return char;

    // Determine which keyword letter to use
    const keyChar = keyword[position % keyword.length].toUpperCase();
    const shift = constants.ALPHABET.indexOf(keyChar);

    // Apply the shift
    const charIndex = constants.ALPHABET.indexOf(char);
    const shiftedIndex = (charIndex + shift) % 26;
    return constants.ALPHABET[shiftedIndex];
  },

  // Apply direct substitution mapping
  applySubstitution(char: string, mapping: Record<string, string>): string {
    return mapping[char] || char;
  },

  // Generate a key string from module chain
  generateKey(moduleChain: ModuleConfig[]): string {
    const enabledModules = moduleChain.filter((m) => m.enabled);

    // Create a simple key representation
    // This would need to be expanded for a real application
    const parts = enabledModules.map((module) => {
      switch (module.type) {
        case "shifter":
          return `caesar_${(module as ShifterModuleConfig).shift}`;

        case "vigenere":
          return `vigenere_${(module as VigenereModuleConfig).keyword}`;

        case "rotors":
          const rotorConfig = (module as RotorModuleConfig).rotorSettings
            .map((r) => `${r.rotor}-${r.ringSetting}`)
            .join("_");
          return `rotors_${rotorConfig}`;

        default:
          return module.type;
      }
    });

    return parts.join("|");
  },

  // Parse a key string to recreate module chain
  // This would need to be implemented based on your key format
  parseKey(key: string): ModuleConfig[] {
    // Placeholder for key parsing logic
    // This would convert your key string back into module configurations
    return [];
  },
};
