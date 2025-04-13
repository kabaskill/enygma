import { computed } from "@preact/signals-react";
import { v4 as uuidv4 } from "uuid";
import type { ModuleConfig, ModuleType } from "~/lib/types";
import {
  cipherState,
  updateState,
  createDefaultPlugboardMapping,
} from "./core";

// Module chain state management
export const moduleState = {
  // State accessors
  moduleChain: computed(() => cipherState.value.moduleChain),
  activePreset: computed(() => cipherState.value.activePreset),

  // Get all available presets
  getAvailablePresets(): string[] {
    return Object.keys(cipherState.value.presets);
  },

  // Actions
  setActivePreset(presetName: string): void {
    if (!cipherState.value.presets[presetName]) return;

    updateState((state) => {
      state.activePreset = presetName;
      // Clone the preset modules to avoid shared references
      state.moduleChain = JSON.parse(JSON.stringify(state.presets[presetName]));
    });
  },

  // Add a new module to the chain
  addModule(type: ModuleType, position?: number): string {
    const id = uuidv4();
    let newModule: ModuleConfig;

    // Create the appropriate module configuration based on type
    switch (type) {
      case "rotors":
        newModule = {
          id,
          type: "rotors",
          enabled: true,
          rotorSettings: [{ rotor: "I", ringSetting: 0 }],
        };
        break;

      case "plugboard":
        newModule = {
          id,
          type: "plugboard",
          enabled: true,
          mapping: createDefaultPlugboardMapping(),
        };
        break;

      case "reflector":
        newModule = {
          id,
          type: "reflector",
          enabled: true,
          reflectorType: "standard",
        };
        break;

      case "shifter":
        newModule = {
          id,
          type: "shifter",
          enabled: true,
          shift: 3,
        };
        break;

      case "substitution":
        newModule = {
          id,
          type: "substitution",
          enabled: true,
          mapping: createDefaultPlugboardMapping(),
        };
        break;

      case "vigenere":
        newModule = {
          id,
          type: "vigenere",
          enabled: true,
          keyword: "KEY",
        };
        break;

      case "transposition":
        newModule = {
          id,
          type: "transposition",
          enabled: true,
          pattern: [0, 1, 2, 3], // Basic identity pattern
        };
        break;

      default:
        throw new Error(`Unknown module type: ${type}`);
    }

    updateState((state) => {
      if (
        position !== undefined &&
        position >= 0 &&
        position <= state.moduleChain.length
      ) {
        // Insert at specific position
        state.moduleChain = [
          ...state.moduleChain.slice(0, position),
          newModule,
          ...state.moduleChain.slice(position),
        ];
      } else {
        // Add to end
        state.moduleChain = [...state.moduleChain, newModule];
      }

      // Mark as custom configuration by clearing the active preset
      if (state.activePreset !== "custom") {
        state.activePreset = "custom";
        // Save the custom configuration as a preset
        state.presets.custom = [...state.moduleChain];
      }
    });

    return id;
  },

  // Remove a module from the chain
  removeModule(id: string): void {
    updateState((state) => {
      state.moduleChain = state.moduleChain.filter(
        (module) => module.id !== id,
      );

      // Mark as custom configuration
      if (state.activePreset !== "custom") {
        state.activePreset = "custom";
        // Save the custom configuration as a preset
        state.presets.custom = [...state.moduleChain];
      }
    });
  },

  // Enable/disable a module
  setModuleEnabled(id: string, enabled: boolean): void {
    updateState((state) => {
      state.moduleChain = state.moduleChain.map((module) =>
        module.id === id ? { ...module, enabled } : module,
      );

      // Mark as custom configuration
      if (state.activePreset !== "custom") {
        state.activePreset = "custom";
        // Save the custom configuration as a preset
        state.presets.custom = [...state.moduleChain];
      }
    });
  },

  // Move a module up or down in the chain
  moveModule(id: string, direction: "up" | "down"): void {
    updateState((state) => {
      const index = state.moduleChain.findIndex((module) => module.id === id);
      if (index === -1) return;

      if (direction === "up" && index > 0) {
        // Swap with the module above
        const temp = state.moduleChain[index - 1];
        state.moduleChain[index - 1] = state.moduleChain[index];
        state.moduleChain[index] = temp;
      } else if (direction === "down" && index < state.moduleChain.length - 1) {
        // Swap with the module below
        const temp = state.moduleChain[index + 1];
        state.moduleChain[index + 1] = state.moduleChain[index];
        state.moduleChain[index] = temp;
      }

      // Mark as custom configuration
      if (state.activePreset !== "custom") {
        state.activePreset = "custom";
        // Save the custom configuration as a preset
        state.presets.custom = [...state.moduleChain];
      }
    });
  },

  // Update a specific module's configuration
  updateModule(id: string, updates: Partial<ModuleConfig>): void {
    updateState((state) => {
      state.moduleChain = state.moduleChain.map((module) =>
        module.id === id ? { ...module, ...updates } : module,
      );

      // Mark as custom configuration
      if (state.activePreset !== "custom") {
        state.activePreset = "custom";
        // Save the custom configuration as a preset
        state.presets.custom = [...state.moduleChain];
      }
    });
  },

  // Find a module by ID
  getModuleById(id: string): ModuleConfig | undefined {
    return cipherState.value.moduleChain.find((module) => module.id === id);
  },

  // Save current configuration as a new preset
  saveAsPreset(name: string): void {
    updateState((state) => {
      state.presets[name] = JSON.parse(JSON.stringify(state.moduleChain));
      state.activePreset = name;
    });
  },

  // Delete a preset
  deletePreset(name: string): void {
    if (name === "enigma" || name === "caesar" || name === "vigenere") {
      // Don't allow deletion of built-in presets
      return;
    }

    updateState((state) => {
      const { [name]: _, ...restPresets } = state.presets;
      state.presets = restPresets;

      // If this was the active preset, switch to enigma
      if (state.activePreset === name) {
        state.activePreset = "enigma";
        state.moduleChain = JSON.parse(JSON.stringify(state.presets.enigma));
      }
    });
  },
};
