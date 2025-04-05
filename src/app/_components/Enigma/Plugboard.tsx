import { useState } from "react";
import {
  plugboardMapping,
  connectPlugboardPair,
  disconnectPlugboardLetter,
} from "~/store/StateManager";
import ModuleWrapper from "./ModuleWrapper";
import { ALPHABET } from "~/data/constants";
import { cn } from "~/lib/utils";


export default function Plugboard() {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  function handleLetterClick(letter: string) {
    if (!selectedLetter) {
      setSelectedLetter(letter);
    } else if (selectedLetter === letter) {
      setSelectedLetter(null);
    } else {
      connectPlugboardPair(selectedLetter, letter);
      setSelectedLetter(null);
    }
  }

  function handleDoubleClick(letter: string) {
    disconnectPlugboardLetter(letter);
  }

  return (
    <ModuleWrapper modName="plugboard">
      <div className="mt-2 text-center text-xs text-gray-500">
        Click two letters to connect them. Double-click to disconnect.
      </div>
      <div className="mb-2 flex flex-wrap justify-center gap-2 p-2">
        {(() => {
          const displayedLetters = new Set<string>();
          const buttons = [];

          ALPHABET.split("").forEach((letter) => {
            if (displayedLetters.has(letter)) return;

            const mapping = plugboardMapping.value;
            const pairedLetter = mapping[letter];
            const isPaired = pairedLetter !== letter;

            if (isPaired) {
              displayedLetters.add(letter);
              displayedLetters.add(pairedLetter);

              buttons.push(
                <button
                  key={`${letter}-${pairedLetter}`}
                  onClick={() => handleLetterClick(letter)}
                  onDoubleClick={() => handleDoubleClick(letter)}
                  className={cn(
                    "min-w-[3.5rem] cursor-pointer px-3 py-2",
                    "flex items-center justify-center",
                    "bg-indigo-500 font-medium text-white",
                    "rounded-lg border border-transparent",
                    "shadow-sm transition-all duration-200",
                  )}
                >
                  {letter}
                  <span className="mx-0.5 text-indigo-200">{` = `}</span>
                  {pairedLetter}
                </button>,
              );
            } else {
              buttons.push(
                <button
                  key={letter}
                  onClick={() => handleLetterClick(letter)}
                  onDoubleClick={() => handleDoubleClick(letter)}
                  className={cn(
                    "h-10 w-10 cursor-pointer",
                    "flex items-center justify-center",
                    "rounded-lg border border-transparent",
                    "transition-all duration-200",

                    selectedLetter === letter
                      ? "scale-105 bg-yellow-300 text-yellow-800 shadow-md"
                      : "bg-zinc-700 text-white hover:bg-zinc-600",
                  )}
                >
                  {letter}
                </button>,
              );
            }
          });

          return buttons;
        })()}
      </div>
    </ModuleWrapper>
  );
}
