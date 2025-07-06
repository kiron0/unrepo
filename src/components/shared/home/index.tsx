import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { Features } from "@/components/shared/home/features"
import { Hero } from "@/components/shared/home/hero"
import { WhyChoose } from "@/components/shared/home/why-choose"

interface HomeProps {
  isLoggedIn: string | null
}

export async function Home({ isLoggedIn }: HomeProps) {
  return (
    <section className="min-h-screen">
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="container mx-auto px-4 pt-24 pb-8 md:pt-32 lg:px-8 lg:pt-36">
        <Hero isLoggedIn={isLoggedIn} />
        <Features />
        <WhyChoose />
      </div>
      <Footer />
    </section>
  )
}
