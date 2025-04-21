import { useModuleStore, useMessageStore, encryptionPipeline } from "~/store";
import type { RotorModuleConfig, RotorSetting, Rotor } from "~/store/types";
import { Button } from "~/app/_components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";
import { Label } from "~/app/_components/ui/label";
import { Plus, Minus, RotateCcw, ArrowLeft, ArrowRight } from "lucide-react";
import { getAlphabetForCharSet } from "~/store/processors/base";
import { Card, CardContent } from "~/app/_components/ui/card";

interface RotorSectionProps {
  moduleId: string;
}

// All possible rotors
const ALL_ROTORS: Rotor[] = ["I", "II", "III", "IV", "V"];

export default function RotorSection({ moduleId }: RotorSectionProps) {
  // Get the module data and store functions directly from zustand
  const { modules, updateModule, resetProcessors, characterSet } =
    useModuleStore();
  const { processText } = useMessageStore();

  // Find the rotor module
  const module = modules.find(
    (m) => m.id === moduleId && m.type === "rotors",
  ) as RotorModuleConfig ;

  if (!module || module.type !== "rotors") {
    return (
      <div className="text-muted-foreground p-4 text-center">
        Invalid module configuration
      </div>
    );
  }

  // Get the alphabet length based on the character set
  const alphabetLength = getAlphabetForCharSet(characterSet).length;

  // Get the latest positions directly from processor
  const rotorState = encryptionPipeline.processors.rotors.getState();
  const rotorPositions = rotorState.positions || {};

  // Get available rotors for selection (those not already selected)
  const availableRotors = ALL_ROTORS.filter(
    (rotor) => !module.rotorSettings.map((s) => s.rotor).includes(rotor),
  );

  // Update a rotor setting and process text
  function updateRotorSetting(index: number, updates: Partial<RotorSetting>) {
    const newSettings = [...module.rotorSettings];
    newSettings[index] = { ...newSettings[index], ...updates };

    updateModule(moduleId, {
      rotorSettings: newSettings,
    } as Partial<RotorModuleConfig>);

    // Update processor state if needed
    const rotorProcessor = encryptionPipeline.processors.rotors;
    if (rotorProcessor.updateState) {
      rotorProcessor.updateState(moduleId, {
        ...module,
        rotorSettings: newSettings,
      });
    }

    processText();
  }

  // Manual step a rotor
  function stepRotor(index: number, steps: number) {
    // Get current position from processor state
    const rotorKey = `${moduleId}-${index}`;
    const currentPosition =
      rotorPositions[rotorKey] || module.rotorSettings[index].ringSetting || 0;

    // Calculate new position
    const newPosition =
      (currentPosition + steps + alphabetLength) % alphabetLength;

    // Update the module config
    const newSettings = [...module.rotorSettings];
    newSettings[index] = { ...newSettings[index], ringSetting: newPosition };
    updateModule(moduleId, {
      rotorSettings: newSettings,
    } as Partial<RotorModuleConfig>);

    // Update the processor state
    const rotorProcessor = encryptionPipeline.processors.rotors;
    if (rotorProcessor.updateState) {
      rotorProcessor.updateState(moduleId, {
        ...module,
        rotorSettings: newSettings,
      });
    }

    // Process the text to see the update
    processText();
  }

  // Reset all rotors to position 0
  function resetRotors() {
    // Update all rotor settings to 0
    const newSettings = module.rotorSettings.map((setting) => ({
      ...setting,
      ringSetting: 0,
    }));

    // Update module config
    updateModule(moduleId, {
      rotorSettings: newSettings,
    } as Partial<RotorModuleConfig>);

    // Reset processors
    resetProcessors();

    // Process text
    processText();
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Rotor Configuration</h3>

      {/* Rotor Configuration */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {module.rotorSettings.map((rotorSetting, index) => {
          // Get position from processor state if available
          const rotorKey = `${moduleId}-${index}`;
          const position =
            rotorPositions[rotorKey] !== undefined
              ? rotorPositions[rotorKey]
              : rotorSetting.ringSetting || 0;

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
                      onClick={() => stepRotor(index, -1)}
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
                      onClick={() => stepRotor(index, 1)}
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
              processText();
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
              processText();
            }}
            className="text-destructive flex items-center"
          >
            <Minus className="mr-1 h-4 w-4" /> Remove Rotor
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={resetRotors}
          className="ml-auto flex items-center"
        >
          <RotateCcw className="mr-1 h-4 w-4" /> Reset
        </Button>
      </div>
    </div>
  );
}
