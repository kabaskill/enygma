import type { CipherState, SavedConfiguration } from "~/lib/types";
import { cipherState, updateState, initialState } from "./core";
import { STATE_VERSION } from "./constants";

// Persistence functions
export const persistenceState = {
  // Save state to localStorage
  saveState(name: string): void {
    try {
      localStorage.setItem(
        `cipher_state_${name}`,
        JSON.stringify({
          state: cipherState.value,
          version: STATE_VERSION,
        }),
      );
    } catch (error) {
      console.error("Failed to save state:", error);
    }
  },

  // Load state from localStorage
  loadState(name: string): boolean {
    try {
      const storedState = localStorage.getItem(`cipher_state_${name}`);
      if (!storedState) return false;

      const parsed = JSON.parse(storedState);
      const migratedState = this.migrateState(parsed.state);

      updateState((state) => {
        Object.assign(state, migratedState);
      });

      return true;
    } catch (error) {
      console.error("Failed to load state:", error);
      return false;
    }
  },

  // Migrate older state versions to current version
  migrateState(oldState: CipherState): CipherState {
    const version = oldState.version || 0;

    // Clone the state to avoid mutations
    let state = JSON.parse(JSON.stringify(oldState));

    // Example migration from version 0 to 1
    if (version < 1) {
      // Add any missing properties from initial state
      state = {
        ...initialState,
        ...state,
        presets: {
          ...initialState.presets,
          ...state.presets,
        },
        ui: {
          ...initialState.ui,
          ...state.ui,
        },
      };
    }

    // Set current version
    state.version = STATE_VERSION;

    return state;
  },

  getSavedStates(): string[] {
    return Object.keys(localStorage)
      .filter((key) => key.startsWith("cipher_state_"))
      .map((key) => key.replace("cipher_state_", ""));
  },

  deleteState(name: string): void {
    localStorage.removeItem(`cipher_state_${name}`);
  },

  // Export and import state to/from file
  exportState(name: string): void {
    try {
      const config: SavedConfiguration = {
        name,
        timestamp: Date.now(),
        state: cipherState.value,
      };

      const blob = new Blob([JSON.stringify(config, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `cipher-${name}.json`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export state:", error);
    }
  },

  importState(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const reader = new FileReader();

        reader.onload = (event) => {
          try {
            const config: SavedConfiguration = JSON.parse(
              event.target?.result as string,
            );

            if (!config.state) {
              console.error("Invalid configuration file");
              resolve(false);
              return;
            }

            const migratedState = this.migrateState(config.state);

            updateState((state) => {
              Object.assign(state, migratedState);
            });

            resolve(true);
          } catch (error) {
            console.error("Failed to parse state file:", error);
            resolve(false);
          }
        };

        reader.onerror = () => {
          console.error("Failed to read state file");
          resolve(false);
        };

        reader.readAsText(file);
      } catch (error) {
        console.error("Failed to import state:", error);
        resolve(false);
      }
    });
  },
};
