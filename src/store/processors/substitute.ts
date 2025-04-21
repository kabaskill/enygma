import type { ModuleProcessor, ProcessingContext } from "./base";
import { getAlphabetForCharSet, preserveCase } from "./base";
import type { SubstitutionModuleConfig, ModuleConfig } from "../types";

export class SubstitutionProcessor implements ModuleProcessor {
  process(char: string, position: number, config: ModuleConfig, context: Partial<ProcessingContext>): string {
    if (config.type !== "substitution") return char;
    
    const subConfig = config as SubstitutionModuleConfig;
    const alphabet = getAlphabetForCharSet(context.characterSet || "uppercase");
    
    // Skip non-alphabet characters
    if (alphabet.indexOf(char.toUpperCase()) === -1) return char;
    
    const upperChar = char.toUpperCase();
    
    // Check if there's a mapping for this character
    if (subConfig.mapping && subConfig.mapping[upperChar]) {
      return preserveCase(char, subConfig.mapping[upperChar]);
    }
    
    return char;
  }
  
  // Substitution doesn't need state
  reset(): void {}
}