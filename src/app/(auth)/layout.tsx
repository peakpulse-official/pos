// src/app/(auth)/layout.tsx
import { ChefHat } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
       <div className="mb-8 text-center">
        <ChefHat className="mx-auto h-16 w-16 text-primary mb-3" />
        <h1 className="text-4xl font-headline font-bold text-primary">Annapurna POS</h1>
        <p className="text-muted-foreground">Welcome! Please sign in or create an account.</p>
      </div>
      {children}
    </div>
  )
}
