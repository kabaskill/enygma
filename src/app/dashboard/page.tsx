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
import Lampboard from "../_components/Enigma/Lampboard";
import ModuleWrapper from "../_components/Enigma/ModuleWrapper";
import SlateEditor from "../_components/Editor/SlateEditor";
import { useSignals } from "@preact/signals-react/runtime";

export default function Dashboard() {
  useSignals();

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

        <div className="flex flex-1 flex-col gap-4 overflow-auto p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl">
              <RotorSection />
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl">
              <Plugboard />
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl">
              <Lampboard />
            </div>
          </div>

          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
            <ModuleWrapper modName="input" className="h-full">
              <SlateEditor />
            </ModuleWrapper>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
