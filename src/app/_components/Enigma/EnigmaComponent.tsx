import { useEffect, useRef } from "react";
import {
  input,
  output,
  setInput,
  setActiveLamp,
  processChar,
} from "../../../store/StateManager";
import Lampboard from "./Lampboard";
import Plugboard from "./Plugboard";
import KeyboardToggle from "./KeyboardToggle";
import Reset from "./Reset";
import RotorSection from "./RotorSection";

export default function EnigmaComponent() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const newInput = event.target.value;
    if (newInput.length > input.value.length) {
      const lastChar = newInput.slice(-1).toUpperCase();
      processChar(lastChar);
    } else {
      setInput(newInput);
    }
  }

  function handleButtonPress(char: string) {
    processChar(char);
  }

  useEffect(() => {
    function handleKeyUp() {
      setActiveLamp(null);
    }

    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left column */}
      <div className=" lg:col-span-2">
        <div className="flex flex-col items-center">
          <div className="mx-auto w-full max-w-3xl space-y-4">
            <RotorSection />
            <Lampboard />
            <KeyboardToggle onButtonPress={handleButtonPress} />
            <Plugboard />
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="enigma-panel flex flex-col gap-6">
        <Reset />

        <div className="space-y-2">
          <label htmlFor="input-area" className="enigma-label block">
            Input:
          </label>
          <textarea
            ref={textareaRef}
            name="input-area"
            id="input-area"
            className="enigma-input min-h-[120px] w-full resize-none font-mono"
            value={input.value}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <h2 className="enigma-label">Output:</h2>
          <div className="enigma-input min-h-[120px] overflow-auto font-mono text-wrap">
            {output.value}
          </div>
        </div>
      </div>
    </section>
  );
}
