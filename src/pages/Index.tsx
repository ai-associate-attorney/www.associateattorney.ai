import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import PlatformOverview from "@/components/sections/PlatformOverview";
import FeaturesSection from "@/components/sections/FeaturesSection";
import StatisticsSection from "@/components/sections/StatisticsSection";
import CTASection from "@/components/sections/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <PlatformOverview />
        <FeaturesSection />
        <StatisticsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;