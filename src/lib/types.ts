export interface RotorSetting {
  rotor: string;
  ringSetting: number;
}

export interface Control {
  show: boolean;
  active: boolean;
}

export interface Controls {
  rotors: Control;
  reflector: Control; 
  plugboard: Control;
  lampboard: Control;
  keyboard: Control;
  input: Control;
  output: Control;
}

export type Modules = "rotors" | "reflector" | "plugboard" | "lampboard" | "keyboard" | "input" | "output";

export type UIStyle = "modern" | "classic";

export interface MachineState {
  rotorSettings: RotorSetting[];
  plugboardMapping: Record<string, string>;
}

export interface MessagesState {
  input: string;
  output: string;
}

export interface UIState {
  activeLamp: string | null;
  uiStyle: UIStyle;
  controls: Controls;
}

export interface EnigmaState {
  machine: MachineState;
  messages: MessagesState;
  ui: UIState;
  version?: number; 
}

// Configuration export/import
export interface SavedConfiguration {
  name: string;
  timestamp: number;
  state: EnigmaState;
}