"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Logo from "@/assets/logo.png"
import { siteConfig } from "@/config"
import { ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { UserDropdown } from "@/components/user-dropdown"

interface NavbarProps {
  isLoggedIn: string | null
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
      return <UserDropdown contentClassName="mr-4 md:mr-0 mt-2 md:mt-3" />
    }

    return (
      <Link
        href="/sign-in"
        className={buttonVariants({
          variant: "outline",
          size: "sm",
          className:
            "group text-primary hover:text-primary-foreground relative overflow-hidden transition-all duration-300 hover:scale-105",
        })}
      >
        <span className="from-primary to-accent absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="relative z-10 flex items-center gap-1">
          Sign In
          <ChevronRightIcon className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </Link>
    )
  }

  return (
    <nav
      className={cn(
        "bg-background/5 fixed top-0 z-50 w-full backdrop-blur transition-all duration-300",
        isScrolled ? "border-b" : ""
      )}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="from-primary group to-accent flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-tr">
              <Image
                src={Logo}
                alt="Logo"
                width={16}
                height={16}
                className="inline-block w-5 select-none"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
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
