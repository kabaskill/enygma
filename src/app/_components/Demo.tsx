"use client";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { cipher } from "~/lib/enigmaHelpers";
import { plugboardMapping, rotorSettings } from "~/store/StateManager";

export default function Demo() {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = event.target.value;
    setInput(value);

    // Process each character through the Enigma machine
    const processedOutput = value.split('')
      .map(char => {
        if (!char || !char.trim()) return ' ';
        
        // Get current settings from the state
        const currentRotorSettings = rotorSettings.value;
        const currentPlugboard = plugboardMapping.value;
        
        // Apply the cipher without updating state
        return cipher(
          char,
          currentRotorSettings,
          currentPlugboard
        );
      })
      .join('');

    // Simulate a processing delay
    setTimeout(() => {
      setOutput(processedOutput);
    }, 1000);
  }

  return (
    <div className="flex w-full flex-col gap-8 px-4 py-16 text-center">

      <div className="grid md:grid-cols-2 gap-8">
        <Textarea placeholder="Input" defaultValue={input} onChange={handleChange} />
        <Textarea placeholder="Output" defaultValue={output} />
      </div>
    </div>
  );
}
