import { Link } from "react-router-dom";
import { FlaskConical, Shield } from "lucide-react";

export default function PrivacyPage() {
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
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
            <p className="text-muted-foreground text-sm mt-1">Last updated: 1 May 2026</p>
          </div>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          {[
            {
              title: "1. Information We Collect",
              content: "When you create a FundoLabs account, we collect your email address, name, and education level (O-Level or A-Level). We also collect usage data such as which experiments you complete, your exam scores, and lab session activity. We do not collect any sensitive personal information beyond what is necessary to provide our service.",
            },
            {
              title: "2. How We Use Your Information",
              content: "We use your information to provide and improve the FundoLabs service, personalise your learning experience, track your progress across experiments and exams, generate lab reports, and communicate with you about your account. We do not sell your personal data to third parties.",
            },
            {
              title: "3. Data Storage and Security",
              content: "Your data is stored securely using Supabase (a PostgreSQL database with row-level security). We use industry-standard encryption for data in transit and at rest. Access to your data is restricted to authorised FundoLabs systems only.",
            },
            {
              title: "4. Cookies",
              content: "FundoLabs uses essential cookies to keep you signed in and maintain your session. We also use analytics cookies to understand how our platform is used and improve it. You can manage cookie preferences in your browser settings. See our Cookie Policy for more details.",
            },
            {
              title: "5. AI and Third-Party Services",
              content: "FundoLabs uses the BK9 AI API to power FundoBot, our AI science tutor. When you send messages to FundoBot, those messages are processed by the BK9 API to generate responses. We do not store AI conversation content beyond your session unless you are signed in, in which case conversation history may be saved to your account.",
            },
            {
              title: "6. Children's Privacy",
              content: "FundoLabs is designed for students aged 13 and above. If you are under 13, please ask a parent or guardian to create an account on your behalf. We do not knowingly collect personal information from children under 13 without parental consent.",
            },
            {
              title: "7. Your Rights",
              content: "You have the right to access, correct, or delete your personal data at any time. To request data deletion or export, contact us at privacy@fundolabs.co.zw. We will process your request within 30 days.",
            },
            {
              title: "8. Changes to This Policy",
              content: "We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by posting a notice on the platform. Continued use of FundoLabs after changes constitutes acceptance of the updated policy.",
            },
            {
              title: "9. Contact",
              content: "For privacy-related questions, email us at privacy@fundolabs.co.zw or use the contact form on our website.",
            },
          ].map(({ title, content }) => (
            <section key={title}>
              <h2 className="text-foreground font-semibold text-base mb-3">{title}</h2>
              <p>{content}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 flex gap-4 text-sm">
          <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
          <span className="text-muted-foreground">·</span>
          <Link to="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link>
          <span className="text-muted-foreground">·</span>
          <Link to="/contact" className="text-primary hover:underline">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
