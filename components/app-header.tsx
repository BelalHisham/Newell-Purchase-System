"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Search, Moon, User, LogOut, Settings, HelpCircle, Menu, PersonStanding } from "lucide-react"
import { useTheme } from "next-themes"
import { useLayout } from "@/components/layout/layout-provider"
// import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { SignedIn, UserButton } from "@clerk/nextjs"

export function AppHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const { theme, setTheme } = useTheme()





  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">

      <div className="w-full flex items-center justify-between">
        <div  />
        <div className="flex items-center gap-4">
          
           <SignedIn>
           <UserButton  appearance={{
            elements: {
                userButtonPopoverFooter : "hidden",
                },}} />
            </SignedIn>

          
        </div>
      </div>
    </header>
  )
}
