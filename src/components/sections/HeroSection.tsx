import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center">
      <div className="max-w-layout mx-auto px-6 text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-8">
          Premium Legal Services at 1/10th The Cost
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 max-w-4xl mx-auto leading-tight">
          Reduce Legal Costs by{" "}
          <span className="text-yellow-400">10X</span>
        </h1>
        
        <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
          Connect with AI-powered attorneys on our platform. Get quality legal
          help and complete documentation at a fraction of traditional costs.
        </p>

        <div className="mt-12 flex flex-col md:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-slate-900 text-white hover:bg-slate-800"
            onClick={() => window.location.href = 'https://app.associateattorney.ai/signup'}
          >
            Start Using Platform
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-slate-200 text-slate-900 hover:bg-slate-50"
            onClick={() => window.location.href = 'https://www.associateattorney.ai/onboarding/'}
          >
            Join as an Attorney
          </Button>
        </div>

        <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8 bg-white rounded-2xl shadow-sm p-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <Check className="text-green-500 w-5 h-5" />
              <span className="text-slate-600">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const features = [
  "Legal help at 1/10th cost",
  "AI-powered form filling agent",
  "Free initial consultation",
];

export default HeroSection;