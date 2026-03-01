import { Zap, Shield, Globe, Image, Clock, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Zap, title: "Lightning Fast", desc: "Get results in under 5 seconds with our optimized AI pipeline." },
  { icon: Shield, title: "Privacy First", desc: "Images are auto-deleted after 30 minutes. We never store originals." },
  { icon: Globe, title: "API Access", desc: "Integrate background removal into your app with our REST API." },
  { icon: Image, title: "HD Quality", desc: "Pixel-perfect edge detection for professional results every time." },
  { icon: Clock, title: "Free Daily Uses", desc: "Start with free daily credits. No credit card required." },
  { icon: CreditCard, title: "Flexible Plans", desc: "Pay monthly, buy credits, or get unlimited with a Pro plan." },
];

export default function FeaturesSection() {
  return (
    <section className="bg-card py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl font-bold">
          Why Choose <span className="gradient-brand-text">GokuCut AI</span>
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-muted-foreground">
          Built for speed, privacy, and professional quality.
        </p>
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="group rounded-2xl border border-border bg-background p-6 transition-shadow hover:shadow-elevated"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:gradient-brand group-hover:text-primary-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
