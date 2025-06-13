// src/components/AppSidebar.tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  ShoppingCart,
  BookOpenText,
  Printer,
  BarChart3,
  Sparkles,
  ChefHat,
  Settings,
  Rocket,
  LayoutGrid, 
  Clipboard, 
} from "lucide-react"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar" 
import { cn } from "@/lib/utils"
import { useSettings } from "@/contexts/SettingsContext"


const navItems = [
  { href: "/order", label: "Order", icon: ShoppingCart },
  { href: "/menu", label: "Menu", icon: BookOpenText },
  { href: "/billing", label: "Billing", icon: Printer },
  { href: "/floor-plan", label: "Floor Plan (Admin)", icon: LayoutGrid },
  { href: "/waiter-view", label: "Waiter View", icon: Clipboard }, 
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/recommendations", label: "AI Recommends", icon: Sparkles },
  { href: "/setup-guide", label: "Setup Guide", icon: Rocket },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar();
  const { settings, isLoading: settingsLoading } = useSettings();

  const logoUrl = settings?.logoUrl;
  const restaurantName = settings?.restaurantName || "Annapurna POS";

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="p-4 items-center">
        {logoUrl ? (
          <Image 
            src={logoUrl} 
            alt="Logo" 
            width={state === "collapsed" ? 32 : 40} // size in px
            height={state === "collapsed" ? 32 : 40} // size in px
            className={cn(
              "object-contain transition-all duration-300 ease-in-out",
              state === "collapsed" ? "max-h-8" : "max-h-10"
            )}
            onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget. RREPLACE_WITH_ICON = true; }} // Fallback handled by rendering ChefHat
          />
        ) : (
          <ChefHat className={cn("transition-all duration-300 ease-in-out", state === "collapsed" ? "size-8" : "size-10 text-primary")} />
        )}
         {/* This is a bit of a hack to re-render the ChefHat if image fails, could be improved with a dedicated state */}
        {logoUrl && typeof document !== 'undefined' && (document.querySelector(`img[src="${logoUrl}"]`) as any)?.RREPLACE_WITH_ICON && (
           <ChefHat className={cn("transition-all duration-300 ease-in-out", state === "collapsed" ? "size-8" : "size-10 text-primary")} />
        )}

        <h1 className={cn(
          "font-headline text-2xl font-bold text-primary transition-opacity duration-200 ease-in-out whitespace-nowrap overflow-hidden text-ellipsis",
          state === "collapsed" ? "opacity-0 w-0" : "opacity-100 ml-2" // Added ml-2 for spacing when expanded
        )}>
          {restaurantName}
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
        <SidebarMenuButton 
          asChild 
          tooltip="Settings" 
          className="justify-start"
          isActive={pathname.startsWith('/settings')}
        >
            <Link href="/settings">
                <Settings />
                <span>Settings</span>
            </Link>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  )
}
