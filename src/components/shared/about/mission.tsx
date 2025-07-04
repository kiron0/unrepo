"use client"

import { siteConfig } from "@/config"

export function Mission() {
  return (
    <div>
      <h2 className="mb-8 text-3xl font-bold tracking-tight lg:text-4xl">
        <span className="from-primary to-secondary bg-gradient-to-tr bg-clip-text text-transparent">
          My Mission
        </span>
      </h2>
      <p className="text-muted-foreground text-lg leading-8 sm:text-xl">
        I created {siteConfig.name} to help developers efficiently manage their
        GitHub repositories. As developers, we often create numerous
        repositories for testing, learning, or temporary projects that
        eventually clutter our GitHub accounts. This tool makes it easy to clean
        up your GitHub profile by providing a simple, intuitive interface to
        manage and delete unwanted repositories.
      </p>
    </div>
  )
}
