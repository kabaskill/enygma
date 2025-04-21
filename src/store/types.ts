// Module Types
export type ModuleType =
  | "rotors"
  | "plugboard"
  | "reflector"
  | "shifter"
  | "substitution"
  | "vigenere"
  | "transposition";

export type Rotor = "I" | "II" | "III" | "IV" | "V";

export type ReflectorType = "standard" | "custom";

export type Theme = "light" | "dark" | "dracula";

export type CharacterSetOption = "uppercase" | "full" | "extended";

export interface RotorSetting {
  rotor: Rotor;
  ringSetting: number;
}

export interface ModuleBase {
  id: string;
  type: ModuleType;
  enabled: boolean;
  minimized: boolean;
  showInputOutput: boolean;
}

export interface RotorModuleConfig extends ModuleBase {
  type: "rotors";
  rotorSettings: RotorSetting[];
}

export interface PlugboardModuleConfig extends ModuleBase {
  type: "plugboard";
  mapping: Record<string, string>;
}

export interface ReflectorModuleConfig extends ModuleBase {
  type: "reflector";
  reflectorType: ReflectorType;
  customMapping?: Record<string, string>;
}

export interface ShifterModuleConfig extends ModuleBase {
  type: "shifter";
  shift: number;
}

export interface SubstitutionModuleConfig extends ModuleBase {
  type: "substitution";
  mapping: Record<string, string>;
}

export interface VigenereModuleConfig extends ModuleBase {
  type: "vigenere";
  keyword: string;
}

export interface TranspositionModuleConfig extends ModuleBase {
  type: "transposition";
  pattern: number[];
}

export type ModuleConfig =
  | RotorModuleConfig
  | PlugboardModuleConfig
  | ReflectorModuleConfig
  | ShifterModuleConfig
  | SubstitutionModuleConfig
  | VigenereModuleConfig
  | TranspositionModuleConfig;

// App Store Types
export interface AppState {
  theme: Theme;
  activePreset: string;
  presets: Record<string, ModuleConfig[]>;
}

// Module Store Types
export interface ModuleState {
  modules: ModuleConfig[];
  characterSet: CharacterSetOption;
}

// Import ProcessingContext from our new processor structure
// We re-export it here to maintain compatibility with existing code
import type { ProcessingContext as BaseProcessingContext } from './processors/base';
export type ProcessingContext = BaseProcessingContext;

// Message Store Types
export interface MessageState {
  title: string;
  input: string;
  output: string;
  activeModuleId: string | null;
  activeLamp: string | null;
}

// Config for export/import
export interface SavedConfiguration {
  name: string;
  timestamp: number;
  appState: AppState;
  moduleState: ModuleState;
  messageState: MessageState;
}

// State for processor modules
export interface ProcessorState {
  rotorPositions: Record<string, number>;
  // Add other state properties as needed for other processors
}