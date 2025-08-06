import { ClipboardPlus, Database, Home, ListChecks, NotepadText, } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "MRF",
    url: "mrf",
    icon: NotepadText,
  },
  {
    title: "Requests",
    url: "requests",
    icon: ListChecks,
  },
  {
    title: "LPO",
    url: "lpo",
    icon: ClipboardPlus,
  },
  {
    title: "Suppliers",
    url: "suppliers",
    icon: Database,
  },
]

export function AppSidebar() {
  return (
    <Sidebar  >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="my-8"  >
                 <div className="flex items-center space-x-2">
            <Image src="/newell-logo.PNG" alt="Logo" height={50} width={50} />
            <h1 className="text-sm text-black font-bold">Newell ELECTROMECHANICAL</h1>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="text-xl font-smibold my-1 ">
                      <item.icon />
                      <span >{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}