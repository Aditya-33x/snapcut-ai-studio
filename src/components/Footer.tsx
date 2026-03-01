import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="GokuCut AI" className="h-8 w-auto max-h-8" />
              <span className="font-display text-lg font-bold">GokuCut AI</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              One-click AI background removal for everyone.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/pricing" className="hover:text-primary">Pricing</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary">Dashboard</Link></li>
              <li><Link to="/api-access" className="hover:text-primary">API Access</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Connect</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="mailto:support@gokucutai.com" className="hover:text-primary">support@gokucutai.com</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} GokuCut AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
