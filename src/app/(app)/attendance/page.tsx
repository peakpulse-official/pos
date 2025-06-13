// src/app/(app)/attendance/page.tsx
"use client"

import { useSettings } from "@/contexts/SettingsContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarCheck, UserCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function AttendancePage() {
  const { settings, currentUser, isLoading } = useSettings();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <CalendarCheck className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-headline font-bold text-primary">Attendance Logs</h1>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Loading attendance data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isAdminOrManager = currentUser?.role === 'Admin' || currentUser?.role === 'Manager';
  const logsToDisplay = isAdminOrManager 
    ? settings.timeLogs 
    : settings.timeLogs.filter(log => log.userId === currentUser?.id);

  const sortedLogs = logsToDisplay.sort((a, b) => parseISO(b.checkInTime).getTime() - parseISO(a.checkInTime).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <CalendarCheck className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-headline font-bold text-primary">Attendance Logs</h1>
      </div>
      <p className="text-muted-foreground">
        {isAdminOrManager ? "Showing all user attendance records." : "Showing your attendance records."}
      </p>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Recorded Check-ins & Check-outs</CardTitle>
          <CardDescription>
            Most recent logs are shown first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedLogs.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <UserCircle className="mx-auto h-12 w-12 mb-3" />
              <p className="text-lg font-medium">No attendance records found.</p>
              <p>Users can check-in via the button in the sidebar.</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-20rem)] md:h-[calc(100vh-18rem)]">
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {isAdminOrManager && <TableHead>Username</TableHead>}
                      {isAdminOrManager && <TableHead>Role</TableHead>}
                      <TableHead>Date</TableHead>
                      <TableHead>Check-in Time</TableHead>
                      <TableHead>Check-out Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedLogs.map((log) => (
                      <TableRow key={log.id}>
                        {isAdminOrManager && <TableCell className="font-medium">{log.username}</TableCell>}
                        {isAdminOrManager && <TableCell>{log.role}</TableCell>}
                        <TableCell>{format(parseISO(log.date), "MMM d, yyyy")}</TableCell>
                        <TableCell>{format(parseISO(log.checkInTime), "h:mm:ss a")}</TableCell>
                        <TableCell>
                          {log.checkOutTime ? format(parseISO(log.checkOutTime), "h:mm:ss a") : <span className="text-muted-foreground italic">Not checked out</span>}
                        </TableCell>
                        <TableCell>
                          {log.checkOutTime ? 
                            <Badge variant="outline">Completed</Badge> : 
                            <Badge variant="default">Checked In</Badge>
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
