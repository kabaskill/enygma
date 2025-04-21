import type { ModuleProcessor, ProcessingContext } from "./base"
import { charIndex, charAtIndex, getAlphabetForCharSet, preserveCase } from "./base";
import type { RotorModuleConfig, ModuleConfig, Rotor } from "../types";

interface RotorState {
  positions: Record<string, number>;
}

// Pre-defined historical rotor wirings
const ROTOR_WIRINGS: Record<Rotor, string> = {
  "I": "EKMFLGDQVZNTOWYHXUSPAIBRCJ",
  "II": "AJDKSIRUXBLHWTMCQGZNPYFVOE",
  "III": "BDFHJLCPRTXVZNYEIWGAKMUSQO",
  "IV": "ESOVPZJAYQUIRHXLNFTGKDCMWB",
  "V": "VZBRGITYUPSDNHLXAWMJQOFECK"
};

// Historical rotor notch positions (simplified for example)
const NOTCH_POSITIONS: Record<Rotor, number[]> = {
  "I": [16],    // Q -> 16
  "II": [4],    // E -> 4
  "III": [21],  // V -> 21
  "IV": [9],    // J -> 9
  "V": [25],    // Z -> 25
};

export class RotorProcessor implements ModuleProcessor {
  private state: RotorState = { positions: {} };
  
  process(char: string, position: number, config: ModuleConfig, context: Partial<ProcessingContext>): string {
    if (config.type !== "rotors") return char;
    
    const rotorConfig = config as RotorModuleConfig;
    const alphabet = getAlphabetForCharSet(context.characterSet || "uppercase");
    
    // Skip non-alphabet characters
    if (alphabet.indexOf(char.toUpperCase()) === -1) return char;
    
    // Get the original case to preserve it
    const upperChar = char.toUpperCase();
    
    // Initialize positions for this module if not set
    if (this.state.positions[config.id] === undefined) {
      // For each rotor in the configuration, initialize position
      rotorConfig.rotorSettings.forEach((setting, idx) => {
        const key = `${config.id}-${idx}`;
        this.state.positions[key] = setting.ringSetting || 0;
      });
    }
    
    let result = upperChar;
    
    // Process through each rotor in forward direction
    for (let i = 0; i < rotorConfig.rotorSettings.length; i++) {
      const setting = rotorConfig.rotorSettings[i];
      const rotorKey = `${config.id}-${i}`;
      const rotorPos = this.state.positions[rotorKey] || 0;
      
      // Get rotor wiring
      const wiring = ROTOR_WIRINGS[setting.rotor];
      
      // Process through rotor
      const charPos = alphabet.indexOf(result);
      const wiringPos = (charPos + rotorPos) % alphabet.length;
      result = wiring[wiringPos];
      
      // Adjust for rotor position
      const alphabetPos = alphabet.indexOf(result);
      result = alphabet[(alphabetPos - rotorPos + alphabet.length) % alphabet.length];
    }
    
    return preserveCase(char, result);
  }
  
  updateState(moduleId: string, config: ModuleConfig): boolean {
    if (config.type !== "rotors") return false;
    
    const rotorConfig = config as RotorModuleConfig;
    let shouldAdvanceNext = false;
    
    // Update positions for each rotor in the configuration
    for (let i = rotorConfig.rotorSettings.length - 1; i >= 0; i--) {
      const setting = rotorConfig.rotorSettings[i];
      const rotorKey = `${moduleId}-${i}`;
      let position = this.state.positions[rotorKey] || 0;
      
      // Check if we need to advance this rotor
      if (i === rotorConfig.rotorSettings.length - 1 || shouldAdvanceNext) {
        position = (position + 1) % 26;
        this.state.positions[rotorKey] = position;
        
        // Check if this rotor hit a notch position
        const notches = NOTCH_POSITIONS[setting.rotor] || [];
        shouldAdvanceNext = notches.includes(position);
      } else {
        shouldAdvanceNext = false;
      }
    }
    
    return false;
  }
  
  getState(): RotorState {
    return this.state;
  }
  
  reset(): void {
    this.state = { positions: {} };
  }
}