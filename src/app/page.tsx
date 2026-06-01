import { Hero } from "@/components/Hero"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Hero />
      </main>
      <Footer />
    </>
  )
}
