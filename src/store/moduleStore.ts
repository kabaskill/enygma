import { create } from "zustand";
import type {
  ModuleState,
  ModuleConfig,
  CharacterSetOption,
  PlugboardModuleConfig,
} from "./types";
import { v4 as uuidv4 } from "uuid";
import { useMessageStore } from "./messageStore";
import { encryptionPipeline } from "./encryptionPipeline";

interface ModuleStoreState extends ModuleState {
  addModule: (type: string) => void;
  updateModule: (id: string, updates: Partial<ModuleConfig>) => void;
  removeModule: (id: string) => void;
  reorderModules: (sourceIndex: number, destinationIndex: number) => void;
  setCharacterSet: (set: CharacterSetOption) => void;
  setModules: (modules: ModuleConfig[]) => void;
  connectPlugboardPair: (moduleId: string, from: string, to: string) => void;
  disconnectPlugboardLetter: (moduleId: string, letter: string) => void;
  resetPlugboard: (moduleId: string) => void;
  resetProcessors: () => void;
}

export const useModuleStore = create<ModuleStoreState>((set, get) => ({
  modules: [],
  characterSet: "uppercase",

  addModule: (type) => {
    // Create base module
    let baseModule: ModuleConfig = {
      id: uuidv4(),
      type: type as any,
      enabled: true,
      minimized: false,
      showInputOutput: true,
    } as ModuleConfig;

    // Initialize with default values based on module type
    const newModule = encryptionPipeline.initializeModule(baseModule);

    set((state) => ({
      modules: [...state.modules, newModule],
    }));

    // Trigger text reprocessing
    setTimeout(() => {
      useMessageStore.getState().processText();
    }, 0);
  },

  updateModule: (id, updates) => {
    set((state) => ({
      modules: state.modules.map((module) =>
        module.id === id ? { ...module, ...updates } : module,
      ) as ModuleConfig[],
    }));

    // Trigger text reprocessing
    setTimeout(() => {
      useMessageStore.getState().processText();
    }, 0);
  },

  removeModule: (id) => {
    set((state) => ({
      modules: state.modules.filter((module) => module.id !== id),
    }));

    // Trigger text reprocessing
    setTimeout(() => {
      useMessageStore.getState().processText();
    }, 0);
  },

  reorderModules: (sourceIndex, destinationIndex) => {
    set((state) => {
      const result = Array.from(state.modules);
      const [removed] = result.splice(sourceIndex, 1);
      result.splice(destinationIndex, 0, removed);

      return { modules: result };
    });

    // Trigger text reprocessing
    setTimeout(() => {
      useMessageStore.getState().processText();
    }, 0);
  },

  setCharacterSet: (characterSet) => {
    set({ characterSet });

    // Trigger text reprocessing
    setTimeout(() => {
      useMessageStore.getState().processText();
    }, 0);
  },

  setModules: (modules) => {
    set({ modules });

    // Trigger text reprocessing
    setTimeout(() => {
      useMessageStore.getState().processText();
    }, 0);
  },

  connectPlugboardPair: (moduleId, from, to) => {
    set((state) => {
      const modules = [...state.modules];
      const moduleIndex = modules.findIndex(
        (m) => m.id === moduleId && m.type === "plugboard",
      );

      if (moduleIndex === -1) return state;

      const module = modules[moduleIndex] as PlugboardModuleConfig;

      // Create a new mapping
      const newMapping = { ...module.mapping };

      // First remove any existing connections for these letters
      Object.keys(newMapping).forEach((key) => {
        if (
          newMapping[key] === from ||
          newMapping[key] === to ||
          key === from ||
          key === to
        ) {
          delete newMapping[key];
        }
      });

      // Add the new bidirectional connection
      newMapping[from] = to;
      newMapping[to] = from;

      // Update the module
      modules[moduleIndex] = {
        ...module,
        mapping: newMapping,
      };

      return { modules };
    });

    // Trigger text reprocessing
    setTimeout(() => {
      useMessageStore.getState().processText();
    }, 0);
  },

  disconnectPlugboardLetter: (moduleId, letter) => {
    set((state) => {
      const modules = [...state.modules];
      const moduleIndex = modules.findIndex(
        (m) => m.id === moduleId && m.type === "plugboard",
      );

      if (moduleIndex === -1) return state;

      const module = modules[moduleIndex] as PlugboardModuleConfig;

      // Create a new mapping
      const newMapping = { ...module.mapping };

      // Get the connected letter
      const connectedLetter = newMapping[letter];

      // Remove both connections (bidirectional)
      if (connectedLetter) {
        delete newMapping[letter];
        delete newMapping[connectedLetter];
      }

      // Update the module
      modules[moduleIndex] = {
        ...module,
        mapping: newMapping,
      };

      return { modules };
    });

    // Trigger text reprocessing
    setTimeout(() => {
      useMessageStore.getState().processText();
    }, 0);
  },

  resetPlugboard: (moduleId) => {
    set((state) => {
      const modules = [...state.modules];
      const moduleIndex = modules.findIndex(
        (m) => m.id === moduleId && m.type === "plugboard",
      );

      if (moduleIndex === -1) return state;

      // Reset the mapping to empty
      modules[moduleIndex] = {
        ...modules[moduleIndex],
        mapping: {},
      } as PlugboardModuleConfig;

      return { modules };
    });

    // Trigger text reprocessing
    setTimeout(() => {
      useMessageStore.getState().processText();
    }, 0);
  },

  resetProcessors: () => {
    // Access all processors and reset them
    Object.values(encryptionPipeline.processors).forEach((processor) => {
      if (processor.reset) {
        processor.reset();
      }
    });

    // Trigger text reprocessing
    setTimeout(() => {
      useMessageStore.getState().processText();
    }, 0);
  },
}));
