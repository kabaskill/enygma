import {signal} from "@preact/signals-react";
import type {RotorSetting, UIStyle} from "~/data/types";
import {ALPHABET, ROTORS} from "~/data/constants";
import {cipher} from "~/utils/enigmaHelpers";

export const input = signal("");
export const output = signal("");
export const rotorSettings = signal<RotorSetting[]>([
  {rotor: "I", ringSetting: 0},
  {rotor: "II", ringSetting: 0},
  {rotor: "III", ringSetting: 0},
]);
export const activeLamp = signal<string | null>(null);
export const controls = signal({
  rotors: {show: true, active: true},
  reflector: {show: true, active: true},
  plugboard: {show: true, active: true},
  lampboard: {show: true, active: true},
  keyboard: {show: true, active: true},
  input: {show: true, active: true},
  output: {show: true, active: true},
});

export const uiStyle = signal<UIStyle>("modern");

const defaultPlugboardMapping: Record<string, string> = {};

ALPHABET.split("").forEach((letter) => {
  defaultPlugboardMapping[letter] = letter;
});

export const plugboardMapping = signal<Record<string, string>>(defaultPlugboardMapping);

export function connectPlugboardPair(letter1: string, letter2: string) {
  const newMapping = {...plugboardMapping.value};

  const oldConnection1 = newMapping[letter1];
  const oldConnection2 = newMapping[letter2];

  if (oldConnection1 !== letter1) {
    newMapping[oldConnection1] = oldConnection1;
  }

  if (oldConnection2 !== letter2) {
    newMapping[oldConnection2] = oldConnection2;
  }

  newMapping[letter1] = letter2;
  newMapping[letter2] = letter1;

  plugboardMapping.value = newMapping;
}

export function disconnectPlugboardLetter(letter: string) {
  const newMapping = {...plugboardMapping.value};
  const connectedTo = newMapping[letter];

  newMapping[letter] = letter;
  newMapping[connectedTo] = connectedTo;

  plugboardMapping.value = newMapping;
}

export function resetPlugboard() {
  plugboardMapping.value = {...defaultPlugboardMapping};
}

export function getPlugboardSubstitution(letter: string): string {
  return plugboardMapping.value[letter] || letter;
}

export function setInput(value: string) {
  input.value = value;
}

export function setOutput(value: string) {
  output.value = value;
}

export function setRotorSettings(settings: RotorSetting[]) {
  rotorSettings.value = settings;
}

export function setActiveLamp(lamp: string | null) {
  activeLamp.value = lamp;
}

export function getAvailableRotors(currentRotor?: string): string[] {
  const usedRotors = new Set(rotorSettings.value.map(setting => setting.rotor));
  
  if (currentRotor) {
    usedRotors.delete(currentRotor);
  }
  
  return Object.keys(ROTORS).filter(rotor => !usedRotors.has(rotor));
}

export function addRotor() {
  const availableRotors = getAvailableRotors();
  if (availableRotors.length === 0) return; 
  
  const newRotor: RotorSetting = {
    rotor: availableRotors[0],
    ringSetting: 0
  };
  
  rotorSettings.value = [...rotorSettings.value, newRotor];
}

export function removeRotor(index: number) {
  if (rotorSettings.value.length <= 1) return; 
  
  const newSettings = [...rotorSettings.value];
  newSettings.splice(index, 1);
  rotorSettings.value = newSettings;
}

export function updateRotor(index: number, newRotor: string) {
  const newSettings = [...rotorSettings.value];
  
  const usedRotors = new Set(
    rotorSettings.value
      .filter((_, i) => i !== index)
      .map(setting => setting.rotor)
  );
  
  if (usedRotors.has(newRotor)) return;
  
  newSettings[index] = {...newSettings[index], rotor: newRotor};
  rotorSettings.value = newSettings;
}

export function processChar(character: string) {
  const char = character.toUpperCase();
  if (ALPHABET.includes(char) || char === " ") {
    const plugboardPairs = Object.entries(plugboardMapping.value)
      .filter(([key, value]) => key < value) 
      .map(([from, to]) => ({from, to}));

    const cipheredChar = char === " " ? " " : cipher(char, rotorSettings.value, plugboardPairs);
    const newInput = input.value + char;
    const newOutput = output.value + cipheredChar;
    setInput(newInput);
    setOutput(newOutput);
    setActiveLamp(cipheredChar.toUpperCase());

    if (char !== " " && rotorSettings.value.length > 0) {
      const newSettings = [...rotorSettings.value];
      
      newSettings[0].ringSetting = (newSettings[0].ringSetting + 1) % 26;
      
      for (let i = 0; i < newSettings.length - 1; i++) {
        if (newSettings[i].ringSetting === 0) {
          newSettings[i+1].ringSetting = (newSettings[i+1].ringSetting + 1) % 26;
        } else {
          break; 
        }
      }
      
      setRotorSettings(newSettings);
    }
  }
}

export function reset() {
  input.value = "";
  output.value = "";
  rotorSettings.value = [
    {rotor: "I", ringSetting: 0},
    {rotor: "II", ringSetting: 0},
    {rotor: "III", ringSetting: 0},
  ];
  plugboardMapping.value = {...defaultPlugboardMapping};
  activeLamp.value = null;
  controls.value = {
    rotors: {show: true, active: true},
    reflector: {show: true, active: true},
    plugboard: {show: true, active: true},
    lampboard: {show: true, active: true},
    keyboard: {show: true, active: true},
    input: {show: true, active: true},
    output: {show: true, active: true},
  };
}
