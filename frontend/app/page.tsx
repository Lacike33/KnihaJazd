import { HeroSection } from "@/features/landingPage/components/hero-section";
import { ForWhoSection } from "@/features/landingPage/components/for-who-section";
import { ProblemSection } from "@/features/landingPage/components/problem-section";
import { FeaturesSection } from "@/features/landingPage/components/features-section";
import { MobileAppSection } from "@/features/landingPage/components/mobile-app-section";
import { VatFeatureSection } from "@/features/landingPage/components/vat-feature-section";
import { NoGpsSection } from "@/features/landingPage/components/no-gps-section";
import { SecuritySection } from "@/features/landingPage/components/security-section";
import { PricingSection } from "@/features/landingPage/components/pricing-section";
import { FaqSection } from "@/features/landingPage/components/faq-section";
import { Footer } from "@/features/landingPage/components/footer";
import { Header } from "@/features/landingPage/components/header";
import { PartnersSection } from "@/features/landingPage/components/partners-section";
import { AffiliateSection } from "@/features/landingPage/components/affiliate-section";
import { CarDealersSection } from "@/features/landingPage/components/car-dealers-section";
import { VerifiedPartnersSection } from "@/features/landingPage/components/verified-partners-section";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ForWhoSection />
        <ProblemSection />
        <FeaturesSection />
        <MobileAppSection />
        <VatFeatureSection />
        <NoGpsSection />
        <SecuritySection />
        <PricingSection />
        <PartnersSection />
        <AffiliateSection />
        <CarDealersSection />
        <VerifiedPartnersSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
