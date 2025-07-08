
// src/components/floor-plan/FloorViewSection.tsx
"use client"

import { useSettings } from "@/contexts/SettingsContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TableCardsGrid } from "@/components/floor-plan/TableCardsGrid";
import { Eye, Info } from "lucide-react";
import { useMemo } from "react";

export function FloorViewSection() {
  const { settings } = useSettings();

  const servingStaff = useMemo(() => {
    return settings.users.filter(u => u.role === 'Staff' || u.role === 'Manager');
  }, [settings.users]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
            <Eye className="mr-2 h-6 w-6 text-primary" />
            Live Floor View
        </CardTitle>
        <CardDescription>
          Overview of table statuses and assignments. Click on a table to manage it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {settings.tables.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <Info className="mx-auto h-12 w-12 mb-3"/>
            <p className="text-lg font-medium">No tables have been configured yet.</p>
            <p>Go to the "Manage Tables" tab to add tables to your floor plan.</p>
          </div>
        ) : (
          <TableCardsGrid tables={settings.tables} waiters={servingStaff} />
        )}
      </CardContent>
    </Card>
  )
}
