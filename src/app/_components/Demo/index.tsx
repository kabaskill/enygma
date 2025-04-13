"use client";
import React, { useEffect, useState } from "react";
import demoData from "~/app/_components/Demo/demoLib";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { encryptionProcessor } from "~/store/encryptionProcessor";
import type { ModuleConfig, RotorSetting } from "~/lib/types";

import { InfoComponent } from "./InfoComponent";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "~/lib/utils";
import { enigmaLogic } from "~/store/enigmaLogic";
import { Copy } from "lucide-react";

export default function Demo() {
  const cipherList = Object.keys(demoData);

  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("enigma");
  const [modules, setModules] = useState<ModuleConfig[]>(
    demoData.enigma.modules,
  );

  const [infoMinimized, setInfoMinimized] = useState<boolean>(true);

  // Extract encryption logic to a reusable function
  function processEncryption(text: string): string {
    if (!text) return "";

    let processedOutput = "";

    if (selectedOption === "enigma") {
      const rotorsModule = modules.find(
        (module) => module.type === "rotors",
      ) as { type: string; rotorSettings: RotorSetting[] };

      const plugboardModule = modules.find(
        (module) => module.type === "plugboard",
      ) as { type: string; mapping: Record<string, string> };

      processedOutput = text
        .split("")
        .map((char) =>
          enigmaLogic.cipher(
            char,
            rotorsModule.rotorSettings,
            plugboardModule.mapping,
          ),
        )
        .join("");
    } else {
      // Process each character through the selected cipher
      processedOutput = text
        .split("")
        .map((char) => {
          if (!char || !char.trim()) return " ";

          return encryptionProcessor.processChar(char, 0, modules);
        })
        .join("");
    }

    return processedOutput;
  }

  // Process the encryption when input or cipher method changes
  useEffect(() => {
    if (!input) {
      setOutput("");
      return;
    }

    // Simulate a processing delay
    const timer = setTimeout(() => {
      setOutput(processEncryption(input));
    }, 1000);

    return () => clearTimeout(timer);
  }, [modules, input, selectedOption]);

  function handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(event.target.value);
  }

  function handleOptionChange(value: string) {
    setSelectedOption(value);
    setModules(demoData[value].modules);
    // No need to manually process encryption as useEffect will handle that
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className={cn(
          "grid gap-8",
          infoMinimized ? "md:grid-cols-[1fr_3fr]" : "grid-cols-1",
        )}
      >
        <Card>
          <CardHeader>
            <CardTitle>
              <Label htmlFor="demo-modules">Select Cipher Method</Label>
            </CardTitle>

            <CardDescription>
              <Select value={selectedOption} onValueChange={handleOptionChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select cipher type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {cipherList.map((key) => (
                      <SelectItem key={key} value={key}>
                        {key.slice(0, 1).toUpperCase() + key.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <InfoComponent
              selectedOption={selectedOption}
              minimized={infoMinimized}
            />
          </CardContent>

          <CardFooter>
            <Button
              onClick={() => setInfoMinimized(!infoMinimized)}
              className="w-full"
            >
              {infoMinimized ? "Show More Info" : "Show Less"}
            </Button>
          </CardFooter>
        </Card>

        {/* Input/Output area */}
        {infoMinimized && (
          <div className="grid gap-0 divide-x md:grid-cols-2">
            <div className="h-full px-4">
              <div className="mb-2 flex items-center justify-between">
                <Label htmlFor="input" className="text-sm font-medium">
                  Input
                </Label>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    try {
                      const text = await navigator.clipboard.readText();

                      const event = {
                        target: { value: text },
                      } as React.ChangeEvent<HTMLTextAreaElement>;
                      handleInputChange(event);
                    } catch (err) {
                      alert("Failed to read clipboard");
                    }
                  }}
                  className="h-8 px-2 text-xs"
                >
                  <Copy className="mr-1 h-3 w-3" />
                  Paste
                </Button>
              </div>
              <Textarea
                id="input"
                placeholder="Enter text to encrypt..."
                value={input}
                onChange={handleInputChange}
              
              />
            </div>
            <div className="px-4">
              <div className="mb-2 flex items-center justify-between">
                <Label htmlFor="output" className="text-sm font-medium">
                  Output
                </Label>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(output);
                  }}
                  className="h-8 px-2 text-xs"
                  disabled={!output}
                >
                  <Copy />
                  Copy
                </Button>
              </div>
              <Textarea
                id="output"
                placeholder="Encrypted text will appear here..."
                value={output}
                readOnly
        
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
