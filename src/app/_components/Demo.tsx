"use client";
import { useState } from "react";
import { Textarea } from "./ui/textarea";

export default function Demo() {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = event.target.value;
    setInput(value);

    

    // Simulate a processing delay
    setTimeout(() => {
      setOutput(value);
    }, 1000);
  }

  return (
    <div className="flex w-full max-w-6xl flex-col gap-8 px-4 py-16 text-center">
      <h3 className="text-4xl font-bold">Test it out!</h3>

      <div className="grid w-full max-w-6xl grid-cols-2 gap-8">
        <Textarea placeholder="Input" value={input} onChange={handleChange} />
        <Textarea placeholder="Output" value={output} />
      </div>
    </div>
  );
}
