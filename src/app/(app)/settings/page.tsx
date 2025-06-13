// src/app/(app)/settings/page.tsx
"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useSettings } from "@/contexts/SettingsContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Settings as SettingsIcon, Save, Store, Percent, Server, Users } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const restaurantDetailsSchema = z.object({
  restaurantName: z.string().min(1, "Restaurant name is required"),
  restaurantAddress: z.string().min(1, "Restaurant address is required"),
  restaurantContact: z.string().optional(),
})

const taxChargesSchema = z.object({
  vatRate: z.coerce.number().min(0, "VAT rate must be non-negative").max(1, "VAT rate must be less than or equal to 1 (e.g., 0.13 for 13%)"),
  serviceChargeRate: z.coerce.number().min(0, "Service charge must be non-negative").max(1, "Service charge must be less than or equal to 1 (e.g., 0.10 for 10%)"),
})

type RestaurantDetailsFormValues = z.infer<typeof restaurantDetailsSchema>
type TaxChargesFormValues = z.infer<typeof taxChargesSchema>

export default function SettingsPage() {
  const { settings, updateSettings, isLoading } = useSettings()
  const { toast } = useToast()

  const restaurantForm = useForm<RestaurantDetailsFormValues>({
    resolver: zodResolver(restaurantDetailsSchema),
    defaultValues: settings,
  })

  const taxForm = useForm<TaxChargesFormValues>({
    resolver: zodResolver(taxChargesSchema),
    defaultValues: settings,
  })

  // Effect to reset form when settings are loaded/changed
  React.useEffect(() => {
    if (!isLoading) {
      restaurantForm.reset(settings)
      taxForm.reset(settings)
    }
  }, [settings, isLoading, restaurantForm, taxForm])


  const handleRestaurantDetailsSubmit = (data: RestaurantDetailsFormValues) => {
    updateSettings(data)
    toast({ title: "Restaurant Details Updated", description: "Your restaurant information has been saved." })
  }

  const handleTaxChargesSubmit = (data: TaxChargesFormValues) => {
    updateSettings(data)
    toast({ title: "Tax & Charges Updated", description: "VAT and service charge rates have been saved." })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <SettingsIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-headline font-bold text-primary">Settings</h1>
        </div>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <SettingsIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-headline font-bold text-primary">Settings</h1>
      </div>
      
      <Form {...restaurantForm}>
        <form onSubmit={restaurantForm.handleSubmit(handleRestaurantDetailsSubmit)} className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center"><Store className="mr-2 h-5 w-5" />Restaurant Details</CardTitle>
              <CardDescription>Update your restaurant's name, address, and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={restaurantForm.control}
                name="restaurantName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Restaurant Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Restaurant LLC" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={restaurantForm.control}
                name="restaurantAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={restaurantForm.control}
                name="restaurantContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Info (Phone/Email)</FormLabel>
                    <FormControl>
                      <Input placeholder="98XXXXXXX / info@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={restaurantForm.formState.isSubmitting}>
                <Save className="mr-2 h-4 w-4" /> Save Restaurant Details
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>

      <Form {...taxForm}>
        <form onSubmit={taxForm.handleSubmit(handleTaxChargesSubmit)} className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center"><Percent className="mr-2 h-5 w-5" />Tax & Charges</CardTitle>
              <CardDescription>Configure VAT and service charge percentages (e.g., 0.13 for 13%).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={taxForm.control}
                name="vatRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VAT Rate</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 0.13" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={taxForm.control}
                name="serviceChargeRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Charge Rate</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 0.10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={taxForm.formState.isSubmitting}>
                <Save className="mr-2 h-4 w-4" /> Save Tax & Charges
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center"><Server className="mr-2 h-5 w-5" />Printers & Devices</CardTitle>
          <CardDescription>Manage connected receipt printers and other devices.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This feature is under construction and will be available in a future update.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center"><Users className="mr-2 h-5 w-5" />User Management</CardTitle>
          <CardDescription>Add or remove staff accounts and manage permissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This feature is under construction and will be available in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
