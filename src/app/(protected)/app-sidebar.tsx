"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  CircleQuestionMark,
  CreditCard,
  LayoutDashboard,
  Plus,
  Presentation,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "../../../public/logo.png";
import Image from "next/image";
import UseProject from "@/hooks/use-project";
const iteams = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Q&A",
    url: "/qa",
    icon: CircleQuestionMark,
  },
  {
    title: "Mettings",
    url: "/meetings",
    icon: Presentation,
  },
  {
    title: "Billings",
    url: "/billings",
    icon: CreditCard,
  },
];

const AppSideBar = () => {
  const pathName = usePathname();
  const { open } = useSidebar();
  const { projects, selectedProjectId, setSelectedProjectId } = UseProject();
  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <div className="flex items-center gap-2 text-lg font-bold">
          <Image alt="logo" src={logo} width={50} height={50} />
          {open && <h1>Dino</h1>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {iteams.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={cn({
                        "!bg-primary !text-white": pathName === item.url,
                      })}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map((project) => (
                <SidebarMenuItem key={project.id}>
                  <SidebarMenuButton asChild>
                    <div
                      onClick={() => setSelectedProjectId?.(project.id)}
                      className={cn("flex items-center")}
                    >
                      <div
                        className={cn(
                          "mr-2 inline-flex size-6 items-center justify-center rounded-sm border p-2",
                          {
                            "bg-primary border-primary text-white":
                              project.id === selectedProjectId,
                            "border-gray-300": project.id != selectedProjectId,
                          },
                        )}
                      >
                        {project.name.charAt(0).toUpperCase()}
                      </div>
                      {project.name}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {open && (
                <SidebarMenuItem>
                  <Link href={"/create"}>
                    <Button variant={"outline"} className="w-fit">
                      <Plus className="mr-2 h-4 w-4" />
                      Create project
                    </Button>
                  </Link>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="text-sm text-gray-500">© 2024 My App</div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSideBar;
