
// src/app/(app)/attendance/page.tsx
"use client"

import { useSettings } from "@/contexts/SettingsContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarCheck, UserCircle, Users, BarChartBig, Landmark, Coffee, Wallet } from "lucide-react";
import { format, parseISO, differenceInMinutes } from "date-fns";
import { Badge } from "@/components/ui/badge";
import type { TimeLog } from "@/lib/types";
import { useMemo } from "react";

// Helper function to get effective duration in minutes for a single log (deducts break)
const getEffectiveDurationInMinutes = (log: TimeLog): number => {
  if (!log.checkOutTime) return 0; 
  let duration = differenceInMinutes(parseISO(log.checkOutTime), parseISO(log.checkInTime));
  if (log.totalBreakDurationMinutes && log.totalBreakDurationMinutes > 0) {
    duration -= log.totalBreakDurationMinutes;
  }
  return Math.max(0, duration); 
};

// Helper function to format total minutes into "Xh Ym"
const formatTotalDurationFromMinutes = (totalMinutes: number): string => {
  if (totalMinutes <= 0) return "0h 0m";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};

const formatBreakDurationDisplay = (log: TimeLog): string => {
    if (!log.totalBreakDurationMinutes || log.totalBreakDurationMinutes <= 0) return "-";
    return formatTotalDurationFromMinutes(log.totalBreakDurationMinutes);
};

const calculatePayForLog = (log: TimeLog): string => {
    if (!log.checkOutTime || !log.hourlyRate || log.hourlyRate <= 0) return "-";
    const effectiveMinutes = getEffectiveDurationInMinutes(log);
    if (effectiveMinutes <= 0) return "NPR 0.00";
    const pay = (effectiveMinutes / 60) * log.hourlyRate;
    return `NPR ${pay.toFixed(2)}`;
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
    const totals: Record<string, { username: string, role: string, totalMinutes: number, totalBreakMinutes: number, totalPay: number, hourlyRate?: number }> = {};
    completedLogs.forEach(log => {
      if (!totals[log.userId]) {
        totals[log.userId] = { username: log.username, role: log.role, totalMinutes: 0, totalBreakMinutes: 0, totalPay: 0, hourlyRate: log.hourlyRate };
      }
      const effectiveMinutes = getEffectiveDurationInMinutes(log);
      totals[log.userId].totalMinutes += effectiveMinutes;
      totals[log.userId].totalBreakMinutes += (log.totalBreakDurationMinutes || 0);
      if (log.hourlyRate && log.hourlyRate > 0 && effectiveMinutes > 0) {
          totals[log.userId].totalPay += (effectiveMinutes / 60) * log.hourlyRate;
          // Ensure hourlyRate in totals is set if any log for that user has it (prefers the latest found, but should be consistent per user)
          if (!totals[log.userId].hourlyRate) totals[log.userId].hourlyRate = log.hourlyRate;
      }
    });
    return Object.values(totals).sort((a,b) => b.totalMinutes - a.totalMinutes);
  }, [isAdminOrManager, completedLogs]);

  const overallTotalMinutes = useMemo(() => {
    if (isAdminOrManager) {
      return completedLogs.reduce((sum, log) => sum + getEffectiveDurationInMinutes(log), 0);
    } else if (currentUser) {
      return completedLogs
        .filter(log => log.userId === currentUser.id)
        .reduce((sum, log) => sum + getEffectiveDurationInMinutes(log), 0);
    }
    return 0;
  }, [isAdminOrManager, completedLogs, currentUser]);

  const overallTotalPay = useMemo(() => {
    if (!isAdminOrManager) return 0; // Only calculate overall pay for admin/manager view
    return completedLogs.reduce((sum, log) => {
        const effectiveMinutes = getEffectiveDurationInMinutes(log);
        if (log.hourlyRate && log.hourlyRate > 0 && effectiveMinutes > 0) {
            return sum + (effectiveMinutes / 60) * log.hourlyRate;
        }
        return sum;
    }, 0);
  }, [isAdminOrManager, completedLogs]);


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
        <div className="flex flex-col sm:flex-row gap-2">
            <Card className="shadow-md min-w-[200px] bg-muted/30">
                <CardHeader className="pb-2 pt-3 px-4">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                        <Landmark className="mr-2 h-4 w-4" /> Total Recorded Hours (Effective)
                    </CardTitle>
                </CardHeader>
                <CardContent className="pb-3 px-4">
                    <p className="text-2xl font-bold text-primary">{formatTotalDurationFromMinutes(overallTotalMinutes)}</p>
                </CardContent>
            </Card>
            {isAdminOrManager && overallTotalPay > 0 && (
                 <Card className="shadow-md min-w-[200px] bg-muted/30">
                    <CardHeader className="pb-2 pt-3 px-4">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                            <Wallet className="mr-2 h-4 w-4" /> Total Estimated Pay
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3 px-4">
                        <p className="text-2xl font-bold text-primary">NPR {overallTotalPay.toFixed(2)}</p>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
      

      {isAdminOrManager && userTotals && userTotals.length > 0 && (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center">
                    <Users className="mr-2 h-6 w-6 text-primary" /> User Hour & Pay Summaries
                </CardTitle>
                <CardDescription>Total effective work hours, break times, and estimated pay per user (for users with an hourly rate).</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[150px] md:h-[200px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Username</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Work Hours</TableHead>
                                <TableHead className="text-right">Break Time</TableHead>
                                <TableHead className="text-right">Est. Pay (NPR)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userTotals.map(userTotal => (
                                <TableRow key={userTotal.username}>
                                    <TableCell className="font-medium">{userTotal.username}</TableCell>
                                    <TableCell>{userTotal.role}</TableCell>
                                    <TableCell className="text-right font-semibold">{formatTotalDurationFromMinutes(userTotal.totalMinutes)}</TableCell>
                                    <TableCell className="text-right">{formatTotalDurationFromMinutes(userTotal.totalBreakMinutes)}</TableCell>
                                    <TableCell className="text-right font-medium">
                                        {userTotal.hourlyRate && userTotal.hourlyRate > 0 && userTotal.totalPay > 0 ? userTotal.totalPay.toFixed(2) : <span className="text-muted-foreground italic">-</span>}
                                    </TableCell>
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
            Most recent logs are shown first. Durations are effective work time. Pay is estimated for completed shifts with a set hourly rate.
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
                      <TableHead>Check-in</TableHead>
                      <TableHead>Check-out</TableHead>
                      <TableHead>Break</TableHead>
                      <TableHead>Duration</TableHead>
                      {(isAdminOrManager || (currentUser && currentUser.hourlyRate && currentUser.hourlyRate > 0)) && <TableHead className="text-right">Pay (Est.)</TableHead>}
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
                            {formatBreakDurationDisplay(log)}
                        </TableCell>
                        <TableCell className="font-semibold">
                            {log.checkOutTime ? formatTotalDurationFromMinutes(getEffectiveDurationInMinutes(log)) : <span className="text-muted-foreground italic">-</span>}
                        </TableCell>
                        {(isAdminOrManager || (currentUser && currentUser.hourlyRate && currentUser.hourlyRate > 0)) && 
                            <TableCell className="text-right font-medium">{calculatePayForLog(log)}</TableCell>
                        }
                        <TableCell>
                          {log.checkOutTime ? 
                            <Badge variant="outline">Completed</Badge> : 
                            (log.breakStartTime && !log.breakEndTime ? <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-300"><Coffee className="mr-1 h-3 w-3" />On Break</Badge> : <Badge variant="default">Checked In</Badge>)
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
