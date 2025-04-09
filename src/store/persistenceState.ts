import type { EnigmaState, SavedConfiguration } from "~/lib/types";
import { enigmaState } from "./core";
import { initialState } from "./core";
import { STATE_VERSION } from "./constants";

// Persistence functions
export const persistenceState = {
  // Save state to localStorage
  saveState(name: string): void {
    try {
      const config: SavedConfiguration = {
        name,
        timestamp: Date.now(),
        state: enigmaState.value,
      };

      const serializedState = JSON.stringify(config);
      localStorage.setItem(`enigma_state_${name}`, serializedState);
    } catch (error) {
      console.error("Failed to save state:", error);
    }
  },

  // Load state from localStorage
  loadState(name: string): boolean {
    try {
      const savedState = localStorage.getItem(`enigma_state_${name}`);
      if (!savedState) return false;

      const config: SavedConfiguration = JSON.parse(savedState);

      // Handle version migrations if needed
      if (!config.state.version || config.state.version < STATE_VERSION) {
        config.state = persistenceState.migrateState(config.state);
      }

      enigmaState.value = config.state;
      return true;
    } catch (error) {
      console.error("Failed to load state:", error);
      return false;
    }
  },

  // Migrate older state versions to current version
  migrateState(oldState: EnigmaState): EnigmaState {
    const version = oldState.version || 0;

    // Clone the state to avoid mutations
    let state = JSON.parse(JSON.stringify(oldState));

    // Example migration from version 0 to 1
    if (version < 1) {
      // Add any missing properties from initial state
      state = {
        ...initialState,
        ...state,
        ui: {
          ...initialState.ui,
          ...state.ui,
          controls: {
            ...initialState.ui.controls,
            ...(state.ui?.controls || {}),
          },
        },
      };
    }

    // Set current version
    state.version = STATE_VERSION;

    return state;
  },

  getSavedStates(): string[] {
    return Object.keys(localStorage)
      .filter((key) => key.startsWith("enigma_state_"))
      .map((key) => key.replace("enigma_state_", ""));
  },

  deleteState(name: string): void {
    localStorage.removeItem(`enigma_state_${name}`);
  },

  // Export and import state to/from file
  exportState(name: string): void {
    try {
      const config: SavedConfiguration = {
        name,
        timestamp: Date.now(),
        state: enigmaState.value,
      };

      const blob = new Blob([JSON.stringify(config, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `enigma-${name}.json`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export state:", error);
    }
  },

  importState(file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const config: SavedConfiguration = JSON.parse(
            e.target?.result as string,
          );

          if (!config.state) {
            reject(new Error("Invalid configuration file"));
            return;
          }

          // Handle version migrations if needed
          if (!config.state.version || config.state.version < STATE_VERSION) {
            config.state = persistenceState.migrateState(config.state);
          }

          enigmaState.value = config.state;
          resolve(true);
        } catch (error) {
          console.error("Failed to import state:", error);
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsText(file);
    });
  }
};