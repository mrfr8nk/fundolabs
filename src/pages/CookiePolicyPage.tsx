import { Link } from "react-router-dom";
import { FlaskConical, Cookie } from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 glass-strong border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <FlaskConical className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold">Fundo<span className="text-gradient">Labs</span></span>
          </Link>
          <Link to="/auth" className="text-sm text-primary hover:underline">Get started</Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-20 max-w-3xl">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Cookie className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Cookie Policy</h1>
            <p className="text-muted-foreground text-sm mt-1">Last updated: 1 May 2026</p>
          </div>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-foreground font-semibold text-base mb-3">What are cookies?</h2>
            <p>Cookies are small text files stored in your browser when you visit a website. They help the website remember your preferences, keep you logged in, and understand how you use the site. FundoLabs uses cookies to provide a better learning experience.</p>
          </section>

          <section>
            <h2 className="text-foreground font-semibold text-base mb-3">Types of cookies we use</h2>
            <div className="space-y-4">
              {[
                {
                  name: "Essential cookies",
                  description: "Required for the platform to function. These include authentication tokens (to keep you signed in), session cookies, and security cookies. You cannot opt out of essential cookies and still use FundoLabs.",
                  examples: "supabase-auth-token, session-id",
                  required: true,
                },
                {
                  name: "Preference cookies",
                  description: "Remember your settings such as theme, language, and notification preferences so you don't have to set them every time you visit.",
                  examples: "theme-preference, display-settings",
                  required: false,
                },
                {
                  name: "Analytics cookies",
                  description: "Help us understand how students use FundoLabs — which experiments are most popular, where users get stuck, and how to improve the platform. We use anonymised data only.",
                  examples: "page-views, session-duration",
                  required: false,
                },
                {
                  name: "Performance cookies",
                  description: "Monitor the technical performance of the platform to detect and fix errors faster. These cookies help us identify slow-loading pages or broken features.",
                  examples: "error-tracking, load-time",
                  required: false,
                },
              ].map((c) => (
                <div key={c.name} className="glass-card rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-foreground">{c.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${c.required ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {c.required ? "Required" : "Optional"}
                    </span>
                  </div>
                  <p className="mb-1">{c.description}</p>
                  <p className="text-xs font-mono text-muted-foreground/70">Examples: {c.examples}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-foreground font-semibold text-base mb-3">Managing cookies</h2>
            <p className="mb-3">You can control cookies through your browser settings. Most browsers allow you to block or delete cookies. Note that blocking essential cookies will prevent you from signing in or using FundoLabs.</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Chrome: Settings → Privacy and security → Cookies</li>
              <li>Firefox: Options → Privacy &amp; Security → Cookies</li>
              <li>Safari: Preferences → Privacy → Cookies</li>
              <li>Edge: Settings → Privacy, search, and services → Cookies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground font-semibold text-base mb-3">Third-party cookies</h2>
            <p>FundoLabs uses Supabase for authentication and database storage. Supabase may set its own essential cookies. We do not use advertising networks or social media tracking cookies.</p>
          </section>

          <section>
            <h2 className="text-foreground font-semibold text-base mb-3">Changes to this policy</h2>
            <p>We may update this Cookie Policy when we add new features. We will notify you of significant changes via email or an in-app banner.</p>
          </section>

          <section>
            <h2 className="text-foreground font-semibold text-base mb-3">Contact</h2>
            <p>Questions about our cookie usage? Email us at privacy@fundolabs.co.zw or use the <Link to="/contact" className="text-primary hover:underline">contact form</Link>.</p>
          </section>
        </div>

        <div className="mt-12 flex gap-4 text-sm">
          <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          <span className="text-muted-foreground">·</span>
          <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
          <span className="text-muted-foreground">·</span>
          <Link to="/contact" className="text-primary hover:underline">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
