"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { siteConfig } from "@/config"
import { Github, GithubIcon, LogOut, User } from "lucide-react"
import { HiOutlineMenuAlt4 } from "react-icons/hi"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { ThemeSwitcher } from "./theme-switcher"

export function Navbar() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const closeSheet = () => setIsSheetOpen(false)

  const handleLogout = () => {
    router.push("/")
    closeSheet()
  }

  const AuthButton = () => {
    if (isLoggedIn) {
      return (
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <User className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Button onClick={handleLogout} size="sm" variant="outline">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      )
    }

    return (
      <Link href="/login">
        <Button
          size="sm"
          className="from-primary to-secondary bg-gradient-to-tr hover:opacity-90"
        >
          <Github className="h-4 w-4" />
          Connect GitHub
        </Button>
      </Link>
    )
  }

  return (
    <nav
      className={cn(
        "bg-background/80 fixed top-0 z-50 w-full backdrop-blur-xl",
        isScrolled ? "border-b" : ""
      )}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="from-primary to-accent flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-tr">
              <GithubIcon className="h-4 w-4 text-white" />
            </div>
            <span className="from-primary to-secondary bg-gradient-to-tr bg-clip-text text-lg font-bold tracking-tight text-transparent">
              {siteConfig.name}
            </span>
          </Link>
          <div className="hidden items-center gap-4 md:flex">
            <Link
              href="/about"
              className="hover:text-foreground text-muted-foreground font-medium transition-colors"
            >
              About
            </Link>
            <AuthButton />
            <ThemeSwitcher />
          </div>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <div className="flex items-center md:hidden">
              <ThemeSwitcher />
              <SheetTrigger asChild>
                <button className="inline-flex h-9 items-center justify-center px-4 py-2 md:hidden">
                  <HiOutlineMenuAlt4 className="text-muted-foreground size-6" />
                  <span className="sr-only">Open menu</span>
                </button>
              </SheetTrigger>
            </div>
            <SheetContent side="right" className="w-full max-w-xs">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-3">
                  <div className="from-primary to-secondary flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-tr">
                    <GithubIcon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg font-bold tracking-tight">
                    {siteConfig.name}
                  </span>
                </SheetTitle>
                <SheetDescription>
                  Navigate through the app to manage your repositories
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col space-y-3 px-4">
                <Link
                  href="/about"
                  onClick={closeSheet}
                  className="text-sm font-medium"
                >
                  About
                </Link>
                <div className="space-y-2 pt-6">
                  {isLoggedIn ? (
                    <>
                      <Link href="/dashboard" onClick={closeSheet}>
                        <Button className="w-full" variant="outline">
                          <User className="h-4 w-4" />
                          Dashboard
                        </Button>
                      </Link>
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Link href="/login" onClick={closeSheet}>
                      <Button className="from-primary to-secondary w-full bg-gradient-to-tr text-white hover:opacity-90">
                        <GithubIcon className="h-4 w-4" />
                        Connect GitHub
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
