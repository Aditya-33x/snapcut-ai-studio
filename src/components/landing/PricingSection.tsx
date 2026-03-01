import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    desc: "Try it out with daily limits",
    features: ["3 images/day", "Standard quality", "PNG download", "No watermark"],
    cta: "Get Started",
    variant: "hero-outline" as const,
  },
  {
    name: "Pro",
    price: "₹499",
    period: "/month",
    desc: "For professionals and creators",
    features: ["Unlimited images", "HD quality", "Priority processing", "Dashboard & history", "Cancel anytime"],
    cta: "Go Pro",
    variant: "hero" as const,
    popular: true,
  },
  {
    name: "Credits",
    price: "₹199",
    period: "/ 50 credits",
    desc: "Pay only for what you use",
    features: ["50 images per pack", "HD quality", "No expiry", "Buy anytime"],
    cta: "Buy Credits",
    variant: "hero-outline" as const,
  },
];

export default function PricingSection({ full = false }: { full?: boolean }) {
  return (
    <section className={full ? "py-20" : "py-20 bg-card"}>
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl font-bold">
          Simple, Transparent <span className="gradient-brand-text">Pricing</span>
        </h2>
        <p className="mx-auto mt-3 max-w-md text-center text-muted-foreground">
          Start free. Upgrade when you need more.
        </p>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-3xl border p-6 transition-shadow hover:shadow-elevated ${
                plan.popular
                  ? "border-primary bg-card shadow-elevated"
                  : "border-border bg-card shadow-card"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-brand px-4 py-1 text-xs font-semibold text-primary-foreground">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-bold">{plan.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{plan.desc}</p>
              <ul className="my-6 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-accent" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register">
                <Button variant={plan.variant} className="w-full">
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {full && (
          <div className="mx-auto mt-12 max-w-2xl rounded-3xl border border-border bg-card p-8 text-center shadow-card">
            <h3 className="text-xl font-bold">Business API</h3>
            <p className="mt-2 text-muted-foreground">
              Need high-volume API access? Get custom rate limits, dedicated support, and SLA guarantees.
            </p>
            <Link to="/register">
              <Button variant="hero" className="mt-6">Contact Sales</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
