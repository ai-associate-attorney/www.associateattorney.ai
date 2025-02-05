import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import PlatformOverview from "@/components/sections/PlatformOverview";
import FeaturesSection from "@/components/sections/FeaturesSection";
import StatisticsSection from "@/components/sections/StatisticsSection";
import CTASection from "@/components/sections/CTASection";
import { TrustedBy } from "@/components/sections/trusted-by";
import TeamSection from "@/components/sections/TeamSection";
const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <PlatformOverview />
        <TrustedBy />
        <FeaturesSection />
        <StatisticsSection />
        <TeamSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;