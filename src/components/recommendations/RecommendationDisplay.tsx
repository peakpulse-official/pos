// src/components/recommendations/RecommendationDisplay.tsx
import type { DishRecommendationOutput } from "@/ai/flows/dish-recommendation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Utensils, Zap } from "lucide-react"

interface RecommendationDisplayProps {
  recommendation: DishRecommendationOutput | null
}

export function RecommendationDisplay({ recommendation }: RecommendationDisplayProps) {
  if (!recommendation) {
    return (
       <Card className="mt-8 shadow-lg min-h-[200px] flex flex-col items-center justify-center">
        <CardHeader className="items-center">
          <Zap className="h-12 w-12 text-muted-foreground mb-2" />
          <CardTitle className="font-headline text-xl">Awaiting Your Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Enter the time of day and optionally some order history to get a dish recommendation.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-8 shadow-xl animate-in fade-in-50 duration-500">
      <CardHeader className="bg-primary/10 rounded-t-lg">
        <div className="flex items-center space-x-3">
            <Utensils className="h-8 w-8 text-primary" />
            <div>
                <CardTitle className="font-headline text-2xl text-primary">{recommendation.dishName}</CardTitle>
                <CardDescription className="text-primary/80">Our AI's Top Pick For You!</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-3">
        <div>
          <h4 className="font-semibold text-foreground mb-1">Description:</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{recommendation.description}</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-1">Why this dish?</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{recommendation.reason}</p>
        </div>
      </CardContent>
    </Card>
  )
}
