import { Navbar } from "@/components/navbar"

import { Features } from "./features"
import { Footer } from "./footer"
import { Hero } from "./hero"
import { WhyChoose } from "./why-choose"

export function Home() {
  return (
    <section className="from-background via-background to-muted/20 min-h-screen bg-gradient-to-br">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-8 md:pt-32 lg:px-8 lg:pt-36">
        <Hero />
        <Features />
        <WhyChoose />
      </div>
      <Footer />
    </section>
  )
}
