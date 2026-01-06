import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrustSection from "@/components/TrustSection";
import CategoriesSection from "@/components/CategoriesSection";
import TrendingSection from "@/components/TrendingSection";
import GoogleSection from "@/components/GoogleSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import StatsSection from "@/components/StatsSection";
import Footer from "@/components/Footer";
import { lazy, Suspense } from "react";

const SamsungAd = lazy(() => import("@/components/SamsungAd"));

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <TrendingSection />
        <div className="xl:hidden py-8">
          <Suspense fallback={<div className="h-[400px] w-full animate-pulse bg-muted/10 rounded-2xl" />}>
            <SamsungAd />
          </Suspense>
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
