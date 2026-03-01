import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>Last updated: March 1, 2026</p>
          <h2 className="text-lg font-semibold text-foreground">1. Acceptance</h2>
          <p>By using GokuCut AI, you agree to these terms. If you do not agree, please do not use the service.</p>
          <h2 className="text-lg font-semibold text-foreground">2. Service Description</h2>
          <p>GokuCut AI provides AI-powered background removal. We do not guarantee 100% accuracy for all images.</p>
          <h2 className="text-lg font-semibold text-foreground">3. Usage Limits</h2>
          <p>Free accounts have daily usage limits. Exceeding limits requires upgrading to a paid plan or purchasing credits.</p>
          <h2 className="text-lg font-semibold text-foreground">4. Payments</h2>
          <p>Payments are processed via Razorpay. Subscriptions renew automatically unless cancelled.</p>
          <h2 className="text-lg font-semibold text-foreground">5. Prohibited Use</h2>
          <p>You may not use the service for illegal content, abuse the API, or attempt to circumvent usage limits.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
