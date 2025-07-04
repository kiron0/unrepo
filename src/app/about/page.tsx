import Link from "next/link"
import { ArrowLeft, Code, Database, Github, Heart, Shield } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Navbar } from "@/components/navbar"

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950/20">
      <Navbar showBackButton />

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-8 md:pt-32 lg:px-8 lg:pt-36">
        <div className="mx-auto max-w-5xl">
          {/* Hero Section */}
          <div className="mb-20 text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-slate-200 bg-white/60 px-4 py-2 text-sm font-medium text-slate-700 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
              <Shield className="mr-2 h-4 w-4 text-green-500" />
              <span>Learn more about our mission and technology</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="from-primary to-secondary bg-gradient-to-tr bg-clip-text text-transparent">
                About GitHub
              </span>
              <br />
              <span className="from-primary to-secondary bg-gradient-to-tr bg-clip-text text-transparent">
                Repo Remover
              </span>
            </h1>
          </div>

          {/* Mission Section */}
          <div className="mb-20">
            <h2 className="mb-8 text-3xl font-bold tracking-tight lg:text-4xl">
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                My Mission
              </span>
            </h2>
            <div className="rounded-3xl border p-8 shadow-xl lg:p-12">
              <p className="text-muted-foreground text-lg leading-8 sm:text-xl">
                I created GitHub Repo Remover to help developers efficiently
                manage their GitHub repositories. As developers, we often create
                numerous repositories for testing, learning, or temporary
                projects that eventually clutter our GitHub accounts. This tool
                makes it easy to clean up your GitHub profile by providing a
                simple, intuitive interface to manage and delete unwanted
                repositories.
              </p>
            </div>
          </div>

          {/* Key Features Section */}
          <div className="mb-20">
            <h2 className="mb-8 text-3xl font-bold tracking-tight lg:text-4xl">
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                Key Features
              </span>
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:gap-10">
              <Card className="group relative overflow-hidden border-0 bg-white/60 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10 dark:bg-slate-900/60">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <CardHeader className="pb-4">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 transition-all duration-300 group-hover:scale-110 group-hover:bg-green-200 dark:bg-green-900/30 dark:group-hover:bg-green-800/50">
                    <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-xl font-semibold tracking-tight">
                    Secure Authentication
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
                    OAuth 2.0 integration with GitHub for secure access
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-0 bg-white/60 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 dark:bg-slate-900/60">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <CardHeader className="pb-4">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-200 dark:bg-blue-900/30 dark:group-hover:bg-blue-800/50">
                    <Code className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl font-semibold tracking-tight">
                    Modern Tech Stack
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
                    Built with React 19, Next.js, and Node.js
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-0 bg-white/60 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10 dark:bg-slate-900/60">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <CardHeader className="pb-4">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 transition-all duration-300 group-hover:scale-110 group-hover:bg-red-200 dark:bg-red-900/30 dark:group-hover:bg-red-800/50">
                    <Github className="h-8 w-8 text-red-600 dark:text-red-400" />
                  </div>
                  <CardTitle className="text-xl font-semibold tracking-tight">
                    Batch Operations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
                    Delete multiple repositories at once
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-0 bg-white/60 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 dark:bg-slate-900/60">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <CardHeader className="pb-4">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 transition-all duration-300 group-hover:scale-110 group-hover:bg-purple-200 dark:bg-purple-900/30 dark:group-hover:bg-purple-800/50">
                    <Database className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-xl font-semibold tracking-tight">
                    Data Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
                    We never store your GitHub data
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* About the Developer Section */}
          <div className="mb-20">
            <h2 className="mb-8 text-3xl font-bold tracking-tight lg:text-4xl">
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                About the Developer
              </span>
            </h2>
            <div className="rounded-3xl bg-white/60 p-8 shadow-xl backdrop-blur-sm lg:p-12 dark:bg-slate-900/60">
              <div className="grid items-center gap-12 lg:grid-cols-2">
                <div className="space-y-6">
                  <p className="text-lg leading-8 text-slate-600 sm:text-xl dark:text-slate-400">
                    GitHub Repo Remover is a personal project developed by
                    Rakibul Islam Emon. As a developer, I understand the
                    importance of maintaining a clean and organized GitHub
                    profile. I created this tool to make developers&apos; lives
                    easier, including my own.
                  </p>
                  <Button
                    asChild
                    size="lg"
                    className="group h-12 bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 px-8 text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
                  >
                    <a
                      href="https://github.com/Rakibulislam-emon/github_repo_remover"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                      View on GitHub
                    </a>
                  </Button>
                </div>
                <div className="relative text-center">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-violet-500 to-purple-600 opacity-20 blur-3xl"></div>
                  <div className="relative mx-auto mb-6 flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-violet-500 to-purple-600 shadow-2xl shadow-blue-500/25">
                    <Github className="h-20 w-20 text-white" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      Rakibul Islam Emon
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Full Stack Developer
                    </p>
                    <div className="flex justify-center space-x-4 text-xs text-slate-500 dark:text-slate-500">
                      <span>React Expert</span>
                      <span>•</span>
                      <span>Node.js Developer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack Section */}
          <div className="mb-20">
            <h2 className="mb-8 text-3xl font-bold tracking-tight lg:text-4xl">
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                Built With
              </span>
            </h2>
            <div className="rounded-3xl bg-white/60 p-8 shadow-xl backdrop-blur-sm lg:p-12 dark:bg-slate-900/60">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                <Badge
                  variant="outline"
                  className="group justify-center border-blue-200 p-4 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 dark:border-blue-800 dark:hover:border-blue-600 dark:hover:bg-blue-950/50"
                >
                  <span className="font-medium text-blue-700 group-hover:text-blue-800 dark:text-blue-400 dark:group-hover:text-blue-300">
                    React 19
                  </span>
                </Badge>
                <Badge
                  variant="outline"
                  className="group justify-center border-slate-200 p-4 text-center transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-800/50"
                >
                  <span className="font-medium text-slate-700 group-hover:text-slate-800 dark:text-slate-400 dark:group-hover:text-slate-300">
                    Next.js
                  </span>
                </Badge>
                <Badge
                  variant="outline"
                  className="group justify-center border-blue-200 p-4 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 dark:border-blue-800 dark:hover:border-blue-600 dark:hover:bg-blue-950/50"
                >
                  <span className="font-medium text-blue-700 group-hover:text-blue-800 dark:text-blue-400 dark:group-hover:text-blue-300">
                    TypeScript
                  </span>
                </Badge>
                <Badge
                  variant="outline"
                  className="group justify-center border-cyan-200 p-4 text-center transition-all duration-200 hover:border-cyan-400 hover:bg-cyan-50 dark:border-cyan-800 dark:hover:border-cyan-600 dark:hover:bg-cyan-950/50"
                >
                  <span className="font-medium text-cyan-700 group-hover:text-cyan-800 dark:text-cyan-400 dark:group-hover:text-cyan-300">
                    Tailwind CSS
                  </span>
                </Badge>
                <Badge
                  variant="outline"
                  className="group justify-center border-green-200 p-4 text-center transition-all duration-200 hover:border-green-400 hover:bg-green-50 dark:border-green-800 dark:hover:border-green-600 dark:hover:bg-green-950/50"
                >
                  <span className="font-medium text-green-700 group-hover:text-green-800 dark:text-green-400 dark:group-hover:text-green-300">
                    Node.js
                  </span>
                </Badge>
                <Badge
                  variant="outline"
                  className="group justify-center border-purple-200 p-4 text-center transition-all duration-200 hover:border-purple-400 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-600 dark:hover:bg-purple-950/50"
                >
                  <span className="font-medium text-purple-700 group-hover:text-purple-800 dark:text-purple-400 dark:group-hover:text-purple-300">
                    GitHub API
                  </span>
                </Badge>
                <Badge
                  variant="outline"
                  className="group justify-center border-orange-200 p-4 text-center transition-all duration-200 hover:border-orange-400 hover:bg-orange-50 dark:border-orange-800 dark:hover:border-orange-600 dark:hover:bg-orange-950/50"
                >
                  <span className="font-medium text-orange-700 group-hover:text-orange-800 dark:text-orange-400 dark:group-hover:text-orange-300">
                    OAuth 2.0
                  </span>
                </Badge>
                <Badge
                  variant="outline"
                  className="group justify-center border-slate-200 p-4 text-center transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-800/50"
                >
                  <span className="font-medium text-slate-700 group-hover:text-slate-800 dark:text-slate-400 dark:group-hover:text-slate-300">
                    Vercel
                  </span>
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200/60 bg-white/60 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/60">
        <div className="container mx-auto px-4 py-12 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
            <Link
              href="/"
              className="group flex items-center space-x-3 transition-all duration-200 hover:opacity-80"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-violet-600 to-purple-600 transition-transform group-hover:scale-105">
                <ArrowLeft className="h-4 w-4 text-white transition-transform group-hover:-translate-x-0.5" />
              </div>
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-lg font-bold tracking-tight text-transparent dark:from-white dark:to-slate-300">
                Repo Remover
              </span>
            </Link>
            <div className="flex items-center space-x-8 text-sm">
              <Link
                href="/"
                className="font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                Home
              </Link>
              <Separator orientation="vertical" className="h-5" />
              <a
                href="https://github.com/Rakibulislam-emon/github_repo_remover"
                className="flex items-center space-x-2 font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
              <Separator orientation="vertical" className="h-5" />
              <span className="flex items-center space-x-2 text-slate-500 dark:text-slate-500">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-red-500" />
                <span>by developers</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
