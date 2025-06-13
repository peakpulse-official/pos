
// src/app/(app)/setup-guide/page.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Rocket, AlertTriangle, Database, Users, Printer, Wifi, Cloud, ShieldCheck, HardDrive, Cpu, ShoppingCart } from "lucide-react"
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
          It uses browser LocalStorage for data and mocks certain features like user logins and real printer integration. 
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
                  <CardDescription className="mt-1">Taking your app live.</CardDescription>
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
                      <li><strong>Firebase App Hosting (Recommended):</strong> Since we're in Firebase Studio, this is a natural fit. It supports Next.js features, including server-side code for Genkit AI. Your <code className="bg-muted px-1.5 py-0.5 rounded-sm">apphosting.yaml</code> is a starting point. <Link href="https://firebase.google.com/docs/app-hosting" target="_blank" className="text-primary hover:underline">Learn more</Link>.</li>
                      <li><strong>Vercel:</strong> Created by the makers of Next.js, Vercel offers seamless deployment for Next.js apps. <Link href="https://vercel.com/docs" target="_blank" className="text-primary hover:underline">Learn more</Link>.</li>
                      <li><strong>Other Cloud Platforms:</strong> AWS Amplify, Netlify, Google Cloud Run, Azure Static Web Apps also support Next.js.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Deploy Your App:</strong> Follow your chosen provider's instructions to deploy the production build. This usually involves connecting your code repository (e.g., GitHub) or uploading the build files.
                  </li>
                  <li>
                    <strong>Custom Domain (Optional):</strong> Configure a custom domain name (e.g., <code className="bg-muted px-1.5 py-0.5 rounded-sm">pos.myrestaurant.com</code>) for easier access.
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
                  <li>Data is only on one browser, not shared.</li>
                  <li>Easily lost if browser data is cleared.</li>
                  <li>No backups.</li>
                </ul>
                <p><strong>Solution: Use a Centralized Database.</strong></p>
                <ol className="list-decimal list-inside space-y-2 pl-4">
                  <li>
                    <strong>Choose a Database:</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li><strong>Cloud Firestore (Recommended with Firebase):</strong> A NoSQL, real-time database. Integrates well with Firebase products. Scalable and robust. <Link href="https://firebase.google.com/docs/firestore" target="_blank" className="text-primary hover:underline">Learn more</Link>.</li>
                      <li><strong>Other Options:</strong> PostgreSQL, MySQL (SQL databases), or MongoDB (NoSQL) can be used, often requiring a custom backend API to interact with them from your Next.js app.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Set Up Your Database:</strong> Create an instance of your chosen database in the cloud (e.g., create a Firestore database in your Firebase project).
                  </li>
                  <li>
                    <strong>Modify App Code (Significant Development):</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li>Replace ALL LocalStorage reads/writes with database operations. This affects:
                        <ul className="list-circle list-inside space-y-1 pl-6 mt-1">
                          <li>Menu items (<code className="bg-muted px-1.5 py-0.5 rounded-sm">src/app/(app)/menu/page.tsx</code>)</li>
                          <li>Orders (<code className="bg-muted px-1.5 py-0.5 rounded-sm">src/app/(app)/order/page.tsx</code>, <code className="bg-muted px-1.5 py-0.5 rounded-sm">src/app/(app)/billing/page.tsx</code>, <code className="bg-muted px-1.5 py-0.5 rounded-sm">src/app/(app)/reports/page.tsx</code>)</li>
                          <li>Application settings (<code className="bg-muted px-1.5 py-0.5 rounded-sm">src/contexts/SettingsContext.tsx</code>)</li>
                        </ul>
                      </li>
                      <li>Implement functions to add, fetch, update, and delete data from your database. For Firestore, you'd use the Firebase SDK.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Data Structure:</strong> Define how your data (menu items, orders, users, settings) will be structured in the database (collections and documents in Firestore).
                  </li>
                  <li>
                    <strong>Data Seeding (Optional):</strong> Populate your new database with initial menu items from <code className="bg-muted px-1.5 py-0.5 rounded-sm">src/lib/data.ts</code>.
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
                <Users className="h-7 w-7 text-primary mt-1" />
                <div>
                  <CardTitle className="font-headline text-xl">3. User Authentication & Authorization</CardTitle>
                  <CardDescription className="mt-1">Securely managing user accounts and roles.</CardDescription>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-3 text-sm">
                <p>The current login/registration pages are UI mockups. Real user management needs a secure backend.</p>
                <ol className="list-decimal list-inside space-y-2 pl-4">
                  <li>
                    <strong>Choose an Authentication Provider:</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li><strong>Firebase Authentication (Recommended):</strong> Securely handles sign-up, sign-in, password resets, etc. Integrates with Firestore for user profiles. <Link href="https://firebase.google.com/docs/auth" target="_blank" className="text-primary hover:underline">Learn more</Link>.</li>
                      <li><strong>NextAuth.js:</strong> A comprehensive open-source authentication solution for Next.js. Supports various providers (email/password, social logins, etc.). <Link href="https://next-auth.js.org/" target="_blank" className="text-primary hover:underline">Learn more</Link>.</li>
                      <li><strong>Custom Backend:</strong> Build your own auth system (complex and requires deep security knowledge).</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Integrate with Frontend:</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li>Update <code className="bg-muted px-1.5 py-0.5 rounded-sm">src/app/(auth)/login/page.tsx</code> and <code className="bg-muted px-1.5 py-0.5 rounded-sm">src/app/(auth)/register/page.tsx</code> to call your chosen auth provider's SDK methods for registration and login.</li>
                      <li>Handle loading states, errors, and success messages.</li>
                      <li>Implement logout functionality.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Manage User State:</strong> Use React Context or a state management library to make the current user's information available throughout the app.
                  </li>
                  <li>
                    <strong>Protect Routes:</strong> Implement logic to redirect unauthenticated users from app pages (like <code className="bg-muted px-1.5 py-0.5 rounded-sm">/order</code>) to the login page.
                  </li>
                  <li>
                    <strong>Role-Based Access Control (RBAC):</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li>Store user roles (e.g., 'Admin', 'Staff', 'Manager') in your database (e.g., Firestore document for each user).</li>
                      <li>Fetch the user's role after login.</li>
                      <li>Conditionally render UI elements or restrict access to certain pages/features (e.g., only 'Admin' can access Settings) based on their role. This is partially mocked in <code className="bg-muted px-1.5 py-0.5 rounded-sm">src/app/(app)/settings/page.tsx</code> but needs real auth.</li>
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
                  <CardDescription className="mt-1">Connecting to thermal receipt and kitchen printers.</CardDescription>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-3 text-sm">
                <p>The current <code className="bg-muted px-1.5 py-0.5 rounded-sm">window.print()</code> in the Billing page is for web page printing, not for POS thermal printers.</p>
                <ol className="list-decimal list-inside space-y-2 pl-4">
                  <li>
                    <strong>Choose Printer Type:</strong> Standard POS thermal printers (e.g., Epson, Star Micronics) are common. Decide if you need USB, Ethernet, or Wi-Fi printers.
                  </li>
                  <li>
                    <strong>Integration Method (Complex):</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li><strong>Web-to-Printer Services:</strong> Services like PrintNode or ePrint.io act as a bridge. Your web app sends print jobs to their cloud service, which then relays to a local agent connected to your printer. Often subscription-based.</li>
                      <li><strong>Printer SDKs:</strong> Some manufacturers (e.g., Epson's ePOS-Print XML/SDK) provide tools to send commands directly to network-connected printers. This might involve backend code.</li>
                      <li><strong>Local Print Server/Agent:</strong> Develop a small application (e.g., using Node.js with a library like <code className="bg-muted px-1.5 py-0.5 rounded-sm">node-thermal-printer</code>) that runs on a computer in your restaurant. This local server listens for requests from your web app (via local network HTTP calls) and sends commands to the connected printer. Requires a dedicated computer.</li>
                      <li><strong>Electron App (Advanced):</strong> Package your Next.js app as a desktop application using Electron. Electron has better access to system hardware like printers. This is a significant architectural change.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Update Settings UI:</strong> The "Printers & Devices" section in Settings (<code className="bg-muted px-1.5 py-0.5 rounded-sm">src/app/(app)/settings/page.tsx</code>) needs to be completely re-implemented to manage real printer configurations (e.g., IP addresses, connection types) instead of the current mock setup.
                  </li>
                  <li>
                    <strong>Design Bill/Receipt Templates:</strong> You'll need to format the bill data specifically for thermal printer output (often using printer-specific command languages like ESC/POS).
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
                <p>Your AI dish recommendation feature uses Genkit, which involves server-side code.</p>
                <ol className="list-decimal list-inside space-y-2 pl-4">
                    <li>
                        <strong>Server-Side Environment:</strong> Your chosen hosting provider (Step 1) must support a Node.js runtime environment for Genkit flows to execute. Firebase App Hosting and Vercel (with serverless functions) are suitable.
                    </li>
                    <li>
                        <strong>API Keys & Configuration:</strong>
                        <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                            <li>Securely store and manage API keys for your AI models (e.g., Google AI Studio API key for Gemini). Use environment variables on your hosting provider, not hardcoded in your code.</li>
                            <li>Ensure your <code className="bg-muted px-1.5 py-0.5 rounded-sm">.env</code> file (or equivalent environment variable setup on your host) has the necessary keys for production. The <code className="bg-muted px-1.5 py-0.5 rounded-sm">src/ai/genkit.ts</code> file might need adjustments if API key handling differs in production.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Testing in Production:</strong> After deployment, thoroughly test the AI recommendation feature to ensure it's connecting to the AI service and returning results.
                    </li>
                    <li>
                        <strong>Error Handling & Logging:</strong> Implement robust error handling for AI flow calls and log any issues for debugging.
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
                  <CardDescription className="mt-1">Setting up the physical environment.</CardDescription>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-3 text-sm">
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li><strong>Reliable Network:</strong> A stable Wi-Fi or wired Ethernet network is essential for all devices to communicate with the hosted app and each other (if using local print servers).</li>
                  <li><strong>POS Devices:</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li>Computers, tablets (iPad, Android), or dedicated POS terminals to run the web app.</li>
                      <li>Touch screens for ease of use.</li>
                    </ul>
                  </li>
                  <li><strong>Peripherals:</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li>Receipt printers, kitchen printers (as discussed in Step 4).</li>
                      <li>Cash drawers (often connected to receipt printers).</li>
                      <li>Barcode scanners (if your menu items use barcodes).</li>
                    </ul>
                  </li>
                  <li><strong>Device Configuration:</strong> Ensure all devices can access the deployed application URL. Configure printers on the network or connect them to the appropriate local print server/agent.</li>
                </ul>
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
                  <li><strong>Data Backups:</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li>If using a cloud database like Firestore, backups are often managed by the provider, but understand their policies and consider additional export options.</li>
                      <li>If self-hosting a database, implement a regular, automated backup schedule.</li>
                    </ul>
                  </li>
                  <li><strong>Security:</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li>Always use HTTPS (SSL/TLS encryption) for your deployed app. Hosting providers usually handle this.</li>
                      <li>Keep all API keys and sensitive credentials secure (use environment variables, not hardcoded).</li>
                      <li>Regularly update software dependencies (Next.js, libraries, Node.js on server) to patch security vulnerabilities.</li>
                      <li>Implement strong password policies if managing your own user database.</li>
                    </ul>
                  </li>
                  <li><strong>Maintenance:</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li>Monitor your application for errors and performance issues.
                      </li>
                      <li>Plan for software updates and potential downtime (if any).</li>
                    </ul>
                  </li>
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
            This guide outlines the major components involved in transforming the Annapurna POS prototype into a production-ready system. Each step, especially data management, authentication, and printer integration, requires dedicated development effort.
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

    
