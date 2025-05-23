import { useRef } from "react";
import KeyboardWrapper from "./KeyboardWrapper";
import Keyboard from "react-simple-keyboard";

interface SimpleKeyboardProps {
  onKeyPress: (input: string) => void;
}

export function SimpleKeyboard({ onKeyPress }: SimpleKeyboardProps) {
  // Use any here to fix the type issue with the ref
  const keyboard = useRef<any>(null);

  const handleChange = (input: string) => {
    // Only process the last character typed
    if (input.length > 0) {
      const lastChar = input.slice(-1);
      onKeyPress(lastChar);
    }
  };

  return (
    <div className="text-black">
      <KeyboardWrapper keyboardRef={keyboard} onChange={handleChange} />
    </div>
  );
}
