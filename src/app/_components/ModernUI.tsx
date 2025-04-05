"use client";
import { useSignals } from "@preact/signals-react/runtime";
import { useState } from "react";
import { cn } from "~/utils/cn";
import Lampboard from "./Enigma/Lampboard";
import RotorSection from "./Enigma/RotorSection";
import Plugboard from "./Enigma/Plugboard";
import SimpleKeyboard from "./SimpleKeyboard/SimpleKeyboard";
import { 
  Menu, X, Settings, Keyboard, History, HelpCircle, Home, 
  Plug, RefreshCcw, Minimize2, Maximize2 
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  input,
  output,
  setInput,
  processChar,
  reset,
} from "../../store/StateManager";
import Link from "next/link";

type ComponentKey = 'home' | 'rotors' | 'plugboard' | 'settings' | 'history' | 'help';

type SidebarItem = {
  name: string;
  icon: LucideIcon;
  key: ComponentKey;
};

type ComponentState = Record<ComponentKey, {
  visible: boolean;
  minimized: boolean;
}>;

export default function ModernUI() {
  useSignals();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showKeyboard, setShowKeyboard] = useState(false);

  const [componentState, setComponentState] = useState<ComponentState>({
    home: { visible: true, minimized: false },
    rotors: { visible: false, minimized: false },
    plugboard: { visible: false, minimized: false },
    settings: { visible: false, minimized: false },
    history: { visible: false, minimized: false },
    help: { visible: false, minimized: false },
  });

  const sidebarItems: SidebarItem[] = [
    { name: "Home", icon: Home, key: "home" },
    { name: "Rotors", icon: RefreshCcw, key: "rotors" },
    { name: "Plugboard", icon: Plug, key: "plugboard" },
    { name: "Settings", icon: Settings, key: "settings" },
    { name: "History", icon: History, key: "history" },
    { name: "Help", icon: HelpCircle, key: "help" },
  ];

  function handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const newInput = event.target.value;
    if (newInput.length > input.value.length) {
      const lastChar = newInput.slice(-1).toUpperCase();
      processChar(lastChar);
    } else {
      setInput(newInput);
    }
  }

  function handleKeyboardInput(char: string) {
    processChar(char);
  }

  function toggleComponent(key: ComponentKey) {
    setComponentState((prev) => ({
      ...prev,
      [key]: { ...prev[key], visible: !prev[key].visible },
    }));
  }
  
  function toggleMinimize(key: ComponentKey) {
    setComponentState((prev) => ({
      ...prev,
      [key]: { ...prev[key], minimized: !prev[key].minimized },
    }));
  }

  return (
    <div className="flex h-screen bg-zinc-900 text-amber-50">
      {/* Sidebar toggle button for mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-4 left-4 z-20 md:hidden"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed z-10 h-full w-64 border-r border-zinc-700 bg-zinc-800 md:relative",
          "shadow-lg transition-all duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <Link href="/" className="border-b border-zinc-700 p-4">
          <h1 className="text-2xl font-bold tracking-tight text-amber-300">
            ENIGMA
          </h1>
          <p className="text-xs text-zinc-400">Modern Encryption Machine</p>
        </Link>

        <nav className="p-2">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => toggleComponent(item.key)}
              className={cn(
                "mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left",
                "transition-colors duration-200",
                componentState[item.key].visible
                  ? "bg-amber-600/20 text-amber-300"
                  : "text-zinc-300 hover:bg-zinc-700/70",
              )}
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-zinc-700 p-4 text-xs text-zinc-500">
          <p>Enigma Machine Simulator</p>
          <p>© {new Date().getFullYear()}</p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Home Component */}
          {componentState.home.visible && (
            <div
              className={cn(
                "overflow-hidden rounded-lg bg-zinc-800 shadow-lg",
                componentState.home.minimized
                  ? "col-span-1 row-span-1"
                  : "col-span-full",
              )}
            >
              <div className="flex items-center justify-between bg-zinc-700 p-3">
                <h2 className="text-lg font-bold text-amber-300">
                  Enigma Encoder
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleMinimize("home")}
                    className="rounded-full p-1 hover:bg-zinc-600"
                  >
                    {componentState.home.minimized ? (
                      <Maximize2 size={16} />
                    ) : (
                      <Minimize2 size={16} />
                    )}
                  </button>
                  <button
                    onClick={() => setShowKeyboard(!showKeyboard)}
                    className="rounded-full p-1 hover:bg-zinc-600"
                  >
                    <Keyboard size={16} />
                  </button>
                </div>
              </div>

              {!componentState.home.minimized && (
                <div className="flex flex-col gap-6 p-4">
                  <Lampboard />

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="input-area"
                        className="enigma-label block"
                      >
                        Input Message:
                      </label>
                      <textarea
                        name="input-area"
                        id="input-area"
                        className="enigma-input min-h-[200px] w-full resize-none font-mono"
                        value={input.value}
                        onChange={handleInputChange}
                        placeholder="Type your message here..."
                      />
                    </div>

                    <div className="space-y-2">
                      <h2 className="enigma-label">Encrypted Output:</h2>
                      <div className="enigma-input min-h-[200px] overflow-auto p-4 font-mono text-wrap">
                        {output.value || (
                          <span className="text-gray-500">
                            Encrypted text will appear here
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {showKeyboard && (
                    <div className="mt-4">
                      <SimpleKeyboard onKeyPress={handleKeyboardInput} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Rotors Component */}
          {componentState.rotors.visible && (
            <div
              className={cn(
                "overflow-hidden rounded-lg bg-zinc-800 shadow-lg",
                componentState.rotors.minimized
                  ? "col-span-1"
                  : "col-span-1 md:col-span-2",
              )}
            >
              <div className="flex items-center justify-between bg-zinc-700 p-3">
                <h2 className="text-lg font-bold text-amber-300">
                  Rotor Configuration
                </h2>
                <button
                  onClick={() => toggleMinimize("rotors")}
                  className="rounded-full p-1 hover:bg-zinc-600"
                >
                  {componentState.rotors.minimized ? (
                    <Maximize2 size={16} />
                  ) : (
                    <Minimize2 size={16} />
                  )}
                </button>
              </div>

              {!componentState.rotors.minimized && (
                <div className="p-4">
                  <RotorSection />
                </div>
              )}
            </div>
          )}

          {/* Plugboard Component */}
          {componentState.plugboard.visible && (
            <div
              className={cn(
                "overflow-hidden rounded-lg bg-zinc-800 shadow-lg",
                componentState.plugboard.minimized
                  ? "col-span-1"
                  : "col-span-1 md:col-span-2",
              )}
            >
              <div className="flex items-center justify-between bg-zinc-700 p-3">
                <h2 className="text-lg font-bold text-amber-300">
                  Plugboard Settings
                </h2>
                <button
                  onClick={() => toggleMinimize("plugboard")}
                  className="rounded-full p-1 hover:bg-zinc-600"
                >
                  {componentState.plugboard.minimized ? (
                    <Maximize2 size={16} />
                  ) : (
                    <Minimize2 size={16} />
                  )}
                </button>
              </div>

              {!componentState.plugboard.minimized && (
                <div className="p-4">
                  <Plugboard />
                </div>
              )}
            </div>
          )}

          {/* Settings Component */}
          {componentState.settings.visible && (
            <div
              className={cn(
                "overflow-hidden rounded-lg bg-zinc-800 shadow-lg",
                componentState.settings.minimized ? "col-span-1" : "col-span-1",
              )}
            >
              <div className="flex items-center justify-between bg-zinc-700 p-3">
                <h2 className="text-lg font-bold text-amber-300">Settings</h2>
                <button
                  onClick={() => toggleMinimize("settings")}
                  className="rounded-full p-1 hover:bg-zinc-600"
                >
                  {componentState.settings.minimized ? (
                    <Maximize2 size={16} />
                  ) : (
                    <Minimize2 size={16} />
                  )}
                </button>
              </div>

              {!componentState.settings.minimized && (
                <div className="p-4">
                  <button
                    onClick={reset}
                    className="flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                  >
                    <RefreshCcw size={18} /> Reset Machine
                  </button>
                </div>
              )}
            </div>
          )}

          {/* History Component */}
          {componentState.history.visible && (
            <div
              className={cn(
                "overflow-hidden rounded-lg bg-zinc-800 shadow-lg",
                componentState.history.minimized ? "col-span-1" : "col-span-1",
              )}
            >
              <div className="flex items-center justify-between bg-zinc-700 p-3">
                <h2 className="text-lg font-bold text-amber-300">
                  Message History
                </h2>
                <button
                  onClick={() => toggleMinimize("history")}
                  className="rounded-full p-1 hover:bg-zinc-600"
                >
                  {componentState.history.minimized ? (
                    <Maximize2 size={16} />
                  ) : (
                    <Minimize2 size={16} />
                  )}
                </button>
              </div>

              {!componentState.history.minimized && (
                <div className="p-4">
                  <p className="text-gray-400">
                    Your encryption history will appear here.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Help Component */}
          {componentState.help.visible && (
            <div
              className={cn(
                "overflow-hidden rounded-lg bg-zinc-800 shadow-lg",
                componentState.help.minimized
                  ? "col-span-1"
                  : "col-span-1 md:col-span-2",
              )}
            >
              <div className="flex items-center justify-between bg-zinc-700 p-3">
                <h2 className="text-lg font-bold text-amber-300">
                  Help & Documentation
                </h2>
                <button
                  onClick={() => toggleMinimize("help")}
                  className="rounded-full p-1 hover:bg-zinc-600"
                >
                  {componentState.help.minimized ? (
                    <Maximize2 size={16} />
                  ) : (
                    <Minimize2 size={16} />
                  )}
                </button>
              </div>

              {!componentState.help.minimized && (
                <div className="p-4">
                  <div className="prose prose-invert prose-amber">
                    <p>
                      The Enigma machine was a cipher device used during World
                      War II. This modern recreation allows you to encrypt and
                      decrypt messages using the same principles.
                    </p>
                    <h3>How to Use</h3>
                    <ul>
                      <li>
                        Type your message in the input area or use the on-screen
                        keyboard
                      </li>
                      <li>The encrypted output will appear automatically</li>
                      <li>
                        Configure rotors and plugboard connections to change
                        encryption
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
