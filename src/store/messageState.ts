import { computed } from "@preact/signals-react";
import { cipherState, updateState } from "./core";
import { constants } from "./constants";
import { encryptionProcessor } from "./encryptionProcessor";

// Message/text functions
export const messageState = {
  // State accessors
  input: computed(() => cipherState.value.messages.input),
  output: computed(() => cipherState.value.messages.output),

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

  // Process a single character using the module chain
  processChar(character: string): void {
    const char = character.toUpperCase();
    if (constants.ALPHABET.includes(char) || char === " ") {
      updateState((state) => {
        const position = state.messages.input.length;
        const cipheredChar = encryptionProcessor.processChar(
          char,
          position,
          state.moduleChain,
        );

        state.messages.input += char;
        state.messages.output += cipheredChar;
        state.ui.activeLamp = cipheredChar.toUpperCase();

        // Update rotor positions for any rotor modules
        // This simulates the mechanical rotation of Enigma rotors
        this.updateRotorPositions(state);
      });
    }
  },

  // Process the entire input text using the module chain
  processText(text: string): void {
    updateState((state) => {
      state.messages.input = text;
      state.messages.output = encryptionProcessor.processText(
        text,
        state.moduleChain,
      );
    });
  },

  // Helper function to update rotor positions after processing a character
  updateRotorPositions(state: typeof cipherState.value): void {
    // Find rotor modules
    const rotorModules = state.moduleChain.filter(
      (module) => module.type === "rotors" && module.enabled,
    );

    // Update each rotor module's settings
    rotorModules.forEach((module) => {
      if (module.type !== "rotors") return;

      const rotorSettings = [...module.rotorSettings];

      // Advance the first rotor
      if (rotorSettings.length > 0) {
        rotorSettings[0].ringSetting = (rotorSettings[0].ringSetting + 1) % 26;

        // Handle rotor stepping (like in the Enigma machine)
        for (let i = 0; i < rotorSettings.length - 1; i++) {
          if (rotorSettings[i].ringSetting === 0) {
            rotorSettings[i + 1].ringSetting =
              (rotorSettings[i + 1].ringSetting + 1) % 26;
          } else {
            break;
          }
        }

        // Update the module with new settings
        module.rotorSettings = rotorSettings;
      }
    });
  },

  // Clear input and output text
  clearText(): void {
    updateState((state) => {
      state.messages.input = "";
      state.messages.output = "";
    });
  },

  // Generate encryption key from current module chain
  generateEncryptionKey(): string {
    return encryptionProcessor.generateKey(cipherState.value.moduleChain);
  },
};
