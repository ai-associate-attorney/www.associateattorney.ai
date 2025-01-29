import { Button } from "@/components/ui/button"
import { FileText, Users, Zap } from "lucide-react"

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  ctaText,
}: { icon: any; title: string; description: string; ctaText: string }) => (
  <div className="p-8 rounded-2xl bg-slate-50 transition-transform hover:transform hover:-translate-y-2">
    <Icon className="h-12 w-12 text-yellow-400 mb-6" />
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <p className="text-slate-600 mb-6">{description}</p>
    <Button variant="link">{ctaText}</Button>
  </div>
)

export function Features() {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Platform Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={FileText}
            title="Smart Document Processing"
            description="AI-powered document analysis and form filling for faster, more accurate legal work."
            ctaText="Learn More"
          />
          <FeatureCard
            icon={Users}
            title="Attorney Matching"
            description="Connect with the right legal expert for your specific needs using our advanced matching algorithm."
            ctaText="Find an Attorney"
          />
          <FeatureCard
            icon={Zap}
            title="Instant Consultations"
            description="Get quick legal advice through our platform's instant consultation feature."
            ctaText="Try It Now"
          />
        </div>
      </div>
    </section>
  )
}

