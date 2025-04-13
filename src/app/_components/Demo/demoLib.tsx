import React from "react";
import { cipherState } from "~/store/core";
import type { ModuleConfig } from "~/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";

// Define the structure of demo data with proper typing
interface DemoEntry {
  info: React.ComponentType<{ minimized: boolean }>;
  modules: ModuleConfig[];
}

type DemoDataType = Record<string, DemoEntry>;

// Info Components with expanded views
function EnigmaInfo({ minimized = true }: { minimized: boolean }) {
  if (minimized) {
    return (
      <div className="text-sm">
        <p>
          The Enigma machine was a complex encryption device used by the Germans
          during World War II for secure communication.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in space-y-6 duration-300">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">The Enigma Machine</CardTitle>
            <CardDescription>
              A sophisticated encryption device used during World War II
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                The Enigma machine was a complex encryption device used by the
                Germans during World War II. It consisted of a keyboard, a set
                of rotors, a reflector, and a plugboard that worked together to
                scramble messages. Each keystroke would result in a different
                substitution due to the rotating mechanism.
              </p>
              <p className="text-muted-foreground text-sm">
                The breaking of Enigma by Allied cryptanalysts at Bletchley
                Park, led by Alan Turing, was a pivotal moment in the war and
                laid foundations for modern computing.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center">
          <div className="bg-muted text-muted-foreground flex aspect-video w-full items-center justify-center rounded-lg">
            [Enigma Machine Illustration]
          </div>
        </div>
      </div>
    </div>
  );
}

function CaesarInfo({ minimized = true }: { minimized: boolean }) {
  if (minimized) {
    return (
      <div className="text-sm">
        <p>
          The Caesar cipher is one of the earliest and simplest encryption
          techniques, using a fixed shift value for each letter.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in space-y-6 duration-300">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl">The Caesar Cipher</CardTitle>
        <CardDescription>
          A simple substitution cipher used in ancient Rome
        </CardDescription>
      </CardHeader>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            The Caesar cipher is one of the earliest and simplest encryption
            techniques. Named after Julius Caesar who used it for military
            communications, it works by shifting each letter in the plaintext by
            a fixed number of positions in the alphabet.
          </p>
          <p className="text-muted-foreground text-sm">
            For example, with a shift of 3, 'A' becomes 'D', 'B' becomes 'E',
            and so on. While historically significant, it offers minimal
            security by modern standards as it can be easily broken with
            frequency analysis.
          </p>
        </div>

        <div className="flex items-center justify-center">
          <div className="bg-muted text-muted-foreground flex aspect-video w-full items-center justify-center rounded-lg">
            [Caesar Cipher Visualization]
          </div>
        </div>
      </div>
    </div>
  );
}

function VigenereInfo({ minimized = true }: { minimized: boolean }) {
  if (minimized) {
    return (
      <div className="text-sm">
        <p>
          The Vigenère cipher improves on simple substitution by using a keyword
          to determine variable shift values for each letter.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in space-y-6 duration-300">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl">The Vigenère Cipher</CardTitle>
        <CardDescription>
          A polyalphabetic substitution cipher developed in the 16th century
        </CardDescription>
      </CardHeader>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            The Vigenère cipher, developed in the 16th century, improved upon
            simple substitution ciphers by using a keyword to determine variable
            shift values. Each letter of the keyword specifies how many
            positions to shift the corresponding plaintext letter.
          </p>
          <p className="text-muted-foreground text-sm">
            This creates multiple substitution alphabets, making it resistant to
            basic frequency analysis. Though eventually broken in the 19th
            century, it remained secure for hundreds of years and represented a
            significant advancement in cryptography.
          </p>
        </div>

        <div className="flex items-center justify-center">
          <div className="bg-muted text-muted-foreground flex aspect-video w-full items-center justify-center rounded-lg">
            [Vigenère Table Visualization]
          </div>
        </div>
      </div>
    </div>
  );
}

const demoData: DemoDataType = {
  enigma: {
    info: EnigmaInfo,
    modules: cipherState.value.presets.enigma,
  },
  caesar: {
    info: CaesarInfo,
    modules: cipherState.value.presets.caesar,
  },
  vigenere: {
    info: VigenereInfo,
    modules: cipherState.value.presets.vigenere,
  },
};

export default demoData;
