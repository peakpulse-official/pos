// src/components/floor-plan/TableForm.tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { TableDefinition } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useEffect } from "react"

const tableSchema = z.object({
  name: z.string().min(1, "Table name/number is required."),
  capacity: z.coerce.number().int().min(1, "Capacity must be at least 1."),
  shape: z.enum(["rectangle", "square", "circle"], { required_error: "Please select a shape." }),
})

type TableFormValues = z.infer<typeof tableSchema>

interface TableFormProps {
  onCancel: () => void
  onSubmit: (data: TableFormValues) => void
  initialData?: TableDefinition
}

export function TableForm({ onCancel, onSubmit, initialData }: TableFormProps) {
  const form = useForm<TableFormValues>({
    resolver: zodResolver(tableSchema),
    defaultValues: initialData || {
      name: "",
      capacity: 2,
      shape: "rectangle",
    },
  })

  useEffect(() => {
    form.reset(
      initialData || {
        name: "",
        capacity: 2,
        shape: "rectangle",
      }
    )
  }, [initialData, form])

  const handleFormSubmit = (values: TableFormValues) => {
    onSubmit(values)
  }

  return (
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
         <FormField
          control={form.control}
          name="shape"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Table Shape</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                  className="flex flex-row space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl><RadioGroupItem value="rectangle" /></FormControl>
                    <FormLabel className="font-normal">Rectangle</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl><RadioGroupItem value="square" /></FormControl>
                    <FormLabel className="font-normal">Square</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl><RadioGroupItem value="circle" /></FormControl>
                    <FormLabel className="font-normal">Circle</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
            </Button>
            <Button type="submit">
                {initialData ? "Save Changes" : "Add Table"}
            </Button>
        </div>
      </form>
    </Form>
  )
}
