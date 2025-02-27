import { Button } from "../ui/button";

const CTASection = () => {
  return (
    <section className="relative overflow-hidden py-24 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
      
      <div className="relative max-w-layout mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white animate-fade-in">
          Transform Your Legal Documentation Workflow
        </h2>
        
        <p className="text-slate-200 mb-10 max-w-2xl mx-auto text-lg md:text-xl animate-fade-in-delay">
          Getting started is simple. Our AI-powered platform integrates seamlessly with your existing systems, 
          with no complex setup required.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-delay-2">
          <Button 
            size="lg" 
            className="bg-secondary text-slate-900 hover:bg-secondary/90 text-lg px-8 py-6 
                      transition-all duration-300 transform hover:scale-105"
            asChild
          >
            <a href="https://www.associateattorney.ai/trial/" className="flex items-center gap-2">
              Start Free Trial
            </a>
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white/10 text-lg px-8 py-6
                      transition-all duration-300"
            asChild
          >
            <a href="https://www.associateattorney.ai/demo/" className="flex items-center gap-2">
              Schedule Demo
            </a>
          </Button>
        </div>
        
        {/* Trust indicators */}
        <div className="animate-fade-in-delay-3">
          <p className="text-slate-300 mb-4 text-sm">Trusted by leading law firms</p>
          <div className="flex justify-center items-center gap-8 opacity-70">
            {/* Replace with actual client logos or a testimonial */}
            <div className="h-8 w-24 bg-white/20 rounded"></div>
            <div className="h-8 w-24 bg-white/20 rounded"></div>
            <div className="h-8 w-24 bg-white/20 rounded"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;