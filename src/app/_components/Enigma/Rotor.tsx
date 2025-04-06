import { X } from "lucide-react";
import {
  rotorSettings,
  setRotorSettings,
  updateRotor,
  removeRotor,
  getAvailableRotors,
} from "~/store/StateManager";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface RotorProps {
  index: number;
}

export default function Rotor({ index }: RotorProps) {
  const currentRotor = rotorSettings.value[index].rotor;
  const availableRotors = getAvailableRotors(currentRotor);
  const reverseIndex = rotorSettings.value.length - index - 1;
  const rotorNumber = index + 1;

  // Updated to work with the Select component
  function handleRotorTypeChange(value: string) {
    updateRotor(index, value);
  }

  function handleRingSettingChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newSettings = [...rotorSettings.value];
    newSettings[reverseIndex].ringSetting = parseInt(e.target.value);
    setRotorSettings(newSettings);
  }

  function handleRemove() {
    removeRotor(index);
  }

  return (
    <Card className="p-4 shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Rotor {rotorNumber}</h3>
        {rotorSettings.value.length > 1 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="text-destructive hover:text-destructive/80 cursor-pointer"
            title="Remove rotor"
          >
            <X />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor={`rotor-type-${index}`}
            className="text-sm font-medium"
          >
            Type
      

          <Select value={currentRotor} onValueChange={handleRotorTypeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select rotor type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={currentRotor}>{currentRotor}</SelectItem>
                {availableRotors
                  .filter((rotor) => rotor !== currentRotor)
                  .map((rotorType) => (
                    <SelectItem key={rotorType} value={rotorType}>
                      {rotorType}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          </Label>
        </div>

        <div className="flex items-center gap-3">
          <Label
            htmlFor={`ring-setting-${index}`}
            className="text-sm font-medium"
          >
            Ring
          </Label>
          <Input
            id={`ring-setting-${index}`}
            type="number"
            min="0"
            max="25"
            value={rotorSettings.value[reverseIndex].ringSetting}
            onChange={handleRingSettingChange}
            
          />
        </div>
      </div>
    </Card>
  );
}
