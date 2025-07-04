"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { siteConfig } from "@/config"
import { ChevronRightIcon, GithubIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { ThemeSwitcher } from "./theme-switcher"
import { UserDropdown } from "./user-dropdown"

interface NavbarProps {
  isLoggedIn: boolean
}

export function Navbar({ isLoggedIn }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

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
          <ChevronRightIcon />
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
            <AuthButton />
            <ThemeSwitcher />
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  )
}
