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
} from "@/components/ui/sidebar"
import { House, UserRound } from "lucide-react"

const listMenu = [
  {
    "name": "Dashboard",
    "url": "/admin",
    "icon": House
  },
  {
    "name": "User Management",
    "url": "/admin/user-management",
    "icon": UserRound
  },
  {
    "name": "Facility",
    "url": "/admin/user-management",
    "icon": UserRound
  },

]



export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <h1 className="text-lg font-bold text-center">Admin Dashboard</h1>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>

          <SidebarMenu>
            {listMenu.map((menu) => (
              <SidebarMenuItem key={menu.name}>
                <SidebarMenuButton asChild>
                  <a href={menu.url}>
                    < menu.icon />
                    <span>{menu.name}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar >
  )
}