
// src/app/(app)/dashboard/page.tsx
"use client"

import { useSettings } from "@/contexts/SettingsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogIn as LogInIcon, LogOut as LogOutIcon, CalendarDays, UserCircle, Clock, Coffee, PauseCircle, PlayCircle, Wallet } from "lucide-react";
import { format, differenceInMinutes, parseISO } from "date-fns";
import type { TimeLog } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
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


export default function DashboardPage() {
  const { settings, currentUser, checkInUser, checkOutUser, startBreak, endBreak, getTodaysTimeLogForCurrentUser, isLoading } = useSettings();

  if (isLoading || !currentUser) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <UserCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-headline font-bold text-primary">My Dashboard</h1>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Loading user data and time logs...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const todaysLog = getTodaysTimeLogForCurrentUser();
  const isCheckedIn = !!todaysLog && !todaysLog.checkOutTime;
  const isOnBreak = !!todaysLog && !!todaysLog.breakStartTime && !todaysLog.breakEndTime;

  const handleCheckInOut = () => {
    if (isCheckedIn) {
      checkOutUser();
    } else {
      checkInUser();
    }
  };

  const handleBreakToggle = () => {
    if (isOnBreak) {
      endBreak();
    } else if (isCheckedIn) {
      startBreak();
    }
  };

  const userTimeLogs = useMemo(() => {
    return settings.timeLogs
      .filter(log => log.userId === currentUser.id)
      .sort((a, b) => parseISO(b.checkInTime).getTime() - parseISO(a.checkInTime).getTime());
  }, [settings.timeLogs, currentUser.id]);

  const calculatePayForLog = (log: TimeLog): string => {
    if (!log.checkOutTime || !log.hourlyRate || log.hourlyRate <= 0) return "-";
    const effectiveMinutes = getEffectiveDurationInMinutes(log);
    if (effectiveMinutes <= 0) return "NPR 0.00";
    const pay = (effectiveMinutes / 60) * log.hourlyRate;
    return `NPR ${pay.toFixed(2)}`;
  };
  
  const totalEstimatedPay = useMemo(() => {
    if (!currentUser.hourlyRate || currentUser.hourlyRate <= 0) return 0;
    return userTimeLogs
        .filter(log => !!log.checkOutTime)
        .reduce((sum, log) => {
            const effectiveMinutes = getEffectiveDurationInMinutes(log);
            if (log.hourlyRate && log.hourlyRate > 0 && effectiveMinutes > 0) {
                 return sum + (effectiveMinutes / 60) * log.hourlyRate;
            }
            return sum;
        }, 0);
  }, [userTimeLogs, currentUser.hourlyRate]);


  const formatBreakTime = (log: TimeLog): string => {
    if (!log.totalBreakDurationMinutes || log.totalBreakDurationMinutes === 0) return "-";
    return formatTotalDurationFromMinutes(log.totalBreakDurationMinutes);
  };


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <UserCircle className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-3xl font-headline font-bold text-primary">Welcome, {currentUser.username}!</h1>
            <p className="text-muted-foreground">This is your personal dashboard and time clock.</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {isCheckedIn && (
            <Button
              onClick={handleBreakToggle}
              variant={isOnBreak ? "secondary" : "outline"}
              size="lg"
              className="w-full sm:w-auto text-base py-3 shadow-md hover:shadow-lg transition-shadow"
            >
              {isOnBreak ? <PlayCircle className="mr-2 h-5 w-5" /> : <PauseCircle className="mr-2 h-5 w-5" />}
              {isOnBreak ? "End Break" : "Start Break"}
            </Button>
          )}
          <Button 
              onClick={handleCheckInOut} 
              variant={isCheckedIn ? "destructive" : "default"}
              size="lg"
              className="w-full sm:w-auto text-base py-3 shadow-md hover:shadow-lg transition-shadow"
              disabled={isOnBreak} 
          >
            {isCheckedIn ? <LogOutIcon className="mr-2 h-5 w-5" /> : <LogInIcon className="mr-2 h-5 w-5" />}
            {isCheckedIn ? "Check Out" : "Check In"}
          </Button>
        </div>
      </div>
      
      {isCheckedIn && todaysLog && (
        <Card className={`${isOnBreak ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-500' : 'bg-green-50 dark:bg-green-900/30 border-green-500'} shadow-lg`}>
          <CardHeader>
            <CardTitle className={`${isOnBreak ? 'text-amber-700 dark:text-amber-400' : 'text-green-700 dark:text-green-400'} font-headline flex items-center`}>
                {isOnBreak ? <Coffee className="mr-2 h-6 w-6"/> : <Clock className="mr-2 h-6 w-6"/>} 
                {isOnBreak ? "You are currently on break!" : "You are currently checked in!"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`${isOnBreak ? 'text-amber-600 dark:text-amber-500' : 'text-green-600 dark:text-green-500'}`}>
              {isOnBreak ? `Break started at: ${format(parseISO(todaysLog.breakStartTime!), "h:mm a")}` : `Checked in at: ${format(parseISO(todaysLog.checkInTime), "MMM d, yyyy 'at' h:mm a")}`}
            </p>
            <p className="text-sm text-muted-foreground">
                {isOnBreak ? "Press \"End Break\" to resume your shift." : "Press \"Check Out\" when you finish your shift."}
            </p>
          </CardContent>
        </Card>
      )}

      {currentUser.hourlyRate && currentUser.hourlyRate > 0 && userTimeLogs.some(log => !!log.checkOutTime) && (
        <Card className="shadow-md bg-muted/30">
            <CardHeader className="pb-2 pt-3 px-4">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <Wallet className="mr-2 h-4 w-4" /> Total Estimated Pay (Completed Shifts)
                </CardTitle>
            </CardHeader>
            <CardContent className="pb-3 px-4">
                <p className="text-2xl font-bold text-primary">NPR {totalEstimatedPay.toFixed(2)}</p>
            </CardContent>
        </Card>
      )}


      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center">
            <CalendarDays className="mr-2 h-6 w-6 text-primary" /> My Time Logs & Paystub Record
          </CardTitle>
          <CardDescription>
            Your recorded check-in, check-out, break times, and estimated pay.
            {currentUser.hourlyRate ? ` (Your current rate: NPR ${currentUser.hourlyRate.toFixed(2)}/hr)` : " (Hourly rate not set)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userTimeLogs.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Clock className="mx-auto h-12 w-12 mb-3" />
              <p className="text-lg font-medium">No time logs recorded yet.</p>
              <p>Use the "Check-in" button to start recording your hours.</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-32rem)] md:h-[calc(100vh-28rem)]">
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead>Check-out</TableHead>
                      <TableHead>Break</TableHead>
                      <TableHead>Duration</TableHead>
                      {currentUser.hourlyRate && currentUser.hourlyRate > 0 && <TableHead className="text-right">Pay (Est.)</TableHead>}
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userTimeLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{format(parseISO(log.date), "MMM d, yyyy")}</TableCell>
                        <TableCell>{format(parseISO(log.checkInTime), "h:mm:ss a")}</TableCell>
                        <TableCell>
                          {log.checkOutTime ? format(parseISO(log.checkOutTime), "h:mm:ss a") : <span className="text-muted-foreground italic">Clocked In</span>}
                        </TableCell>
                        <TableCell>{formatBreakTime(log)}</TableCell>
                        <TableCell className="font-semibold">{formatTotalDurationFromMinutes(getEffectiveDurationInMinutes(log))}</TableCell>
                        {currentUser.hourlyRate && currentUser.hourlyRate > 0 && <TableCell className="text-right font-medium">{calculatePayForLog(log)}</TableCell>}
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
