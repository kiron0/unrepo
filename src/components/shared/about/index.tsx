"use client"

import Image from "next/image"
import { siteConfig } from "@/config"
import { Code, Database, Github, GithubIcon, Shield } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"

const keyFeatures = [
  {
    title: "Secure Authentication",
    description: "OAuth 2.0 integration with GitHub for secure access",
    icon: Shield,
  },
  {
    title: "Modern Tech Stack",
    description: "Built with React 19, Next.js, and Node.js",
    icon: Code,
  },
  {
    title: "Batch Operations",
    description: "Delete multiple repositories at once",
    icon: Github,
  },
  {
    title: "Data Privacy",
    description: "We never store your GitHub data",
    icon: Database,
  },
]

export function About() {
  return (
    <section className="min-h-screen">
      <Navbar />
      <div className="container mx-auto space-y-20 px-4 pt-24 pb-8 md:pt-32 lg:px-8 lg:pt-36">
        <div className="text-center">
          <div className="text-muted-foreground mx-auto mb-6 w-fit rounded-full border px-4 py-2 text-sm font-medium">
            <Shield className="mr-2 inline-flex h-4 w-4" />
            <span>Learn more about our mission and technology</span>
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="from-primary to-secondary bg-gradient-to-tr bg-clip-text text-transparent">
              About {siteConfig.name}
            </span>
          </h1>
        </div>
        <div>
          <h2 className="mb-8 text-3xl font-bold tracking-tight lg:text-4xl">
            <span className="from-primary to-secondary bg-gradient-to-tr bg-clip-text text-transparent">
              My Mission
            </span>
          </h2>
          <p className="text-muted-foreground text-lg leading-8 sm:text-xl">
            I created {siteConfig.name} to help developers efficiently manage
            their GitHub repositories. As developers, we often create numerous
            repositories for testing, learning, or temporary projects that
            eventually clutter our GitHub accounts. This tool makes it easy to
            clean up your GitHub profile by providing a simple, intuitive
            interface to manage and delete unwanted repositories.
          </p>
        </div>
        <div>
          <h2 className="mb-8 text-3xl font-bold tracking-tight lg:text-4xl">
            <span className="from-primary to-secondary bg-gradient-to-tr bg-clip-text text-transparent">
              Key Features
            </span>
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:gap-10">
            {keyFeatures.map((feature, index) => (
              <Card
                key={index}
                className="group bg-card/60 hover:shadow-primary/10 relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <div className="from-primary/5 to-secondary/10 absolute inset-0 bg-gradient-to-tr opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CardHeader className="pb-4">
                  <div className="bg-secondary group-hover:bg-secondary/80 mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-xl font-semibold tracking-tight">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-slate-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-8 text-3xl font-bold tracking-tight lg:text-4xl">
            <span className="from-primary to-secondary bg-gradient-to-tr bg-clip-text text-transparent">
              Developer
            </span>
          </h2>
          <div className="rounded-3xl bg-white/60 p-4 shadow-xl lg:p-8">
            <div className="flex w-full flex-col-reverse items-center gap-12 lg:flex-row">
              <div className="w-full space-y-6 lg:w-1/2">
                <p className="text-lg leading-8 text-slate-600 sm:text-xl">
                  {siteConfig.name} is a personal project developed by Toufiq
                  Hasan Kiron. As a developer, I understand the importance of
                  maintaining a clean and organized GitHub profile. I created
                  this tool to make developers&apos; lives easier, including my
                  own.
                </p>
                <a
                  href="https://github.com/kiron0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({
                    size: "lg",
                    className:
                      "group from-primary to-secondary bg-gradient-to-tr",
                  })}
                >
                  <GithubIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
                  View on GitHub
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
                  <p className="text-lg font-semibold text-slate-900">
                    Toufiq Hasan Kiron
                  </p>
                  <p className="text-sm text-slate-600">Full Stack Developer</p>
                  <div className="flex justify-center space-x-4 text-xs text-slate-500">
                    <span>React Expert</span>
                    <span>•</span>
                    <span>Node.js Developer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  )
}
