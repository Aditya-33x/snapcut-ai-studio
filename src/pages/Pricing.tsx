import Navbar from "@/components/Navbar";
import PricingSection from "@/components/landing/PricingSection";
import Footer from "@/components/Footer";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-8">
        <PricingSection full />
      </div>
      <Footer />
    </div>
  );
}
