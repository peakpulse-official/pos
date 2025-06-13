// src/components/floor-plan/WaiterForm.tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { Waiter } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useEffect } from "react"

const waiterSchema = z.object({
  name: z.string().min(2, "Waiter name must be at least 2 characters."),
})

type WaiterFormValues = z.infer<typeof waiterSchema>

interface WaiterFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: WaiterFormValues) => void
  initialData?: Waiter // For future editing
}

export function WaiterForm({ isOpen, onClose, onSubmit, initialData }: WaiterFormProps) {
  const form = useForm<WaiterFormValues>({
    resolver: zodResolver(waiterSchema),
    defaultValues: {
      name: initialData?.name || "",
    },
  })

  useEffect(() => {
    if (isOpen) { // Reset form only when dialog opens
      form.reset({
        name: initialData?.name || "",
      })
    }
  }, [initialData, form, isOpen])

  const handleFormSubmit = (values: WaiterFormValues) => {
    onSubmit(values)
    form.reset() // Reset after successful submission
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-xl">
            {initialData ? "Edit Waiter" : "Add New Waiter"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Waiter Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Ram Bahadur" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">
                {initialData ? "Save Changes" : "Add Waiter"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
