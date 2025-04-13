export type ModuleType =
  | "rotors"
  | "plugboard"
  | "reflector"
  | "shifter"
  | "substitution"
  | "vigenere"
  | "transposition";

export interface BaseModuleConfig {
  id: string;
  type: ModuleType;
  enabled: boolean;
}

export interface RotorModuleConfig extends BaseModuleConfig {
  type: "rotors";
  rotorSettings: RotorSetting[];
}

export interface PlugboardModuleConfig extends BaseModuleConfig {
  type: "plugboard";
  mapping: Record<string, string>;
}

export interface ReflectorModuleConfig extends BaseModuleConfig {
  type: "reflector";
  reflectorType: string; // Could be an enum of different reflector wirings
}

export interface ShifterModuleConfig extends BaseModuleConfig {
  type: "shifter";
  shift: number;
}

export interface SubstitutionModuleConfig extends BaseModuleConfig {
  type: "substitution";
  mapping: Record<string, string>;
}

export interface VigenereModuleConfig extends BaseModuleConfig {
  type: "vigenere";
  keyword: string;
}

export interface TranspositionModuleConfig extends BaseModuleConfig {
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

export interface RotorSetting {
  rotor: Rotor;
  ringSetting: number;
}

export type Rotor = "I" | "II" | "III" | "IV" | "V";
export type UIStyle = "classic" | "modern";

export interface Control {
  show: boolean;
  active: boolean;
}

export interface MessagesState {
  input: string;
  output: string;
}

export interface UIState {
  activeLamp: string | null;
  uiStyle: UIStyle;
}

// Main state interface
export interface CipherState {
  activePreset: string;
  presets: Record<string, ModuleConfig[]>;
  moduleChain: ModuleConfig[];
  messages: MessagesState;
  ui: UIState;
  version?: number;
}

// Configuration export/import
export interface SavedConfiguration {
  name: string;
  timestamp: number;
  state: CipherState;
}
