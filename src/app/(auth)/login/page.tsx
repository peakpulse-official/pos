
// src/app/(auth)/login/page.tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { LogIn, UserPlus } from "lucide-react"
import { useSettings } from "@/contexts/SettingsContext"

const loginSchema = z.object({
  email: z.string().min(1, { message: "Username (email) is required." }), 
  password: z.string().min(1, { message: "Password is required." }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { loginUser, isLoading } = useSettings()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    const authenticatedUser = await loginUser(data.email, data.password)

    if (authenticatedUser) {
      toast({
        title: "Login Successful",
        description: `Welcome back, ${authenticatedUser.username}! (Role: ${authenticatedUser.role})`,
        variant: "default"
      })
      // Redirect based on role
      if (authenticatedUser.role === 'Admin') {
        router.push("/floor-plan")
      } else if (authenticatedUser.role === 'Manager' || authenticatedUser.role === 'Waiter') {
        router.push("/dashboard") // Redirect Manager and Waiter to dashboard
      } else {
        router.push("/order") // Default page if role is somehow different
      }
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password. (Hint: For prototype, try 'admin@example.com' with 'password123' or any user from settings with their set password or 'password123' if unset).",
        variant: "destructive"
      })
      form.setError("email", { type: "manual", message: " " }) 
      form.setError("password", { type: "manual", message: "Invalid username or password." })
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <LogIn className="mx-auto h-10 w-10 text-primary mb-2" />
        <CardTitle className="font-headline text-2xl">Sign In</CardTitle>
        <CardDescription>Welcome back! Sign in to access Annapurna POS.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username (Email)</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="user@example.com or username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <Button variant="link" asChild className="p-0 h-auto text-sm justify-start">
                <Link href="#">Forgot password? (Mock)</Link>
            </Button>
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || isLoading}>
              {form.formState.isSubmitting || isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center text-sm">
        <p className="text-muted-foreground">Don't have an account?</p>
        <Button variant="link" asChild className="p-1">
          <Link href="/register">
            <UserPlus className="mr-2 h-4 w-4" /> Create Account (Mock)
          </Link>
        </Button>
         <p className="text-xs text-muted-foreground mt-4 text-center">
            Prototype Login: Use 'admin@example.com' with password 'password123', or any user added in Settings (default password 'password123' or as set by admin).
        </p>
      </CardFooter>
    </Card>
  )
}
