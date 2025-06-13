
// src/app/(app)/setup-guide/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Database, Users, Printer, Wifi, Cloud, ShieldCheck, Rocket, AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SetupGuidePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <Rocket className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-headline font-bold text-primary">From Prototype to Production: Setup Guide</h1>
      </div>

      <Alert variant="destructive" className="bg-destructive/10 border-destructive/30 text-destructive dark:text-red-400 dark:bg-red-900/20 dark:border-red-500/30">
        <AlertTriangle className="h-5 w-5 !text-destructive dark:!text-red-400" />
        <AlertTitle className="font-semibold !text-destructive dark:!text-red-400 text-lg">Critical: This is a Prototype Application</AlertTitle>
        <AlertDescription className="!text-destructive/80 dark:!text-red-400/80 mt-1">
          The Annapurna POS application you are currently using is a **prototype designed for demonstration and development in Firebase Studio**.
          It uses your browser's LocalStorage for all data (menu, orders, settings), which means:
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Data is **not shared** between different computers or users.</li>
            <li>Data can be **easily lost** if browser history/cache is cleared.</li>
            <li>Features like user logins and real printer connections are **mocked or simplified**.</li>
          </ul>
          To use this application in a real restaurant, **significant software development work is required**. The steps below outline what's involved. This is not a simple configuration task; it requires coding and system setup expertise.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center"><Terminal className="mr-2 h-5 w-5 text-primary" />1. Production Build & Hosting</CardTitle>
          <CardDescription>Getting your app ready and putting it online.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <div>
            <h4 className="font-semibold text-foreground mb-1">Step 1.1: Create a Production Build</h4>
            <p>Your Next.js app needs to be "built" for production. This optimizes the code for performance and prepares it for deployment.</p>
            <p className="mt-1">In your project's terminal, run:</p>
            <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto mt-1"><code>npm run build</code></pre>
            <p className="mt-1">This will create a `.next` folder with the optimized application.</p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">Step 1.2: Choose a Hosting Platform</h4>
            <p>This built app needs to live on a server accessible via the internet or your local restaurant network.</p>
            <ul className="list-disc list-outside pl-5 space-y-2 mt-1">
              <li>
                <strong>Firebase App Hosting (Recommended for Firebase Users):</strong>
                <p className="text-xs">Firebase can host Next.js applications directly. Your project already includes an `apphosting.yaml` file, which is a configuration for App Hosting. You'd set up an App Hosting backend in your Firebase project and deploy your built code to it. This can also run your Genkit AI flows.</p>
                <Button variant="link" size="sm" asChild className="p-0 h-auto">
                  <Link href="https://firebase.google.com/docs/app-hosting" target="_blank" rel="noopener noreferrer">Learn more about Firebase App Hosting <ExternalLink className="ml-1 h-3 w-3" /></Link>
                </Button>
              </li>
              <li>
                <strong>Vercel:</strong>
                <p className="text-xs">Created by the makers of Next.js, Vercel offers seamless deployment for Next.js projects. You'd connect your code repository (e.g., GitHub) to Vercel.</p>
              </li>
              <li>
                <strong>Other Cloud Platforms:</strong> Services like Netlify, AWS Amplify, Azure Static Web Apps also support Next.js.
              </li>
              <li>
                <strong>Self-Hosting:</strong> You can deploy to your own server (e.g., a Linux server with Node.js installed, potentially using Docker). This offers maximum control but requires more technical expertise for setup, security, and maintenance.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center"><Database className="mr-2 h-5 w-5 text-primary" />2. Real-Time Data Management (Most Critical Change)</CardTitle>
          <CardDescription>Moving from LocalStorage to a shared, persistent database.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <Alert variant="default" className="bg-yellow-50 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-600">
            <AlertTriangle className="h-4 w-4 !text-yellow-600 dark:!text-yellow-400" />
            <AlertTitle className="font-semibold !text-yellow-700 dark:!text-yellow-300">Development Intensive</AlertTitle>
            <AlertDescription className="!text-yellow-700/80 dark:!text-yellow-400/80">
              This step involves rewriting significant parts of the application's data handling logic.
            </AlertDescription>
          </Alert>
          <div>
            <h4 className="font-semibold text-foreground mb-1">Step 2.1: Understand the Limitation of LocalStorage</h4>
            <p>As mentioned, LocalStorage is temporary and browser-specific. For a real restaurant, you need a central database where all menu items, orders, settings, and user data are stored securely and can be accessed by multiple devices (cashier terminal, kitchen display system, manager's view).</p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">Step 2.2: Choose and Set Up a Database</h4>
            <ul className="list-disc list-outside pl-5 space-y-2 mt-1">
              <li>
                <strong>Cloud Firestore (Recommended with Firebase):</strong>
                <p className="text-xs">A NoSQL, real-time database from Firebase. It's scalable, syncs data across devices instantly, and integrates well with other Firebase services like Authentication.</p>
                <p className="text-xs mt-1"><strong>Setup:</strong> Create a Firebase project (if you don't have one), enable Firestore in your Firebase console, and set up security rules to control data access.</p>
                 <Button variant="link" size="sm" asChild className="p-0 h-auto">
                  <Link href="https://firebase.google.com/docs/firestore" target="_blank" rel="noopener noreferrer">Learn more about Firestore <ExternalLink className="ml-1 h-3 w-3" /></Link>
                </Button>
              </li>
              <li>
                <strong>Other Database Options:</strong> You could use PostgreSQL, MySQL, MongoDB, etc. These typically require building a separate backend API (e.g., using Node.js/Express, Python/Django) for your Next.js frontend to communicate with the database.
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">Step 2.3: Modify Application Code</h4>
            <p>This is where most of the development work lies. You'll need to:</p>
            <ul className="list-disc list-outside pl-5 space-y-1 mt-1">
              <li>Remove all `localStorage.getItem(...)` and `localStorage.setItem(...)` calls related to menu items, orders, and application settings.</li>
              <li>Integrate the Firebase SDK (for Firestore) or your database's client library into the application.</li>
              <li>Rewrite functions in `src/contexts/SettingsContext.tsx`, `src/app/(app)/menu/page.tsx`, `src/app/(app)/order/page.tsx`, `src/app/(app)/billing/page.tsx`, and `src/app/(app)/reports/page.tsx` to:
                <ul className="list-disc list-outside pl-5 space-y-1 mt-1">
                    <li>Fetch data from Firestore on component mount.</li>
                    <li>Save new data (new menu items, placed orders) to Firestore.</li>
                    <li>Update existing data in Firestore.</li>
                    <li>Delete data from Firestore.</li>
                    <li>Listen for real-time updates from Firestore (optional but powerful for features like live order updates).</li>
                </ul>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center"><Users className="mr-2 h-5 w-5 text-primary" />3. User Authentication & Authorization</CardTitle>
          <CardDescription>Secure login for staff and role-based access.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
           <div>
            <h4 className="font-semibold text-foreground mb-1">Step 3.1: Choose an Authentication Provider</h4>
             <ul className="list-disc list-outside pl-5 space-y-2 mt-1">
                <li>
                    <strong>Firebase Authentication (Recommended with Firebase):</strong>
                    <p className="text-xs">Provides easy-to-use SDKs for user sign-up, sign-in (email/password, phone, social logins), password reset, and more. User data is stored securely by Firebase.</p>
                     <p className="text-xs mt-1"><strong>Setup:</strong> Enable Firebase Authentication in your Firebase console and configure desired sign-in methods.</p>
                     <Button variant="link" size="sm" asChild className="p-0 h-auto">
                        <Link href="https://firebase.google.com/docs/auth" target="_blank" rel="noopener noreferrer">Learn more about Firebase Auth <ExternalLink className="ml-1 h-3 w-3" /></Link>
                    </Button>
                </li>
                <li>
                    <strong>NextAuth.js:</strong> A comprehensive open-source authentication library for Next.js. Highly configurable.
                </li>
             </ul>
           </div>
           <div>
            <h4 className="font-semibold text-foreground mb-1">Step 3.2: Implement Login/Registration UI</h4>
            <p>Create pages or modals for users to log in or register. The current "User Management" in settings is purely a mock and needs to be replaced.</p>
           </div>
           <div>
            <h4 className="font-semibold text-foreground mb-1">Step 3.3: Protect Routes and Features</h4>
            <p>Modify the application to:</p>
            <ul className="list-disc list-outside pl-5 space-y-1 mt-1">
                <li>Redirect unauthenticated users to a login page.</li>
                <li>Show/hide UI elements or restrict access to pages (like Settings, Reports) based on the logged-in user's role (e.g., Admin, Manager, Staff). This involves checking the user's role (stored in your database alongside their auth record) after they log in.</li>
            </ul>
           </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center"><Printer className="mr-2 h-5 w-5 text-primary" />4. Real Printer Integration</CardTitle>
          <CardDescription>Connecting to thermal receipt printers for bills and kitchen orders.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
            <div>
                <h4 className="font-semibold text-foreground mb-1">Step 4.1: Understand Web Printing Limitations</h4>
                <p>The current `window.print()` function in the app triggers the browser's standard print dialog, which is for printing web pages to A4/Letter paper, not ideal for thermal receipt printers.</p>
            </div>
            <div>
                <h4 className="font-semibold text-foreground mb-1">Step 4.2: Choose an Integration Method</h4>
                <p>Directly controlling thermal printers from a web browser is complex due to security restrictions. Common solutions include:</p>
                <ul className="list-disc list-outside pl-5 space-y-2 mt-1">
                    <li>
                        <strong>Web-to-Printer Cloud Services:</strong>
                        <p className="text-xs">Services like PrintNode or RawBT (for Android) act as a bridge. Your web app sends print jobs to the cloud service, which then relays them to a locally connected printer.</p>
                    </li>
                    <li>
                        <strong>Printer Manufacturer SDKs:</strong>
                        <p className="text-xs">Some printer brands (e.g., Epson's ePOS-Print SDK/XML, Star Micronics' WebPRNT) provide tools or JavaScript libraries that allow web applications to communicate with their printers, often over the local network.</p>
                    </li>
                    <li>
                        <strong>Local Print Server/Agent Software:</strong>
                        <p className="text-xs">Install a small application (e.g., QZ Tray, or a custom-built one) on a computer that has the thermal printer connected. Your web POS communicates with this local agent (e.g., via WebSockets or HTTP requests on the local network) to send print commands.</p>
                    </li>
                </ul>
            </div>
             <div>
                <h4 className="font-semibold text-foreground mb-1">Step 4.3: Implement Printing Logic</h4>
                <p>This involves significant coding:</p>
                <ul className="list-disc list-outside pl-5 space-y-1 mt-1">
                    <li>Integrate the chosen SDK or API for the print service/agent.</li>
                    <li>Format the bill data specifically for thermal printers (e.g., using ESC/POS commands or the format required by the SDK). This is different from HTML.</li>
                    <li>Update the "Print Bill" button and potentially add printing for kitchen order tickets (KOTs).</li>
                    <li>The "Printers & Devices" section in settings would need to be re-implemented to manage these real printer connections and select target printers.</li>
                </ul>
            </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center"><Wifi className="mr-2 h-5 w-5 text-primary" />5. Networking & Hardware Setup</CardTitle>
          <CardDescription>Physical setup in your restaurant.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
            <div>
                <h4 className="font-semibold text-foreground mb-1">Step 5.1: Plan Your Network</h4>
                <p>A stable local network (Wi-Fi or wired Ethernet) is essential. Ensure good coverage and bandwidth, especially if you plan to use multiple devices or tablets.</p>
            </div>
             <div>
                <h4 className="font-semibold text-foreground mb-1">Step 5.2: Acquire POS Hardware</h4>
                <p>Consider what you'll need:</p>
                <ul className="list-disc list-outside pl-5 space-y-1 mt-1">
                    <li><strong>POS Terminals:</strong> Computers (Windows, Mac, Linux) or tablets (Android, iPad) to run the POS application (via a web browser). Touch screens are highly recommended.</li>
                    <li><strong>Receipt Printers:</strong> Thermal printers compatible with your chosen integration method.</li>
                    <li><strong>Kitchen Printers/Displays (KDS):</strong> Printers or screens in the kitchen to display orders.</li>
                    <li><strong>Cash Drawer:</strong> Typically connects to the receipt printer and opens on command.</li>
                    <li><strong>Barcode Scanners:</strong> If you plan to use barcodes for menu items.</li>
                    <li><strong>Card Readers:</strong> For payment processing (integration depends on your payment gateway).</li>
                </ul>
            </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center"><Cloud className="mr-2 h-5 w-5 text-primary" />6. Deploying Genkit AI Flows (AI Dish Recommender)</CardTitle>
          <CardDescription>Making the AI features work in production.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
            <div>
                <h4 className="font-semibold text-foreground mb-1">Step 6.1: Understand Server-Side Execution</h4>
                <p>The Genkit AI flows (like the dish recommender in `src/ai/flows/*`) run on a server, not directly in the user's browser. Your hosting platform must support Node.js execution.</p>
            </div>
            <div>
                <h4 className="font-semibold text-foreground mb-1">Step 6.2: Configuration for Hosting</h4>
                <p>If using Firebase App Hosting, it's designed to run Node.js backends and can execute Genkit flows. Other platforms (Vercel, Netlify) support serverless functions where these flows can be deployed.</p>
            </div>
            <div>
                <h4 className="font-semibold text-foreground mb-1">Step 6.3: Secure API Keys</h4>
                <p>Ensure that any API keys for AI services (e.g., Google AI Studio API key for Gemini) are **not hardcoded** in your application. They should be configured as environment variables in your production hosting environment. Your `.env` file is for local development; production environments have their own way to set these securely.</p>
            </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-primary" />7. Backup, Security & Ongoing Maintenance</CardTitle>
          <CardDescription>Keeping your system running smoothly and securely.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
            <div>
                <h4 className="font-semibold text-foreground mb-1">Step 7.1: Data Backups</h4>
                <p>If using a cloud database like Firestore, automatic backups are often part of the service. For self-hosted databases, implement a regular, automated backup schedule.</p>
            </div>
             <div>
                <h4 className="font-semibold text-foreground mb-1">Step 7.2: Security Best Practices</h4>
                <ul className="list-disc list-outside pl-5 space-y-1 mt-1">
                    <li>Use HTTPS (SSL/TLS encryption) for all communication. Hosting platforms usually provide this.</li>
                    <li>Securely manage all API keys and credentials using environment variables.</li>
                    <li>Implement strong input validation on both client-side and server-side (if you build a custom backend).</li>
                    <li>Regularly update all software dependencies (Next.js, libraries, Node.js) to patch security vulnerabilities.</li>
                    <li>Follow security guidelines for your chosen database (e.g., Firestore Security Rules).</li>
                </ul>
            </div>
            <div>
                <h4 className="font-semibold text-foreground mb-1">Step 7.3: Ongoing Maintenance</h4>
                <p>Plan for regular software updates, monitoring your system for errors or performance issues, and troubleshooting any problems that arise.</p>
            </div>
        </CardContent>
      </Card>

      <div className="text-center text-muted-foreground py-4">
        <p>This guide provides a high-level overview. Each step involves many smaller technical decisions and considerable development effort.</p>
        <p className="font-semibold mt-2">Consider hiring a software developer or a company specializing in POS solutions if you are not comfortable with these technical tasks.</p>
        <p className="mt-4">Good luck with deploying your Annapurna POS system!</p>
      </div>
    </div>
  );
}
