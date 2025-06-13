
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
                      <li><strong>Firebase App Hosting (Recommended):</strong> Since we're in Firebase Studio, this is a natural fit. It supports Next.js features, including server-side code for Genkit AI. Your <code className="bg-muted px-1.5 py-0.5 rounded-sm">apphosting.yaml</code> is a starting point. <Link href="https://firebase.google.com/docs/app-hosting" target="_blank" className="text-primary hover:underline">Learn more on the Firebase website</Link>.</li>
                      <li><strong>Vercel:</strong> Created by the makers of Next.js, Vercel offers seamless deployment for Next.js apps. <Link href="https://vercel.com/docs" target="_blank" className="text-primary hover:underline">Learn more on the Vercel website</Link>.</li>
                      <li><strong>Other Cloud Platforms:</strong> AWS Amplify, Netlify, Google Cloud Run, Azure Static Web Apps also support Next.js. Check their respective documentation for Next.js deployment guides.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Deploy Your App:</strong> Follow your chosen provider's instructions (usually found on their official documentation website) to deploy the production build. This typically involves connecting your code repository (e.g., GitHub) or uploading the build files.
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
                      <li><strong>Other Cloud Databases:</strong> Options like Supabase (PostgreSQL), AWS DynamoDB, MongoDB Atlas offer robust solutions.</li>
                      <li><strong>Self-Hosted Databases:</strong> PostgreSQL, MySQL can be self-hosted but require more server management.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Set Up Your Database Instance:</strong> Create an instance of your chosen database in your cloud provider's console (e.g., create a Firestore database in your Firebase project). Define security rules to protect your data.
                  </li>
                  <li>
                    <strong>Modify Application Code (Significant Development):</strong> This is a major development task.
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li>Replace ALL LocalStorage reads and writes with database operations (using the SDK for your chosen database, e.g., Firebase SDK for Firestore). This impacts:
                        <ul className="list-circle list-inside space-y-1 pl-6 mt-1">
                          <li>Menu items (<code className="bg-muted px-1.5 py-0.5 rounded-sm">src/app/(app)/menu/page.tsx</code>)</li>
                          <li>Orders (<code className="bg-muted px-1.5 py-0.5 rounded-sm">src/app/(app)/order/page.tsx</code>, <code className="bg-muted px-1.5 py-0.5 rounded-sm">src/app/(app)/billing/page.tsx</code>, <code className="bg-muted px-1.5 py-0.5 rounded-sm">src/app/(app)/reports/page.tsx</code>)</li>
                          <li>Application settings (<code className="bg-muted px-1.5 py-0.5 rounded-sm">src/contexts/SettingsContext.tsx</code>)</li>
                        </ul>
                      </li>
                      <li>Implement functions for creating, reading, updating, and deleting (CRUD) data from your database.
                      For example, when an order is placed, it must be written to the database. When the menu page loads, it must fetch items from the database.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Define Data Structures (Schema):</strong> Plan how your data (menu items, categories, orders, users, settings) will be organized in the database (e.g., collections and documents in Firestore, or tables and columns in SQL).
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
                <Users className="h-7 w-7 text-primary mt-1" />
                <div>
                  <CardTitle className="font-headline text-xl">3. User Authentication & Authorization</CardTitle>
                  <CardDescription className="mt-1">Securely managing user accounts and roles.</CardDescription>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-3 text-sm">
                <p>The current login and registration pages are UI mockups. Real user management needs a secure backend authentication system.</p>
                <ol className="list-decimal list-inside space-y-2 pl-4">
                  <li>
                    <strong>Choose an Authentication Provider:</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li><strong>Firebase Authentication (Recommended):</strong> Provides secure user sign-up, sign-in, password resets, email verification, etc. Integrates seamlessly with Firestore for user profiles and roles. <Link href="https://firebase.google.com/docs/auth" target="_blank" className="text-primary hover:underline">Learn more about Firebase Auth</Link>.</li>
                      <li><strong>NextAuth.js:</strong> A comprehensive open-source authentication solution specifically for Next.js. Supports various providers (email/password, social logins, OAuth). <Link href="https://next-auth.js.org/" target="_blank" className="text-primary hover:underline">Learn more about NextAuth.js</Link>.</li>
                      <li><strong>Other Identity Platforms:</strong> Auth0, Okta, etc., offer enterprise-grade identity solutions.</li>
                      <li><strong>Custom Backend (Not Recommended for Beginners):</strong> Building your own secure authentication system is complex and error-prone.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Integrate Authentication with Frontend:</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li>Update <code className="bg-muted px-1.5 py-0.5 rounded-sm">src/app/(auth)/login/page.tsx</code> and <code className="bg-muted px-1.5 py-0.5 rounded-sm">src/app/(auth)/register/page.tsx</code>.</li>
                      <li>In the `onSubmit` functions of these forms, instead of `console.log`, call the SDK methods of your chosen auth provider (e.g., `createUserWithEmailAndPassword`, `signInWithEmailAndPassword` for Firebase Auth).</li>
                      <li>Handle loading states, display error messages from the auth provider (e.g., "Invalid password", "Email already in use").</li>
                      <li>Implement logout functionality (e.g., `signOut` method).</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Manage User Session/State:</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li>Use React Context or a state management library (like Zustand, Redux) to store the current authenticated user's information (ID, email, role) globally in the app.</li>
                      <li>Firebase Auth SDK provides an `onAuthStateChanged` listener to track login status.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Protect Routes & Pages:</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li>Implement logic (e.g., in a main layout component or using Next.js middleware) to check if a user is authenticated.</li>
                      <li>Redirect unauthenticated users from app pages (like <code className="bg-muted px-1.5 py-0.5 rounded-sm">/order</code>, <code className="bg-muted px-1.5 py-0.5 rounded-sm">/menu</code>) to the <code className="bg-muted px-1.5 py-0.5 rounded-sm">/login</code> page.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Role-Based Access Control (RBAC):</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li>Store user roles (e.g., 'Admin', 'Staff', 'Manager') in your user database (e.g., a 'role' field in each user's Firestore document). This is mocked in `src/contexts/SettingsContext.tsx` currently.</li>
                      <li>After login, fetch the user's role.</li>
                      <li>Conditionally render UI elements or restrict access to certain pages/features based on their role. For example, only users with an 'Admin' role should access the <code className="bg-muted px-1.5 py-0.5 rounded-sm">/settings</code> page.</li>
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
                <p>
                  The "Print Bill" button in the Billing page currently uses <code className="bg-muted px-1.5 py-0.5 rounded-sm">window.print()</code>, which is for standard web page printing on A4/Letter paper. This is **not** suitable for POS thermal receipt printers.
                </p>
                <p>
                  Directly controlling thermal printers from a web browser is restricted for security reasons. Specialized solutions are needed:
                </p>
                <ol className="list-decimal list-inside space-y-2 pl-4">
                  <li>
                    <strong>Choose Your Printers:</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                        <li><strong>Receipt Printer:</strong> Typically an 80mm or 58mm thermal printer (e.g., Epson TM-T88 series, Star TSP100 series).</li>
                        <li><strong>Kitchen Printer (Optional):</strong> Often a dot-matrix impact printer for durability or another thermal printer.</li>
                        <li><strong>Connection Types:</strong> USB, Ethernet (Network), Wi-Fi, Bluetooth. Network printers (Ethernet/Wi-Fi) are generally easier to integrate with web-based POS systems.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Select an Integration Method (This is the complex part):</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li><strong>Web-to-Printer Cloud Services:</strong>
                        Services like PrintNode, ePrint.io, PaperCut Mobility Print.
                        Your web app sends print data (e.g., formatted text or PDF) to their cloud service.
                        A small software agent installed on a local computer in your restaurant polls this service and sends jobs to the connected printer.
                        Often subscription-based. Simpler to implement from the web app side.
                      </li>
                      <li><strong>Manufacturer SDKs/APIs:</strong>
                        Some printer manufacturers (e.g., Epson's ePOS-Print XML/SDK, Star Micronics' StarXpand SDK) provide tools to send commands directly to network-connected printers from a web application or a backend server.
                        This might involve backend code to format data into the printer's command language (e.g., ESC/POS).
                      </li>
                      <li><strong>Local Print Server/Agent (Custom Development):</strong>
                        Develop a small server application (e.g., using Node.js with a library like <code className="bg-muted px-1.5 py-0.5 rounded-sm">node-thermal-printer</code> or Python with <code className="bg-muted px-1.5 py-0.5 rounded-sm">python-escpos</code>) that runs on a computer within your restaurant's local network.
                        This local server exposes an API (e.g., HTTP endpoint).
                        Your POS web app sends print requests (bill data) to this local server's API.
                        The local server then formats the data and sends commands directly to the USB or network-connected printer.
                        Requires a dedicated computer/Raspberry Pi to run this agent.
                      </li>
                      <li><strong>Using an Electron App (Advanced):</strong>
                        Package your Next.js application as a desktop application using Electron. Electron apps have more direct access to system hardware like printers via Node.js capabilities. This is a significant architectural change from a pure web app.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Update Settings UI:</strong> The "Printers & Devices" section in Settings (<code className="bg-muted px-1.5 py-0.5 rounded-sm">src/app/(app)/settings/page.tsx</code>) needs to be completely re-implemented. Instead of the current mock setup, it should allow configuration of:
                        <ul className="list-circle list-inside space-y-1 pl-6 mt-1">
                            <li>Printer names (e.g., "Front Counter Receipt", "Kitchen Order Printer").</li>
                            <li>Printer connection types and details (e.g., IP address for network printers, selected local agent for cloud services).</li>
                            <li>Assigning printers to functions (e.g., which printer gets receipts, which gets kitchen orders).</li>
                        </ul>
                  </li>
                  <li>
                    <strong>Format Bill/Receipt Data:</strong> You'll need to transform the order data into a format suitable for the chosen printer/method. This could be:
                        <ul className="list-circle list-inside space-y-1 pl-6 mt-1">
                            <li>Plain text with specific formatting (line breaks, character spacing).</li>
                            <li>Printer-specific command languages like ESC/POS (for direct control over bolding, cutting, logo printing).</li>
                            <li>HTML/CSS designed for very narrow outputs, then converted to an image or PDF if your print service requires it.</li>
                        </ul>
                        The `BillDisplay.tsx` component currently provides a visual layout; this layout's data would need to be re-formatted.
                  </li>
                  <li>
                    <strong>Implement Print Triggering:</strong> Update the "Print Bill" button (or add new buttons like "Print Kitchen Order") to send the formatted data to your chosen integration method (cloud service, local agent API, etc.).
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
                <p>Your AI dish recommendation feature (<code className="bg-muted px-1.5 py-0.5 rounded-sm">src/ai/flows/dish-recommendation.ts</code>) uses Genkit, which involves server-side code execution.</p>
                <ol className="list-decimal list-inside space-y-2 pl-4">
                    <li>
                        <strong>Server-Side Environment:</strong> Your chosen hosting provider (Step 1) must support a Node.js runtime environment for Genkit flows to execute.
                        <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                            <li><strong>Firebase App Hosting:</strong> Excellent support for Next.js server-side features, including API routes or server actions which can house Genkit flows.</li>
                            <li><strong>Vercel:</strong> Seamlessly supports Next.js serverless functions.</li>
                            <li>Other platforms that can run Node.js applications.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>API Keys & Configuration:</strong>
                        <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                            <li><strong>Secure API Key Management:</strong> Your AI model (e.g., Google AI Studio API key for Gemini) needs to be stored securely.
                                **Do NOT hardcode API keys in your frontend or backend code directly.**
                                Use environment variables provided by your hosting platform (e.g., Firebase App Hosting environment variables, Vercel Environment Variables).
                            </li>
                            <li><strong>Update <code className="bg-muted px-1.5 py-0.5 rounded-sm">.env</code> or Environment Variables:</strong> Ensure your production environment has the necessary API keys (e.g., <code className="bg-muted px-1.5 py-0.5 rounded-sm">GOOGLE_API_KEY</code>). The <code className="bg-muted px-1.5 py-0.5 rounded-sm">src/ai/genkit.ts</code> file, which initializes Genkit, might need adjustments if API key handling or plugin configuration differs in production based on environment variables.
                            </li>
                        </ul>
                    </li>
                    <li>
                        <strong>Testing in Production:</strong> After deployment, thoroughly test the AI recommendation feature to ensure it's connecting to the AI service (e.g., Google AI) and returning results as expected. Check server logs on your hosting platform for any errors.
                    </li>
                    <li>
                        <strong>Error Handling & Logging:</strong> Implement robust error handling within your AI flow calls (e.g., in <code className="bg-muted px-1.5 py-0.5 rounded-sm">src/app/(app)/recommendations/page.tsx</code> when calling <code className="bg-muted px-1.5 py-0.5 rounded-sm">getDishRecommendation</code>). Log any errors from the AI service for easier debugging in production.
                    </li>
                     <li>
                        <strong>Genkit Deployment:</strong> Genkit itself doesn't require separate "deployment" beyond your Next.js app if flows are invoked via server actions or API routes. Ensure the Genkit packages (<code className="bg-muted px-1.5 py-0.5 rounded-sm">genkit</code>, <code className="bg-muted px-1.5 py-0.5 rounded-sm">@genkit-ai/googleai</code>) are in your `dependencies` in `package.json` so they are installed during the production build.
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
                  <li><strong>Reliable Network Infrastructure:</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li><strong>Internet Connection:</strong> A stable, reasonably fast internet connection is vital for accessing your hosted application and any cloud services (database, AI, payment gateways).</li>
                      <li><strong>Local Network (LAN):</strong> A robust Wi-Fi network covering your restaurant. For critical components like fixed POS terminals or network printers, a wired Ethernet connection is often more reliable than Wi-Fi.
                      </li>
                      <li><strong>Network Security:</strong> Secure your Wi-Fi with a strong password (WPA2/WPA3). Consider a separate network for POS devices if possible, isolated from guest Wi-Fi.</li>
                    </ul>
                  </li>
                  <li><strong>POS Terminal Devices:</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li><strong>Options:</strong> All-in-one POS terminals, computers (desktops, laptops) with touch monitors, tablets (iPads, Android tablets).</li>
                      <li><strong>Browser Access:</strong> Ensure chosen devices have a modern web browser that can run your Next.js application smoothly.</li>
                      <li><strong>Durability:</strong> Consider restaurant environment (spills, grease) when choosing hardware. Tablet stands or enclosures can help.</li>
                    </ul>
                  </li>
                  <li><strong>Peripheral Devices:</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li><strong>Receipt Printers & Kitchen Printers:</strong> As discussed in Step 4. Ensure they are compatible with your chosen integration method.</li>
                      <li><strong>Cash Drawers:</strong> Usually connect to receipt printers and are triggered to open by a command sent from the printer.</li>
                      <li><strong>Barcode Scanners (Optional):</strong> If you plan to use barcodes for menu items or retail products. Typically USB or Bluetooth.</li>
                      <li><strong>Payment Terminals (Card Readers):</strong> Integration with payment terminals varies greatly. Some modern terminals offer APIs or can operate semi-independently. This is a complex area often requiring specific payment gateway integration.</li>
                    </ul>
                  </li>
                  <li><strong>Device Configuration & Setup:</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                        <li>Ensure all POS devices can access the URL of your deployed application.</li>
                        <li>Configure network printers with static IP addresses on your local network for stable connections.</li>
                        <li>Install any necessary drivers or local agent software for printers or other peripherals.</li>
                    </ul>
                   </li>
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
                      <li><strong>Cloud Database:</strong> If using a managed cloud database like Firestore or AWS DynamoDB, automatic backups are often part of the service. Understand their backup policies, retention periods, and point-in-time recovery options. Consider setting up scheduled exports for additional peace of mind.</li>
                      <li><strong>Self-Hosted Database:</strong> If you self-host a database (e.g., PostgreSQL on your own server), you are responsible for implementing a regular, automated backup schedule. Store backups securely, preferably off-site or in a different availability zone.</li>
                    </ul>
                  </li>
                  <li><strong>Application & System Security:</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li><strong>HTTPS (SSL/TLS):</strong> Always serve your application over HTTPS. Hosting providers like Firebase App Hosting and Vercel typically handle SSL certificate provisioning and renewal automatically.</li>
                      <li><strong>Secure API Keys & Credentials:</strong> As mentioned in Step 5, use environment variables on your hosting server for all API keys, database credentials, and other secrets. Do not commit them to your code repository.</li>
                      <li><strong>Input Validation:</strong> Sanitize and validate all user inputs on both client-side and server-side to prevent common web vulnerabilities (e.g., XSS, SQL injection if applicable).</li>
                      <li><strong>Dependency Updates:</strong> Regularly update software dependencies (Next.js, UI libraries, Node.js on the server, Genkit packages) to patch known security vulnerabilities. Use tools like `npm audit` or Dependabot.</li>
                      <li><strong>Strong Password Policies:</strong> If using Firebase Authentication or similar, configure strong password requirements. If building custom auth (not recommended), implement secure password hashing (e.g., bcrypt, Argon2).</li>
                      <li><strong>Firewall & Network Security:</strong> Secure your server and network infrastructure (see Step 6).</li>
                    </ul>
                  </li>
                  <li><strong>Ongoing Maintenance:</strong>
                    <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                      <li><strong>Monitoring:</strong> Set up monitoring for your application and server. Track error rates, response times, and resource usage (CPU, memory, database load). Hosting providers often offer built-in monitoring tools.</li>
                      <li><strong>Logging:</strong> Implement comprehensive logging for both frontend and backend actions, especially for errors and critical operations. This is invaluable for debugging.
                      </li>
                      <li><strong>Software Updates:</strong> Plan for regular updates to your Next.js app, operating systems (if self-hosting), and all dependencies.</li>
                      <li><strong>Testing:</strong> Have a staging or test environment to test updates before deploying them to your live production system.</li>
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
    
