"use client"

import Image from "next/image"
import Logo from "@/assets/logo.png"
import { siteConfig } from "@/config"
import { ShieldIcon, UsersIcon, ZapIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"

export function WhyChoose() {
  return (
    <div className="grid items-center gap-12 xl:grid-cols-2">
      <div className="space-y-8">
        <div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight lg:text-4xl">
            <span className="from-foreground to-muted-foreground bg-gradient-to-r bg-clip-text text-transparent">
              Why Choose
            </span>{" "}
            <br className="md:hidden" />
            <span className="from-primary to-secondary bg-gradient-to-tr bg-clip-text text-transparent">
              {siteConfig.name}?
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Streamline your GitHub workflow with tools designed for efficient
            repository management and cleanup.
          </p>
        </div>
        <div className="space-y-6">
          <div className="flex flex-col items-start gap-2 space-x-4 md:flex-row md:gap-0">
            <Badge
              variant="secondary"
              className="bg-secondary text-secondary-foreground px-3 py-1 text-sm font-semibold"
            >
              <ZapIcon className="mr-1 h-3 w-3" />
              Fast
            </Badge>
            <div className="space-y-1">
              <h3 className="text-card-foreground font-semibold">
                Efficient Processing
              </h3>
              <p className="text-muted-foreground">
                Handle multiple repositories at once with our streamlined GitHub
                API integration for faster workflow.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 space-x-4 md:flex-row md:gap-0">
            <Badge
              variant="secondary"
              className="bg-secondary text-secondary-foreground px-3 py-1 text-sm font-semibold"
            >
              <ShieldIcon className="mr-1 h-3 w-3" />
              Secure
            </Badge>
            <div className="space-y-1">
              <h3 className="text-card-foreground font-semibold">
                Safe & Secure
              </h3>
              <p className="text-muted-foreground">
                Uses standard OAuth 2.0 authentication with read-only access to
                ensure your account security.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 space-x-4 md:flex-row md:gap-0">
            <Badge
              variant="secondary"
              className="bg-secondary text-secondary-foreground px-3 py-1 text-sm font-semibold"
            >
              <UsersIcon className="mr-1 h-3 w-3" />
              Simple
            </Badge>
            <div className="space-y-1">
              <h3 className="text-card-foreground font-semibold">
                User Friendly
              </h3>
              <p className="text-muted-foreground">
                Intuitive interface designed for developers to quickly manage
                and organize their GitHub repositories.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="from-primary to-secondary absolute inset-0 rounded-full bg-gradient-to-tr opacity-25 blur-3xl" />
        <div className="from-primary to-secondary shadow-primary/50 group relative mx-auto flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-tr shadow-2xl sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-80 lg:w-80">
          <Image
            src={Logo}
            alt="Logo"
            width={1080}
            height={1080}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            className="size-32 object-cover transition-transform duration-300 select-none hover:scale-105 sm:size-36 md:size-44 lg:size-52"
          />
        </div>
        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-lg font-medium">
            Simple. Secure. Effective.
          </p>
          <div className="text-muted-foreground mt-2 justify-center space-x-4 text-sm md:flex">
            <span>Easy to Use</span>
            <span>•</span>
            <span>OAuth Secure</span>
            <span>•</span>
            <span>No Installation</span>
          </div>
        </div>
      </div>
    </div>
  )
}
