
// src/app/(app)/waiter-view/page.tsx
"use client"

import { useState } from "react"
import { useSettings } from "@/contexts/SettingsContext"
import type { Waiter } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TableCardsGrid } from "@/components/floor-plan/TableCardsGrid" // Admin one can be reused for display
import { WaiterTableCard } from "@/components/waiter-view/WaiterTableCard" // Waiter specific card
import { Clipboard, Info, UserCheck } from "lucide-react" 
import { Skeleton } from "@/components/ui/skeleton"

export default function WaiterViewPage() {
  const { settings, isLoading: settingsLoading } = useSettings()
  const [selectedWaiterId, setSelectedWaiterId] = useState<string | null>(null)

  const selectedWaiter = settings.waiters.find(w => w.id === selectedWaiterId)

  if (settingsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-4">
            <Clipboard className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-headline font-bold text-primary">Waiter Live View</h1>
        </div>
        <Skeleton className="h-10 w-1/2 mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
            <Clipboard className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-headline font-bold text-primary">Waiter Live View</h1>
        </div>
        {settings.waiters.length > 0 && (
          <div className="w-full sm:w-auto">
            <Select value={selectedWaiterId || ""} onValueChange={setSelectedWaiterId}>
              <SelectTrigger className="w-full sm:w-[200px] text-base">
                <SelectValue placeholder="Select Waiter Profile" />
              </SelectTrigger>
              <SelectContent>
                {settings.waiters.map((waiter) => (
                  <SelectItem key={waiter.id} value={waiter.id}>
                    {waiter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {settings.waiters.length === 0 ? (
         <Card className="shadow-lg">
            <CardHeader className="items-center text-center">
                <UserCheck className="h-12 w-12 text-muted-foreground mb-3"/>
                <CardTitle className="font-headline text-xl">No Waiter Profiles Configured</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-muted-foreground">
                Please ask an Administrator to add waiter profiles in the "Floor Plan > Manage Waiters" section.
                </p>
            </CardContent>
         </Card>
      ) : !selectedWaiterId ? (
        <Card className="shadow-lg">
            <CardHeader className="items-center text-center">
                <Info className="h-12 w-12 text-muted-foreground mb-3"/>
                <CardTitle className="font-headline text-xl">Select Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-muted-foreground">
                Please select your waiter profile from the dropdown above to view and manage tables.
                </p>
            </CardContent>
        </Card>
      ) : (
        <>
            <p className="text-lg text-muted-foreground">
                Viewing as: <span className="font-semibold text-primary">{selectedWaiter?.name}</span>
            </p>
            {settings.tables.length === 0 ? (
            <Card className="shadow-lg">
                <CardHeader className="items-center text-center">
                    <Info className="h-12 w-12 text-muted-foreground mb-3"/>
                    <CardTitle className="font-headline text-xl">No Tables on Floor Plan</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-muted-foreground">
                    Once tables are added by an Administrator in "Floor Plan > Manage Tables", they will appear here for you to manage.
                    </p>
                </CardContent>
            </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {settings.tables.map((table) => (
                        <WaiterTableCard 
                            key={table.id} 
                            table={table} 
                            allWaiters={settings.waiters} 
                            currentWaiterId={selectedWaiterId} 
                        />
                    ))}
                </div>
            )}
        </>
      )}
    </div>
  )
}

