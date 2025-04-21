import { useModuleStore, useMessageStore } from "~/store";
import type { RotorModuleConfig, RotorSetting, Rotor } from "~/store/types";
import { Button } from "~/app/_components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
import { Plus, Minus, RotateCcw, ArrowLeft, ArrowRight } from "lucide-react";
import React, { useEffect } from "react";
import { getAlphabetForCharSet } from "~/store/processors/base";
import { Card, CardContent } from "~/app/_components/ui/card";
import { encryptionPipeline } from "~/store";

interface RotorSectionProps {
  moduleId: string;
}

// All possible rotors
const ALL_ROTORS: Rotor[] = ["I", "II", "III", "IV", "V"];

export default function RotorSection({ moduleId }: RotorSectionProps) {
  // Get module configuration from module store
  const module = useModuleStore((state) =>
    state.modules.find((m) => m.id === moduleId && m.type === "rotors"),
  ) as RotorModuleConfig | undefined;

  // Get module store functions
  const { updateModule, resetProcessors } = useModuleStore();

  // Get the character set from the global store
  const characterSet = useModuleStore((state) => state.characterSet);

  // Force a re-render when message is processed (to update rotor positions)
  useMessageStore((state) => state.output);

  // Get the alphabet length based on the character set
  const alphabetLength = getAlphabetForCharSet(characterSet).length;

  // This single useEffect ensures proper initialization when the component mounts
  useEffect(() => {
    if (!module) return;

    // On initial mount, ensure rotors are properly initialized with their settings
    const rotorProcessor = encryptionPipeline.processors.rotors;
    if (rotorProcessor?.updateState) {
      rotorProcessor.updateState(moduleId, module);
    }

    // Process any existing text to ensure rotor positions are correct
    const messageState = useMessageStore.getState();
    if (messageState.input) {
      messageState.processText();
    }
  }, [moduleId]);

  if (!module || module.type !== "rotors") {
    return (
      <div className="text-muted-foreground p-4 text-center">
        Invalid module configuration
      </div>
    );
  }

  // Get available rotors for selection (those not already selected)
  const availableRotors = ALL_ROTORS.filter(
    (rotor) => !module.rotorSettings.map((s) => s.rotor).includes(rotor),
  );

  // Get current rotor positions directly from the processor
  const rotorPositions = getRotorPositions(moduleId, module);

  // Update rotor settings and process text
  const updateRotorSetting = (
    index: number,
    updates: Partial<RotorSetting>,
  ) => {
    const newSettings = [...module.rotorSettings];
    newSettings[index] = { ...newSettings[index], ...updates };

    updateModule(moduleId, {
      rotorSettings: newSettings,
    } as Partial<RotorModuleConfig>);

    // Directly update processor state
    const rotorProcessor = encryptionPipeline.processors.rotors;
    if (rotorProcessor?.updateState) {
      rotorProcessor.updateState(moduleId, {
        ...module,
        rotorSettings: newSettings,
      });
    }

    // Process text if there is any
    const messageState = useMessageStore.getState();
    if (messageState.input) {
      messageState.processText();
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Rotor Configuration</h3>
      {/* Rotor Configuration */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {module.rotorSettings.map((rotorSetting, index) => {
          // Get position for this rotor
          const rotorKey = `${moduleId}-${index}`;
          const position = rotorPositions[rotorKey] || 0;

          return (
            <Card key={index} className="overflow-hidden">
              <CardContent className="space-y-3 p-3">
                {/* Rotor current position and controls */}
                <div className="flex items-center justify-between gap-2 border-b pb-2">
                  <div>
                    <span className="text-sm font-medium">
                      Rotor {index + 1}: {rotorSetting.rotor}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => {
                        // Manual step backward
                        const newPos =
                          (position - 1 + alphabetLength) % alphabetLength;
                        updateRotorSetting(index, { ringSetting: newPos });
                      }}
                    >
                      <ArrowLeft className="h-3 w-3" />
                    </Button>

                    <div className="bg-muted/20 flex h-7 min-w-7 items-center justify-center rounded border px-1">
                      <span className="font-mono text-xs">{position}</span>
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => {
                        // Manual step forward
                        const newPos = (position + 1) % alphabetLength;
                        updateRotorSetting(index, { ringSetting: newPos });
                      }}
                    >
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex-1 space-y-1.5">
                    <Label htmlFor={`rotor-type-${index}`}>Rotor Type</Label>
                    <Select
                      value={rotorSetting.rotor}
                      onValueChange={(value) =>
                        updateRotorSetting(index, { rotor: value as Rotor })
                      }
                    >
                      <SelectTrigger id={`rotor-type-${index}`}>
                        <SelectValue placeholder="Select Rotor" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Current selected rotor is always available */}
                        <SelectItem
                          key={rotorSetting.rotor}
                          value={rotorSetting.rotor}
                        >
                          Rotor {rotorSetting.rotor}
                        </SelectItem>

                        {/* Show other available rotors */}
                        {availableRotors.map((rotor) => (
                          <SelectItem key={rotor} value={rotor}>
                            Rotor {rotor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <p className="text-sm font-medium">
                      Ring Setting
                      <br />
                      {position}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Position 0-{alphabetLength - 1}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add/remove rotor buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // Only allow adding if we haven't used all rotors
            if (availableRotors.length > 0) {
              const newSettings = [...module.rotorSettings];
              // Add the first available rotor
              newSettings.push({ rotor: availableRotors[0], ringSetting: 0 });
              updateModule(moduleId, {
                rotorSettings: newSettings,
              } as Partial<RotorModuleConfig>);
            }
          }}
          disabled={
            availableRotors.length === 0 || module.rotorSettings.length >= 5
          }
          className="flex items-center"
        >
          <Plus className="mr-1 h-4 w-4" /> Add Rotor
        </Button>

        {module.rotorSettings.length > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newSettings = module.rotorSettings.slice(0, -1);
              updateModule(moduleId, {
                rotorSettings: newSettings,
              } as Partial<RotorModuleConfig>);
            }}
            className="text-destructive flex items-center"
          >
            <Minus className="mr-1 h-4 w-4" /> Remove Rotor
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // Reset all rotors to their initial positions
            const newSettings = module.rotorSettings.map((setting) => ({
              ...setting,
              ringSetting: 0,
            }));
            updateModule(moduleId, {
              rotorSettings: newSettings,
            } as Partial<RotorModuleConfig>);

            // Reset processors and reprocess text
            resetProcessors();

            const messageState = useMessageStore.getState();
            if (messageState.input) {
              messageState.processText();
            }
          }}
          className="ml-auto flex items-center"
        >
          <RotateCcw className="mr-1 h-4 w-4" /> Reset
        </Button>
      </div>
    </div>
  );
}

// Helper function to get rotor positions from processor state
function getRotorPositions(
  moduleId: string,
  module: RotorModuleConfig,
): Record<string, number> {
  const positions: Record<string, number> = {};

  // Initialize with default ring settings
  module.rotorSettings.forEach((setting, idx) => {
    positions[`${moduleId}-${idx}`] = setting.ringSetting || 0;
  });

  // Get the latest processor state
  const rotorProcessor = encryptionPipeline.processors.rotors;
  if (rotorProcessor?.getState) {
    const processorState = rotorProcessor.getState();
    if (processorState.positions) {
      // Update positions from processor state
      Object.keys(processorState.positions).forEach((key) => {
        if (key.startsWith(moduleId)) {
          positions[key] = processorState.positions[key];
        }
      });
    }
  }

  return positions;
}
