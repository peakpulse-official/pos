// src/components/recommendations/RecommendationForm.tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Lightbulb } from "lucide-react"
import type { DishRecommendationInput } from "@/ai/flows/dish-recommendation"

const recommendationSchema = z.object({
  timeOfDay: z.enum(["morning", "afternoon", "evening", "night"], {
    required_error: "Please select a time of day.",
  }),
  orderHistory: z.string().optional(),
})

type RecommendationFormValues = z.infer<typeof recommendationSchema>

interface RecommendationFormProps {
  onSubmit: (data: DishRecommendationInput) => void
  isLoading: boolean
}

export function RecommendationForm({ onSubmit, isLoading }: RecommendationFormProps) {
  const form = useForm<RecommendationFormValues>({
    resolver: zodResolver(recommendationSchema),
    defaultValues: {
      timeOfDay: "afternoon",
      orderHistory: "",
    },
  })

  const handleSubmit = (values: RecommendationFormValues) => {
    onSubmit(values as DishRecommendationInput)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="timeOfDay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time of Day</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time of day" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                  <SelectItem value="night">Night</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="orderHistory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order History (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Dal Bhat, Chicken Mo:Mo, Sel Roti"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Lightbulb className="mr-2 h-5 w-5" />
          )}
          Get Recommendation
        </Button>
      </form>
    </Form>
  )
}
