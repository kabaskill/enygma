import { useMessageStore, useModuleStore } from '~/store';
import type { ModuleConfig } from '~/store/types';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "~/app/_components/ui/card";
import { Button } from "~/app/_components/ui/button";
import { Switch } from "~/app/_components/ui/switch";
import { 
  Eye, 
  EyeOff, 
  Minimize2, 
  Maximize2, 
  X, 
  Power 
} from "lucide-react";

interface ModuleWrapperProps {
  module: ModuleConfig;
  children: React.ReactNode;
}

export default function ModuleWrapper({ module, children }: ModuleWrapperProps) {
  const { processingHistory } = useMessageStore();
  const { updateModule, removeModule } = useModuleStore();
  const [inputOutput, setInputOutput] = useState<{ input: string[], output: string[] }>({
    input: [],
    output: []
  });
  
  // Extract module-specific processing history
  useEffect(() => {
    if (module.showInputOutput) {
      const moduleHistory = processingHistory.filter(ctx => ctx.moduleId === module.id);
      
      // Extract input/output for this module
      const input = moduleHistory.map(ctx => ctx.inputChar);
      const output = moduleHistory.map(ctx => ctx.outputChar);
      
      setInputOutput({ input, output });
    }
  }, [processingHistory, module.id, module.showInputOutput]);
  
  const toggleEnabled = () => {
    updateModule(module.id, { enabled: !module.enabled });
  };
  
  const toggleMinimized = () => {
    updateModule(module.id, { minimized: !module.minimized });
  };
  
  const toggleShowInputOutput = () => {
    updateModule(module.id, { showInputOutput: !module.showInputOutput });
  };
  
  return (
    <Card className={`${!module.enabled ? 'opacity-60' : ''}`}>
      <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-medium">
          {module.type.toUpperCase()}
        </CardTitle>
        <div className="flex items-center space-x-1">
          <Switch 
            checked={module.enabled}
            onCheckedChange={toggleEnabled}
            aria-label={module.enabled ? 'Disable' : 'Enable'}
            className="size-sm"
          />
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleShowInputOutput}
            className="h-7 w-7"
          >
            {module.showInputOutput ? 
              <Eye className="h-4 w-4" /> : 
              <EyeOff className="h-4 w-4" />
            }
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleMinimized}
            className="h-7 w-7"
          >
            {module.minimized ? 
              <Maximize2 className="h-4 w-4" /> : 
              <Minimize2 className="h-4 w-4" />
            }
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => removeModule(module.id)}
            className="h-7 w-7 text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      {!module.minimized && (
        <>
          <CardContent className="p-3 pt-0">
            {children}
          </CardContent>
          
          {module.showInputOutput && (
            <div className="border-t p-3 grid grid-cols-2 gap-3">
              <div>
                <h4 className="text-sm font-medium mb-1">Input</h4>
                <div className="flex flex-wrap gap-1 overflow-x-auto max-h-16 p-1 bg-muted/20 rounded">
                  {inputOutput.input.map((char, idx) => (
                    <span 
                      key={`input-${idx}`} 
                      className="inline-block min-w-6 h-6 rounded border text-center"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Output</h4>
                <div className="flex flex-wrap gap-1 overflow-x-auto max-h-16 p-1 bg-muted/20 rounded">
                  {inputOutput.output.map((char, idx) => (
                    <span 
                      key={`output-${idx}`} 
                      className="inline-block min-w-6 h-6 rounded border text-center"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
}