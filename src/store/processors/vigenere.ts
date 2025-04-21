import type { ModuleProcessor, ProcessingContext } from "./base";
import { getAlphabetForCharSet, shiftChar, preserveCase, charIndex } from "./base";
import type { VigenereModuleConfig, ModuleConfig } from "../types";

export class VigenereProcessor implements ModuleProcessor {
  process(char: string, position: number, config: ModuleConfig, context: Partial<ProcessingContext>): string {
    if (config.type !== "vigenere") return char;
    
    const vigenereConfig = config as VigenereModuleConfig;
    const alphabet = getAlphabetForCharSet(context.characterSet || "uppercase");
    
    // Skip non-alphabet characters
    if (alphabet.indexOf(char.toUpperCase()) === -1) return char;
    
    const upperChar = char.toUpperCase();
    
    // Get the keyword and calculate the shift
    const keyword = vigenereConfig.keyword || "";
    if (!keyword) return char;
    
    // Get the key character and its position in the alphabet
    const keyIndex = position % keyword.length;
    const keyChar = keyword[keyIndex].toUpperCase();
    const shift = charIndex(keyChar, alphabet);
    
    // Apply the shift
    const result = shiftChar(upperChar, shift, alphabet);
    
    return preserveCase(char, result);
  }
  
  // Vigenere doesn't need state
  reset(): void {}
}