import React from "react";
import demoData from "~/app/_components/Demo/demoLib";
import { cn } from "~/lib/utils";
import { Card, CardContent, CardHeader } from "~/app/_components/ui/card";

interface InfoComponentProps {
  selectedOption: string;
  minimized: boolean;
}

export function InfoComponent({
  selectedOption,
  minimized,
}: InfoComponentProps) {
  const info = demoData[selectedOption]?.info;

  if (!info) return null;

  // Render the info component with the appropriate props
  const InfoContent = info as React.ComponentType<{ minimized: boolean }>;

  return (
    <div className={cn(
      "transition-all duration-500 ease-in-out w-full ",
      !minimized && "md:col-span-full"
    )}>

        <InfoContent minimized={minimized} />
   
    </div>
  );
}