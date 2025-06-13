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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar" // Assuming this is the correct path to your Sidebar component
import { Button } from "@/components/ui/button"
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
              <Link href={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                  className="justify-start"
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Link href="/settings">
            <SidebarMenuButton asChild tooltip="Settings" className="justify-start">
                 <a>
                    <Settings />
                    <span>Settings</span>
                </a>
            </SidebarMenuButton>
        </Link>
      </SidebarFooter>
    </Sidebar>
  )
}
