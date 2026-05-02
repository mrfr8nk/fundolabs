import { Link } from "react-router-dom";
import { FlaskConical, FileText } from "lucide-react";

export default function TermsPage() {
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
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Terms of Service</h1>
            <p className="text-muted-foreground text-sm mt-1">Last updated: 1 May 2026</p>
          </div>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          {[
            {
              title: "1. Acceptance of Terms",
              content: "By accessing or using FundoLabs (the \"Service\"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Service. These terms apply to all users, including students, teachers, and school administrators.",
            },
            {
              title: "2. Description of Service",
              content: "FundoLabs provides an AI-powered virtual science laboratory platform aligned to the ZIMSEC O-Level and A-Level curriculum. The Service includes interactive simulations, an AI tutor (FundoBot), exam practice tools, and lab report generation. Features may change over time.",
            },
            {
              title: "3. Account Registration",
              content: "You must create an account to access most features. You are responsible for maintaining the confidentiality of your login credentials. You agree to provide accurate information when registering. One person may not operate multiple accounts without prior approval.",
            },
            {
              title: "4. Acceptable Use",
              content: "You agree to use FundoLabs only for its intended educational purpose. You must not attempt to reverse engineer, scrape, or exploit the Service. You must not use FundoBot to generate content that is harmful, abusive, or unrelated to science education. Academic integrity is expected — do not use FundoLabs to cheat in real examinations.",
            },
            {
              title: "5. Intellectual Property",
              content: "All content on FundoLabs, including simulations, AI responses, question banks, and design, is the intellectual property of FundoLabs or its licensors. You may not reproduce or distribute any content without written permission. Lab reports you generate using your own data remain yours.",
            },
            {
              title: "6. Free and Paid Plans",
              content: "FundoLabs offers a free tier with limited access to experiments and AI tutor queries. A Pro plan provides unlimited access. Paid plans are billed monthly or annually. We reserve the right to change pricing with 30 days' notice. No refunds are provided for partial months.",
            },
            {
              title: "7. Disclaimer of Warranties",
              content: "The Service is provided \"as is\" without warranties of any kind. We do not guarantee that simulations exactly replicate real-world results. AI tutor responses should be verified against official ZIMSEC materials. Use the Service as a learning aid, not as a replacement for qualified teachers.",
            },
            {
              title: "8. Limitation of Liability",
              content: "FundoLabs shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service. Our total liability is limited to the amount you paid us in the 12 months preceding any claim.",
            },
            {
              title: "9. Termination",
              content: "We may suspend or terminate your account if you violate these terms. You may delete your account at any time from the Settings page. Upon termination, your data will be deleted within 30 days.",
            },
            {
              title: "10. Governing Law",
              content: "These Terms are governed by the laws of Zimbabwe. Any disputes shall be resolved in the courts of Harare, Zimbabwe.",
            },
            {
              title: "11. Contact",
              content: "For questions about these Terms, contact us at legal@fundolabs.co.zw.",
            },
          ].map(({ title, content }) => (
            <section key={title}>
              <h2 className="text-foreground font-semibold text-base mb-3">{title}</h2>
              <p>{content}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 flex gap-4 text-sm">
          <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          <span className="text-muted-foreground">·</span>
          <Link to="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link>
          <span className="text-muted-foreground">·</span>
          <Link to="/contact" className="text-primary hover:underline">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
