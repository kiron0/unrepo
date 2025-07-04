"use client"

import { siteConfig } from "@/config"
import { GithubIcon, ShieldIcon, UsersIcon, ZapIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"

export function WhyChoose() {
  return (
    <div className="bg-card/60 rounded-3xl p-8 shadow-lg lg:p-12">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="space-y-8">
          <div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight lg:text-4xl">
              <span className="from-foreground to-muted-foreground bg-gradient-to-r bg-clip-text text-transparent">
                Why Choose
              </span>
              <br />
              <span className="from-primary to-secondary bg-gradient-to-tr bg-clip-text text-transparent">
                {siteConfig.name}?
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Built by developers, for developers. Experience the fastest way to
              manage your GitHub repositories.
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <Badge
                variant="secondary"
                className="bg-secondary text-secondary-foreground px-3 py-1 text-sm font-semibold"
              >
                <ZapIcon className="mr-1 h-3 w-3" />
                Fast
              </Badge>
              <div className="space-y-1">
                <h3 className="text-card-foreground font-semibold">
                  Lightning Performance
                </h3>
                <p className="text-muted-foreground">
                  Process thousands of repositories in seconds with our
                  optimized GitHub API integration.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Badge
                variant="secondary"
                className="bg-secondary text-secondary-foreground px-3 py-1 text-sm font-semibold"
              >
                <ShieldIcon className="mr-1 h-3 w-3" />
                Secure
              </Badge>
              <div className="space-y-1">
                <h3 className="text-card-foreground font-semibold">
                  Bank-Level Security
                </h3>
                <p className="text-muted-foreground">
                  Enterprise-grade OAuth 2.0 with minimal permissions and
                  complete transparency.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Badge
                variant="secondary"
                className="bg-secondary text-secondary-foreground px-3 py-1 text-sm font-semibold"
              >
                <UsersIcon className="mr-1 h-3 w-3" />
                Trusted
              </Badge>
              <div className="space-y-1">
                <h3 className="text-card-foreground font-semibold">
                  Developer Approved
                </h3>
                <p className="text-muted-foreground">
                  Used by thousands of developers worldwide to maintain clean
                  GitHub profiles.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="from-primary to-secondary absolute inset-0 rounded-full bg-gradient-to-tr opacity-25 blur-3xl" />
          <div className="from-primary to-secondary shadow-primary/50 relative mx-auto flex h-64 w-64 items-center justify-center rounded-full bg-gradient-to-tr shadow-2xl lg:h-80 lg:w-80">
            <GithubIcon className="text-primary-foreground h-32 w-32 lg:h-40 lg:w-40" />
          </div>
          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-lg font-medium">
              Trusted by developers worldwide
            </p>
            <div className="text-muted-foreground mt-2 justify-center space-x-4 text-sm md:flex">
              <span>10K+ Users</span>
              <span>•</span>
              <span>50K+ Repos Cleaned</span>
              <span>•</span>
              <span>99.9% Uptime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
