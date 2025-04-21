import type { ModuleProcessor, ProcessingContext } from "./base"
import { getAlphabetForCharSet, preserveCase } from "./base";
import type { ReflectorModuleConfig, ModuleConfig } from "../types";

// Standard reflector wirings
const STANDARD_REFLECTOR = "YRUHQSLDPXNGOKMIEBFZCWVJAT"; // Historical B reflector

export class ReflectorProcessor implements ModuleProcessor {
  process(char: string, position: number, config: ModuleConfig, context: Partial<ProcessingContext>): string {
    if (config.type !== "reflector") return char;
    
    const reflectorConfig = config as ReflectorModuleConfig;
    const alphabet = getAlphabetForCharSet(context.characterSet || "uppercase");
    
    // Skip non-alphabet characters
    if (alphabet.indexOf(char.toUpperCase()) === -1) return char;
    
    const upperChar = char.toUpperCase();
    const charIndex = alphabet.indexOf(upperChar);
    
    if (reflectorConfig.reflectorType === "standard") {
      // Use standard reflector mapping
      return preserveCase(char, STANDARD_REFLECTOR[charIndex]);
    } else if (reflectorConfig.reflectorType === "custom" && reflectorConfig.customMapping) {
      // Use custom mapping
      if (reflectorConfig.customMapping[upperChar]) {
        return preserveCase(char, reflectorConfig.customMapping[upperChar]);
      }
      
      // Check for reverse mapping
      for (const [from, to] of Object.entries(reflectorConfig.customMapping)) {
        if (to.toUpperCase() === upperChar) {
          return preserveCase(char, from);
        }
      }
    }
    
    return char;
  }
  
  // Reflector doesn't need state
  reset(): void {}
}