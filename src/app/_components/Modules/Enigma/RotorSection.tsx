import { useModuleStore } from '~/store';
import type { RotorModuleConfig, RotorSetting } from '~/store/types';
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
import { Plus, Minus } from "lucide-react";

interface RotorSectionProps {
  moduleId: string;
}

export default function RotorSection({ moduleId }: RotorSectionProps) {
  // Get the module from the store
  const module = useModuleStore(state => 
    state.modules.find(m => m.id === moduleId && m.type === "rotors")
  ) as RotorModuleConfig | undefined;
  
  const { updateModule } = useModuleStore();
  
  if (!module || module.type !== "rotors") {
    return <div className="p-4 text-center text-muted-foreground">Invalid module configuration</div>;
  }
  
  const updateRotorSetting = (index: number, updates: Partial<RotorSetting>) => {
    const newSettings = [...module.rotorSettings];
    newSettings[index] = { ...newSettings[index], ...updates };
    
    updateModule(moduleId, { 
      rotorSettings: newSettings 
    } as Partial<RotorModuleConfig>);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Rotor Configuration</h3>
      
      <div className="space-y-3">
        {module.rotorSettings.map((rotorSetting, index) => (
          <div key={index} className="flex flex-col sm:flex-row gap-3 p-3 bg-muted/20 rounded-md">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor={`rotor-type-${index}`}>Rotor Type</Label>
              <Select
                value={rotorSetting.rotor}
                onValueChange={(value) => updateRotorSetting(index, { rotor: value as any })}
              >
                <SelectTrigger id={`rotor-type-${index}`}>
                  <SelectValue placeholder="Select Rotor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="I">Rotor I</SelectItem>
                  <SelectItem value="II">Rotor II</SelectItem>
                  <SelectItem value="III">Rotor III</SelectItem>
                  <SelectItem value="IV">Rotor IV</SelectItem>
                  <SelectItem value="V">Rotor V</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 space-y-1.5">
              <Label htmlFor={`ring-setting-${index}`}>Ring Setting</Label>
              <Input
                id={`ring-setting-${index}`}
                type="number"
                min="0"
                max="25"
                value={rotorSetting.ringSetting}
                onChange={(e) => updateRotorSetting(index, { 
                  ringSetting: Math.max(0, Math.min(25, parseInt(e.target.value) || 0)) 
                })}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Position 0-25</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline"
          size="sm"
          onClick={() => {
            const newSettings = [...module.rotorSettings];
            newSettings.push({ rotor: "I", ringSetting: 0 });
            updateModule(moduleId, { rotorSettings: newSettings } as Partial<RotorModuleConfig>);
          }}
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
              updateModule(moduleId, { rotorSettings: newSettings } as Partial<RotorModuleConfig>);
            }}
            className="flex items-center text-destructive"
          >
            <Minus className="mr-1 h-4 w-4" /> Remove Rotor
          </Button>
        )}
      </div>
    </div>
  );
}