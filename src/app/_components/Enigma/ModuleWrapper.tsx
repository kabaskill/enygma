import { Signal, computed } from "@preact/signals-react";
import { cn } from "~/lib/utils";
import { Card, CardContent, CardHeader, CardTitle} from "../ui/card"; //prettier-ignore
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { constants } from "~/store/constants";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { signal } from "@preact/signals-react";

// Create a control signal to manage module visibility
export type Modules =
  | "rotors"
  | "plugboard"
  | "lampboard"
  | "input"
  | "keyboard"
  | "reflector"
  | "output"
  | "settings";

interface ModuleControl {
  active: boolean;
}

// Local control state for module visibility
// This could be integrated with cipherState in the future if needed
export const controls = signal<Record<Modules, ModuleControl>>({
  rotors: { active: true },
  plugboard: { active: true },
  lampboard: { active: true },
  keyboard: { active: true },
  input: { active: true },
  output: { active: true },
  reflector: { active: true },
  settings: { active: true },
});

export function updateControls(
  modName: Modules,
  updates: Partial<ModuleControl>,
): void {
  controls.value = {
    ...controls.value,
    [modName]: {
      ...controls.value[modName],
      ...updates,
    },
  };
}

export default function ModuleWrapper({
  children,
  modName,
  className = "",
}: {
  children: React.ReactNode;
  modName: Modules;
  className?: string;
}) {
  const headerText = modName.charAt(0).toUpperCase() + modName.slice(1);
  const tooltipText = constants.TOOLTIPS[modName as keyof typeof constants.TOOLTIPS] || 
                      `${headerText} module`;

  return (
    <Card className={className}>
      <CardHeader className="inline-flex items-center">
        <CardTitle>{headerText}</CardTitle>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost" size="icon" className="p-2">
                <MessageCircleQuestion className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-48">{tooltipText}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            updateControls(modName, {
              active: !controls.value[modName].active,
            })
          }
          className={cn(
            "ml-auto transform cursor-pointer transition duration-300 ease-in-out",
            controls.value[modName].active ? "rotate-180" : "rotate-0",
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent
        className={cn(
          "transition-all duration-300 ease-in-out",
          controls.value[modName].active
            ? "max-h-screen rotate-x-0"
            : "max-h-0 overflow-hidden -rotate-x-90",
        )}
      >
        {children}
      </CardContent>
    </Card>
  );
}
