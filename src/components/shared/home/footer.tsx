"use client"

import Link from "next/link"
import { siteConfig } from "@/config"
import { GithubIcon, HeartIcon, Trash2Icon } from "lucide-react"

import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="bg-card/60 mt-20 border-t">
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="from-primary to-secondary flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-tr">
              <Trash2Icon className="text-primary-foreground h-4 w-4" />
            </div>
            <span className="from-foreground to-muted-foreground bg-gradient-to-r bg-clip-text text-lg font-bold tracking-tight text-transparent">
              {siteConfig.name}
            </span>
          </div>
          <div className="flex items-center space-x-8 text-sm">
            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              About
            </Link>
            <Separator orientation="vertical" className="h-5" />
            <a
              href="https://github.com/Rakibulislam-emon/github_repo_remover"
              className="text-muted-foreground hover:text-foreground flex items-center space-x-2 font-medium transition-colors"
            >
              <GithubIcon className="h-4 w-4" />
              <span>GitHub</span>
            </a>
            <Separator orientation="vertical" className="h-5" />
            <span className="text-muted-foreground flex items-center space-x-2">
              <span>Made with</span>
              <HeartIcon className="text-primary h-4 w-4" />
              <span>by developers</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
