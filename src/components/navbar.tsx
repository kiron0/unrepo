"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { siteConfig } from "@/config"
import { ChevronRightIcon, GithubIcon, LogOut } from "lucide-react"
import { GoRepo } from "react-icons/go"
import { HiOutlineMenuAlt4 } from "react-icons/hi"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { AlertDialogHelper } from "./alert-dialog-helper"
import { ThemeSwitcher } from "./theme-switcher"
import { notifySuccess } from "./toast"
import { UserDropdown } from "./user-dropdown"

interface NavbarProps {
  isLoggedIn: boolean
}

export function Navbar({ isLoggedIn }: NavbarProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const router = useRouter()
  const pathname = usePathname()

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

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" }).then((res) => {
        if (res.ok) {
          notifySuccess({
            description: "You have been logged out successfully.",
          })
        }
      })

      if (isSheetOpen) {
        closeSheet()
      }

      if (pathname !== "/") {
        router.push("/")
      }
    } catch (error) {
      console.error("Logout error:", error)
      router.push("/")
    }
  }

  const AuthButton = () => {
    if (isLoggedIn) {
      return <UserDropdown contentClassName="mr-2 lg:mr-0 mt-2 sm:mt-2" />
    }

    return (
      <Link href="/login">
        <Button
          size="sm"
          className="from-primary to-secondary bg-gradient-to-tr hover:opacity-90"
        >
          <GithubIcon />
          Get Started
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
          </div>
          <div className="hidden items-center gap-4 md:flex">
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
                      <Link
                        href="/repos"
                        onClick={closeSheet}
                        className={buttonVariants({
                          className:
                            "from-primary to-secondary w-full bg-gradient-to-tr text-white hover:opacity-90",
                        })}
                      >
                        <GoRepo className="h-4 w-4" />
                        Repositories
                      </Link>
                      <AlertDialogHelper
                        trigger={
                          <Button className="w-full" variant="destructive">
                            <LogOut className="h-4 w-4" />
                            Logout
                          </Button>
                        }
                        title="Are you sure you want to logout?"
                        description="You will be redirected to the home page."
                        func={() => handleLogout()}
                      />
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={closeSheet}
                      className={buttonVariants({
                        variant: "outline",
                        className:
                          "from-primary to-secondary w-full bg-gradient-to-tr text-white hover:opacity-90",
                      })}
                    >
                      <GithubIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
                      Get Started
                      <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
