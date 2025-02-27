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
            <a href="https://app.associateattorney.ai/login" className="flex items-center gap-2">
              <span>Start Free Trial</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-blue-500 text-white border-blue-400 hover:bg-blue-600 text-lg px-8 py-6
                      transition-all duration-300 border-2 font-medium"
            asChild
          >
            <a href="https://calendly.com/vikas-associateattorney" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <span>Schedule Demo</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </a>
          </Button>
        </div>
        
        {/* Trust indicators */}
        <div className="animate-fade-in-delay-3">
          <p className="text-slate-300 mb-4 text-sm">Trusted by leading law firms</p>
          <div className="flex justify-center items-center gap-8 opacity-70 flex-wrap">
            {/* Replace with actual client logos */}
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