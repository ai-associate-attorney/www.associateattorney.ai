import { Layout } from "./components/Layout"
import { Hero } from "./components/Hero"
import { PlatformOverview } from "./components/PlatformOverview"
import { Features } from "./components/Features"
import { Statistics } from "./components/Statistics"
import { CTA } from "./components/CTA"

export default function Home() {
  return (
    <Layout>
      <Hero />
      <PlatformOverview />
      <Features />
      <Statistics />
      <CTA />
    </Layout>
  )
}

