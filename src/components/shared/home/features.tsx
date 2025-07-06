"use client"

import { Lock, Search, Trash2 } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function Features() {
  const featureList = [
    {
      title: "Intelligent Search",
      description:
        "Advanced filtering by name, language, stars, size, and last activity date with real-time search suggestions.",
      icon: Search,
      gradient: "from-chart-1/5 to-transparent",
    },
    {
      title: "Batch Operations",
      description:
        "Select and delete multiple repositories simultaneously with confirmation dialogs and undo functionality.",
      icon: Trash2,
      gradient: "from-destructive/5 to-transparent",
    },
    {
      title: "Enterprise Security",
      description:
        "OAuth 2.0 authentication with fine-grained permissions and zero data storage on our servers.",
      icon: Lock,
      gradient: "from-chart-2/5 to-transparent",
    },
  ]

  return (
    <div className="mb-20 grid gap-6 md:grid-cols-2 lg:gap-8 xl:grid-cols-3">
      {featureList.map((feature, i) => (
        <Card
          key={i}
          className="group bg-card/60 hover:shadow-primary/10 relative overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          <div className="from-primary/5 to-secondary/10 absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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
  )
}
