import { controls, updateControls } from "~/store/StateManager";
import type { Modules } from "~/lib/types";
import { cn } from "~/lib/utils";
import { Card, CardContent, CardHeader, CardTitle} from "../ui/card"; //prettier-ignore
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { TOOLTIPS } from "~/lib/constants";
import { TooltipProvider } from "@radix-ui/react-tooltip";

export default function ModuleWrapper({
  children,
  modName,
  className="",
}: {
  children: React.ReactNode;
  modName: Modules;
  className?: string;
}) {
  const headerText = modName.charAt(0).toUpperCase() + modName.slice(1);
  const tooltipText = TOOLTIPS[modName];

  return (
    <Card className={className}>
      <CardHeader className="inline-flex items-center">
        <CardTitle>{headerText}</CardTitle>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost" size="icon" asChild className="p-2">
                <MessageCircleQuestion />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-48 ">{tooltipText}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button
          variant="ghost"
          asChild
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
          <ChevronDown />
        </Button>
      </CardHeader>

      <CardContent
        className={cn(
          "transition-all duration-300 ease-in-out",
          controls.value[modName].active
            // ? "animate-accordion-down max-h-screen rotate-x-0"
            // : "animate-accordion-up max-h-0 -rotate-x-90",

            ? "max-h-screen rotate-x-0"
            : "max-h-0 -rotate-x-90",
        )}
      >
        {children}
      </CardContent>
      {/* <CardFooter>
      sdfasdfasha
        <Button
          asChild
          // variant="ghost"
          className="text-amber-400 hover:bg-zinc-700/70 hover:text-amber-300"
        >
          sdasdasdasdjofjdsofjhsdfsdf
        </Button>
      </CardFooter> */}
    </Card>
  );
}
