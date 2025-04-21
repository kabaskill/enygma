import type { ModuleConfig, CharacterSetOption } from "./types";
import type { ModuleProcessor, ProcessingContext } from "./processors/base";
import { RotorProcessor } from "./processors/rotor";
import { PlugboardProcessor } from "./processors/plugboard";
import { ReflectorProcessor } from "./processors/reflector";
import { ShifterProcessor } from "./processors/shifter";
import { SubstitutionProcessor } from "./processors/substitute";
import { VigenereProcessor } from "./processors/vigenere";
import { TranspositionProcessor } from "./processors/transpose";

export class EncryptionPipeline {
  private processors: Record<string, ModuleProcessor> = {};
  private processingHistory: ProcessingContext[] = [];

  constructor() {
    // Register all processors
    this.processors = {
      rotors: new RotorProcessor(),
      plugboard: new PlugboardProcessor(),
      reflector: new ReflectorProcessor(),
      shifter: new ShifterProcessor(),
      substitution: new SubstitutionProcessor(),
      vigenere: new VigenereProcessor(),
      transposition: new TranspositionProcessor(),
    };
  }

  /**
   * Process a single character through all enabled modules in the pipeline
   */
  processChar(
    char: string,
    position: number,
    modules: ModuleConfig[],
    characterSet: CharacterSetOption,
  ): { result: string; history: ProcessingContext[] } {
    let currentChar = char;
    const history: ProcessingContext[] = [];

    // Process through each enabled module
    for (const module of modules) {
      if (!module.enabled) continue;

      // Get the appropriate processor
      const processor = this.processors[module.type];
      if (!processor) continue;

      // Create context for this processing step
      const context: ProcessingContext = {
        characterSet,
        position,
        inputChar: currentChar,
        outputChar: "", // Will be filled after processing
        moduleId: module.id,
      };

      // Process the character
      const outputChar = processor.process(
        currentChar,
        position,
        module,
        context,
      );
      context.outputChar = outputChar;

      // Store in history for visualization
      history.push(context);

      // Update current char for next module
      currentChar = outputChar;

      // Update state for stateful processors (like rotors)
      if (processor.updateState) {
        processor.updateState(module.id, module);
      }
    }

    return { result: currentChar, history };
  }

  /**
   * Process a complete message through the pipeline
   */
  processMessage(
    message: string,
    modules: ModuleConfig[],
    characterSet: CharacterSetOption,
  ): { output: string; processingHistory: ProcessingContext[] } {
    let output = "";
    this.processingHistory = [];

    // Reset all processor states
    Object.values(this.processors).forEach((processor) => {
      if (processor.reset) processor.reset();
    });

    // Process each character
    for (let i = 0; i < message.length; i++) {
      const { result, history } = this.processChar(
        message[i],
        i,
        modules,
        characterSet,
      );
      if (result) {
        // For transposition, some calls might not return a character yet
        output += result;
      }
      this.processingHistory.push(...history);
    }

    // Handle any remaining buffered characters in stateful processors
    // This is mainly for transposition which might have buffered chars
    const transProcessor = this.processors
      .transposition as TranspositionProcessor;
    if (transProcessor && transProcessor.getState) {
      const state = transProcessor.getState();
      // Process any remaining buffered characters
      // Implementation depends on specific needs
    }

    return { output, processingHistory: this.processingHistory };
  }

  /**
   * Get processing history for visualization
   */
  getProcessingHistory(): ProcessingContext[] {
    return this.processingHistory;
  }

  /**
   * Get specific history for a module
   */
  getModuleHistory(moduleId: string): ProcessingContext[] {
    return this.processingHistory.filter((ctx) => ctx.moduleId === moduleId);
  }

  /**
 * Initialize modules with default values for presets
 */
initializePresetModules(modules: ModuleConfig[]): ModuleConfig[] {
  return modules.map(module => {
    return this.initializeModule(module);
  });
}


  /**
   * Initialize default configurations for newly added modules
   */
  initializeModule(baseModule: ModuleConfig): ModuleConfig {
    // Create a properly typed copy of the base module
    let module = { ...baseModule };

    switch (module.type) {
      case "rotors":
        return {
          ...module,
          rotorSettings: [
            { rotor: "I", ringSetting: 0 },
            { rotor: "II", ringSetting: 0 },
            { rotor: "III", ringSetting: 0 },
          ],
        } as ModuleConfig;

      case "plugboard":
        return {
          ...module,
          mapping: {} as Record<string, string>,
        } as ModuleConfig;

      case "reflector":
        return {
          ...module,
          reflectorType: "standard",
          customMapping: {} as Record<string, string>,
        } as ModuleConfig;

      case "shifter":
        return {
          ...module,
          shift: 3, // Default Caesar shift
        } as ModuleConfig;

      case "substitution":
        // Create default mapping (each letter maps to itself)
        const mapping: Record<string, string> = {};
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (const letter of alphabet) {
          mapping[letter] = letter;
        }

        return {
          ...module,
          mapping,
        } as ModuleConfig;

      case "vigenere":
        return {
          ...module,
          keyword: "KEY", // Default keyword
        } as ModuleConfig;

      case "transposition":
        return {
          ...module,
          pattern: [1, 0, 2], // Basic transposition pattern
        } as ModuleConfig;

      default:
        return module;
    }
  }
}

// Create singleton instance
export const encryptionPipeline = new EncryptionPipeline();
