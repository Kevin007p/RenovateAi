import { HeroSection } from "@/components/hero-section"
import { QuoteForm } from "@/components/quote-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <HeroSection />
        <QuoteForm />
      </div>
    </main>
  )
}

