import { File, Users, Zap } from "lucide-react";

const FeaturesSection = () => {
  return (
    <>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Our Platform Features
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="text-center p-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-slate-50 border border-gray-100"
              >
                <div className="inline-flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <a
                  href={feature.link}
                  className="text-primary font-medium hover:text-yellow-500 transition-colors"
                >
                  {feature.linkText}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900">
            Why Choose Associate Attorney AI?
          </h2>
        </div>
      </section>
    </>
  );
};

const features = [
  {
    icon: <File className="w-12 h-12 text-yellow-400" />,
    title: "Smart Document Processing",
    description: "AI-powered document analysis and form filling for faster, more accurate legal work.",
    linkText: "Learn More",
    link: "#"
  },
  {
    icon: <Users className="w-12 h-12 text-yellow-400" />,
    title: "Attorney Matching",
    description: "Connect with the right legal expert for your specific needs using our advanced matching algorithm.",
    linkText: "Find an Attorney",
    link: "#"
  },
  {
    icon: <Zap className="w-12 h-12 text-yellow-400" />,
    title: "Instant Consultations",
    description: "Get quick legal advice through our platform's instant consultation feature.",
    linkText: "Try It Now",
    link: "#"
  }
];

export default FeaturesSection;