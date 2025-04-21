import { useModuleStore } from '~/store';
import type { PlugboardModuleConfig } from '~/store/types';
import { constants } from '~/store/constants';
import React, { useState } from 'react';
import { Button } from "~/app/_components/ui/button";
import { Badge } from "~/app/_components/ui/badge";

interface PlugboardProps {
  moduleId: string;
}

export default function Plugboard({ moduleId }: PlugboardProps) {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const module = useModuleStore((state) =>
    state.modules.find((m) => m.id === moduleId && m.type === "plugboard"),
  ) as PlugboardModuleConfig | undefined;

  const connectPlugboardPair = useModuleStore(
    (state) => state.connectPlugboardPair,
  );
  const disconnectPlugboardLetter = useModuleStore(
    (state) => state.disconnectPlugboardLetter,
  );
  const resetPlugboard = useModuleStore((state) => state.resetPlugboard);

  if (!module || module.type !== "plugboard") {
    return <div className="p-4 text-center text-muted-foreground">Invalid module configuration</div>;
  }

  // Handle clicking on a letter in the plugboard
  const handleLetterClick = (letter: string) => {
    // If no letter is selected, select this letter
    if (!selectedLetter) {
      setSelectedLetter(letter);
      return;
    }

    // If the same letter was clicked again, deselect it
    if (selectedLetter === letter) {
      setSelectedLetter(null);
      return;
    }

    // If a different letter was selected, connect them
    connectPlugboardPair(moduleId, selectedLetter, letter);
    setSelectedLetter(null);
  };

  // Handle resetting a connection for a specific letter
  const handleResetConnection = (letter: string, event: React.MouseEvent) => {
    event.stopPropagation();
    disconnectPlugboardLetter(moduleId, letter);
  };

  // Get connected pair for a letter
  const getConnectedLetter = (letter: string) => {
    return module.mapping[letter];
  };

  // Determine if a letter is connected to another letter
  const isConnected = (letter: string) => {
    return !!module.mapping[letter];
  };

  // All possible letters
  const letters = constants.ALPHABET.split("");

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-9 gap-1 sm:gap-2">
        {letters.map((letter) => (
          <Button
            key={letter}
            variant={selectedLetter === letter ? "default" : isConnected(letter) ? "secondary" : "outline"}
            size="sm"
            className="relative p-0 h-8 sm:h-10 w-full"
            onClick={() => handleLetterClick(letter)}
          >
            {letter}
            {isConnected(letter) && (
              <Badge 
                className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center"
                variant="destructive"
                onClick={(e) => handleResetConnection(letter, e)}
              >
                ×
              </Badge>
            )}
          </Button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm">
          {selectedLetter ? (
            <span>Select a letter to connect with <strong>{selectedLetter}</strong></span>
          ) : (
            <span>Connected pairs: {Object.keys(module.mapping).length / 2}</span>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => resetPlugboard(moduleId)}
          disabled={Object.keys(module.mapping).length === 0}
        >
          Reset All
        </Button>
      </div>
    </div>
  );
}