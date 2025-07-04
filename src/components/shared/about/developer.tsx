"use client"

import Image from "next/image"
import { siteConfig } from "@/config"
import { GithubIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"

export function Developer() {
  return (
    <div>
      <h2 className="mb-8 text-3xl font-bold tracking-tight lg:text-4xl">
        <span className="from-primary to-secondary bg-gradient-to-tr bg-clip-text text-transparent">
          Developer
        </span>
      </h2>
      <div className="flex w-full flex-col-reverse items-center gap-12 lg:flex-row">
        <div className="w-full space-y-6 lg:w-1/2">
          <p className="text-lg leading-8 sm:text-xl">
            {siteConfig.name} is a personal project developed by Toufiq Hasan
            Kiron. As a developer, I understand the importance of maintaining a
            clean and organized GitHub profile. I created this tool to make
            developers life easier, including my own.
          </p>
          <a
            href="https://github.com/kiron0"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({
              className: "group from-primary to-secondary bg-gradient-to-tr",
            })}
          >
            <GithubIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
            GitHub
          </a>
        </div>
        <div className="relative w-full text-center lg:w-1/2">
          <div className="from-primary to-secondary absolute inset-0 rounded-full bg-gradient-to-tr opacity-25 blur-3xl" />
          <div className="from-primary to-secondary shadow-primary/50 relative mx-auto flex size-60 items-center justify-center rounded-full bg-gradient-to-tr shadow-2xl lg:size-64">
            <Image
              src="https://avatars.githubusercontent.com/u/64346279?v=4"
              alt="Developer Image"
              width={1080}
              height={1080}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              className="size-full rounded-full object-cover transition-transform duration-300 select-none hover:scale-105"
            />
          </div>
          <div className="mt-6 space-y-2">
            <p className="text-lg font-semibold">Toufiq Hasan Kiron</p>
            <p className="text-muted-foreground text-sm">
              Full Stack Developer
            </p>
            <div className="text-muted-foreground flex justify-center space-x-4 text-xs">
              <span>React Expert</span>
              <span>•</span>
              <span>Node.js Developer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
