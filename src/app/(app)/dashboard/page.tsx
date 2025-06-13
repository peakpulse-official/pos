
// src/app/(app)/dashboard/page.tsx
"use client"

import { useSettings } from "@/contexts/SettingsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogIn as LogInIcon, LogOut as LogOutIcon, CalendarDays, UserCircle, Clock } from "lucide-react";
import { format, differenceInMinutes, parseISO } from "date-fns";
import type { TimeLog } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { settings, currentUser, checkInUser, checkOutUser, getTodaysTimeLogForCurrentUser, isLoading } = useSettings();

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
  const isCheckedIn = !!todaysLog;

  const handleCheckInOut = () => {
    if (isCheckedIn) {
      checkOutUser();
    } else {
      checkInUser();
    }
  };

  const userTimeLogs = settings.timeLogs
    .filter(log => log.userId === currentUser.id)
    .sort((a, b) => parseISO(b.checkInTime).getTime() - parseISO(a.checkInTime).getTime());

  const calculateDuration = (log: TimeLog): string => {
    if (!log.checkOutTime) return "Ongoing";
    const minutes = differenceInMinutes(parseISO(log.checkOutTime), parseISO(log.checkInTime));
    const hours = Math.floor(minutes / 60);
    const  remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
          <UserCircle className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-3xl font-headline font-bold text-primary">Welcome, {currentUser.username}!</h1>
            <p className="text-muted-foreground">This is your personal dashboard.</p>
          </div>
        </div>
        <Button 
            onClick={handleCheckInOut} 
            variant={isCheckedIn ? "destructive" : "default"}
            size="lg"
            className="w-full sm:w-auto text-base py-3 shadow-md hover:shadow-lg transition-shadow"
        >
          {isCheckedIn ? <LogOutIcon className="mr-2 h-5 w-5" /> : <LogInIcon className="mr-2 h-5 w-5" />}
          {isCheckedIn ? "Check Out" : "Check In"}
        </Button>
      </div>
      
      {isCheckedIn && todaysLog && (
        <Card className="bg-green-50 dark:bg-green-900/30 border-green-500 shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-700 dark:text-green-400 font-headline flex items-center">
                <Clock className="mr-2 h-6 w-6"/> You are currently checked in!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-600 dark:text-green-500">
              Checked in at: {format(parseISO(todaysLog.checkInTime), "MMM d, yyyy 'at' h:mm a")}
            </p>
            <p className="text-sm text-muted-foreground">Press "Check Out" when you finish your shift.</p>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center">
            <CalendarDays className="mr-2 h-6 w-6 text-primary" /> My Time Logs & Paystub Record
          </CardTitle>
          <CardDescription>
            Your recorded check-in and check-out times.
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
            <ScrollArea className="h-[calc(100vh-28rem)] md:h-[calc(100vh-25rem)]">
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Check-in Time</TableHead>
                      <TableHead>Check-out Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userTimeLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{format(parseISO(log.date), "MMM d, yyyy")}</TableCell>
                        <TableCell>{format(parseISO(log.checkInTime), "h:mm:ss a")}</TableCell>
                        <TableCell>
                          {log.checkOutTime ? format(parseISO(log.checkOutTime), "h:mm:ss a") : <span className="text-muted-foreground italic">Not checked out</span>}
                        </TableCell>
                        <TableCell>{calculateDuration(log)}</TableCell>
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
