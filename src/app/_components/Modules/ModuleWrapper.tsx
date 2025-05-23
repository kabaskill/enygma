import { useMessageStore, useModuleStore } from "~/store";
import type { ModuleConfig } from "~/store/types";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { Button } from "~/app/_components/ui/button";
import { Switch } from "~/app/_components/ui/switch";
import { Eye, EyeOff, Minimize2, Maximize2, X } from "lucide-react";

interface ModuleWrapperProps {
  module: ModuleConfig;
  children?: React.ReactNode;
}

export default function ModuleWrapper({
  module,
  children,
}: ModuleWrapperProps) {
  const { processingHistory } = useMessageStore();
  const { updateModule, removeModule } = useModuleStore();
  const [inputOutput, setInputOutput] = useState<{
    input: string[];
    output: string[];
  }>({
    input: [],
    output: [],
  });

  // Extract module-specific processing history
  useEffect(() => {
    if (module.showInputOutput) {
      const moduleHistory = processingHistory.filter(
        (ctx) => ctx.moduleId === module.id,
      );

      // Extract input/output for this module
      const input = moduleHistory.map((ctx) => ctx.inputChar);
      const output = moduleHistory.map((ctx) => ctx.outputChar);

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
    <Card className={`${!module.enabled ? "opacity-60" : ""}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3">
        <CardTitle className="text-base font-medium">
          {module.type.toUpperCase()}
        </CardTitle>
        <div className="flex items-center space-x-1">
          <Switch
            checked={module.enabled}
            onCheckedChange={toggleEnabled}
            aria-label={module.enabled ? "Disable" : "Enable"}
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleShowInputOutput}
            className="h-8 w-8"
            title={module.showInputOutput ? "Hide I/O" : "Show I/O"}
          >
            {module.showInputOutput ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMinimized}
            className="h-8 w-8"
            title={module.minimized ? "Expand" : "Minimize"}
          >
            {module.minimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeModule(module.id)}
            className="hover:text-destructive h-8 w-8"
            title="Remove Module"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!module.minimized && (
        <>
          <CardContent className="p-3 pt-0">{children}</CardContent>

          {module.showInputOutput && (
            <div className="grid grid-cols-2 gap-3 border-t p-3">
              <div>
                <h4 className="mb-1 text-sm font-medium">Input</h4>
                <div className="bg-muted/20 flex max-h-20 flex-wrap gap-1 overflow-y-auto rounded p-1">
                  {inputOutput.input.map((char, idx) => (
                    <span
                      key={`input-${idx}`}
                      className="inline-block h-6 min-w-6 rounded border text-center"
                      title={`Position ${idx}`}
                    >
                      {char || " "}
                    </span>
                  ))}
                  {inputOutput.input.length === 0 && (
                    <span className="text-muted-foreground p-1 text-xs">
                      No input processed yet
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="mb-1 text-sm font-medium">Output</h4>
                <div className="bg-muted/20 flex max-h-20 flex-wrap gap-1 overflow-y-auto rounded p-1">
                  {inputOutput.output.map((char, idx) => (
                    <span
                      key={`output-${idx}`}
                      className="inline-block h-6 min-w-6 rounded border text-center"
                      title={`Position ${idx}`}
                    >
                      {char || " "}
                    </span>
                  ))}
                  {inputOutput.output.length === 0 && (
                    <span className="text-muted-foreground p-1 text-xs">
                      No output processed yet
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
