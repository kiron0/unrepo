"use client"

import Image from "next/image"
import Link from "next/link"
import Logo from "@/assets/logo.png"
import { siteConfig } from "@/config"

export function Footer() {
  return (
    <footer className="bg-card/60 mt-20 border-t">
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="from-primary to-secondary group flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-tr">
              <Image
                src={Logo}
                alt="Logo"
                width={499}
                height={500}
                className="inline-block w-5 select-none"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
            <span className="from-primary to-secondary bg-gradient-to-tr bg-clip-text text-lg font-bold tracking-tight text-transparent">
              {siteConfig.name}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 text-sm md:flex-row md:gap-8">
            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              About
            </Link>
            <span className="text-muted-foreground flex items-center space-x-2">
              <span>Developed by</span>
              <a
                href={siteConfig.author.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary/80 font-bold duration-300 hover:underline hover:underline-offset-4"
              >
                {siteConfig.author.name}
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
