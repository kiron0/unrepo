"use client"

import { ArrowRightIcon, GithubIcon, ZapIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <div className="mx-auto mb-20 w-full text-center">
      <div className="text-muted-foreground mx-auto mb-6 w-fit rounded-full border px-4 py-2 text-sm font-medium">
        <ZapIcon className="mr-2 inline-flex h-4 w-4" />
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
        <Button
          size="lg"
          className="group from-primary to-secondary text-primary-foreground hover:shadow-primary/50 h-12 bg-gradient-to-tr px-8 text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          <GithubIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
          Connect with GitHub
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  )
}
