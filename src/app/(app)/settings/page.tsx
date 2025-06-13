
// src/app/(app)/settings/page.tsx
"use client"

import * as React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useSettings } from "@/contexts/SettingsContext"
import type { PrinterDevice, PrinterType, UserAccount, UserRole } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Settings as SettingsIcon, Save, Store, Percent, Server, Users, PlusCircle, Trash2, Edit, CheckCircle, Star, Image as ImageIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image";


const restaurantDetailsSchema = z.object({
  restaurantName: z.string().min(1, "Restaurant name is required"),
  restaurantAddress: z.string().min(1, "Restaurant address is required"),
  restaurantContact: z.string().optional(),
})

const brandingSchema = z.object({
  logoUrl: z.string().url("Please enter a valid URL for the logo.").optional().or(z.literal('')),
});


const taxChargesSchema = z.object({
  vatRate: z.coerce.number().min(0, "VAT rate must be non-negative").max(1, "VAT rate must be <= 1 (e.g., 0.13 for 13%)"),
  serviceChargeRate: z.coerce.number().min(0, "Service charge must be non-negative").max(1, "Service charge must be <= 1 (e.g., 0.10 for 10%)"),
})

const printerSchema = z.object({
  name: z.string().min(1, "Printer name is required"),
  type: z.enum(["Receipt", "Kitchen", "Label"], { required_error: "Printer type is required" }),
})

const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  role: z.enum(["Admin", "Staff", "Manager"], { required_error: "User role is required" }),
})

type RestaurantDetailsFormValues = z.infer<typeof restaurantDetailsSchema>
type BrandingFormValues = z.infer<typeof brandingSchema>;
type TaxChargesFormValues = z.infer<typeof taxChargesSchema>
type PrinterFormValues = z.infer<typeof printerSchema>
type UserFormValues = z.infer<typeof userSchema>


export default function SettingsPage() {
  const { 
    settings, 
    updateSettings, 
    addPrinter, 
    removePrinter,
    setDefaultPrinter,
    addUser,
    updateUserRole,
    removeUser,
    isLoading 
  } = useSettings()
  const { toast } = useToast()

  const [isPrinterDialogOpen, setIsPrinterDialogOpen] = React.useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<UserAccount | null>(null);
  const [isEditUserRoleDialogOpen, setIsEditUserRoleDialogOpen] = React.useState(false);


  const restaurantForm = useForm<RestaurantDetailsFormValues>({
    resolver: zodResolver(restaurantDetailsSchema),
    defaultValues: settings,
  })

  const brandingForm = useForm<BrandingFormValues>({
    resolver: zodResolver(brandingSchema),
    defaultValues: { logoUrl: settings.logoUrl || "" },
  });

  const taxForm = useForm<TaxChargesFormValues>({
    resolver: zodResolver(taxChargesSchema),
    defaultValues: settings,
  })
  
  const printerForm = useForm<PrinterFormValues>({
    resolver: zodResolver(printerSchema),
    defaultValues: { name: "", type: "Receipt" },
  })

  const userForm = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { username: "", role: "Staff"},
  })

  const editUserRoleForm = useForm<{role: UserRole}>({
    resolver: zodResolver(z.object({role: z.enum(["Admin", "Staff", "Manager"])})),
  });


  React.useEffect(() => {
    if (!isLoading) {
      restaurantForm.reset(settings)
      brandingForm.reset({ logoUrl: settings.logoUrl || "" });
      taxForm.reset(settings)
    }
  }, [settings, isLoading, restaurantForm, brandingForm, taxForm])

  React.useEffect(() => {
    if (editingUser) {
      editUserRoleForm.reset({ role: editingUser.role });
    }
  }, [editingUser, editUserRoleForm]);


  const handleRestaurantDetailsSubmit = (data: RestaurantDetailsFormValues) => {
    updateSettings(data)
    toast({ title: "Restaurant Details Updated", description: "Your restaurant information has been saved." })
  }

  const handleBrandingSubmit = (data: BrandingFormValues) => {
    updateSettings({ logoUrl: data.logoUrl || "" }); // Ensure empty string if undefined
    toast({ title: "Branding Updated", description: "Your logo URL has been saved." });
  };

  const handleTaxChargesSubmit = (data: TaxChargesFormValues) => {
    updateSettings(data)
    toast({ title: "Tax & Charges Updated", description: "VAT and service charge rates have been saved." })
  }

  const handleAddPrinterSubmit = (data: PrinterFormValues) => {
    addPrinter(data as Omit<PrinterDevice, 'id'>);
    toast({ title: "Printer Added", description: `${data.name} has been added.` });
    printerForm.reset({ name: "", type: "Receipt" });
    setIsPrinterDialogOpen(false);
  }

  const handleRemovePrinter = (printerId: string) => {
    removePrinter(printerId);
    toast({ title: "Printer Removed", variant: "destructive" });
  }

  const handleSetDefaultPrinter = (printerId: string) => {
    setDefaultPrinter(printerId);
    toast({ title: "Default Printer Set" });
  }
  
  const handleAddUserSubmit = (data: UserFormValues) => {
    addUser(data as Omit<UserAccount, 'id'>);
    toast({ title: "User Added", description: `${data.username} has been added.` });
    userForm.reset({ username: "", role: "Staff" });
    setIsUserDialogOpen(false);
  }

  const handleOpenEditUserRoleDialog = (user: UserAccount) => {
    setEditingUser(user);
    setIsEditUserRoleDialogOpen(true);
  };

  const handleUpdateUserRoleSubmit = (data: {role: UserRole}) => {
    if (editingUser) {
      updateUserRole(editingUser.id, data.role);
      toast({ title: "User Role Updated", description: `${editingUser.username}'s role has been updated.` });
      setEditingUser(null);
      setIsEditUserRoleDialogOpen(false);
    }
  };

  const handleRemoveUser = (userId: string) => {
    removeUser(userId);
    toast({ title: "User Removed", variant: "destructive" });
  }


  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <SettingsIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-headline font-bold text-primary">Settings</h1>
        </div>
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <SettingsIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-headline font-bold text-primary">Settings</h1>
      </div>
      
      {/* Restaurant Details Form */}
      <Form {...restaurantForm}>
        <form onSubmit={restaurantForm.handleSubmit(handleRestaurantDetailsSubmit)} className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center"><Store className="mr-2 h-5 w-5" />Restaurant Details</CardTitle>
              <CardDescription>Update your restaurant's name, address, and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={restaurantForm.control} name="restaurantName" render={({ field }) => ( <FormItem> <FormLabel>Restaurant Name</FormLabel><FormControl><Input placeholder="Your Restaurant LLC" {...field} /></FormControl><FormMessage /> </FormItem> )}/>
              <FormField control={restaurantForm.control} name="restaurantAddress" render={({ field }) => ( <FormItem> <FormLabel>Address</FormLabel><FormControl><Input placeholder="123 Main St, City" {...field} /></FormControl><FormMessage /> </FormItem> )}/>
              <FormField control={restaurantForm.control} name="restaurantContact" render={({ field }) => ( <FormItem> <FormLabel>Contact Info (Phone/Email)</FormLabel><FormControl><Input placeholder="98XXXXXXX / info@example.com" {...field} /></FormControl><FormMessage /> </FormItem> )}/>
              <Button type="submit" disabled={restaurantForm.formState.isSubmitting}> <Save className="mr-2 h-4 w-4" /> Save Restaurant Details </Button>
            </CardContent>
          </Card>
        </form>
      </Form>

      {/* Branding Form */}
      <Form {...brandingForm}>
        <form onSubmit={brandingForm.handleSubmit(handleBrandingSubmit)} className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center"><ImageIcon className="mr-2 h-5 w-5" />Branding</CardTitle>
              <CardDescription>Set your restaurant's logo. Provide a direct image URL.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={brandingForm.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl><Input placeholder="https://example.com/logo.png or https://placehold.co/100x40.png" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {settings.logoUrl && (
                <div className="mt-2">
                  <Label>Current Logo Preview:</Label>
                  <div className="mt-1 p-2 border rounded-md inline-block bg-muted">
                    <Image src={settings.logoUrl} alt="Logo Preview" width={100} height={40} className="object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                </div>
              )}
              <Button type="submit" disabled={brandingForm.formState.isSubmitting}>
                <Save className="mr-2 h-4 w-4" /> Save Branding
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>


      {/* Tax & Charges Form */}
      <Form {...taxForm}>
        <form onSubmit={taxForm.handleSubmit(handleTaxChargesSubmit)} className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center"><Percent className="mr-2 h-5 w-5" />Tax & Charges</CardTitle>
              <CardDescription>Configure VAT and service charge percentages (e.g., 0.13 for 13%).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={taxForm.control} name="vatRate" render={({ field }) => ( <FormItem> <FormLabel>VAT Rate</FormLabel><FormControl><Input type="number" step="0.01" placeholder="e.g., 0.13" {...field} /></FormControl><FormMessage /> </FormItem> )}/>
              <FormField control={taxForm.control} name="serviceChargeRate" render={({ field }) => ( <FormItem> <FormLabel>Service Charge Rate</FormLabel><FormControl><Input type="number" step="0.01" placeholder="e.g., 0.10" {...field} /></FormControl><FormMessage /> </FormItem> )}/>
              <Button type="submit" disabled={taxForm.formState.isSubmitting}> <Save className="mr-2 h-4 w-4" /> Save Tax & Charges </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
      
      {/* Printers & Devices Section */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-xl flex items-center"><Server className="mr-2 h-5 w-5" />Printers & Devices</CardTitle>
            <CardDescription>Manage connected receipt printers and other devices. (Mock)</CardDescription>
          </div>
          <Dialog open={isPrinterDialogOpen} onOpenChange={setIsPrinterDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default"><PlusCircle className="mr-2 h-4 w-4" /> Add Printer</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Printer</DialogTitle>
              </DialogHeader>
              <Form {...printerForm}>
                <form onSubmit={printerForm.handleSubmit(handleAddPrinterSubmit)} className="space-y-4">
                  <FormField control={printerForm.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Printer Name</FormLabel><FormControl><Input placeholder="e.g., Main Receipt Printer" {...field} /></FormControl><FormMessage /> </FormItem> )}/>
                  <FormField control={printerForm.control} name="type" render={({ field }) => ( <FormItem> <FormLabel>Printer Type</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl><SelectContent> <SelectItem value="Receipt">Receipt</SelectItem> <SelectItem value="Kitchen">Kitchen</SelectItem> <SelectItem value="Label">Label</SelectItem> </SelectContent> </Select><FormMessage /> </FormItem> )}/>
                  <DialogFooter>
                    <Button type="submit">Add Printer</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {settings.printers.length === 0 ? (
            <p className="text-muted-foreground">No printers configured yet.</p>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead className="text-center">Default</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {settings.printers.map((printer) => (
                  <TableRow key={printer.id}>
                    <TableCell>{printer.name}</TableCell>
                    <TableCell>{printer.type}</TableCell>
                    <TableCell className="text-center">
                      {settings.defaultPrinterId === printer.id ? 
                        (<CheckCircle className="h-5 w-5 text-green-500 mx-auto" />) : 
                        (<Button variant="ghost" size="sm" onClick={() => handleSetDefaultPrinter(printer.id)}>Set Default</Button>)
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Confirm Deletion</AlertDialogTitle><AlertDialogDescription>Are you sure you want to remove the printer "{printer.name}"?</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleRemovePrinter(printer.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* User Management Section */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-xl flex items-center"><Users className="mr-2 h-5 w-5" />User Management</CardTitle>
            <CardDescription>Add or remove staff accounts and manage permissions. (Mock)</CardDescription>
          </div>
           <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default"><PlusCircle className="mr-2 h-4 w-4" /> Add User</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <Form {...userForm}>
                <form onSubmit={userForm.handleSubmit(handleAddUserSubmit)} className="space-y-4">
                  <FormField control={userForm.control} name="username" render={({ field }) => ( <FormItem> <FormLabel>Username</FormLabel><FormControl><Input placeholder="e.g., john.doe" {...field} /></FormControl><FormMessage /> </FormItem> )}/>
                  <FormField control={userForm.control} name="role" render={({ field }) => ( <FormItem> <FormLabel>Role</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger></FormControl><SelectContent> <SelectItem value="Admin">Admin</SelectItem> <SelectItem value="Manager">Manager</SelectItem> <SelectItem value="Staff">Staff</SelectItem> </SelectContent> </Select><FormMessage /> </FormItem> )}/>
                  <DialogFooter>
                    <Button type="submit">Add User</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
           {settings.users.length === 0 ? (
            <p className="text-muted-foreground">No users configured yet.</p>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Username</TableHead><TableHead>Role</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {settings.users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEditUserRoleDialog(user)}><Edit className="h-4 w-4" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Confirm Deletion</AlertDialogTitle><AlertDialogDescription>Are you sure you want to remove the user "{user.username}"?</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleRemoveUser(user.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit User Role Dialog */}
      {editingUser && (
        <Dialog open={isEditUserRoleDialogOpen} onOpenChange={(open) => { if (!open) setEditingUser(null); setIsEditUserRoleDialogOpen(open);}}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Role for {editingUser.username}</DialogTitle>
            </DialogHeader>
            <Form {...editUserRoleForm}>
              <form onSubmit={editUserRoleForm.handleSubmit(handleUpdateUserRoleSubmit)} className="space-y-4">
                <FormField
                  control={editUserRoleForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select new role" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="Staff">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                  <Button type="submit">Save Role</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}

    </div>
  )
}
