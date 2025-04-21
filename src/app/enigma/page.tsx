"use client";
import { useModuleStore, useAppStore, useMessageStore } from "~/store";
import MessageArea from "~/app/_components/Modules/MessageArea";
import RotorSection from "~/app/_components/Modules/Enigma/RotorSection";
import Plugboard from "~/app/_components/Modules/Enigma/Plugboard";
import ModuleWrapper from "../_components/Modules/ModuleWrapper";
import type { ModuleConfig, CharacterSetOption } from "~/store/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";
import { Label } from "~/app/_components/ui/label";
import { Button } from "~/app/_components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function EnigmaPage() {
  const { modules, addModule, characterSet, setCharacterSet } =
    useModuleStore();
  const { activePreset, presets, loadPreset } = useAppStore();
  const { setText } = useMessageStore();

  // Function to render the appropriate module content based on type
  const renderModuleContent = (module: ModuleConfig) => {
    switch (module.type) {
      case "rotors":
        return <RotorSection moduleId={module.id} />;
      case "plugboard":
        return <Plugboard moduleId={module.id} />;
      case "reflector":
        return (
          <div className="text-muted-foreground p-4 text-center">
            Reflector Component (TBD)
          </div>
        );
      case "shifter":
        return (
          <div className="text-muted-foreground p-4 text-center">
            Caesar Shifter Component (TBD)
          </div>
        );
      case "substitution":
        return (
          <div className="text-muted-foreground p-4 text-center">
            Substitution Component (TBD)
          </div>
        );
      case "vigenere":
        return (
          <div className="text-muted-foreground p-4 text-center">
            Vigenere Component (TBD)
          </div>
        );
      case "transposition":
        return (
          <div className="text-muted-foreground p-4 text-center">
            Transposition Component (TBD)
          </div>
        );
      default:
        return (
          <div className="text-muted-foreground p-4 text-center">
            Unknown module type
          </div>
        );
    }
  };

  // Check if current configuration matches active preset
  const isModified = () => {
    if (activePreset === "Custom") return false;

    const presetModules = presets[activePreset];
    if (!presetModules || presetModules.length !== modules.length) return true;

    // Simple deep comparison - might need more sophisticated comparison in real app
    return JSON.stringify(presetModules) !== JSON.stringify(modules);
  };

  // Character set options
  const characterSetOptions: { value: CharacterSetOption; label: string }[] = [
    { value: "uppercase", label: "Uppercase (A-Z)" },
    { value: "full", label: "Full (A-Z, a-z, 0-9)" },
    { value: "extended", label: "Extended (A-Z, a-z, 0-9, symbols)" },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-auto p-4 pt-0">
      {/* Top Controls Section */}

      <Link href="/" className="bg-accent-foreground text-primary text-2xl font-bold">
        BACK
      </Link>

      <div className="bg-card rounded-lg border p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          {/* Preset Selection */}
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="preset-selector">Cipher Preset</Label>
            <Select
              value={activePreset}
              onValueChange={(value) => loadPreset(value)}
            >
              <SelectTrigger id="preset-selector" className="w-full">
                <SelectValue placeholder="Select Preset">
                  {isModified() ? `${activePreset} (Modified)` : activePreset}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Custom">Custom</SelectItem>
                {Object.keys(presets).map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">
              Load a predefined cipher configuration
            </p>
          </div>

          {/* Character Set Selection */}
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="character-set">Character Set</Label>
            <Select
              value={characterSet}
              onValueChange={(value) =>
                setCharacterSet(value as CharacterSetOption)
              }
            >
              <SelectTrigger id="character-set">
                <SelectValue placeholder="Select Character Set" />
              </SelectTrigger>
              <SelectContent>
                {characterSetOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">
              Sets the alphabet used for encryption (affects all modules)
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[300px_1fr]">
        {/* Sidebar with Module Management */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Add Modules</h2>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addModule("rotors")}
                  className="flex items-center"
                >
                  <PlusCircle className="mr-1 h-4 w-4" /> Rotors
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addModule("plugboard")}
                  className="flex items-center"
                >
                  <PlusCircle className="mr-1 h-4 w-4" /> Plugboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addModule("reflector")}
                  className="flex items-center"
                >
                  <PlusCircle className="mr-1 h-4 w-4" /> Reflector
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addModule("shifter")}
                  className="flex items-center"
                >
                  <PlusCircle className="mr-1 h-4 w-4" /> Caesar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addModule("substitution")}
                  className="flex items-center"
                >
                  <PlusCircle className="mr-1 h-4 w-4" /> Substitution
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addModule("vigenere")}
                  className="flex items-center"
                >
                  <PlusCircle className="mr-1 h-4 w-4" /> Vigenère
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addModule("transposition")}
                  className="flex items-center"
                >
                  <PlusCircle className="mr-1 h-4 w-4" /> Transposition
                </Button>
              </div>
            </div>
          </div>

          {/* Example Text */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Sample Text</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setText("HELLO WORLD")}
              >
                Hello World
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() =>
                  setText("THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG")
                }
              >
                Quick Brown Fox
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setText("ENIGMA MACHINE")}
              >
                Enigma Machine
              </Button>
            </div>
          </div>

          {/* Input/Output */}
          <MessageArea />
        </div>

        {/* Active Modules */}
        <div className="space-y-8">
          {/* Modules List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Active Modules</h2>
            {modules.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p>No modules are configured. Add modules from the sidebar.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {modules.map((module) => (
                  <ModuleWrapper key={module.id} module={module}>
                    {renderModuleContent(module)}
                  </ModuleWrapper>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
