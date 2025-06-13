// src/components/order/MenuItemCard.tsx
"use client"

import Image from "next/image"
import type { MenuItem } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, ReceiptText } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MenuItemCardProps {
  item: MenuItem
  onAddItem: (item: MenuItem) => void
}

export function MenuItemCard({ item, onAddItem }: MenuItemCardProps) {
  const [recipeItem, setRecipeItem] = useState<MenuItem | null>(null);

  const getRecipeSnippet = (recipe?: string, maxLength = 50) => {
    if (!recipe) return "";
    if (recipe.length <= maxLength) return recipe;
    return recipe.substring(0, maxLength) + "...";
  }

  return (
    <>
      <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="p-0">
          {item.imageUrl && (
            <div className="relative h-40 w-full">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                data-ai-hint={item.dataAiHint}
              />
            </div>
          )}
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-headline mb-1">{item.name}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground mb-2 h-10 overflow-hidden">
            {item.description || 'Delicious item from our menu.'}
          </CardDescription>
          {item.recipe && (
            <div className="text-xs text-muted-foreground mt-1 mb-2">
              <p> {/* Removed truncate class from here */}
                <strong>Recipe: </strong>{getRecipeSnippet(item.recipe, 50)}
                {item.recipe.length > 50 && (
                  <Button variant="link" size="sm" className="p-0 h-auto ml-1 text-xs align-baseline" onClick={() => setRecipeItem(item)}>
                    View
                  </Button>
                )}
              </p>
            </div>
          )}
          <p className="text-lg font-semibold text-primary">NPR {item.price.toFixed(2)}</p>
        </CardContent>
        <CardFooter className="p-4 border-t">
          <Button onClick={() => onAddItem(item)} className="w-full" variant="default">
            <PlusCircle className="mr-2 h-5 w-5" /> Add to Order
          </Button>
        </CardFooter>
      </Card>

      {recipeItem && (
        <Dialog open={!!recipeItem} onOpenChange={() => setRecipeItem(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-headline text-xl flex items-center">
                <ReceiptText className="mr-2 h-6 w-6 text-primary" /> Recipe for {recipeItem.name}
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] mt-4">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap p-1">
                {recipeItem.recipe}
                </p>
            </ScrollArea>
            <DialogClose asChild className="mt-4">
              <Button type="button" variant="outline">Close</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
