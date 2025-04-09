// Re-export everything from the individual state files

// Constants and core state
export { constants, createDefaultPlugboardMapping, STATE_VERSION } from "./constants";
export { enigmaState, updateState, initialState } from "./core";

// Logic
export { enigmaLogic } from "./enigmaLogic";

// State modules
export { machineState } from "./machineState";
export { messageState } from "./messageState";
export { uiState } from "./uiState"; 
export { persistenceState } from "./persistenceState";
export { appActions } from "./appActions";

// Convenience exports for backward compatibility
import { machineState } from "./machineState";
import { messageState } from "./messageState";
import { uiState } from "./uiState";
import { persistenceState } from "./persistenceState";
import { appActions } from "./appActions";

// Export computed signals directly
export const input = messageState.input;
export const output = messageState.output;
export const rotorSettings = machineState.rotorSettings;
export const activeLamp = uiState.activeLamp;
export const controls = uiState.controls;
export const uiStyle = uiState.uiStyle;
export const plugboardMapping = machineState.plugboardMapping;

// Re-export functions with original names for backward compatibility
export const {
  setRotorSettings,
  getAvailableRotors,
  addRotor,
  removeRotor,
  updateRotor,
  connectPlugboardPair,
  disconnectPlugboardLetter,
  resetPlugboard,
  getPlugboardSubstitution
} = machineState;

export const {
  setInput,
  setOutput,
  processChar
} = messageState;

export const {
  setActiveLamp,
  setUIStyle,
  updateControls
} = uiState;

export const {
  saveState,
  loadState,
  getSavedStates,
  deleteState,
  exportState,
  importState
} = persistenceState;

export const {
  reset
} = appActions;