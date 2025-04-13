import { updateState, initialState, cipherState } from "./core";

// Global application actions
export const appActions = {
  // Reset the entire application state
  reset(): void {
    updateState((state) => {
      Object.assign(state, initialState);
    });
  },

  // Reset just the current cipher configuration
  resetCurrentCipher(): void {
    const activePreset = cipherState.value.activePreset;

    updateState((state) => {
      // Reset the module chain to the active preset's default configuration
      if (state.presets[activePreset]) {
        state.moduleChain = [...state.presets[activePreset]];
      }

      // Clear the input/output
      state.messages.input = "";
      state.messages.output = "";
      state.ui.activeLamp = null;
    });
  },
};
