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
          <div className="space-y-4">
            <p className="text-muted-foreground leading-7">
              <span className="font-bold">{siteConfig.name}</span> is a personal
              project developed by{" "}
              <a
                href={siteConfig.author.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary/80 font-bold duration-300 hover:underline hover:underline-offset-4"
              >
                {siteConfig.author.name}
              </a>
              . As a developer, I understand the importance of maintaining a
              clean and organized GitHub profile. I created this tool to make
              developers life easier, including my own.
            </p>
            <p className="text-muted-foreground leading-7">
              With over 2 years of experience in MERN stack development, I
              specialize in building modern web applications using React,
              Next.js, and Node.js. This project represents my passion for
              creating developer tools that solve real-world problems.
            </p>
            <p className="text-muted-foreground leading-7">
              When I&apos;m not coding, you can find me exploring new
              technologies, contributing to open-source projects, or sharing
              knowledge with the developer community through tutorials and blog
              posts.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <a
              href={siteConfig.author.github}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({
                className: "group from-primary to-secondary bg-gradient-to-tr",
              })}
            >
              <GithubIcon className="transition-transform group-hover:scale-110" />
              GitHub Profile
            </a>
            <a
              href={siteConfig.links.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({
                variant: "outline",
              })}
            >
              View Portfolio
            </a>
          </div>
        </div>
        <div className="relative w-full text-center lg:w-1/2">
          <div className="from-primary to-secondary absolute inset-0 rounded-full bg-gradient-to-tr opacity-25 blur-3xl" />
          <div className="from-primary to-secondary shadow-primary/50 relative mx-auto flex size-60 items-center justify-center rounded-full bg-gradient-to-tr shadow-2xl lg:size-64">
            <Image
              src={siteConfig.author.avatar}
              alt="Developer Image"
              width={1080}
              height={1080}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              className="size-full rounded-full object-cover transition-transform duration-300 select-none hover:scale-105"
            />
          </div>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <p className="text-lg font-semibold">{siteConfig.author.name}</p>
              <p className="text-muted-foreground text-sm">
                {siteConfig.author.role}
              </p>
            </div>
            <div className="text-muted-foreground flex justify-center space-x-4 text-xs">
              {siteConfig.author.specializations.map(
                (specialization, index) => (
                  <span key={specialization}>
                    {index > 0 && <span className="mr-4">•</span>}
                    {specialization}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
