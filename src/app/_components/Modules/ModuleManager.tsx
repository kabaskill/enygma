import { useAppStore, useModuleStore } from "~/store";
import type { ModuleConfig } from "~/store/types";
import ModuleWrapper from "./ModuleWrapper";
import RotorSection from "./Enigma/RotorSection";
import Plugboard from "./Enigma/Plugboard";
import PresetSelector from "./PresetSelector";
import { Button } from "../../_components/ui/button";
import { PlusCircle } from "lucide-react";
import React from "react";

export default function ModuleManager() {
  const { modules, addModule } = useModuleStore();
  const { activePreset, presets } = useAppStore();

  // Render appropriate component based on module type
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

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <PresetSelector />

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Add Module</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => addModule("rotors")}
              className="flex items-center"
            >
              <PlusCircle className="mr-1 h-3 w-3" /> Rotors
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addModule("plugboard")}
              className="flex items-center"
            >
              <PlusCircle className="mr-1 h-3 w-3" /> Plugboard
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addModule("reflector")}
              className="flex items-center"
            >
              <PlusCircle className="mr-1 h-3 w-3" /> Reflector
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addModule("shifter")}
              className="flex items-center"
            >
              <PlusCircle className="mr-1 h-3 w-3" /> Caesar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addModule("substitution")}
              className="flex items-center"
            >
              <PlusCircle className="mr-1 h-3 w-3" /> Substitution
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addModule("vigenere")}
              className="flex items-center"
            >
              <PlusCircle className="mr-1 h-3 w-3" /> Vigenère
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addModule("transposition")}
              className="flex items-center"
            >
              <PlusCircle className="mr-1 h-3 w-3" /> Transposition
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {modules.map((module) => (
          <ModuleWrapper key={module.id} module={module}>
            {renderModuleContent(module)}
          </ModuleWrapper>
        ))}
      </div>
    </div>
  );
}
