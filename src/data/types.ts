export interface RotorSetting {
  rotor: string;
  ringSetting: number;
}


export interface Controls {
  rotors: Control;
  plugboard: Control;
  lampboard: Control;
  keyboard: Control;
  input: Control;
  output: Control;
}

export interface Control {
  show: boolean;
  active: boolean;
}

export type Modules = "rotors" | "reflector" | "plugboard" | "lampboard" | "keyboard" | "input" | "output";

export type UIStyle = "modern" | "classic";