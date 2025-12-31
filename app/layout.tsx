import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
// import { Link } from "@heroui/link";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
// import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/Sidebar";
import { HeroUIProvider } from "@heroui/system";
// import {type NextRouter, useRouter} from "next/router";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <div className="relative flex flex-col h-screen">
            <HeroUIProvider>
              <div className="min-h-screen bg-gray-50 flex">
                <Sidebar />
                <div className="flex-1 p-6">
                  {children}
                </div>
              </div>
            </HeroUIProvider>
          </div>
        </Providers>
      </body>
    </html>
  );
}