// src/components/AppSidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ShoppingCart,
  BookOpenText,
  Printer,
  BarChart3,
  Sparkles,
  ChefHat,
  Settings,
} from "lucide-react"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  // SidebarTrigger, // SidebarTrigger is in AppLayout, not used directly here for toggling
  useSidebar,
} from "@/components/ui/sidebar" 
// import { Button } from "@/components/ui/button" // Not directly used
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/order", label: "Order", icon: ShoppingCart },
  { href: "/menu", label: "Menu", icon: BookOpenText },
  { href: "/billing", label: "Billing", icon: Printer },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/recommendations", label: "AI Recommends", icon: Sparkles },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="p-4 items-center">
        <ChefHat className={cn("transition-all duration-300 ease-in-out", state === "collapsed" ? "size-8" : "size-10 text-primary")} />
        <h1 className={cn(
          "font-headline text-2xl font-bold text-primary transition-opacity duration-200 ease-in-out",
          state === "collapsed" ? "opacity-0 w-0" : "opacity-100"
        )}>
          Annapurna POS
        </h1>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={item.label}
                className="justify-start"
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenuButton asChild tooltip="Settings" className="justify-start">
            <Link href="/settings">
                <Settings />
                <span>Settings</span>
            </Link>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  )
}
