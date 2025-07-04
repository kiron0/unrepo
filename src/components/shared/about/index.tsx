"use client"

import { siteConfig } from "@/config"
import { Shield } from "lucide-react"

import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { Developer } from "@/components/shared/about/developer"
import { Features } from "@/components/shared/about/features"
import { Mission } from "@/components/shared/about/mission"

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
        <Mission />
        <Features />
        <Developer />
      </div>
      <Footer />
    </section>
  )
}
