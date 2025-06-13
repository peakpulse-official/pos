// src/app/(app)/setup-guide/page.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Rocket, AlertTriangle, Database, Users, Printer, Wifi, Cloud, ShieldCheck, HardDrive, Cpu, ShoppingCart, KeyRound } from "lucide-react"
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
          It uses browser LocalStorage for data and mocks certain features like user logins, real printer integration, and real-time multi-user interactions.
          To use this in a real restaurant, significant development work is required as outlined below. This guide provides a roadmap for that transition.
          You will likely need software development expertise to implement these steps.
        </AlertDescription>
      </Alert>

      <Accordion type="single" collapsible className="w-full space-y-4">

        <Card className="shadow-lg">
          <AccordionItem value="item-1" className="border-b-0">
            <AccordionTrigger className="p-6 hover:no-underline">
              <div className="flex items-start text-left space-x-3">
                <Cloud className="h-7 w-7 text-primary mt-1" />
                <div>
                  <CardTitle className="font-headline text-xl">1. Production Build & Hosting</CardTitle>
                  <CardDescription className="mt-1">Taking your app live. Instructions typically found on provider's official documentation website.</CardDescription>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-3 text-sm">
                <p>Your app needs a permanent home on the internet accessible to your devices.</p>
                <ol className="list-decimal list-inside space-y-2 pl-4">
                  <li>
                    <strong>Create a Production Build:</strong> Run <code className="bg-muted px-1.5 py-0.5 rounded-sm">npm run build</code> (or <code className="bg-muted px-1.5 py-0.5 rounded-sm">yarn build</code>) in your project terminal. This creates an optimized version of your app in the <code className="bg-muted px-1.5 py-0.5 rounded-sm">.next</code> folder.
                  </li>
                  <li>
                    <strong>Choose a Hosting Provider:</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li><strong>Firebase App Hosting (Recommended):</strong> Since we're in Firebase Studio, this is a natural fit. It supports Next.js features, including server-side code for Genkit AI. Your <code className="bg-muted px-1.5 py-0.5 rounded-sm">apphosting.yaml</code> is a starting point. <Link href="https://firebase.google.com/docs/app-hosting" target="_blank" className="text-primary hover:underline">Learn more on the Firebase website</Link>.</li>
                      <li><strong>Vercel:</strong> Created by the makers of Next.js, Vercel offers seamless deployment for Next.js apps. <Link href="https://vercel.com/docs" target="_blank" className="text-primary hover:underline">Learn more on the Vercel website</Link>.</li>
                      <li><strong>Other Cloud Platforms:</strong> AWS Amplify, Netlify, Google Cloud Run, Azure Static Web Apps also support Next.js. Check their respective documentation for Next.js deployment guides.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Deploy Your App:</strong> Follow your chosen provider's official documentation to deploy the production build. This typically involves connecting your code repository (e.g., GitHub) or uploading the build files.
                  </li>
                  <li>
                    <strong>Custom Domain (Optional):</strong> Configure a custom domain name (e.g., <code className="bg-muted px-1.5 py-0.5 rounded-sm">pos.myrestaurant.com</code>) for easier access, following your hosting provider's domain setup guide.
                  </li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Card>

        <Card className="shadow-lg">
          <AccordionItem value="item-2" className="border-b-0">
            <AccordionTrigger className="p-6 hover:no-underline">
              <div className="flex items-start text-left space-x-3">
                <Database className="h-7 w-7 text-primary mt-1" />
                <div>
                  <CardTitle className="font-headline text-xl">2. Data Management: Beyond LocalStorage</CardTitle>
                  <CardDescription className="mt-1">Storing your data reliably and making it accessible across devices.</CardDescription>
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
                <ol className="list-decimal list-inside space-y-2 pl-4">
                  <li>
                    <strong>Choose a Database Service:</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li><strong>Cloud Firestore (Recommended with Firebase):</strong> A NoSQL, real-time database that scales well and integrates easily with other Firebase services (like Authentication). <Link href="https://firebase.google.com/docs/firestore" target="_blank" className="text-primary hover:underline">Learn more about Firestore</Link>.</li>
                      <li><strong>SQL Databases (e.g., PostgreSQL, MySQL via Cloud SQL, Supabase, Neon):</strong> Relational databases are excellent for structured data like POS systems.
                        <ul className="list-circle list-inside space-y-1 pl-6 mt-1">
                          <li>Define clear schemas for tables (users, menu_items, orders, order_details, tables, waiters, etc.).</li>
                          <li>Utilize SQL for querying and data integrity (foreign keys, transactions).</li>
                        </ul>
                      </li>
                      <li><strong>Other Cloud Databases:</strong> Options like AWS DynamoDB, MongoDB Atlas offer robust solutions.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Set Up Your Database Instance:</strong> Create an instance of your chosen database in your cloud provider's console. Define security rules and access controls.
                  </li>
                  <li>
                    <strong>Modify Application Code (Significant Development):</strong> This is a major development task.
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li>Replace ALL LocalStorage reads and writes with database operations (using an ORM like Prisma or a database client library for your chosen database). This impacts:
                        <ul className="list-circle list-inside space-y-1 pl-6 mt-1">
                          <li>Menu items (<code className="bg-muted px-1.5 py-0.5 rounded-sm">src/app/(app)/menu/page.tsx</code>)</li>
                          <li>Orders (<code className="bg-muted px-1.5 py-0.5 rounded-sm">src/app/(app)/order/page.tsx</code>, <code className="bg-muted px-1.5 py-0.5 rounded-sm">src/app/(app)/billing/page.tsx</code>, <code className="bg-muted px-1.5 py-0.5 rounded-sm">src/app/(app)/reports/page.tsx</code>)</li>
                          <li>Application settings (<code className="bg-muted px-1.5 py-0.5 rounded-sm">src/contexts/SettingsContext.tsx</code> - some settings might move to the DB, others might remain local or be configurable by admin).</li>
                          <li>Table and Waiter definitions (<code className="bg-muted px-1.5 py-0.5 rounded-sm">src/app/(app)/floor-plan/page.tsx</code> and related components).</li>
                        </ul>
                      </li>
                      <li>Implement API endpoints or Server Actions in Next.js to handle creating, reading, updating, and deleting (CRUD) data from your database.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Define Data Structures (Schema):</strong> Plan how your data will be organized.
                      <p className="mt-1">Example SQL for a <code className="bg-muted px-1.5 py-0.5 rounded-sm">menu_items</code> table (PostgreSQL syntax):</p>
                      <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto my-1"><code className="language-sql">{
`CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category_id UUID REFERENCES categories(id),
  description TEXT,
  image_url VARCHAR(2048),
  data_ai_hint VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  icon_name VARCHAR(50) -- Store Lucide icon name string
);`}
                      </code></pre>
                  </li>
                  <li>
                    <strong>Initial Data Seeding (Optional):</strong> You might want to write a script to populate your new database with initial menu items from <code className="bg-muted px-1.5 py-0.5 rounded-sm">src/lib/data.ts</code> or a CSV file.
                  </li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Card>

        <Card className="shadow-lg">
          <AccordionItem value="item-3" className="border-b-0">
            <AccordionTrigger className="p-6 hover:no-underline">
              <div className="flex items-start text-left space-x-3">
                <KeyRound className="h-7 w-7 text-primary mt-1" /> {/* Changed icon */}
                <div>
                  <CardTitle className="font-headline text-xl">3. User Authentication & Authorization (Backend)</CardTitle>
                  <CardDescription className="mt-1">Securely managing user accounts, roles, and password with a backend system.</CardDescription>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-3 text-sm">
                <p>The current login and registration pages are UI mockups. Real user management needs a secure backend authentication system and database integration.</p>
                <ol className="list-decimal list-inside space-y-2 pl-4">
                  <li>
                    <strong>Choose an Authentication Provider or Strategy:</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li><strong>Firebase Authentication (Recommended for quick setup):</strong> Provides secure user sign-up, sign-in, password resets. Integrates with Firestore for user profiles/roles. <Link href="https://firebase.google.com/docs/auth" target="_blank" className="text-primary hover:underline">Learn more</Link>.</li>
                      <li><strong>NextAuth.js:</strong> Comprehensive open-source solution for Next.js. Supports email/password, social logins. <Link href="https://next-auth.js.org/" target="_blank" className="text-primary hover:underline">Learn more</Link>.</li>
                      <li><strong>Custom Backend with Database (e.g., SQL):</strong> Offers full control but requires careful implementation of security.
                        This involves creating API endpoints (e.g., <code className="bg-muted px-1.5 py-0.5 rounded-sm">/api/auth/register</code>, <code className="bg-muted px-1.5 py-0.5 rounded-sm">/api/auth/login</code>) that handle:
                        <ul className="list-circle list-inside space-y-1 pl-6 mt-1">
                          <li>Receiving user credentials.</li>
                          <li>Validating input.</li>
                          <li>Hashing passwords securely (e.g., using <code className="bg-muted px-1.5 py-0.5 rounded-sm">bcrypt</code>). **Never store plain text passwords.**</li>
                          <li>Storing user data in your database.</li>
                          <li>Generating and managing sessions (e.g., using JWTs - JSON Web Tokens - or session cookies).</li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Database Schema for Users and Roles (SQL Example):</strong>
                      <p className="mt-1">Define tables in your SQL database to store user information and their roles.</p>
                      <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto my-1"><code className="language-sql">{
`-- Roles Table (defines available roles)
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  role_name VARCHAR(50) UNIQUE NOT NULL -- e.g., 'Admin', 'Manager', 'Waiter', 'KitchenStaff'
);

-- Seed roles
INSERT INTO roles (role_name) VALUES ('Admin'), ('Manager'), ('Waiter'), ('KitchenStaff');

-- Users Table
CREATE TABLE app_users ( -- Renamed from 'users' to avoid conflict with SQL keyword
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL, -- Store hashed password, not plain text
  role_id INTEGER REFERENCES roles(id) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Example: Add a function to update 'updated_at' automatically (PostgreSQL)
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_app_users
BEFORE UPDATE ON app_users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();`}
                      </code></pre>
                  </li>
                  <li>
                    <strong>Password Security:</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                        <li>**Hashing:** Use a strong, slow hashing algorithm like <code className="bg-muted px-1.5 py-0.5 rounded-sm">bcrypt</code> or <code className="bg-muted px-1.5 py-0.5 rounded-sm">Argon2</code> to store passwords. The hash should be stored in the <code className="bg-muted px-1.5 py-0.5 rounded-sm">password_hash</code> column.</li>
                        <li>**Salting:** These algorithms automatically include salting.</li>
                        <li>**Verification:** When a user logs in, hash the provided password and compare it to the stored hash.</li>
                    </ul>
                  </li>
                   <li>
                    <strong>Integrate Authentication with Frontend:</strong> Update <code className="bg-muted px-1.5 py-0.5 rounded-sm">src/app/(auth)/login/page.tsx</code> and <code className="bg-muted px-1.5 py-0.5 rounded-sm">src/app/(auth)/register/page.tsx</code> to call your backend API endpoints. Handle loading states, errors, and session tokens/cookies returned by the backend.
                  </li>
                  <li>
                    <strong>Role-Based Access Control (RBAC) on Backend & Frontend:</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li>Backend: API endpoints should verify the user's role (from their session/token) before allowing access to protected resources or actions.</li>
                      <li>Frontend: Conditionally render UI elements or restrict page access based on the user's role obtained after login.</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Card>

        <Card className="shadow-lg">
          <AccordionItem value="item-4" className="border-b-0">
            <AccordionTrigger className="p-6 hover:no-underline">
              <div className="flex items-start text-left space-x-3">
                <Printer className="h-7 w-7 text-primary mt-1" />
                <div>
                  <CardTitle className="font-headline text-xl">4. Real Printer Integration</CardTitle>
                  <CardDescription className="mt-1">Connecting to thermal receipt and kitchen printers. Current "Print Bill" uses browser print.</CardDescription>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-3 text-sm">
                 <p>
                  The "Print Bill" button (and similar mock print actions) in this prototype currently uses <code className="bg-muted px-1.5 py-0.5 rounded-sm">window.print()</code>. This is for standard web page printing and **not** suitable for POS thermal printers.
                </p>
                <p>
                  Directly controlling thermal printers from a web browser is restricted. Specialized solutions are needed:
                </p>
                <ol className="list-decimal list-inside space-y-2 pl-4">
                  <li>
                    <strong>Choose Your Printers:</strong> USB, Ethernet (Network), Wi-Fi, Bluetooth. Network printers are generally easier for web-based POS.
                  </li>
                  <li>
                    <strong>Select an Integration Method:</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li><strong>Web-to-Printer Cloud Services:</strong> (e.g., PrintNode, ePrint.io). Web app sends data to cloud; local agent software polls and prints. Often subscription-based.</li>
                      <li><strong>Manufacturer SDKs/APIs:</strong> (e.g., Epson ePOS-Print, StarXpand SDK). Might involve backend code to format data (ESC/POS).</li>
                      <li><strong>Local Print Server/Agent (Custom):</strong> Small server on local network (e.g., Node.js with <code className="bg-muted px-1.5 py-0.5 rounded-sm">node-thermal-printer</code> or Python with <code className="bg-muted px-1.5 py-0.5 rounded-sm">python-escpos</code>) exposes an API. Web app calls this local API. Requires a dedicated device (PC/Raspberry Pi).</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Update Settings UI:</strong> Re-implement "Printers & Devices" in Settings to configure real printers (IP addresses, connection types, assignments).
                  </li>
                  <li>
                    <strong>Format Bill/Receipt Data:</strong> Transform order data for the chosen printer/method (plain text, ESC/POS, HTML for narrow output). The <code className="bg-muted px-1.5 py-0.5 rounded-sm">BillDisplay.tsx</code> component provides a visual, which would need re-formatting logic for actual printing.
                  </li>
                  <li>
                    <strong>Implement Print Triggering:</strong> Update print buttons to send formatted data via your chosen integration method.
                  </li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Card>

        <Card className="shadow-lg">
          <AccordionItem value="item-5" className="border-b-0">
            <AccordionTrigger className="p-6 hover:no-underline">
              <div className="flex items-start text-left space-x-3">
                <Cpu className="h-7 w-7 text-primary mt-1" />
                <div>
                  <CardTitle className="font-headline text-xl">5. Genkit AI Flows Deployment</CardTitle>
                  <CardDescription className="mt-1">Ensuring your AI features work in production.</CardDescription>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-3 text-sm">
                <p>Your AI dish recommendation feature uses Genkit, which involves server-side code execution.</p>
                <ol className="list-decimal list-inside space-y-2 pl-4">
                    <li>
                        <strong>Server-Side Environment:</strong> Your hosting provider must support Node.js (Firebase App Hosting, Vercel, etc.).
                    </li>
                    <li>
                        <strong>API Keys & Configuration:</strong> Securely manage AI model API keys using environment variables on your hosting platform. **Do NOT hardcode API keys.**
                    </li>
                    <li>
                        <strong>Testing in Production:</strong> Thoroughly test AI features post-deployment. Check server logs for errors.
                    </li>
                    <li>
                        <strong>Error Handling & Logging:</strong> Implement robust error handling and logging for AI service calls.
                    </li>
                     <li>
                        <strong>Genkit Deployment:</strong> Ensure Genkit packages are in `dependencies` in `package.json`.
                    </li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Card>

        <Card className="shadow-lg">
          <AccordionItem value="item-6" className="border-b-0">
            <AccordionTrigger className="p-6 hover:no-underline">
              <div className="flex items-start text-left space-x-3">
                <Wifi className="h-7 w-7 text-primary mt-1" />
                <div>
                  <CardTitle className="font-headline text-xl">6. Networking & Hardware</CardTitle>
                  <CardDescription className="mt-1">Setting up the physical environment in your restaurant.</CardDescription>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-3 text-sm">
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li><strong>Reliable Network Infrastructure:</strong> Stable internet, robust Wi-Fi (WPA2/WPA3), consider wired Ethernet for critical devices. Secure your network.</li>
                  <li><strong>POS Terminal Devices:</strong> All-in-one terminals, PCs with touch monitors, tablets. Ensure modern browsers.</li>
                  <li><strong>Peripheral Devices:</strong> Receipt/Kitchen printers, cash drawers, barcode scanners (optional), payment terminals (card readers - complex integration often needed).</li>
                  <li><strong>Device Configuration:</strong> Ensure devices access deployed app URL. Configure network printers with static IPs. Install drivers/local agents.</li>
                </ul>
                <p className="font-semibold">Visual Floor Plan Editor:</p>
                 <p>The current prototype uses a grid to display tables. A production system might benefit from a visual floor plan editor where admins can drag and drop tables to match the restaurant's layout. This is an advanced feature requiring significant development (e.g., using HTML5 canvas libraries or SVG manipulation).</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Card>

        <Card className="shadow-lg">
          <AccordionItem value="item-7" className="border-b-0">
            <AccordionTrigger className="p-6 hover:no-underline">
              <div className="flex items-start text-left space-x-3">
                <ShieldCheck className="h-7 w-7 text-primary mt-1" />
                <div>
                  <CardTitle className="font-headline text-xl">7. Backup, Security & Maintenance</CardTitle>
                  <CardDescription className="mt-1">Protecting your data and keeping the system running smoothly.</CardDescription>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-3 text-sm">
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li><strong>Data Backups:</strong> Cloud databases often have automatic backups; understand policies. For self-hosted, implement regular automated backups.</li>
                  <li><strong>Application & System Security:</strong> HTTPS, secure API keys (environment variables), input validation (client & server), dependency updates, strong password policies (if custom auth), firewall.</li>
                  <li><strong>Ongoing Maintenance:</strong> Monitoring (error rates, performance), logging, software updates, testing updates in a staging environment.</li>
                </ul>
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
            This guide outlines the major components involved in transforming the Annapurna POS prototype into a production-ready system. Each step requires dedicated development effort.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Consider working with a software developer or a team if you're not familiar with these technologies. Good luck!
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
