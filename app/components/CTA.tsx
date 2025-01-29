import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="w-full py-24 bg-[#1E2837] text-white">
      <div className="max-w-[1920px] mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Legal Practice?</h2>
        <p className="text-xl mb-8">Join AssociateAttorney.ai today and experience the future of legal services.</p>
        <div className="flex justify-center">
          <a href="https://www.associateattorney.ai/onboarding/">
            <Button size="lg" variant="secondary">
              Join us as attorney
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}

