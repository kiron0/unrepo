"use client"

import Link from "next/link"
import { ChevronRightIcon, ZapIcon } from "lucide-react"
import { GoRepo } from "react-icons/go"

import { buttonVariants } from "@/components/ui/button"

interface HeroProps {
  isLoggedIn: boolean
}

export function Hero({ isLoggedIn }: HeroProps) {
  const AuthButton = () => {
    if (isLoggedIn) {
      return (
        <Link
          href="/repos"
          className={buttonVariants({
            size: "lg",
            className:
              "group from-primary to-secondary text-primary-foreground hover:shadow-primary/30 relative overflow-hidden bg-gradient-to-tr text-base font-semibold transition-all duration-500 before:absolute before:inset-0 before:translate-x-[-100%] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-transform before:duration-1000 hover:scale-105 hover:shadow-2xl hover:before:translate-x-[100%]",
          })}
        >
          <GoRepo className="h-5 w-5 transition-transform group-hover:scale-110" />
          My Repositories
          <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )
    }

    return (
      <Link
        href="/sign-in"
        className={buttonVariants({
          size: "lg",
          className:
            "group from-primary to-secondary text-primary-foreground hover:shadow-primary/30 relative overflow-hidden bg-gradient-to-tr text-base font-semibold transition-all duration-500 before:absolute before:inset-0 before:translate-x-[-100%] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-transform before:duration-1000 hover:scale-105 hover:shadow-2xl hover:before:translate-x-[100%]",
        })}
      >
        <ZapIcon className="h-5 w-5 transition-transform group-hover:scale-110 group-hover:rotate-12" />
        Get Started Free
        <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    )
  }

  return (
    <div className="mx-auto mb-20 w-full text-center">
      <div className="text-muted-foreground mx-auto mb-6 w-fit rounded-full border px-3 py-2 text-xs font-medium sm:px-4 sm:text-sm">
        <ZapIcon className="mr-1.5 inline-flex h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
        <span>Clean up your GitHub repositories effortlessly</span>
      </div>
      <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
        <span className="from-primary to-secondary bg-gradient-to-tr bg-clip-text text-transparent">
          GitHub Repository
        </span>
        <br />
        <span className="from-primary to-secondary bg-gradient-to-tr bg-clip-text text-transparent">
          Remover
        </span>
      </h1>
      <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-lg leading-8 sm:text-xl">
        The most efficient way to clean up your GitHub account. Find, analyze,
        and remove unwanted repositories with advanced filtering and batch
        operations.
      </p>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <AuthButton />
      </div>
    </div>
  )
}
