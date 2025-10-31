import { SidebarProvider } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import React from "react";
import AppSideBar from "./app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
type Props = {
  children: React.ReactNode;
};
const Layout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <AppSideBar />
      <main className="m-2 w-full">
        <div className="border-sidebar-border bg-sidebar mb-4 flex items-center gap-2 rounded-md border px-2 py-4 shadow">
          {/* <AppSideBar /> */}
          <SidebarTrigger />
          <div className="ml-auto"></div>
          <UserButton />
        </div>
        <div className="h-4"></div>
        <div className="border-sidebar-border bg-sidebar h-[calc(100vh-7rem)] overflow-y-auto rounded-md border p-4 shadow">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
};

export default Layout;
