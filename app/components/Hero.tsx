import { Button } from "@/components/ui/button"
import { FeatureHighlight } from "./FeatureHighlight"

export function Hero() {
  const keyFeatures = ["Legal help at 1/10th cost", "AI-powered form filling agent", "Free initial consultation"]

  return (
    <header className="bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
        {/* Trust Badge */}
        <div className="inline-block bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
          Premium Legal Services at 1/10th The Cost
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
          Reduce Legal Costs by
          <span className="text-yellow-400 block">10X</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
          Connect with AI-powered attorneys on our platform. Get quality legal help and complete documentation at a
          fraction of traditional costs.
        </p>

        {/* Feature Highlight */}
        <FeatureHighlight features={keyFeatures} />

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" asChild>
            <a href="https://app.associateattorney.ai/signup">Start Using Platform</a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="https://www.associateattorney.ai/onboarding/">Join as an Attorney</a>
          </Button>
        </div>
      </div>
    </header>
  )
}

