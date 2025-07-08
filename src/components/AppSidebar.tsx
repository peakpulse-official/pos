
// src/components/AppSidebar.tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
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
  LogOut,
  LogIn as LogInIcon, 
  LogOut as LogOutIcon, 
  CalendarCheck, 
  UserCircle,
  LayoutDashboard, // Added for Dashboard
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
  SidebarSeparator,
} from "@/components/ui/sidebar" 
import { cn } from "@/lib/utils"
import { useSettings } from "@/contexts/SettingsContext"
import { Button } from "./ui/button"
import { useToast } from "@/hooks/use-toast"


const navItemsBase = [
  { href: "/order", label: "Order", icon: ShoppingCart, roles: ['Admin', 'Manager', 'Staff'] },
  { href: "/menu", label: "Menu", icon: BookOpenText, roles: ['Admin', 'Manager', 'Staff'] },
  { href: "/billing", label: "Billing", icon: Printer, roles: ['Admin', 'Manager', 'Staff'] },
  { href: "/floor-plan", label: "Floor Plan", icon: LayoutGrid, roles: ['Admin', 'Manager', 'Staff'] }, 
  { href: "/waiter-view", label: "Waiter View", icon: Clipboard, roles: ['Staff', 'Manager'] }, 
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ['Manager', 'Staff'] }, // New Dashboard link
  { href: "/reports", label: "Reports", icon: BarChart3, roles: ['Admin', 'Manager'] },
  { href: "/recommendations", label: "AI Recommends", icon: Sparkles, roles: ['Admin', 'Manager', 'Staff'] },
  { href: "/attendance", label: "Attendance Logs", icon: CalendarCheck, roles: ['Admin', 'Manager'] }, 
  { href: "/setup-guide", label: "Setup Guide", icon: Rocket, roles: ['Admin', 'Manager', 'Staff'] },
];

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const { state } = useSidebar();
  const { settings, isLoading: settingsLoading, currentUser, logoutUser, checkInUser, checkOutUser, getTodaysTimeLogForCurrentUser } = useSettings();

  const logoUrl = settings?.logoUrl;
  const restaurantName = settings?.restaurantName || "Annapurna POS";

  const handleLogout = () => {
    logoutUser();
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    router.push("/login");
  }

  const todaysLog = getTodaysTimeLogForCurrentUser();
  const isCheckedIn = !!todaysLog;

  const handleCheckInOut = () => {
    if (isCheckedIn) {
      checkOutUser();
      toast({ title: "Checked Out", description: "Successfully checked out for the day." });
    } else {
      checkInUser();
      toast({ title: "Checked In", description: "Successfully checked in." });
    }
  }

  const filteredNavItems = navItemsBase.filter(item => {
    if (!currentUser) return false; // Should not happen if layout protects routes
    return item.roles.includes(currentUser.role);
  });


  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="p-4 items-center">
        {logoUrl ? (
          <Image 
            src={logoUrl} 
            alt="Logo" 
            width={state === "collapsed" ? 32 : 40} 
            height={state === "collapsed" ? 32 : 40}
            className={cn(
              "object-contain transition-all duration-300 ease-in-out",
              state === "collapsed" ? "max-h-8" : "max-h-10"
            )}
            onError={(e) => { (e.currentTarget as any).RREPLACE_WITH_ICON = true; e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <ChefHat className={cn("transition-all duration-300 ease-in-out", state === "collapsed" ? "size-8" : "size-10 text-primary")} />
        )}
        {logoUrl && typeof document !== 'undefined' && (document.querySelector(`img[src="${logoUrl}"]`) as any)?.RREPLACE_WITH_ICON && (
           <ChefHat className={cn("transition-all duration-300 ease-in-out", state === "collapsed" ? "size-8" : "size-10 text-primary")} />
        )}

        <h1 className={cn(
          "font-headline text-2xl font-bold text-primary transition-opacity duration-200 ease-in-out whitespace-nowrap overflow-hidden text-ellipsis",
          state === "collapsed" ? "opacity-0 w-0" : "opacity-100 ml-2" 
        )}>
          {restaurantName}
        </h1>
      </SidebarHeader>

      {currentUser && state !== "collapsed" && (
        <div className="px-4 py-2 text-center border-b border-t border-sidebar-border">
          <UserCircle className="inline-block h-6 w-6 mr-2 text-sidebar-foreground/80" />
          <p className="text-sm font-medium text-sidebar-foreground truncate">{currentUser.username}</p>
          <p className="text-xs text-sidebar-foreground/70">{currentUser.role}</p>
        </div>
      )}
      
      <SidebarContent className="p-2">
        <SidebarMenu>
          {filteredNavItems.map((item) => (
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

      <SidebarSeparator />

      {currentUser && (
        <div className="p-2 space-y-2">
            <Button
                variant={isCheckedIn ? "destructive" : "default"}
                onClick={handleCheckInOut}
                className={cn("w-full justify-start", state === "collapsed" ? "justify-center" : "")}
                size={state === "collapsed" ? "icon" : "default"}
                title={isCheckedIn ? "Check Out" : "Check In"}
            >
                {isCheckedIn ? <LogOutIcon /> : <LogInIcon />}
                {state !== "collapsed" && (isCheckedIn ? "Check Out" : "Check In")}
            </Button>
        </div>
      )}

      <SidebarFooter className="p-2 mt-auto">
        {currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Manager') && (
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
        )}
        {currentUser && (
            <SidebarMenuButton 
            variant="ghost"
            tooltip="Logout" 
            className="justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleLogout}
            >
                <LogOut />
                <span>Logout</span>
            </SidebarMenuButton>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
