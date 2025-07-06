"use client"

import { Code, Database, Github, Shield } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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

export function Features() {
  return (
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
            className="group bg-card/60 hover:shadow-primary/10 relative overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
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
              <CardDescription className="text-muted-foreground text-base leading-relaxed">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
