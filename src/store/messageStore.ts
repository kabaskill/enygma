import { create } from "zustand";
import type { MessageState, ProcessingContext } from "./types";
import { encryptionPipeline } from "./encryptionPipeline";
import { useModuleStore } from "./moduleStore";

interface MessageStoreState extends MessageState {
  setText: (text: string) => void;
  processText: () => void;
  processChar: (char: string, position: number) => string;
  setActiveModuleId: (id: string | null) => void;
  setActiveLamp: (char: string | null) => void;
  setTitle: (title: string) => void;
  processingHistory: ProcessingContext[];
  getModuleHistory: (moduleId: string) => ProcessingContext[];
}

export const useMessageStore = create<MessageStoreState>((set, get) => ({
  title: "Untitled Note",
  input: "",
  output: "",
  activeModuleId: null,
  activeLamp: null,
  processingHistory: [],

  setText: (text) => {
    set({ input: text });
    // Process text immediately
    if (text) {
      get().processText();
    } else {
      set({ output: "", processingHistory: [] });
    }
  },

  processText: () => {
    const { input } = get();
    const { modules, characterSet } = useModuleStore.getState();

    // Reset processors to ensure fresh state for new processing
    useModuleStore.getState().resetProcessors();

    // Process each character individually to ensure proper rotor stepping
    let output = "";
    const allHistory: ProcessingContext[] = [];

    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      const { result: processedChar, history } = encryptionPipeline.processChar(
        char,
        i,
        modules,
        characterSet,
      );

      output += processedChar;
      allHistory.push(...history);
    }

    set({
      output,
      processingHistory: allHistory,
    });
  },

  // Function to process a single character - useful for interactive components
  processChar: (char, position) => {
    const { modules, characterSet } = useModuleStore.getState();
    const { result } = encryptionPipeline.processChar(
      char,
      position,
      modules,
      characterSet,
    );

    // Set the active lamp for visualization
    set({ activeLamp: result });

    return result;
  },

  setActiveModuleId: (id) => set({ activeModuleId: id }),

  setActiveLamp: (char) => set({ activeLamp: char }),

  setTitle: (title) => set({ title }),

  getModuleHistory: (moduleId: string) => {
    return get().processingHistory.filter((ctx) => ctx.moduleId === moduleId);
  },
}));
