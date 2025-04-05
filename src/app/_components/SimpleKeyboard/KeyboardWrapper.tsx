import { useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import type { RefObject } from "react";

interface KeyboardWrapperProps {
  onChange: (input: string) => void;
  keyboardRef: RefObject<typeof Keyboard>;
}

export default function KeyboardWrapper({
  onChange,
  keyboardRef,
}: KeyboardWrapperProps) {
  const [layoutName, setLayoutName] = useState("default");

  const onKeyPress = (button: string) => {
    if (button === "{shift}" || button === "{lock}") {
      setLayoutName(layoutName === "default" ? "shift" : "default");
    } else if (button !== "{space}" && button !== "{bksp}") {
      // Pass only regular keys to the onChange handler
      onChange(button);
    } else if (button === "{space}") {
      onChange(" ");
    }
  };

  return (
    <Keyboard
      keyboardRef={(r) => (keyboardRef.current = r)}
      layoutName={layoutName}
      onChange={() => {}}
      onKeyPress={onKeyPress}
      theme="hg-theme-default hg-layout-default myTheme"
    />
  );
}
