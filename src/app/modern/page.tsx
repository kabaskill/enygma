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
import Plugboard from "../_components/Enigma/Plugboard";
import { useSignals } from "@preact/signals-react/runtime";
import SlateEditor from "../_components/Enigma/Editor/SlateEditor";
import ModuleWrapper from "../_components/Enigma/ModuleWrapper";
import Lampboard from "../_components/Enigma/Lampboard";

export default function Modern() {
  useSignals();

  return (
    <SidebarProvider className="">
      <AppSidebar />
      <SidebarInset className="flex max-h-screen flex-col overflow-auto">
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

        <div className="mb-4 grid grid-cols-2 gap-6 px-4">
          <RotorSection />
          <Plugboard />
          <Lampboard/>
        </div>

        <ModuleWrapper modName="input" className="mx-4">
          <SlateEditor />
        </ModuleWrapper>
      </SidebarInset>
    </SidebarProvider>
  );
}
