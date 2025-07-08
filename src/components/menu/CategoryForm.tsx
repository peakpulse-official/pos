
// src/components/menu/CategoryForm.tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { MenuCategory } from "@/lib/types"
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
import { useEffect } from "react"
import { DynamicIcon } from "@/components/DynamicIcon"

const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters."),
  iconName: z.string().min(2, "Icon name is required (e.g., Coffee, Pizza).").optional(),
})

type CategoryFormValues = z.infer<typeof categorySchema>

interface CategoryFormProps {
  onSubmit: (data: CategoryFormValues) => void
  initialData?: MenuCategory
  onCancel: () => void
}

export function CategoryForm({ onSubmit, initialData, onCancel }: CategoryFormProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData || { name: "", iconName: "" },
  })

  useEffect(() => {
    form.reset(initialData || { name: "", iconName: "" });
  }, [initialData, form]);

  const iconNameValue = form.watch("iconName");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Beverages" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="iconName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lucide Icon Name</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input placeholder="e.g., Coffee" {...field} />
                </FormControl>
                {iconNameValue && <DynamicIcon name={iconNameValue} className="h-6 w-6 text-primary" />}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{initialData ? "Save Changes" : "Add Category"}</Button>
        </div>
      </form>
    </Form>
  )
}
