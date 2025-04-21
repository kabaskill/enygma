import type { ModuleProcessor, ProcessingContext } from "./base";
import { getAlphabetForCharSet, shiftChar, preserveCase } from "./base";
import type { ShifterModuleConfig, ModuleConfig } from "../types";

export class ShifterProcessor implements ModuleProcessor {
  process(char: string, position: number, config: ModuleConfig, context: Partial<ProcessingContext>): string {
    if (config.type !== "shifter") return char;
    
    const shifterConfig = config as ShifterModuleConfig;
    const alphabet = getAlphabetForCharSet(context.characterSet || "uppercase");
    
    // Skip non-alphabet characters
    if (alphabet.indexOf(char.toUpperCase()) === -1) return char;
    
    const upperChar = char.toUpperCase();
    const shift = shifterConfig.shift || 0;
    
    // Apply shift
    const result = shiftChar(upperChar, shift, alphabet);
    
    return preserveCase(char, result);
  }
  
  // Shifter doesn't need state
  reset(): void {}
}