import "@/config/env";

import "@repo/ui/globals.css";

import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { esMX } from "@clerk/localizations";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: process.env.NEXT_PUBLIC_APP_NAME,
};

const font = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={esMX}
      appearance={{
        elements: {
          footer: "hidden",
        },
      }}
    >
      <html lang="es" suppressHydrationWarning>
        {/* <head>
          <script
            src="https://unpkg.com/react-scan/dist/auto.global.js"
            async
          />
        </head> */}
        <body
          className={`${font.className} antialiased selection:bg-primary/80  bg-gradient-to-br from-blue-50 to-indigo-100 animate-gradient-x`}
        >
          {children}
        </body>
        <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_KEY ?? ""} />
      </html>
    </ClerkProvider>
  );
}
