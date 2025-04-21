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
  processors: Record<string, ModuleProcessor> = {};
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

    // Reset stateful processors if this is the first character
    if (position === 0) {
      this.resetAllProcessors();

      // Initialize processors with current module configs
      this.initializeProcessorStates(modules);
    }

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
    this.resetAllProcessors();

    // Initialize all processor states with current modules
    this.initializeProcessorStates(modules);

    // Process each character individually to ensure proper rotor stepping
    for (let i = 0; i < message.length; i++) {
      const { result, history } = this.processChar(
        message[i],
        i,
        modules,
        characterSet,
      );

      if (result) {
        output += result;
        this.processingHistory.push(...history);
      }
    }

    // Handle any remaining buffered characters in stateful processors
    // This is mainly for transposition which might have buffered chars
    const transProcessor = this.processors
      .transposition as TranspositionProcessor;
    if (transProcessor && transProcessor.getState) {
      const state = transProcessor.getState();
      // Process any remaining buffered characters if needed
    }

    return { output, processingHistory: this.processingHistory };
  }

  /**
   * Reset all processors to their initial state
   */
  resetAllProcessors(): void {
    Object.values(this.processors).forEach((processor) => {
      if (processor.reset) {
        processor.reset();
      }
    });
  }

  /**
   * Initialize all processor states with current module configurations
   */
  initializeProcessorStates(modules: ModuleConfig[]): void {
    for (const module of modules) {
      const processor = this.processors[module.type];
      if (processor && processor.updateState) {
        processor.updateState(module.id, module);
      }
    }
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
    return modules.map((module) => {
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
