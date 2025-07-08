// src/app/(app)/floor-plan/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutGrid, SquarePen, Users } from "lucide-react"
import { ManageTablesSection } from "@/components/floor-plan/ManageTablesSection"
import { ManageWaitersSection } from "@/components/floor-plan/ManageWaitersSection"
import { FloorViewSection } from "@/components/floor-plan/FloorViewSection"
import { Skeleton } from "@/components/ui/skeleton";
import { useSettings } from "@/contexts/SettingsContext";
import { cn } from "@/lib/utils"


export default function FloorPlanPage() {
  const { settings, isLoading: settingsLoading, currentUser } = useSettings();
  const [activeTab, setActiveTab] = useState("view")

  const isAdminOrManager = currentUser?.role === 'Admin' || currentUser?.role === 'Manager';
  
  // If a staff user somehow lands on the 'waiters' tab (e.g. via URL), default them to 'view'
  useEffect(() => {
    if (!isAdminOrManager && activeTab === 'waiters') {
      setActiveTab('view');
    }
  }, [activeTab, isAdminOrManager]);


  if (settingsLoading || !currentUser) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-10 w-1/3" />
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-headline font-bold text-primary">Floor Plan & Table Management</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={cn(
          "grid w-full mb-6",
          isAdminOrManager ? "sm:grid-cols-3" : "sm:grid-cols-2"
        )}>
          <TabsTrigger value="view" className="text-base py-2.5">
            <LayoutGrid className="mr-2 h-5 w-5" /> Floor View
          </TabsTrigger>
          <TabsTrigger value="tables" className="text-base py-2.5">
            <SquarePen className="mr-2 h-5 w-5" /> Manage Tables
          </TabsTrigger>
          {isAdminOrManager && (
            <TabsTrigger value="waiters" className="text-base py-2.5">
              <Users className="mr-2 h-5 w-5" /> Manage Waiters
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="view">
          <FloorViewSection />
        </TabsContent>
        <TabsContent value="tables">
          <ManageTablesSection />
        </TabsContent>
        {isAdminOrManager && (
          <TabsContent value="waiters">
            <ManageWaitersSection />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
