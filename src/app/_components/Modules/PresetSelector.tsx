import { useAppStore, useModuleStore } from '~/store';
import React, { useState } from 'react';
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "~/app/_components/ui/dialog";
import { 
  Save, 
  Trash2, 
  RefreshCcw, 
  Plus 
} from "lucide-react";

export default function PresetSelector() {
  const [newPresetName, setNewPresetName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const { 
    presets, 
    activePreset, 
    loadPreset, 
    createPreset, 
    updatePreset, 
    deletePreset,
  } = useAppStore();
  
  const { modules } = useModuleStore();
  
  const handleLoadPreset = (name: string) => {
    loadPreset(name);
  };
  
  const handleCreatePreset = () => {
    if (newPresetName && newPresetName.trim() !== '') {
      createPreset(newPresetName.trim());
      setNewPresetName('');
      setIsCreating(false);
    }
  };
  
  const handleUpdatePreset = () => {
    if (activePreset && activePreset !== 'Custom') {
      updatePreset(activePreset);
    }
  };
  
  const handleDeletePreset = () => {
    if (activePreset && activePreset !== 'Custom') {
      deletePreset(activePreset);
    }
  };
  
  // Check if current configuration matches active preset
  const isModified = () => {
    if (activePreset === 'Custom') return false;
    
    const presetModules = presets[activePreset];
    if (!presetModules || presetModules.length !== modules.length) return true;
    
    // Simple deep comparison - might need more sophisticated comparison in real app
    return JSON.stringify(presetModules) !== JSON.stringify(modules);
  };
  
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Presets</h4>
      
      <div className="flex items-center gap-2">
        <Select 
          value={activePreset} 
          onValueChange={handleLoadPreset}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Preset" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Custom" disabled={activePreset !== 'Custom'}>
              {isModified() ? `${activePreset} (Modified)` : 'Custom'}
            </SelectItem>
            {Object.keys(presets).map(name => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleUpdatePreset}
          disabled={activePreset === 'Custom' || !isModified()}
          title="Update Preset"
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleDeletePreset}
          disabled={activePreset === 'Custom' || Object.keys(presets).indexOf(activePreset) < 3}
          className="text-destructive"
          title="Delete Preset"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center">
              <Save className="mr-1 h-4 w-4" /> Save As New
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Save Configuration as Preset</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input 
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                placeholder="Preset name"
                className="w-full"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                onClick={handleCreatePreset}
                disabled={!newPresetName.trim()}
              >
                Save Preset
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}