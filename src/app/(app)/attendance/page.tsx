// src/app/(app)/attendance/page.tsx
"use client"

import { useSettings } from "@/contexts/SettingsContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarCheck, UserCircle, Users, BarChartBig, Landmark } from "lucide-react";
import { format, parseISO, differenceInMinutes } from "date-fns";
import { Badge } from "@/components/ui/badge";
import type { TimeLog } from "@/lib/types";
import { useMemo } from "react";

// Helper function to get duration in minutes for a single log
const getDurationInMinutes = (log: TimeLog): number => {
  if (!log.checkOutTime) return 0; // Only count completed logs
  return differenceInMinutes(parseISO(log.checkOutTime), parseISO(log.checkInTime));
};

// Helper function to format total minutes into "Xh Ym"
const formatTotalDurationFromMinutes = (totalMinutes: number): string => {
  if (totalMinutes <= 0) return "0h 0m";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};


export default function AttendancePage() {
  const { settings, currentUser, isLoading } = useSettings();

  const isAdminOrManager = currentUser?.role === 'Admin' || currentUser?.role === 'Manager';
  
  const logsToDisplay = useMemo(() => {
    return isAdminOrManager 
      ? settings.timeLogs 
      : settings.timeLogs.filter(log => log.userId === currentUser?.id);
  }, [settings.timeLogs, isAdminOrManager, currentUser?.id]);

  const sortedLogs = useMemo(() => {
    return [...logsToDisplay].sort((a, b) => parseISO(b.checkInTime).getTime() - parseISO(a.checkInTime).getTime());
  }, [logsToDisplay]);

  const completedLogs = useMemo(() => {
    return sortedLogs.filter(log => !!log.checkOutTime);
  }, [sortedLogs]);

  const userTotals = useMemo(() => {
    if (!isAdminOrManager) return null;
    const totals: Record<string, { username: string, role: string, totalMinutes: number }> = {};
    completedLogs.forEach(log => {
      if (!totals[log.userId]) {
        totals[log.userId] = { username: log.username, role: log.role, totalMinutes: 0 };
      }
      totals[log.userId].totalMinutes += getDurationInMinutes(log);
    });
    return Object.values(totals).sort((a,b) => b.totalMinutes - a.totalMinutes);
  }, [isAdminOrManager, completedLogs]);

  const overallTotalMinutes = useMemo(() => {
    if (isAdminOrManager) {
      return completedLogs.reduce((sum, log) => sum + getDurationInMinutes(log), 0);
    } else if (currentUser) {
      return completedLogs
        .filter(log => log.userId === currentUser.id)
        .reduce((sum, log) => sum + getDurationInMinutes(log), 0);
    }
    return 0;
  }, [isAdminOrManager, completedLogs, currentUser]);


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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <CalendarCheck className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-headline font-bold text-primary">Attendance Logs</h1>
            <p className="text-muted-foreground">
              {isAdminOrManager ? "Showing all user attendance records." : "Showing your attendance records."}
            </p>
          </div>
        </div>
        <Card className="shadow-md min-w-[200px] bg-muted/30">
            <CardHeader className="pb-2 pt-3 px-4">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <Landmark className="mr-2 h-4 w-4" /> Total Recorded Hours
                </CardTitle>
            </CardHeader>
            <CardContent className="pb-3 px-4">
                <p className="text-2xl font-bold text-primary">{formatTotalDurationFromMinutes(overallTotalMinutes)}</p>
            </CardContent>
        </Card>
      </div>
      

      {isAdminOrManager && userTotals && userTotals.length > 0 && (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center">
                    <Users className="mr-2 h-6 w-6 text-primary" /> User Hour Summaries
                </CardTitle>
                <CardDescription>Total completed hours per user.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[150px] md:h-[200px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Username</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Total Hours</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userTotals.map(userTotal => (
                                <TableRow key={userTotal.username}>
                                    <TableCell className="font-medium">{userTotal.username}</TableCell>
                                    <TableCell>{userTotal.role}</TableCell>
                                    <TableCell className="text-right font-semibold">{formatTotalDurationFromMinutes(userTotal.totalMinutes)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
        </Card>
      )}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center">
             <BarChartBig className="mr-2 h-6 w-6 text-primary" /> Detailed Log
          </CardTitle>
          <CardDescription>
            Most recent logs are shown first. Only completed shifts contribute to total hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedLogs.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <UserCircle className="mx-auto h-12 w-12 mb-3" />
              <p className="text-lg font-medium">No attendance records found.</p>
              <p>Users can check-in via the button in the sidebar or dashboard.</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-30rem)] md:h-[calc(100vh-25rem)]">
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {isAdminOrManager && <TableHead>Username</TableHead>}
                      {isAdminOrManager && <TableHead>Role</TableHead>}
                      <TableHead>Date</TableHead>
                      <TableHead>Check-in Time</TableHead>
                      <TableHead>Check-out Time</TableHead>
                      <TableHead>Duration</TableHead>
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
                        <TableCell className="font-medium">
                            {log.checkOutTime ? formatTotalDurationFromMinutes(getDurationInMinutes(log)) : <span className="text-muted-foreground italic">-</span>}
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

