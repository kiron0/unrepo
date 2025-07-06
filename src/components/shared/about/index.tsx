import { siteConfig } from "@/config"
import { getGitHubToken } from "@/utils/cookies"
import { ShieldIcon } from "lucide-react"

import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { Developer } from "@/components/shared/about/developer"
import { Features } from "@/components/shared/about/features"
import { Mission } from "@/components/shared/about/mission"

export async function About() {
  const isLoggedIn = (await getGitHubToken()) !== null

  return (
    <section className="min-h-screen">
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="container mx-auto space-y-20 px-4 pt-24 pb-8 md:pt-32 lg:px-8 lg:pt-36">
        <div className="text-center">
          <div className="text-muted-foreground mx-auto mb-6 w-fit rounded-full border px-3 py-2 text-xs font-medium sm:px-4 sm:text-sm">
            <ShieldIcon className="mr-1.5 inline-flex h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
            <span>Learn more about our mission and technology</span>
          </div>
          <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="from-primary to-secondary bg-gradient-to-tr bg-clip-text text-transparent">
              About {siteConfig.name}
            </span>
          </h2>
        </div>
        <Mission />
        <Features />
        <Developer />
      </div>
      <Footer />
    </section>
  )
}
