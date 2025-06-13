// src/app/(app)/recommendations/page.tsx
"use client"

import { useState } from "react"
import { RecommendationForm } from "@/components/recommendations/RecommendationForm"
import { RecommendationDisplay } from "@/components/recommendations/RecommendationDisplay"
import { getDishRecommendation } from "@/ai/flows/dish-recommendation"
import type { DishRecommendationInput, DishRecommendationOutput } from "@/ai/flows/dish-recommendation"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export default function RecommendationsPage() {
  const [recommendation, setRecommendation] = useState<DishRecommendationOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleGetRecommendation = async (data: DishRecommendationInput) => {
    setIsLoading(true)
    setRecommendation(null) // Clear previous recommendation
    try {
      const result = await getDishRecommendation(data)
      setRecommendation(result)
      toast({
        title: "Recommendation Ready!",
        description: `We suggest trying ${result.dishName}.`,
      })
    } catch (error) {
      console.error("Error getting recommendation:", error)
      toast({
        title: "Error",
        description: "Could not fetch recommendation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <Sparkles className="mx-auto h-12 w-12 text-primary mb-2" />
        <h1 className="text-3xl font-headline font-bold text-primary">AI Dish Advisor</h1>
        <p className="text-muted-foreground mt-1">
          Let our AI suggest a popular Nepali dish based on your preferences!
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Find Your Next Favorite Dish</CardTitle>
          <CardDescription>
            Tell us a bit about the context, and we'll suggest something delicious.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecommendationForm onSubmit={handleGetRecommendation} isLoading={isLoading} />
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="mt-8 text-center">
            <div role="status" className="flex justify-center items-center space-x-2">
                <svg aria-hidden="true" className="w-8 h-8 text-primary animate-spin fill-accent" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5424 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="text-muted-foreground">Generating recommendation...</span>
            </div>
        </div>
      )}
      
      {!isLoading && recommendation && (
        <RecommendationDisplay recommendation={recommendation} />
      )}
      {!isLoading && !recommendation && (
         <RecommendationDisplay recommendation={null} />
      )}
    </div>
  )
}
