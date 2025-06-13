// src/components/floor-plan/TableForm.tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { TableDefinition } from "@/lib/types"
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

const tableSchema = z.object({
  name: z.string().min(1, "Table name/number is required."),
  capacity: z.coerce.number().int().min(1, "Capacity must be at least 1."),
})

type TableFormValues = z.infer<typeof tableSchema>

interface TableFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TableFormValues) => void
  initialData?: TableDefinition
}

export function TableForm({ isOpen, onClose, onSubmit, initialData }: TableFormProps) {
  const form = useForm<TableFormValues>({
    resolver: zodResolver(tableSchema),
    defaultValues: {
      name: initialData?.name || "",
      capacity: initialData?.capacity || 2,
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        capacity: initialData.capacity,
      })
    } else {
      form.reset({ name: "", capacity: 2 })
    }
  }, [initialData, form, isOpen]) // Reset form when dialog opens or initialData changes

  const handleFormSubmit = (values: TableFormValues) => {
    onSubmit(values)
    form.reset() // Reset after successful submission
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-xl">
            {initialData ? "Edit Table" : "Add New Table"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Table Name/Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., T1, Window Table" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 4" {...field} />
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
                {initialData ? "Save Changes" : "Add Table"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
