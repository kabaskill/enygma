"use client";
import { AppSidebar } from "~/app/_components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
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
import RotorSection from "../_components/Enigma/RotorSection";
import { useSignals } from "@preact/signals-react/runtime";
import Plugboard from "../_components/Enigma/Plugboard";
import Lampboard from "../_components/Enigma/Lampboard";
import KeyboardToggle from "../_components/Enigma/KeyboardToggle";
import { useEffect } from "react";
import { processChar, setActiveLamp } from "~/store/StateManager";

export default function Modern() {
  useSignals();

  function handleButtonPress(char: string) {
    processChar(char);
  }

  useEffect(() => {
    function handleKeyUp() {
      setActiveLamp(null);
    }

    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="max-h-screen overflow-auto">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="grid grid-cols-2 gap-6 px-4 mb-4">
          <RotorSection />
          <Lampboard />
          <KeyboardToggle onButtonPress={handleButtonPress} />

       
          <Plugboard />
          
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
