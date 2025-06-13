
// src/app/(app)/setup-guide/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Database, Users, Printer, Wifi, Cloud, ShieldCheck, Rocket } from "lucide-react";

export default function SetupGuidePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <Rocket className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-headline font-bold text-primary">Deployment & Setup Guide</h1>
      </div>

      <Alert variant="destructive" className="bg-destructive/10 border-destructive/30 text-destructive dark:text-red-400 dark:bg-red-900/20 dark:border-red-500/30">
        <Terminal className="h-4 w-4 !text-destructive dark:!text-red-400" />
        <AlertTitle className="font-semibold !text-destructive dark:!text-red-400">Important: Prototype Status</AlertTitle>
        <AlertDescription className="!text-destructive/80 dark:!text-red-400/80">
          The Annapurna POS application in its current state is a **prototype**. 
          It uses browser LocalStorage for data and mocks certain features. 
          The steps below outline the necessary development work to make it production-ready for a real restaurant.
          This will require software development expertise.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center"><Terminal className="mr-2 h-5 w-5" />1. Production Build & Hosting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>To deploy the application, you first need to create a production build:</p>
          <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto"><code>npm run build</code></pre>
          <p>This optimized build then needs to be hosted on a suitable platform. Options include:</p>
          <ul className="list-disc list-outside pl-5 space-y-1">
            <li><strong>Firebase App Hosting:</strong> A natural fit given Firebase Studio. It can host Next.js apps and run server-side code like Genkit flows. Your `apphosting.yaml` is a starting point.</li>
            <li><strong>Vercel:</strong> Platform by the creators of Next.js, offering seamless deployment for Next.js projects.</li>
            <li><strong>Netlify:</strong> Another popular platform for modern web applications.</li>
            <li><strong>Self-Hosting:</strong> Deploying to your own server (e.g., using Docker, PM2) provides more control but requires more setup and maintenance.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center"><Database className="mr-2 h-5 w-5" />2. Data Management (Critical)</CardTitle>
          <CardDescription>Moving beyond LocalStorage is essential for a multi-user, multi-device environment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>LocalStorage is browser-specific and not suitable for a real restaurant. You need a centralized database.</p>
          <ul className="list-disc list-outside pl-5 space-y-1">
            <li><strong>Cloud Firestore (Recommended):</strong> A NoSQL, real-time database from Firebase. It's scalable and integrates well with the Firebase ecosystem. You would refactor the app to read/write all data (menu items, orders, settings) to Firestore.</li>
            <li><strong>Other Databases:</strong> Relational databases (PostgreSQL, MySQL) or other NoSQL options (MongoDB) can be used, typically requiring a custom backend API layer to interact with your Next.js frontend.</li>
          </ul>
          <p>This involves changing how menu items, orders, and settings are saved and retrieved throughout the application.</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center"><Users className="mr-2 h-5 w-5" />3. User Authentication & Authorization</CardTitle>
          <CardDescription>Secure login and role-based access are necessary.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>The current user management in settings is a mock-up. A real system needs:</p>
          <ul className="list-disc list-outside pl-5 space-y-1">
            <li><strong>Firebase Authentication:</strong> Provides secure user sign-up, sign-in, password management, and supports various login methods (email/password, social logins).</li>
            <li><strong>NextAuth.js:</strong> A comprehensive authentication library for Next.js applications.</li>
          </ul>
          <p>Once authentication is in place, you'll need to implement role-based access control (e.g., Admin, Staff, Manager) to restrict access to sensitive features and data.</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center"><Printer className="mr-2 h-5 w-5" />4. Printer Integration</CardTitle>
          <CardDescription>Connecting to thermal receipt printers for bills and kitchen orders.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>The current `window.print()` is for browser printing. For POS operations, you'll need to integrate with thermal printers:</p>
          <ul className="list-disc list-outside pl-5 space-y-1">
            <li><strong>Web-to-Printer Services:</strong> Cloud services like PrintNode or ePrint can bridge web applications to local printers.</li>
            <li><strong>Printer SDKs:</strong> Some printer manufacturers (e.g., Epson's ePOS-Print SDK) provide tools for web-based printing.</li>
            <li><strong>Local Print Server/Agent:</strong> A small application running on a computer connected to the printer, which your web app communicates with over the local network (e.g., using QZ Tray, or a custom-built solution).</li>
          </ul>
          <p>The "Printers & Devices" section in settings would need to be re-implemented to manage these real printer connections.</p>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center"><Wifi className="mr-2 h-5 w-5" />5. Networking & Hardware</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>A stable and reliable local network (Wi-Fi or wired Ethernet) is crucial for communication between devices (terminals, printers, kitchen displays).</p>
          <p>Consider the POS hardware you'll need:</p>
          <ul className="list-disc list-outside pl-5 space-y-1">
            <li>Computers or tablets for order taking and management.</li>
            <li>Touch screens for ease of use.</li>
            <li>Receipt printers.</li>
            <li>Kitchen printers or displays.</li>
            <li>Cash drawers.</li>
            <li>Barcode scanners (if applicable).</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center"><Cloud className="mr-2 h-5 w-5" />6. Deploying Genkit AI Flows</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>The AI Dish Recommendation feature uses Genkit flows, which run server-side.</p>
          <p>Your chosen hosting solution (e.g., Firebase App Hosting, Vercel with serverless functions) must support Node.js execution to run these Genkit flows. Ensure API keys for any AI services (like Google AI) are configured securely as environment variables in your production environment.</p>
          <p>The Genkit flows (`src/ai/flows/*`) will need to be part of your deployment bundle.</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center"><ShieldCheck className="mr-2 h-5 w-5" />7. Backup, Security & Maintenance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <ul className="list-disc list-outside pl-5 space-y-1">
            <li><strong>Data Backups:</strong> If using a cloud database like Firestore, backups are often managed by the provider. For self-hosted databases, implement regular, automated backups.</li>
            <li><strong>Security:</strong>
              <ul className="list-disc list-outside pl-5 space-y-1 mt-1">
                  <li>Use HTTPS for all communication.</li>
                  <li>Securely manage API keys and credentials (do not hardcode them). Use environment variables.</li>
                  <li>Implement strong input validation on both client and server sides.</li>
                  <li>Regularly update dependencies to patch security vulnerabilities.</li>
              </ul>
            </li>
            <li><strong>Maintenance:</strong> Plan for ongoing software updates, monitoring, and troubleshooting.</li>
          </ul>
        </CardContent>
      </Card>

      <div className="text-center text-muted-foreground py-4">
        <p>This guide provides a high-level overview. Each step involves significant technical considerations and development effort.</p>
        <p>Good luck with deploying your Annapurna POS system!</p>
      </div>
    </div>
  );
}

    