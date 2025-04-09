import { computed } from "@preact/signals-react";
import { enigmaState, updateState } from "./core";
import { enigmaLogic } from "./enigmaLogic";
import { constants } from "./constants";

// Message/text functions
export const messageState = {
  // State accessors
  input: computed(() => enigmaState.value.messages.input),
  output: computed(() => enigmaState.value.messages.output),
  
  // Actions
  setInput(value: string): void {
    updateState((state) => {
      state.messages.input = value;
    });
  },
  
  setOutput(value: string): void {
    updateState((state) => {
      state.messages.output = value;
    });
  },
  
  processChar(character: string): void {
    const char = character.toUpperCase();
    if (constants.ALPHABET.includes(char) || char === " ") {
      updateState((state) => {
        const cipheredChar =
          char === " "
            ? " "
            : enigmaLogic.cipher(
                char,
                state.machine.rotorSettings,
                state.machine.plugboardMapping,
              );
        state.messages.input += char;
        state.messages.output += cipheredChar;
        state.ui.activeLamp = cipheredChar.toUpperCase();

        if (char !== " " && state.machine.rotorSettings.length > 0) {
          const newSettings = [...state.machine.rotorSettings];

          newSettings[0].ringSetting = (newSettings[0].ringSetting + 1) % 26;

          for (let i = 0; i < newSettings.length - 1; i++) {
            if (newSettings[i].ringSetting === 0) {
              newSettings[i + 1].ringSetting =
                (newSettings[i + 1].ringSetting + 1) % 26;
            } else {
              break;
            }
          }

          state.machine.rotorSettings = newSettings;
        }
      });
    }
  }
};