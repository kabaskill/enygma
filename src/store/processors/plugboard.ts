import type { ModuleProcessor, ProcessingContext } from "./base";
import { getAlphabetForCharSet, preserveCase } from "./base";
import type { PlugboardModuleConfig, ModuleConfig } from "../types";

export class PlugboardProcessor implements ModuleProcessor {
  process(char: string, position: number, config: ModuleConfig, context: Partial<ProcessingContext>): string {
    if (config.type !== "plugboard") return char;
    
    const plugboardConfig = config as PlugboardModuleConfig;
    const alphabet = getAlphabetForCharSet(context.characterSet || "uppercase");
    
    // Skip non-alphabet characters
    if (alphabet.indexOf(char.toUpperCase()) === -1) return char;
    
    const upperChar = char.toUpperCase();
    
    // Check if there's a mapping for this character
    if (plugboardConfig.mapping && plugboardConfig.mapping[upperChar]) {
      return preserveCase(char, plugboardConfig.mapping[upperChar]);
    }
    
    // Check for reverse mapping (plugboards work both ways)
    for (const [from, to] of Object.entries(plugboardConfig.mapping || {})) {
      if (to.toUpperCase() === upperChar) {
        return preserveCase(char, from);
      }
    }
    
    return char;
  }
  
  // Plugboard doesn't need state
  reset(): void {}
}