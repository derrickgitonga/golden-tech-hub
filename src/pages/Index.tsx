import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrustSection from "@/components/TrustSection";
import CategoriesSection from "@/components/CategoriesSection";
import TrendingSection from "@/components/TrendingSection";
import GoogleSection from "@/components/GoogleSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <TrustSection />
        <CategoriesSection />
        <TrendingSection />
        <GoogleSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
