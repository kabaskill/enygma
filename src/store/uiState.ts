import { computed } from "@preact/signals-react";
import type { UIStyle } from "~/lib/types";
import { cipherState, updateState } from "./core";

// UI state and functions
export const uiState = {
  // State accessors
  activeLamp: computed(() => cipherState.value.ui.activeLamp),
  uiStyle: computed(() => cipherState.value.ui.uiStyle || "modern"),

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
};
