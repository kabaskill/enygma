import { computed } from "@preact/signals-react";
import type { UIStyle, Control, Modules } from "~/lib/types";
import { enigmaState, updateState } from "./core";

// UI state and functions
export const uiState = {
  // State accessors
  activeLamp: computed(() => enigmaState.value.ui.activeLamp),
  controls: computed(() => enigmaState.value.ui.controls),
  uiStyle: computed(() => enigmaState.value.ui.uiStyle),
  
  // Actions
  setActiveLamp(lamp: string | null): void {
    updateState((state) => {
      state.ui.activeLamp = lamp;
    });
  },
  
  setUIStyle(style: UIStyle): void {
    updateState((state) => {
      state.ui.uiStyle = style;
    });
  },
  
  updateControls(controlName: Modules, updates: Partial<Control>): void {
    updateState((state) => {
      state.ui.controls[controlName] = {
        ...state.ui.controls[controlName],
        ...updates,
      };
    });
  }
};