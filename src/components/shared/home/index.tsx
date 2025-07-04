import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { Features } from "@/components/shared/home/features"
import { Hero } from "@/components/shared/home/hero"
import { WhyChoose } from "@/components/shared/home/why-choose"

export function Home() {
  return (
    <section className="min-h-screen">
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
