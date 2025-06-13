// src/app/(app)/layout.tsx
"use client" 

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
// SettingsProvider import is removed as it's now in the root layout
import { useSettings } from "@/contexts/SettingsContext"; 
import { Skeleton } from '@/components/ui/skeleton';

function ProtectedAppLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, isLoading, settings } = useSettings(); // Ensure settings is destructured if used
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !currentUser && pathname !== '/login') { 
      router.replace('/login');
    }
  }, [currentUser, isLoading, router, pathname]);

  if (isLoading || (!currentUser && pathname !== '/login')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="h-12 w-1/2 mb-4" />
      </div>
    );
  }
  
  if (currentUser) {
    return (
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 md:hidden">
            <SidebarTrigger />
            {/* Ensure settings is available and restaurantName is accessed correctly */}
            <h1 className="font-headline text-lg font-semibold text-primary">{settings?.restaurantName || "Annapurna POS"}</h1>
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

  return null; 
}

// AppLayoutWrapper no longer wraps with SettingsProvider
export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  return <ProtectedAppLayout>{children}</ProtectedAppLayout>;
}
