// src/app/(app)/layout.tsx
"use client" 

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SettingsProvider, useSettings } from "@/contexts/SettingsContext"; // Import useSettings
import { Skeleton } from '@/components/ui/skeleton';

function ProtectedAppLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, isLoading } = useSettings();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !currentUser && pathname !== '/login') { // Avoid redirect loop if already on login
      router.replace('/login');
    }
  }, [currentUser, isLoading, router, pathname]);

  if (isLoading || (!currentUser && pathname !== '/login')) {
    // Show a loading state or a minimal layout while checking auth or redirecting
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="h-12 w-1/2 mb-4" />
      </div>
    );
  }
  
  // If user is authenticated, render the main app layout
  if (currentUser) {
    return (
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 md:hidden">
            <SidebarTrigger />
            <h1 className="font-headline text-lg font-semibold text-primary">{settings.restaurantName || "Annapurna POS"}</h1>
          </header>
          <ScrollArea className="h-[calc(100vh-theme(spacing.14))] md:h-screen">
            <main className="flex-1 p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </ScrollArea>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // Fallback, should ideally be handled by redirect logic
  return null; 
}


export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <ProtectedAppLayout>{children}</ProtectedAppLayout>
    </SettingsProvider>
  )
}
