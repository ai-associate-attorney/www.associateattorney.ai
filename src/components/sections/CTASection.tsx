import { Button } from "../ui/button";

const CTASection = () => {
  return (
    <section className="bg-slate-800 py-24 text-white">
      <div className="max-w-layout mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Transform Your Legal Practice?
        </h2>
        <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
          Join thousands of attorneys who are already using AssociateAttorney.ai to
          streamline their practice.
        </p>
        <Button 
          size="lg" 
          className="bg-secondary text-slate-800 hover:bg-secondary/90"
          asChild
        >
          <a href="https://www.associateattorney.ai/onboarding/">
            Join us as attorney
          </a>
        </Button>
      </div>
    </section>
  );
};

export default CTASection;