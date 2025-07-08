
// src/app/(app)/waiter-view/page.tsx
"use client"

import { useState, useMemo } from "react"
import { useSettings } from "@/contexts/SettingsContext"
import type { UserAccount } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WaiterTableCard } from "@/components/waiter-view/WaiterTableCard"
import { Clipboard, Info, UserCheck } from "lucide-react" 
import { Skeleton } from "@/components/ui/skeleton"

export default function WaiterViewPage() {
  const { settings, isLoading: settingsLoading, currentUser } = useSettings()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const servingStaff = useMemo(() => {
    return settings.users.filter(u => u.role === 'Waiter' || u.role === 'Manager');
  }, [settings.users]);

  const selectedUser = servingStaff.find(w => w.id === selectedUserId)

  if (settingsLoading || !currentUser) {
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
        {servingStaff.length > 0 && (
          <div className="w-full sm:w-auto">
            <Select value={selectedUserId || ""} onValueChange={setSelectedUserId}>
              <SelectTrigger className="w-full sm:w-[200px] text-base">
                <SelectValue placeholder="Select Staff Profile" />
              </SelectTrigger>
              <SelectContent>
                {servingStaff.map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.username} ({staff.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {servingStaff.length === 0 ? (
         <Card className="shadow-lg">
            <CardHeader className="items-center text-center">
                <UserCheck className="h-12 w-12 text-muted-foreground mb-3"/>
                <CardTitle className="font-headline text-xl">No Serving Staff Accounts</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-muted-foreground">
                Please ask an Administrator to add 'Waiter' or 'Manager' accounts in Settings.
                </p>
            </CardContent>
         </Card>
      ) : !selectedUserId ? (
        <Card className="shadow-lg">
            <CardHeader className="items-center text-center">
                <Info className="h-12 w-12 text-muted-foreground mb-3"/>
                <CardTitle className="font-headline text-xl">Select a Staff Profile</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-muted-foreground">
                Please select a staff profile from the dropdown to view and manage tables.
                </p>
            </CardContent>
        </Card>
      ) : (
        <>
            <p className="text-lg text-muted-foreground">
                Viewing as: <span className="font-semibold text-primary">{selectedUser?.username}</span>
            </p>
            {settings.tables.length === 0 ? (
            <Card className="shadow-lg">
                <CardHeader className="items-center text-center">
                    <Info className="h-12 w-12 text-muted-foreground mb-3"/>
                    <CardTitle className="font-headline text-xl">No Tables on Floor Plan</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-muted-foreground">
                    An Administrator can add tables in "Floor Plan &gt; Manage Tables".
                    </p>
                </CardContent>
            </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {settings.tables.map((table) => (
                        <WaiterTableCard 
                            key={table.id} 
                            table={table} 
                            allStaff={servingStaff} 
                            selectedUserId={selectedUserId} 
                        />
                    ))}
                </div>
            )}
        </>
      )}
    </div>
  )
}
