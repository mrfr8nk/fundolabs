import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FlaskConical, Atom, Brain, GraduationCap, Sparkles, Wifi,
  CheckCircle2, ArrowRight, Beaker, Zap, BookOpen, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import heroImg from "@/assets/hero-lab.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FundoLabs — AI Virtual Science Lab for ZIMSEC" },
      { name: "description", content: "Perform real chemistry and physics experiments virtually. Built for ZIMSEC O-Level and A-Level students across Africa." },
      { property: "og:title", content: "FundoLabs — Learn Science Through Real Simulations" },
      { property: "og:description", content: "Africa's AI-powered virtual science laboratory." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Labs />
      <DemoStrip />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-7 max-w-xl">
            <div className="inline-flex items-center gap-2 glass px-3 py-1.5 rounded-full text-xs">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="text-muted-foreground">AI-powered ZIMSEC practical labs</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05]">
              Learn Science Through{" "}
              <span className="text-gradient">Real Simulations</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Africa's first AI virtual science laboratory. Perform real chemistry
              and physics experiments — pour acids, build circuits, observe
              reactions — all from your phone.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 glow-primary text-base h-12 px-6">
                <Link to="/auth">
                  Start experimenting <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="glass border-white/15 text-base h-12 px-6">
                <Link to="/labs/chemistry">Explore labs</Link>
              </Button>
            </div>
            <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent" /> O & A-Level</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent" /> Works offline</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent" /> Mobile-first</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 bg-gradient-to-tr from-primary/30 to-accent/20 blur-3xl rounded-full" />
            <div className="relative glass-strong rounded-3xl overflow-hidden border border-white/10 glow-primary animate-float">
              <img
                src={heroImg}
                alt="Virtual science lab with glowing beakers and molecular visualisations"
                width={1536}
                height={1024}
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 glass-strong rounded-2xl px-4 py-3 hidden sm:flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center">
                <Beaker className="h-4 w-4 text-accent" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Experiment</div>
                <div className="text-sm font-semibold">Acid-Base Titration</div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 glass-strong rounded-2xl px-4 py-3 hidden sm:flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">AI Tutor</div>
                <div className="text-sm font-semibold">Online</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const featureList = [
  { icon: FlaskConical, title: "Real Chemistry Simulations", desc: "Pour, mix, heat. See real color changes, precipitates, gas bubbles and indicator transitions." },
  { icon: Atom, title: "Interactive Physics Labs", desc: "Build circuits, swing pendulums, refract light. Live measurements and graphs." },
  { icon: Brain, title: "AI Science Tutor", desc: "Ask anything. Get step-by-step guidance, mistake detection, and instant explanations." },
  { icon: GraduationCap, title: "ZIMSEC Exam Mode", desc: "Timed practical exams marked by AI with full observations and conclusions." },
  { icon: Wifi, title: "Works Offline", desc: "Optimised for low-data environments. Install as an app on any Android phone." },
  { icon: BookOpen, title: "AI Lab Reports", desc: "Auto-generate full practical write-ups with equations, observations and conclusions." },
];

function Features() {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 glass px-3 py-1.5 rounded-full text-xs mb-4">
            <Zap className="h-3.5 w-3.5 text-accent" />
            <span className="text-muted-foreground">Built for African students</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything you need to <span className="text-gradient">master practicals</span>
          </h2>
          <p className="text-muted-foreground">
            No expensive equipment. No safety risks. Just real science learning.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featureList.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="glass rounded-2xl p-6 hover:border-primary/40 transition group">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:glow-primary transition">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const labList = [
  { subject: "Chemistry", color: "from-cyan-400/20 to-emerald-400/20", items: ["Acid-Base Titration", "Flame Tests", "Electrolysis", "Rates of Reaction", "Qualitative Analysis", "Redox Reactions"] },
  { subject: "Physics", color: "from-blue-400/20 to-purple-400/20", items: ["Ohm's Law", "Simple Pendulum", "Refraction", "Lenses", "Projectile Motion", "Electromagnetism"] },
];

function Labs() {
  return (
    <section id="labs" className="py-24 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            12+ ZIMSEC labs <span className="text-gradient">already inside</span>
          </h2>
          <p className="text-muted-foreground">Aligned with the O-Level and A-Level syllabus.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {labList.map((cat) => (
            <div key={cat.subject} className={`glass-strong rounded-3xl p-8 bg-gradient-to-br ${cat.color}`}>
              <h3 className="text-2xl font-bold mb-6">{cat.subject}</h3>
              <ul className="space-y-3">
                {cat.items.map((it) => (
                  <li key={it} className="flex items-center gap-3 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DemoStrip() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="glass-strong rounded-3xl p-10 lg:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
          <div className="relative">
            <h3 className="text-2xl sm:text-3xl font-bold mb-3">Try a live experiment in 30 seconds</h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              No download. No setup. Open a beaker, add an indicator, watch the color shift.
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground glow-accent">
              <Link to="/labs/chemistry">Open Chemistry Lab <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

const plans = [
  { name: "Student", price: "Free", desc: "For individual learners", features: ["3 experiments / week", "AI tutor (50 msgs)", "Basic reports", "Mobile + offline"] },
  { name: "Pro", price: "$4", per: "/month", featured: true, desc: "For exam-ready students", features: ["Unlimited experiments", "Unlimited AI tutor", "Exam mode + marking", "AI lab reports", "Priority support"] },
  { name: "School", price: "Custom", desc: "For schools & tutors", features: ["Teacher dashboard", "Class management", "Bulk accounts", "Performance analytics", "Onboarding & training"] },
];

function Pricing() {
  return (
    <section id="pricing" className="py-24 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, fair pricing</h2>
          <p className="text-muted-foreground">Designed for African pockets. School discounts available.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-3xl p-8 ${
                p.featured
                  ? "glass-strong border-2 border-primary/50 glow-primary relative"
                  : "glass"
              }`}
            >
              {p.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Most popular
                </div>
              )}
              <h3 className="text-lg font-semibold mb-1">{p.name}</h3>
              <p className="text-sm text-muted-foreground mb-5">{p.desc}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">{p.price}</span>
                {p.per && <span className="text-muted-foreground text-sm">{p.per}</span>}
              </div>
              <ul className="space-y-3 mb-6">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild className={`w-full ${p.featured ? "bg-gradient-to-r from-primary to-accent text-primary-foreground" : "glass border border-white/10"}`}>
                <Link to="/auth">Get started</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const quotes = [
  { name: "Tendai M.", role: "Form 4 student, Harare", quote: "I finally understand titration. Watching the color change made it click." },
  { name: "Mr. Moyo", role: "Chemistry teacher, Bulawayo", quote: "My rural school can't afford a full lab. FundoLabs changed everything." },
  { name: "Rumbi K.", role: "A-Level student", quote: "The AI tutor is like having a private teacher 24/7. I scored an A." },
];

function Testimonials() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
          Trusted by <span className="text-gradient">students & teachers</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {quotes.map((q) => (
            <div key={q.name} className="glass rounded-2xl p-6">
              <p className="text-sm leading-relaxed mb-5 text-foreground/90">"{q.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-semibold text-primary-foreground">
                  {q.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold">{q.name}</div>
                  <div className="text-xs text-muted-foreground">{q.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="glass-strong rounded-3xl p-10 lg:p-16 text-center relative overflow-hidden border border-primary/30">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent/15" />
          <div className="relative max-w-2xl mx-auto">
            <Users className="h-10 w-10 mx-auto mb-5 text-accent" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Join the next generation of African scientists
            </h2>
            <p className="text-muted-foreground mb-8">
              Free to start. No credit card. Built for ZIMSEC, ready for the world.
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary h-12 px-8 text-base">
              <Link to="/auth">Create free account</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 mt-10">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-3">
          <FlaskConical className="h-4 w-4 text-primary" />
          <span className="font-semibold text-foreground">FundoLabs</span>
        </div>
        © {new Date().getFullYear()} FundoLabs · fundolabs.co.zw · Made in Africa, for Africa
      </div>
    </footer>
  );
}
