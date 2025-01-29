import FeatureCard from "../ui/FeatureCard";


const PlatformOverview = () => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <FeatureCard
            title="For Clients"
            benefits={[
              "Reduce legal costs significantly",
              "Get instant answers 24/7",
              "Secure document management",
              "Transparent pricing",
            ]}
            ctaText="Start Now"
            ctaLink="https://app.associateattorney.ai/signup"
            isExternalLink={true}
          />
          <FeatureCard
            title="For Law Firms"
            benefits={[
              "Automate routine tasks",
              "Increase billable hours",
              "Expand client base",
              "Streamline workflows",
            ]}
            ctaText="Join as Attorney"
            ctaLink="https://www.associateattorney.ai/onboarding/"
            isExternalLink={true}
          />
        </div>
      </div>
    </section>
  );
};

export default PlatformOverview;