import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl rounded-3xl gradient-brand p-12 text-center shadow-elevated">
          <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl">
            Ready to Remove Backgrounds?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-primary-foreground/80">
            Join thousands of creators using GokuCut AI. Start for free — no credit card required.
          </p>
          <Link to="/register">
            <Button
              variant="hero-outline"
              size="lg"
              className="mt-8 border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
