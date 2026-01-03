import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrustSection from "@/components/TrustSection";
import CategoriesSection from "@/components/CategoriesSection";
import TrendingSection from "@/components/TrendingSection";
import GoogleSection from "@/components/GoogleSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import StatsSection from "@/components/StatsSection";
import Footer from "@/components/Footer";

import SamsungAd from "@/components/SamsungAd";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <TrendingSection />
        <div className="xl:hidden py-8">
          <SamsungAd />
        </div>
        <GoogleSection />
        <TestimonialsSection />
        <CategoriesSection />
        <StatsSection />
        <TrustSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
