
// src/app/(app)/setup-guide/page.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Rocket, AlertTriangle, Database, Users, Printer, Wifi, Cloud, ShieldCheck, HardDrive, Cpu, ShoppingCart, KeyRound, Terminal, Package, ListChecks, ShieldQuestion } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SetupGuidePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <Rocket className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-headline font-bold text-primary">From Prototype to Production: Setup Guide</h1>
      </div>

      <Alert variant="destructive" className="shadow-md">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle className="font-headline text-lg">Important: Prototype Status</AlertTitle>
        <AlertDescription>
          The Annapurna POS application you are currently viewing is a **prototype**.
          It uses browser LocalStorage for data and mocks certain features like real printer integration and real-time multi-user interactions.
          To use this in a real restaurant, significant development work is required as outlined below. This guide provides a roadmap for that transition.
          You will likely need software development expertise to implement these steps.
        </AlertDescription>
      </Alert>

      <Accordion type="multiple" className="w-full space-y-4" defaultValue={["item-data-management", "item-auth", "item-local-dev"]}>
        <Card className="shadow-lg">
          <AccordionItem value="item-data-management" className="border-b-0">
            <AccordionTrigger className="p-6 hover:no-underline">
              <div className="flex items-start text-left space-x-3">
                <Database className="h-7 w-7 text-primary mt-1" />
                <div>
                  <CardTitle className="font-headline text-xl">1. Data Management: Beyond LocalStorage</CardTitle>
                  <CardDescription className="mt-1">Storing your data reliably and making it accessible across devices. (Crucial First Step)</CardDescription>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-3 text-sm">
                <p className="font-semibold text-destructive">Crucial: LocalStorage is NOT for production.</p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                  <li>Data is only on one browser, not shared between devices or users.</li>
                  <li>Easily lost if browser data is cleared.</li>
                  <li>No backups or central management.</li>
                  <li>Cannot support multiple staff members using the POS simultaneously.</li>
                </ul>
                <p><strong>Solution: Implement a Centralized Database.</strong></p>
                <ol className="list-decimal list-inside space-y-4 pl-4">
                  <li>
                    <strong>Choose a Database Provider:</strong>
                    <ul className="list-disc list-inside space-y-2 pl-6 mt-1">
                      <li><strong>Supabase (Recommended):</strong> Provides a generous free-tier PostgreSQL database, authentication, and auto-generated APIs. It's an excellent all-in-one backend solution. <Link href="https://supabase.com/" target="_blank" className="text-primary hover:underline">Learn more about Supabase</Link>.</li>
                       <li><strong>Cloud Firestore (Firebase):</strong> A NoSQL, real-time database that scales well and integrates easily with other Firebase services (like Authentication). Perfect for features like live order status updates. <Link href="https://firebase.google.com/docs/firestore" target="_blank" className="text-primary hover:underline">Learn more about Firestore</Link>.</li>
                    </ul>
                  </li>
                   <li>
                    <strong>Set Up Environment Variables:</strong>
                    <p className="mt-1">Never hard-code your database credentials in your application code. Create a file named <code className="bg-muted px-1.5 py-0.5 rounded-sm">.env.local</code> in the root of your project. Your database provider (e.g., Supabase) will give you a connection string or URL. Add it to this file:</p>
                     <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto my-1"><code className="language-bash">{
`# .env.local
DATABASE_URL="your-supabase-connection-string-goes-here"`}
                      </code></pre>
                       <p className="mt-1">Ensure <code className="bg-muted px-1.5 py-0.5 rounded-sm">.env.local</code> is listed in your <code className="bg-muted px-1.5 py-0.5 rounded-sm">.gitignore</code> file to prevent it from being committed to version control.</p>
                  </li>
                  <li>
                    <strong>Modify Application Code (Significant Development):</strong> This is a major development task. You will need to use a database client library (like <code className="bg-muted px-1.5 py-0.5 rounded-sm">pg</code> for PostgreSQL or an ORM like Drizzle/Prisma) to replace ALL LocalStorage reads/writes with database operations. This impacts nearly every page, especially menu, orders, tables, and settings.
                  </li>
                  <li>
                    <strong>Example Database Schema (SQL):</strong> Plan how your data will be organized.
                      <p className="mt-1">Example SQL for <code className="bg-muted px-1.5 py-0.5 rounded-sm">orders</code> and <code className="bg-muted px-1.5 py-0.5 rounded-sm">order_items</code> tables (PostgreSQL syntax, compatible with Supabase):</p>
                      <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto my-1"><code className="language-sql">{
`-- Represents a single customer order
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  order_type VARCHAR(20) NOT NULL, -- 'dine-in', 'takeout', 'delivery'
  order_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'in_kitchen', 'ready', 'completed', 'cancelled'
  payment_status VARCHAR(50) NOT NULL DEFAULT 'unpaid', -- 'unpaid', 'paid', 'refunded'
  customer_name VARCHAR(255),
  subtotal DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  -- Foreign keys can link to tables, waiters etc.
  -- table_id UUID REFERENCES restaurant_tables(id), 
  -- waiter_id UUID REFERENCES app_users(id), 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Links items from the menu to a specific order
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id),
  quantity INTEGER NOT NULL,
  price_at_time DECIMAL(10, 2) NOT NULL -- Price when the order was placed
);`}
                      </code></pre>
                  </li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Card>
        
        <Card className="shadow-lg">
          <AccordionItem value="item-auth" className="border-b-0">
            <AccordionTrigger className="p-6 hover:no-underline">
              <div className="flex items-start text-left space-x-3">
                <KeyRound className="h-7 w-7 text-primary mt-1" />
                <div>
                  <CardTitle className="font-headline text-xl">2. User Authentication & Roles</CardTitle>
                  <CardDescription className="mt-1">Securely managing user accounts, roles, and passwords with a backend system.</CardDescription>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-3 text-sm">
                <p>The current login is a mockup. A real system needs a secure backend.</p>
                <ol className="list-decimal list-inside space-y-2 pl-4">
                  <li>
                    <strong>Choose an Authentication Provider:</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li><strong>Firebase Authentication (Recommended):</strong> Provides secure sign-in, password resets, etc. <Link href="https://firebase.google.com/docs/auth" target="_blank" className="text-primary hover:underline">Learn more</Link>.</li>
                      <li><strong>Supabase Auth:</strong> Included with Supabase, works well with its database.</li>
                      <li><strong>NextAuth.js:</strong> Comprehensive open-source solution for Next.js.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Role-Based Access Control (RBAC):</strong>
                      <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                          <li>The current prototype has roles like 'Admin', 'Manager', and 'Waiter'. In production, these roles must be stored in your database against a user's profile.</li>
                          <li>Backend API endpoints must be protected. Before performing an action (e.g., deleting a menu item), the server must verify the user's role. Hiding buttons on the frontend is not sufficient security.</li>
                      </ul>
                  </li>
                  <li>
                    <strong>Waiter Self-Assignment Logic:</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li>The "Waiter View" allows a logged-in waiter to assign themselves to a vacant table.</li>
                      <li>In a production app, this action should update a <code className="bg-muted px-1.5 py-0.5 rounded-sm">waiter_id</code> field on the <code className="bg-muted px-1.5 py-0.5 rounded-sm">restaurant_tables</code> table in your database.</li>
                      <li>All subsequent actions on that table must be checked on the backend to ensure the user is the assigned waiter, a Manager, or an Admin.</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Card>
        
        <Card className="shadow-lg">
          <AccordionItem value="item-order-status" className="border-b-0">
            <AccordionTrigger className="p-6 hover:no-underline">
              <div className="flex items-start text-left space-x-3">
                <Package className="h-7 w-7 text-primary mt-1" />
                <div>
                  <CardTitle className="font-headline text-xl">3. Order Status & Kitchen Display</CardTitle>
                  <CardDescription className="mt-1">Tracking orders from confirmation to completion.</CardDescription>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-3 text-sm">
                <p>This prototype includes a system for tracking order and payment status.</p>
                <ol className="list-decimal list-inside space-y-2 pl-4">
                  <li>
                    <strong>Status Fields:</strong> Each order has an <code className="bg-muted px-1.5 py-0.5 rounded-sm">orderStatus</code> (e.g., 'confirmed', 'in_kitchen', 'ready') and a <code className="bg-muted px-1.5 py-0.5 rounded-sm">paymentStatus</code> ('paid', 'unpaid'). These must be columns in your database's <code className="bg-muted px-1.5 py-0.5 rounded-sm">orders</code> table.
                  </li>
                  <li>
                    <strong>Order Management Page:</strong> The "All Orders" page allows managers to manually update the status of an order. In production, this would trigger a database update.
                  </li>
                  <li>
                    <strong>Production Kitchen Display System (KDS):</strong>
                      <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                        <li>For a real kitchen, you need a dedicated KDS screen. This screen would display new orders in real time.</li>
                        <li>This requires a real-time database like Firestore or implementing WebSockets with Supabase. When an order's status is updated to 'in_kitchen', it should instantly appear on the KDS.</li>
                        <li>The KDS would allow cooks to mark orders as 'ready', which would then notify waiters or the front counter in real time.</li>
                      </ul>
                  </li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Card>
        
        <Card className="shadow-lg">
          <AccordionItem value="item-hosting" className="border-b-0">
            <AccordionTrigger className="p-6 hover:no-underline">
              <div className="flex items-start text-left space-x-3">
                <Cloud className="h-7 w-7 text-primary mt-1" />
                <div>
                  <CardTitle className="font-headline text-xl">4. Production Build & Hosting</CardTitle>
                  <CardDescription className="mt-1">Taking your app live on platforms like Vercel.</CardDescription>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-3 text-sm">
                 <p>Your app needs a permanent home on the internet accessible to your devices.</p>
                <ol className="list-decimal list-inside space-y-4 pl-4">
                  <li>
                    <strong>Push to a Git Repository:</strong>
                    <p className="mt-1">Hosting providers like Vercel deploy directly from Git. Push your project to a repository on <Link href="https://github.com" target="_blank" className="text-primary hover:underline">GitHub</Link>, GitLab, or Bitbucket.</p>
                  </li>
                  <li>
                    <strong>Choose a Hosting Provider:</strong>
                    <ul className="list-disc list-inside space-y-2 pl-6 mt-1">
                      <li><strong>Vercel (Recommended for Next.js):</strong> Created by the makers of Next.js, Vercel offers seamless deployment, a generous free tier, and automatically handles build steps. <Link href="https://vercel.com" target="_blank" className="text-primary hover:underline">Learn more</Link>.</li>
                      <li><strong>Firebase App Hosting:</strong> Also supports Next.js server-side features needed for Genkit AI. Your <code className="bg-muted px-1.5 py-0.5 rounded-sm">apphosting.yaml</code> is a starting point.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Deploying to Vercel (Step-by-Step):</strong>
                     <ol className="list-decimal list-inside space-y-2 pl-6 mt-2">
                        <li>Sign up on Vercel and connect your Git account (e.g., GitHub).</li>
                        <li>Create a "New Project" and import your POS application's repository.</li>
                        <li>Vercel will automatically detect that it's a Next.js project.</li>
                        <li>Go to the project's "Settings" tab and find "Environment Variables".</li>
                        <li>Add your <code className="bg-muted px-1.5 py-0.5 rounded-sm">DATABASE_URL</code> and any other secrets from your <code className="bg-muted px-1.5 py-0.5 rounded-sm">.env.local</code> file. This keeps your credentials secure.</li>
                        <li>Click "Deploy". Vercel will build and host your application. It will automatically redeploy every time you push a change to your main Git branch.</li>
                    </ol>
                  </li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Card>

        <Card className="shadow-lg">
          <AccordionItem value="item-local-dev" className="border-b-0">
            <AccordionTrigger className="p-6 hover:no-underline">
              <div className="flex items-start text-left space-x-3">
                <Terminal className="h-7 w-7 text-primary mt-1" />
                <div>
                  <CardTitle className="font-headline text-xl">5. Running the App Locally</CardTitle>
                  <CardDescription className="mt-1">How to set up and run this Next.js project on your personal computer.</CardDescription>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-3 text-sm">
                <p>You can run this application on your local machine for development and testing. Here’s a step-by-step guide:</p>
                <ol className="list-decimal list-inside space-y-4 pl-4">
                  <li>
                    <strong>Download the Project Files:</strong>
                    <p className="pl-4 mt-1 text-muted-foreground">First, you need to download the complete source code of this application from Firebase Studio to a folder on your computer.</p>
                  </li>
                  <li>
                    <strong>Install Node.js and npm:</strong>
                    <p className="pl-4 mt-1 text-muted-foreground">If you don't already have them, you must install Node.js (which includes npm, the Node Package Manager). You can download it from the official website: <Link href="https://nodejs.org/" target="_blank" className="text-primary hover:underline">nodejs.org</Link>.</p>
                  </li>
                  <li>
                    <strong>Install Project Dependencies:</strong>
                    <p className="pl-4 mt-1 text-muted-foreground">Open a terminal (like Command Prompt, PowerShell, or Terminal on macOS/Linux) and navigate to the root directory of your downloaded project folder. Then, run the following command:</p>
                    <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto my-1"><code className="language-bash">npm install</code></pre>
                    <p className="pl-4 mt-1 text-muted-foreground">This command reads the `package.json` file and installs all the necessary libraries and packages the project depends on.</p>
                  </li>
                  <li>
                    <strong>Run the Development Servers:</strong>
                    <p className="pl-4 mt-1 text-muted-foreground">This project requires two separate servers to run simultaneously in two different terminal windows for full functionality.</p>
                    <ul className="list-disc list-inside space-y-2 pl-6 mt-2">
                      <li>
                        <strong>Next.js App Server:</strong> In your first terminal, run this command to start the main application:
                        <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto my-1"><code className="language-bash">npm run dev</code></pre>
                        <p className="mt-1 text-muted-foreground">This will typically start the app on <Link href="http://localhost:9002" target="_blank" className="text-primary hover:underline">http://localhost:9002</Link>.</p>
                      </li>
                      <li>
                        <strong>Genkit AI Server:</strong> For the AI features (like dish recommendations) to work, you need to run the Genkit server. Open a <strong>second terminal window</strong> in the same project folder and run:
                        <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto my-1"><code className="language-bash">npm run genkit:dev</code></pre>
                        <p className="mt-1 text-muted-foreground">This starts the AI backend service that your Next.js app communicates with.</p>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Access the App:</strong>
                    <p className="pl-4 mt-1 text-muted-foreground">Once both servers are running without errors, you can open your web browser and navigate to <Link href="http://localhost:9002" target="_blank" className="text-primary hover:underline">http://localhost:9002</Link> to use the application locally.</p>
                  </li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Card>

        <Card className="shadow-lg">
          <AccordionItem value="item-printer" className="border-b-0">
            <AccordionTrigger className="p-6 hover:no-underline">
              <div className="flex items-start text-left space-x-3">
                <Printer className="h-7 w-7 text-primary mt-1" />
                <div>
                  <CardTitle className="font-headline text-xl">6. Real Printer Integration</CardTitle>
                  <CardDescription className="mt-1">Connecting to thermal receipt and kitchen printers. Current "Print Bill" uses browser print.</CardDescription>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-3 text-sm">
                 <p>
                  The "Print Bill" button in this prototype uses <code className="bg-muted px-1.5 py-0.5 rounded-sm">window.print()</code>. This is **not** suitable for POS thermal printers.
                </p>
                <p>
                  Directly controlling thermal printers from a web browser is restricted. You need a bridge:
                </p>
                <ol className="list-decimal list-inside space-y-2 pl-4">
                  <li>
                    <strong>Web-to-Printer Cloud Services:</strong> (e.g., PrintNode). Your web app sends data to their cloud service, and their local software prints it.
                  </li>
                  <li>
                    <strong>Local Print Server/Agent (Custom):</strong> A small server on your local network (e.g., a Raspberry Pi running Node.js) that listens for print requests from your web app and sends them to the printer. This offers more control.
                  </li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Card>
      </Accordion>

      <Card className="shadow-lg">
        <CardHeader>
          <ShoppingCart className="h-7 w-7 text-primary mb-2" />
          <CardTitle className="font-headline text-xl">Ready to Start Development?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This guide outlines the major components involved in transforming the Annapurna POS prototype into a production-ready system. Each step requires dedicated development effort. Consider working with a software developer or a team if you're not familiar with these technologies.
          </p>
        </CardContent>
        <CardFooter>
            <Link href="/order">
                <Button variant="default">Back to Order Page</Button>
            </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

    