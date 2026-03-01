import { Upload, Sparkles, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const steps = [
  { icon: Upload, title: "Upload Image", desc: "Drag & drop or click to upload JPG, PNG, or WEBP up to 10MB." },
  { icon: Sparkles, title: "AI Removes Background", desc: "Our AI processes your image in seconds with precision." },
  { icon: Download, title: "Download Result", desc: "Get your transparent PNG instantly — clean and ready to use." },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient mesh background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -top-20 right-0 h-[300px] w-[400px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 pb-20 pt-16 md:pt-24">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
              ✨ AI-Powered Background Removal
            </span>
          </motion.div>

          <motion.h1
            className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Remove Backgrounds{" "}
            <span className="gradient-brand-text">in One Click</span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Upload any image and get a clean, transparent PNG in seconds. Perfect for e-commerce, marketing, and design.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link to="/dashboard">
              <Button variant="hero" size="lg" className="px-8 text-base">
                Try It Free
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="hero-outline" size="lg" className="px-8 text-base">
                View Pricing
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Upload preview card */}
        <motion.div
          className="mx-auto mt-16 max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="rounded-3xl border border-border bg-card p-8 shadow-elevated">
            <div className="checkerboard flex h-64 items-center justify-center rounded-2xl border border-dashed border-primary/30">
              <div className="text-center">
                <Upload className="mx-auto h-10 w-10 text-primary/50" />
                <p className="mt-3 text-sm font-medium text-muted-foreground">
                  Drop your image here or{" "}
                  <Link to="/dashboard" className="text-primary underline">
                    browse
                  </Link>
                </p>
                <p className="mt-1 text-xs text-muted-foreground/60">JPG, PNG, WEBP • Max 10MB</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* How it works */}
        <div className="mx-auto mt-24 max-w-4xl">
          <h2 className="text-center text-3xl font-bold">
            How It <span className="gradient-brand-text">Works</span>
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                className="rounded-2xl border border-border bg-card p-6 text-center shadow-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl gradient-brand">
                  <step.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
