import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { cookies } from "next/headers";
import { LayoutProvider } from "@/components/layout/layout-provider";
import { AppHeader } from "@/components/app-header";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Newell Purchase System",
  description: "Purchase System for Newell Electromechanical to manage purchases and suppliers.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  return (
     <ClerkProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppHeader />
    <SidebarProvider defaultOpen={defaultOpen}>

    <LayoutProvider>
      <AppSidebar  />
        <SidebarTrigger  />     
  
    <main className="flex flex-1 ">
        {children}
     </main>

    </LayoutProvider>
    </SidebarProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
