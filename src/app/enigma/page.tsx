"use client";

import React, { useEffect } from "react";
import { useModuleStore, useAppStore } from "~/store";
import ModuleManager from "~/app/_components/Modules/ModuleManager";
import PresetSelector from "~/app/_components/Modules/PresetSelector";
import RotorSection from "~/app/_components/Modules/Enigma/RotorSection";
import Plugboard from "~/app/_components/Modules/Enigma/Plugboard";

import { AppSidebar } from "~/app/_components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/app/_components/ui/breadcrumb";
import { Separator } from "~/app/_components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/app/_components/ui/sidebar";
import ModuleWrapper from "../_components/Modules/ModuleWrapper";
import type { ModuleConfig } from "~/store/types";
import MessageArea from "../_components/Modules/MessageArea";

export default function EnigmaPage() {
  const modules = useModuleStore((state) => state.modules);

  // Function to render the appropriate module content based on type
  const renderModuleContent = (module: ModuleConfig) => {
    switch (module.type) {
      case "rotors":
        return <RotorSection moduleId={module.id} />;
      case "plugboard":
        return <Plugboard moduleId={module.id} />;
      case "reflector":
        return <div className="p-4 text-center text-muted-foreground">Reflector Component (TBD)</div>;
      case "shifter":
        return <div className="p-4 text-center text-muted-foreground">Caesar Shifter Component (TBD)</div>;
      case "substitution":
        return <div className="p-4 text-center text-muted-foreground">Substitution Component (TBD)</div>;
      case "vigenere":
        return <div className="p-4 text-center text-muted-foreground">Vigenere Component (TBD)</div>;
      case "transposition":
        return <div className="p-4 text-center text-muted-foreground">Transposition Component (TBD)</div>;
      default:
        return <div className="p-4 text-center text-muted-foreground">Unknown module type</div>;
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Enigma Machine</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 overflow-auto p-4 pt-0">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[300px_1fr]">
            {/* Sidebar with Module Management */}
            <div className="space-y-6">
              <div>
                <h2 className="mb-2 text-xl font-semibold">Cipher Preset</h2>
                <PresetSelector />
              </div>

              <ModuleManager />
            </div>

            {/* Main Content */}
            <div className="space-y-8">
              {/* Modules List */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Active Modules</h2>

                {modules.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <p>
                      No modules are configured. Add modules from the sidebar.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {modules.map((module) => (
                      <ModuleWrapper key={module.id} module={module}>
                        {renderModuleContent(module)}
                      </ModuleWrapper>
                    ))}
                  </div>
                )}
              </div>

              {/* Input/Output */}
              <MessageArea />

              {/* Interactive Elements */}
              {/* <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Lampboard />
                <Keyboard />
              </div> */}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}