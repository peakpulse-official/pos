// src/components/order/MenuItemCard.tsx
"use client"

import Image from "next/image"
import type { MenuItem } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

interface MenuItemCardProps {
  item: MenuItem
  onAddItem: (item: MenuItem) => void
}

export function MenuItemCard({ item, onAddItem }: MenuItemCardProps) {
  return (
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
        <p className="text-lg font-semibold text-primary">NPR {item.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button onClick={() => onAddItem(item)} className="w-full" variant="default">
          <PlusCircle className="mr-2 h-5 w-5" /> Add to Order
        </Button>
      </CardFooter>
    </Card>
  )
}
