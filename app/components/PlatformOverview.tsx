import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

const BenefitItem = ({ text }: { text: string }) => (
  <div className="flex items-start gap-3 mb-2">
    <div className="bg-green-100 p-1 rounded-full">
      <Check className="h-4 w-4 text-green-600" />
    </div>
    <p className="text-slate-600">{text}</p>
  </div>
)

export function PlatformOverview() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>For Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <BenefitItem text="AI-guided form completion" />
              <BenefitItem text="Instant legal consultation" />
              <BenefitItem text="Expert attorney matching" />
              <Button className="mt-6" asChild>
                <a href="https://app.associateattorney.ai/signup">Get Started</a>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>For Law Firms</CardTitle>
            </CardHeader>
            <CardContent>
              <BenefitItem text="Automated client intake" />
              <BenefitItem text="AI-powered document processing" />
              <BenefitItem text="Qualified client matching" />
              <Button variant="secondary" className="mt-6" asChild>
                <a href="https://www.associateattorney.ai/onboarding/">Join Platform</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

