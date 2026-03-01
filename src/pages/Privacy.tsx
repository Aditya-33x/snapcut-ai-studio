import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>Last updated: March 1, 2026</p>
          <h2 className="text-lg font-semibold text-foreground">1. Information We Collect</h2>
          <p>We collect your email address and name when you register. Images are processed temporarily and auto-deleted within 30 minutes.</p>
          <h2 className="text-lg font-semibold text-foreground">2. How We Use Your Information</h2>
          <p>Your information is used solely to provide the background removal service, manage your account, and process payments.</p>
          <h2 className="text-lg font-semibold text-foreground">3. Data Retention</h2>
          <p>We do not store original images permanently. Processed images are stored temporarily on Cloudinary and auto-expire after 30 minutes.</p>
          <h2 className="text-lg font-semibold text-foreground">4. Security</h2>
          <p>We use industry-standard encryption and security practices to protect your data.</p>
          <h2 className="text-lg font-semibold text-foreground">5. Contact</h2>
          <p>For privacy concerns, contact us at support@SnapCutai.com.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
