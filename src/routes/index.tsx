import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  FlaskConical, Atom, Brain, GraduationCap, Sparkles, Wifi,
  CheckCircle2, ArrowRight, Beaker, Zap, BookOpen, Users,
  Star, Play, Share2, Download, ChevronRight, Microscope,
  Dna, Thermometer, Activity, Layers, Globe, Shield, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FundoLabs — AI Virtual Science Lab for ZIMSEC" },
      { name: "description", content: "Perform real chemistry and physics experiments virtually. Built for ZIMSEC O-Level and A-Level students across Africa." },
    ],
  }),
  component: Landing,
});

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".scroll-reveal, .scroll-reveal-left, .scroll-reveal-right").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function Landing() {
  useScrollReveal();
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <ExperimentVideoStrip />
      <FeaturesSection />
      <LabsSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
      <ProFooter />
    </div>
  );
}

function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-[100px] animate-float" style={{ animationDelay: "3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[160px]" />
      </div>

      <motion.div style={{ y, opacity }} className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full text-xs font-semibold"
            >
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="text-accent">AI-powered ZIMSEC practical labs</span>
              <span className="text-muted-foreground">— Free to start</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.02]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Learn Science
              <br />
              Through{" "}
              <span className="text-gradient">Real</span>
              <br />
              <span className="text-gradient-alt">Simulations</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-lg text-muted-foreground leading-relaxed max-w-lg"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              Africa's first AI virtual science laboratory. Perform real chemistry
              and physics experiments — pour acids, build circuits, observe reactions
              — all from your phone. Perfectly aligned with the ZIMSEC syllabus.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap gap-4"
            >
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 glow-primary text-base h-13 px-8 rounded-xl font-semibold">
                <Link to="/auth">
                  Start experimenting <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="glass-card border-white/15 text-base h-13 px-8 rounded-xl hover:bg-white/5">
                <a href="#experiments-video" className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-accent" /> Watch demo
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap items-center gap-6 pt-2 text-sm text-muted-foreground"
            >
              {[
                { icon: CheckCircle2, text: "O & A-Level aligned" },
                { icon: Wifi, text: "Works offline" },
                { icon: Shield, text: "Free forever plan" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-accent" />
                  <span>{text}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex items-center gap-4 pt-2"
            >
              <div className="flex -space-x-3">
                {["T", "R", "M", "A", "S"].map((l, i) => (
                  <div key={l} className="h-9 w-9 rounded-full border-2 border-background bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground" style={{ zIndex: 5 - i }}>
                    {l}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />)}
                </div>
                <div className="text-xs text-muted-foreground">2,400+ students enrolled</div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="absolute -inset-8 bg-gradient-to-tr from-primary/25 to-accent/15 blur-3xl rounded-full" />
            <div className="relative">
              <LabVisualization3D />
            </div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 glass-card rounded-2xl px-4 py-3 flex items-center gap-3"
            >
              <div className="h-9 w-9 rounded-lg bg-accent/20 flex items-center justify-center">
                <Beaker className="h-4 w-4 text-accent" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Active Experiment</div>
                <div className="text-sm font-semibold">Acid-Base Titration</div>
              </div>
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse ml-2" />
            </motion.div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute -top-4 -right-4 glass-card rounded-2xl px-4 py-3 flex items-center gap-3"
            >
              <div className="h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">AI Tutor</div>
                <div className="text-sm font-semibold text-accent">Online</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-50">
        <span className="text-xs text-muted-foreground">Scroll to explore</span>
        <div className="h-6 w-px bg-muted-foreground/40" />
      </div>
    </section>
  );
}

function LabVisualization3D() {
  return (
    <div className="relative w-full aspect-square max-w-lg mx-auto">
      <div className="absolute inset-0 glass-card rounded-3xl overflow-hidden border border-white/15 glow-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" fill="none">
          <defs>
            <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="oklch(0.72 0.18 220)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="oklch(0.85 0.22 145)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          <circle cx="200" cy="200" r="80" stroke="oklch(0.72 0.18 220 / 0.3)" strokeWidth="1" fill="none" strokeDasharray="4 4" className="animate-spin-slow" />
          <circle cx="200" cy="200" r="130" stroke="oklch(0.85 0.22 145 / 0.2)" strokeWidth="1" fill="none" strokeDasharray="8 8" style={{ animation: "spin 14s linear infinite reverse" }} />

          <circle cx="200" cy="200" r="40" fill="url(#glow1)" />
          <circle cx="200" cy="200" r="20" fill="oklch(0.72 0.18 220 / 0.4)" />
          <circle cx="200" cy="200" r="10" fill="oklch(0.72 0.18 220)" className="animate-pulse" />

          <circle cx="200" cy="120" r="10" fill="oklch(0.85 0.22 145)" className="animate-orbit" style={{ transformOrigin: "200px 200px" }} />
          <circle cx="280" cy="200" r="8" fill="oklch(0.72 0.18 220)" style={{ animation: "orbit 8s linear infinite", transformOrigin: "200px 200px" }} />
          <circle cx="200" cy="280" r="6" fill="oklch(0.78 0.18 195)" style={{ animation: "orbit 12s linear infinite reverse", transformOrigin: "200px 200px" }} />

          <g style={{ animation: "orbitReverse 20s linear infinite", transformOrigin: "200px 200px" }}>
            <circle cx="90" cy="200" r="7" fill="oklch(0.72 0.2 290 / 0.8)" />
          </g>

          <line x1="100" y1="300" x2="300" y2="300" stroke="oklch(0.95 0.05 220 / 0.15)" strokeWidth="1" />
          <rect x="160" y="220" width="40" height="80" rx="4" fill="oklch(0.72 0.18 220 / 0.15)" stroke="oklch(0.72 0.18 220 / 0.4)" strokeWidth="1" />
          <rect x="165" y="260" width="30" height="35" rx="3" fill="oklch(0.85 0.22 145 / 0.25)" style={{ animation: "liquidRise 3s ease-out forwards" }} />

          <circle cx="320" cy="80" r="4" fill="oklch(0.85 0.22 145 / 0.6)" className="animate-bubble" />
          <circle cx="340" cy="60" r="3" fill="oklch(0.85 0.22 145 / 0.4)" style={{ animation: "bubble 3s ease-in-out 0.5s infinite" }} />
          <circle cx="310" cy="50" r="2.5" fill="oklch(0.85 0.22 145 / 0.3)" style={{ animation: "bubble 3s ease-in-out 1s infinite" }} />

          <text x="200" y="380" textAnchor="middle" fill="oklch(0.72 0.04 240)" fontSize="10" fontFamily="Space Grotesk, sans-serif">H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O</text>
        </svg>

        <div className="absolute top-4 left-4 flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[10px] text-accent font-medium uppercase tracking-wider">Live Simulation</span>
        </div>

        <div className="absolute bottom-4 right-4 glass rounded-lg px-2.5 py-1.5 text-[10px] text-muted-foreground font-mono">
          pH: <span className="text-accent font-bold">7.02</span>
        </div>
      </div>
    </div>
  );
}

function ExperimentVideoStrip() {
  const experiments3D = [
    { title: "Acid-Base Titration", subject: "Chemistry", color: "from-cyan-500/20 to-blue-500/20", icon: Beaker, desc: "Watch colour change at equivalence point" },
    { title: "Electrolysis of Brine", subject: "Chemistry", color: "from-yellow-500/20 to-orange-500/20", icon: Zap, desc: "Chlorine gas evolution at anode" },
    { title: "Ohm's Law", subject: "Physics", color: "from-purple-500/20 to-pink-500/20", icon: Activity, desc: "Live V-I graph generation" },
    { title: "Refraction of Light", subject: "Physics", color: "from-green-500/20 to-teal-500/20", icon: Layers, desc: "Ray tracing through glass blocks" },
    { title: "DNA Extraction", subject: "Biology", color: "from-red-500/20 to-pink-500/20", icon: Dna, desc: "Strawberry DNA isolation" },
  ];

  return (
    <section id="experiments-video" className="py-24 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14 scroll-reveal">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full text-xs font-semibold mb-5">
            <Play className="h-3.5 w-3.5 text-accent" />
            <span className="text-muted-foreground">3D experiment previews</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            See it before you <span className="text-gradient">try it</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Stunning 3D simulations that mimic real lab environments — no equipment required.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-3xl glass-card border border-white/10 mb-12 scroll-reveal">
          <MainExperimentDemo />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {experiments3D.map((exp, i) => {
            const Icon = exp.icon;
            return (
              <motion.div
                key={exp.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className={`glass-card rounded-2xl p-5 bg-gradient-to-br ${exp.color} cursor-pointer group`}
              >
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center mb-3 group-hover:glow-primary transition">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{exp.subject}</div>
                <h4 className="text-sm font-semibold mb-1">{exp.title}</h4>
                <p className="text-[11px] text-muted-foreground">{exp.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MainExperimentDemo() {
  const [activeTab, setActiveTab] = useState<"titration" | "circuit" | "pendulum">("titration");

  return (
    <div className="aspect-video relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />

      <div className="absolute top-4 left-4 flex gap-2 z-10">
        {(["titration", "circuit", "pendulum"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition capitalize ${
              activeTab === tab
                ? "bg-primary text-primary-foreground glow-primary"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "titration" ? "Titration" : tab === "circuit" ? "Circuits" : "Pendulum"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {activeTab === "titration" && <TitrationAnimation />}
          {activeTab === "circuit" && <CircuitAnimation />}
          {activeTab === "pendulum" && <PendulumAnimation />}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-4 right-4 glass-card rounded-lg px-3 py-2 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
        <span className="text-xs text-muted-foreground">Interactive simulation</span>
      </div>
    </div>
  );
}

function TitrationAnimation() {
  const [fillLevel, setFillLevel] = useState(30);
  const [pH, setPH] = useState(2.3);
  const [color, setColor] = useState("oklch(0.72 0.18 220 / 0.3)");

  useEffect(() => {
    const interval = setInterval(() => {
      setFillLevel((prev) => {
        const next = prev >= 95 ? 30 : prev + 0.8;
        const newPH = 2.3 + ((next - 30) / 65) * 9.4;
        setPH(Math.min(11.7, newPH));
        if (newPH < 4) setColor("oklch(0.72 0.18 220 / 0.3)");
        else if (newPH < 7) setColor("oklch(0.78 0.22 30 / 0.5)");
        else if (newPH < 7.5) setColor("oklch(0.85 0.22 145 / 0.5)");
        else setColor("oklch(0.72 0.2 290 / 0.4)");
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg viewBox="0 0 500 300" className="w-full h-full max-w-2xl" fill="none">
      <text x="250" y="30" textAnchor="middle" fill="oklch(0.97 0.01 230)" fontSize="14" fontFamily="Space Grotesk" fontWeight="600">Acid-Base Titration — H₂SO₄ vs NaOH</text>

      <rect x="220" y="40" width="60" height="120" rx="4" fill="oklch(0.18 0.05 260 / 0.6)" stroke="oklch(0.95 0.05 220 / 0.3)" />
      <rect x="222" y="42" width="56" height={fillLevel * 1.15} rx="3" fill="oklch(0.72 0.18 220 / 0.5)" />
      <line x1="250" y1="160" x2="250" y2="190" stroke="oklch(0.85 0.22 145 / 0.6)" strokeWidth="2" />
      <circle cx="250" cy="192" r="3" fill="oklch(0.85 0.22 145 / 0.6)" />

      <rect x="190" y="200" width="120" height="70" rx="6" fill="oklch(0.18 0.05 260 / 0.8)" stroke="oklch(0.95 0.05 220 / 0.3)" />
      <rect x="192" y={200 + (70 - 70 * 0.6)} width="116" height={70 * 0.6} rx="5" fill={color} style={{ transition: "fill 0.5s ease" }} />
      <ellipse cx="250" cy="200" rx="60" ry="8" fill={color} style={{ transition: "fill 0.5s ease" }} />

      <circle cx="250" cy="192" r="2" fill="oklch(0.85 0.22 145 / 0.8)" className="animate-pulse" />

      <rect x="340" y="150" width="100" height="70" rx="8" fill="oklch(0.18 0.05 260 / 0.7)" stroke="oklch(0.95 0.05 220 / 0.2)" />
      <text x="390" y="172" textAnchor="middle" fill="oklch(0.68 0.04 240)" fontSize="8" fontFamily="monospace">pH METER</text>
      <text x="390" y="198" textAnchor="middle" fill="oklch(0.85 0.22 145)" fontSize="22" fontFamily="Space Grotesk" fontWeight="700">{pH.toFixed(2)}</text>
      <text x="390" y="212" textAnchor="middle" fill="oklch(0.68 0.04 240)" fontSize="8" fontFamily="monospace">
        {pH < 7 ? "ACIDIC" : pH === 7 ? "NEUTRAL" : "ALKALINE"}
      </text>

      <text x="50" y="220" fill="oklch(0.97 0.01 230)" fontSize="11" fontFamily="Nunito, sans-serif" fontWeight="600">Observations:</text>
      <text x="50" y="238" fill="oklch(0.68 0.04 240)" fontSize="9" fontFamily="Nunito, sans-serif">• Solution turns colourless → pink at endpoint</text>
      <text x="50" y="252" fill="oklch(0.68 0.04 240)" fontSize="9" fontFamily="Nunito, sans-serif">• Equivalence point: pH = 7.0</text>
      <text x="50" y="266" fill="oklch(0.68 0.04 240)" fontSize="9" fontFamily="Nunito, sans-serif">• Volume used: {((fillLevel - 30) / 65 * 24.8).toFixed(1)} cm³</text>

      <text x="50" y="170" fill="oklch(0.97 0.01 230 / 0.5)" fontSize="11" fontFamily="Nunito">AI Tutor:</text>
      <rect x="50" y="176" width="120" height="20" rx="4" fill="oklch(0.72 0.18 220 / 0.15)" />
      <text x="56" y="189" fill="oklch(0.85 0.22 145)" fontSize="9" fontFamily="Nunito">Add NaOH drop by drop ✓</text>
    </svg>
  );
}

function CircuitAnimation() {
  const [voltage, setVoltage] = useState(3);
  const current = voltage / 10;
  useEffect(() => {
    const t = setInterval(() => setVoltage((v) => v >= 12 ? 1 : v + 0.5), 300);
    return () => clearInterval(t);
  }, []);

  return (
    <svg viewBox="0 0 500 300" className="w-full h-full max-w-2xl" fill="none">
      <text x="250" y="30" textAnchor="middle" fill="oklch(0.97 0.01 230)" fontSize="14" fontFamily="Space Grotesk" fontWeight="600">Ohm's Law — V = IR</text>

      <rect x="60" y="80" width="50" height="90" rx="6" fill="oklch(0.18 0.05 260 / 0.8)" stroke="oklch(0.85 0.22 145 / 0.4)" />
      <text x="85" y="122" textAnchor="middle" fill="oklch(0.85 0.22 145)" fontSize="10" fontFamily="monospace">{voltage.toFixed(1)}V</text>
      <text x="85" y="140" textAnchor="middle" fill="oklch(0.68 0.04 240)" fontSize="7">BATTERY</text>

      <rect x="200" y="90" width="80" height="40" rx="4" fill="oklch(0.18 0.05 260 / 0.8)" stroke="oklch(0.72 0.18 220 / 0.4)" />
      <text x="240" y="115" textAnchor="middle" fill="oklch(0.72 0.18 220)" fontSize="10" fontFamily="monospace">10Ω</text>

      <rect x="360" y="80" width="60" height="90" rx="6" fill="oklch(0.18 0.05 260 / 0.8)" stroke="oklch(0.78 0.18 195 / 0.4)" />
      <text x="390" y="122" textAnchor="middle" fill="oklch(0.78 0.18 195)" fontSize="10" fontFamily="monospace">{current.toFixed(2)}A</text>
      <text x="390" y="140" textAnchor="middle" fill="oklch(0.68 0.04 240)" fontSize="7">AMMETER</text>

      <line x1="110" y1="100" x2="200" y2="100" stroke="oklch(0.85 0.22 145)" strokeWidth="2.5" strokeDasharray={`${current * 30} 5`} style={{ animation: `electricPulse ${2 / current}s linear infinite` }} />
      <line x1="280" y1="100" x2="360" y2="100" stroke="oklch(0.85 0.22 145)" strokeWidth="2.5" />
      <line x1="420" y1="100" x2="460" y2="100" stroke="oklch(0.85 0.22 145)" strokeWidth="2.5" />
      <line x1="460" y1="100" x2="460" y2="160" stroke="oklch(0.85 0.22 145)" strokeWidth="2.5" />
      <line x1="60" y1="160" x2="460" y2="160" stroke="oklch(0.85 0.22 145)" strokeWidth="2.5" />

      <circle cx="240" cy="100" r={4 + current * 6} fill="oklch(0.85 0.22 145 / 0.2)" className="animate-pulse" />

      <rect x="60" y="200" width="200" height="70" rx="8" fill="oklch(0.18 0.05 260 / 0.7)" stroke="oklch(0.95 0.05 220 / 0.2)" />
      <text x="75" y="222" fill="oklch(0.97 0.01 230)" fontSize="10" fontFamily="Space Grotesk" fontWeight="600">Live Readings</text>
      <text x="75" y="240" fill="oklch(0.85 0.22 145)" fontSize="9" fontFamily="monospace">V = {voltage.toFixed(1)} V</text>
      <text x="75" y="255" fill="oklch(0.72 0.18 220)" fontSize="9" fontFamily="monospace">I = {current.toFixed(3)} A</text>
      <text x="75" y="270" fill="oklch(0.78 0.18 195)" fontSize="9" fontFamily="monospace">R = V/I = 10.0 Ω ✓</text>

      <rect x="290" y="200" width="170" height="70" rx="8" fill="oklch(0.18 0.05 260 / 0.7)" stroke="oklch(0.95 0.05 220 / 0.2)" />
      <text x="305" y="222" fill="oklch(0.97 0.01 230)" fontSize="10" fontFamily="Space Grotesk" fontWeight="600">V-I Graph</text>
      {[0.5, 1.0, 1.5, 2.0, 2.5].map((v, i) => (
        <circle key={i} cx={305 + i * 30} cy={255 - v * 10} r="3" fill="oklch(0.85 0.22 145)" />
      ))}
      <line x1="300" y1="265" x2="460" y2="215" stroke="oklch(0.72 0.18 220 / 0.5)" strokeWidth="1" strokeDasharray="3 3" />
    </svg>
  );
}

function PendulumAnimation() {
  const [angle, setAngle] = useState(0);
  useEffect(() => {
    let t = 0;
    const interval = setInterval(() => {
      t += 0.05;
      setAngle(Math.sin(t) * 30);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const rad = (angle * Math.PI) / 180;
  const L = 120;
  const cx = 250;
  const cy = 60;
  const bx = cx + L * Math.sin(rad);
  const by = cy + L * Math.cos(rad);

  return (
    <svg viewBox="0 0 500 300" className="w-full h-full max-w-2xl" fill="none">
      <text x="250" y="30" textAnchor="middle" fill="oklch(0.97 0.01 230)" fontSize="14" fontFamily="Space Grotesk" fontWeight="600">Simple Pendulum — T = 2π√(L/g)</text>

      <line x1="150" y1="60" x2="350" y2="60" stroke="oklch(0.95 0.05 220 / 0.3)" strokeWidth="3" />
      <rect x="148" y="55" width="204" height="10" rx="2" fill="oklch(0.25 0.06 260 / 0.8)" />

      <path d={`M ${cx} ${cy} L ${cx - L * 0.5 * Math.sin(rad * 0.5)} ${cy + L * 0.5 * Math.cos(rad * 0.5)}`} stroke="oklch(0.72 0.18 220 / 0.3)" strokeWidth="1" strokeDasharray="3 3" />
      <path d={`M ${cx} ${cy} L ${cx + L * 0.5 * Math.sin(rad * 0.5)} ${cy + L * 0.5 * Math.cos(rad * 0.5)}`} stroke="oklch(0.72 0.18 220 / 0.3)" strokeWidth="1" strokeDasharray="3 3" />

      <line x1={cx} y1={cy} x2={bx} y2={by} stroke="oklch(0.85 0.22 145)" strokeWidth="2" />
      <circle cx={cx} cy={cy} r="5" fill="oklch(0.72 0.18 220)" />
      <circle cx={bx} cy={by} r="18" fill="oklch(0.18 0.05 260 / 0.8)" stroke="oklch(0.85 0.22 145)" strokeWidth="2" />
      <circle cx={bx} cy={by} r="18" fill="oklch(0.85 0.22 145 / 0.2)" className="animate-pulse" />

      <text x={bx} y={by + 4} textAnchor="middle" fill="oklch(0.85 0.22 145)" fontSize="7" fontFamily="monospace">200g</text>

      <line x1="100" y1="60" x2="100" y2="200" stroke="oklch(0.95 0.05 220 / 0.2)" strokeWidth="1" />
      <text x="105" y="130" fill="oklch(0.68 0.04 240)" fontSize="8" fontFamily="monospace">L=1.2m</text>
      <line x1="95" y1="60" x2="105" y2="60" stroke="oklch(0.95 0.05 220 / 0.2)" />
      <line x1="95" y1="180" x2="105" y2="180" stroke="oklch(0.95 0.05 220 / 0.2)" />

      <text x="55" y="225" fill="oklch(0.97 0.01 230)" fontSize="10" fontFamily="Space Grotesk" fontWeight="600">Measurements:</text>
      <text x="55" y="242" fill="oklch(0.85 0.22 145)" fontSize="9" fontFamily="monospace">θ = {Math.abs(angle).toFixed(1)}°</text>
      <text x="55" y="257" fill="oklch(0.72 0.18 220)" fontSize="9" fontFamily="monospace">T = 2.20 s</text>
      <text x="55" y="272" fill="oklch(0.78 0.18 195)" fontSize="9" fontFamily="monospace">g = 9.81 m/s²</text>

      <text x="260" y="225" fill="oklch(0.97 0.01 230)" fontSize="10" fontFamily="Space Grotesk" fontWeight="600">Formula:</text>
      <text x="260" y="242" fill="oklch(0.68 0.04 240)" fontSize="9" fontFamily="monospace">T = 2π√(L/g)</text>
      <text x="260" y="258" fill="oklch(0.68 0.04 240)" fontSize="9" fontFamily="monospace">T = 2π√(1.2/9.81)</text>
      <text x="260" y="274" fill="oklch(0.85 0.22 145)" fontSize="9" fontFamily="monospace">T = 2.20 s ✓</text>
    </svg>
  );
}

const featureList = [
  { icon: FlaskConical, title: "Real Chemistry Simulations", desc: "Pour, mix, heat. See real colour changes, precipitates, gas bubbles and indicator transitions.", tag: "Interactive" },
  { icon: Atom, title: "Interactive Physics Labs", desc: "Build circuits, swing pendulums, refract light. Live measurements and graphs auto-generated.", tag: "3D" },
  { icon: Brain, title: "AI Science Tutor", desc: "Ask anything. Get step-by-step guidance, mistake detection, and instant explanations in plain English.", tag: "AI" },
  { icon: GraduationCap, title: "ZIMSEC Exam Mode", desc: "Timed practical exams marked by AI with full observations, calculations and conclusions.", tag: "Exam" },
  { icon: Wifi, title: "Works Offline", desc: "Optimised for low-data environments. Install as a PWA on any Android phone and study anywhere.", tag: "Mobile" },
  { icon: BookOpen, title: "AI Lab Reports", desc: "Auto-generate full practical write-ups with balanced equations, observations and conclusions.", tag: "Reports" },
  { icon: Share2, title: "Share Experiments", desc: "Share your experiment results with classmates or teachers via a unique link.", tag: "Sharing" },
  { icon: Download, title: "Save & Export", desc: "Save your work, export lab reports as PDF, and track your progress over time.", tag: "Storage" },
  { icon: Microscope, title: "Biology Labs", desc: "Coming soon — microscope simulations, dissection guides, and genetics experiments.", tag: "Soon" },
];

function FeaturesSection() {
  return (
    <section id="features" className="py-28">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-20 scroll-reveal">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full text-xs font-semibold mb-6">
            <Zap className="h-3.5 w-3.5 text-accent" />
            <span className="text-muted-foreground">Built for African students</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-5">
            Everything you need to{" "}
            <span className="text-gradient">master practicals</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            No expensive equipment. No safety risks. Just real science learning, powered by AI.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featureList.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="glass-card rounded-2xl p-6 hover:border-primary/40 transition group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:glow-primary transition">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold ${
                      f.tag === "AI" ? "bg-primary/15 text-primary" :
                      f.tag === "Soon" ? "bg-muted text-muted-foreground" :
                      "bg-accent/15 text-accent"
                    }`}>{f.tag}</span>
                  </div>
                  <h3 className="font-semibold mb-2 text-base">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const labCategories = [
  {
    subject: "Chemistry", level: "O-Level", color: "from-cyan-400/15 to-emerald-400/10", accent: "text-cyan-400",
    items: [
      "Acid-Base Titration", "Flame Tests", "Electrolysis of Brine", "Rates of Reaction",
      "Qualitative Salt Analysis", "Redox Reactions", "Making Salts", "Molar Volume of Gas",
      "Displacement Reactions", "Precipitation Reactions", "Tests for Gases", "Paper Chromatography",
    ]
  },
  {
    subject: "Chemistry", level: "A-Level", color: "from-blue-400/15 to-purple-400/10", accent: "text-blue-400",
    items: [
      "Enthalpy of Neutralisation", "Buffer Solutions", "Equilibrium Constants", "Electrode Potentials",
      "Organic Synthesis", "Spectroscopy Analysis", "Kinetics & Rate Laws", "Transition Metal Complexes",
    ]
  },
  {
    subject: "Physics", level: "O-Level", color: "from-violet-400/15 to-pink-400/10", accent: "text-violet-400",
    items: [
      "Ohm's Law", "Simple Pendulum", "Refraction of Light", "Lenses & Ray Tracing",
      "Projectile Motion", "Electromagnetism", "Sound Waves", "Specific Heat Capacity",
      "Hooke's Law", "Diffraction Grating", "Resistance & Wire", "Magnetic Field Mapping",
    ]
  },
  {
    subject: "Physics", level: "A-Level", color: "from-orange-400/15 to-red-400/10", accent: "text-orange-400",
    items: [
      "Photoelectric Effect", "Radioactive Decay", "Standing Waves", "Capacitor Discharge",
      "Doppler Effect", "Interference Patterns", "Nuclear Binding Energy", "Centripetal Force",
    ]
  },
];

function LabsSection() {
  const [activeSubject, setActiveSubject] = useState<"all" | "chemistry" | "physics">("all");
  const filtered = labCategories.filter((c) =>
    activeSubject === "all" || c.subject.toLowerCase() === activeSubject
  );

  return (
    <section id="labs" className="py-28 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16 scroll-reveal">
          <h2 className="text-4xl sm:text-5xl font-bold mb-5">
            40+ ZIMSEC labs{" "}
            <span className="text-gradient">already inside</span>
          </h2>
          <p className="text-muted-foreground text-lg">Fully aligned with the O-Level and A-Level syllabus. New experiments added every week.</p>
        </div>

        <div className="flex justify-center gap-3 mb-10 scroll-reveal">
          {(["all", "chemistry", "physics"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubject(tab)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition capitalize ${
                activeSubject === tab
                  ? "bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary"
                  : "glass-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "all" ? "All Labs" : tab}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((cat, i) => (
            <motion.div
              key={`${cat.subject}-${cat.level}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`glass-card rounded-3xl p-8 bg-gradient-to-br ${cat.color}`}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold">{cat.subject}</h3>
                  <span className={`text-sm font-semibold ${cat.accent}`}>{cat.level}</span>
                </div>
                <span className="glass rounded-xl px-3 py-1.5 text-xs text-muted-foreground">{cat.items.length} experiments</span>
              </div>
              <ul className="grid grid-cols-2 gap-2">
                {cat.items.map((it) => (
                  <li key={it} className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                    <span className="text-muted-foreground">{it}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { num: "01", title: "Choose your experiment", desc: "Browse the ZIMSEC-aligned lab catalogue and pick a chemistry or physics experiment.", icon: BookOpen },
  { num: "02", title: "Set up your virtual apparatus", desc: "Drag and drop equipment — beakers, pipettes, power supplies, resistors — just like a real lab.", icon: Beaker },
  { num: "03", title: "Run the experiment", desc: "Perform the procedure step by step. The AI detects mistakes and guides you in real time.", icon: FlaskConical },
  { num: "04", title: "AI generates your report", desc: "Get a complete lab report with observations, calculations, graphs and conclusion ready for exam.", icon: Brain },
];

function HowItWorksSection() {
  return (
    <section className="py-28 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-20 scroll-reveal">
          <h2 className="text-4xl sm:text-5xl font-bold mb-5">
            How it <span className="text-gradient">works</span>
          </h2>
          <p className="text-muted-foreground text-lg">From zero to a completed practical in under 10 minutes.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="relative"
              >
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-primary/30 to-transparent z-0" style={{ width: "calc(100% - 2rem)" }} />
                )}
                <div className="glass-card rounded-2xl p-6 relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl font-bold text-gradient opacity-40">{step.num}</span>
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const plans = [
  {
    name: "Student", price: "Free", desc: "For curious learners",
    features: ["5 experiments / week", "AI tutor (100 messages)", "Basic lab reports", "Mobile + offline", "O-Level labs"],
    cta: "Get started free",
  },
  {
    name: "Pro", price: "$4", per: "/month", featured: true, desc: "For exam-ready students",
    features: ["Unlimited experiments", "Unlimited AI tutor", "Exam mode + AI marking", "Full lab reports PDF", "O & A-Level labs", "Save & share experiments", "Priority support"],
    cta: "Start Pro — $4/month",
  },
  {
    name: "School", price: "Custom", desc: "For schools & institutions",
    features: ["Teacher dashboard", "Class management", "Bulk student accounts", "Performance analytics", "Onboarding & training", "Custom branding"],
    cta: "Contact us",
  },
];

function PricingSection() {
  return (
    <section id="pricing" className="py-28 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-20 scroll-reveal">
          <h2 className="text-4xl sm:text-5xl font-bold mb-5">Simple, fair pricing</h2>
          <p className="text-muted-foreground text-lg">Designed for African pockets. No credit card to start.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`rounded-3xl p-8 relative ${
                p.featured
                  ? "glass-card border-2 border-primary/50 glow-primary"
                  : "glass-card"
              }`}
            >
              {p.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full">
                  Most popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-1">{p.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{p.desc}</p>
                <div>
                  <span className="text-4xl font-bold">{p.price}</span>
                  {p.per && <span className="text-muted-foreground text-sm">{p.per}</span>}
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild className={`w-full h-11 font-semibold rounded-xl ${p.featured ? "bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary" : "glass border border-white/15 hover:bg-white/5"}`}>
                <Link to="/auth">{p.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const quotes = [
  { name: "Tendai M.", role: "Form 4 student, Harare", quote: "I finally understand titration. Watching the colour change made it click instantly. Got an A in my practicals!", rating: 5 },
  { name: "Mr. Moyo", role: "Chemistry teacher, Bulawayo", quote: "My rural school can't afford a full lab. FundoLabs changed everything for my students. A genuine lifesaver.", rating: 5 },
  { name: "Rumbi K.", role: "A-Level student, Mutare", quote: "The AI tutor is like having a private teacher 24/7. I scored an A in Physics. Couldn't have done it without this.", rating: 5 },
  { name: "Farai N.", role: "Form 5, Masvingo", quote: "The exam mode is brilliant. It marks like a real ZIMSEC examiner. My confidence is through the roof now.", rating: 5 },
  { name: "Ms. Chikwanda", role: "Science HOD, Gweru", quote: "We recommended FundoLabs to all 300 of our science students. The teacher dashboard makes my life so much easier.", rating: 5 },
  { name: "Tinashe B.", role: "O-Level student", quote: "Never thought I'd understand electrolysis until FundoLabs showed me the animations. Now I teach my friends!", rating: 5 },
];

function TestimonialsSection() {
  return (
    <section className="py-28 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl sm:text-5xl font-bold mb-5">
            Trusted by <span className="text-gradient">students & teachers</span>
          </h2>
          <p className="text-muted-foreground text-lg">across Zimbabwe and Africa</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quotes.map((q, i) => (
            <motion.div
              key={q.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass-card rounded-2xl p-6 flex flex-col"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(q.rating)].map((_, j) => <Star key={j} className="h-4 w-4 fill-accent text-accent" />)}
              </div>
              <p className="text-sm leading-relaxed mb-6 text-foreground/85 flex-1">"{q.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-primary-foreground flex-shrink-0">
                  {q.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold">{q.name}</div>
                  <div className="text-xs text-muted-foreground">{q.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-3xl p-10 lg:p-20 text-center relative overflow-hidden border border-primary/25"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-primary/20 blur-[80px] rounded-full" />
          <div className="relative max-w-2xl mx-auto">
            <Award className="h-12 w-12 mx-auto mb-6 text-accent" />
            <h2 className="text-3xl sm:text-5xl font-bold mb-5">
              Join the next generation of<br />
              <span className="text-gradient">African scientists</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              Free to start. No credit card. Built for ZIMSEC, ready for the world.
              Join 2,400+ students already mastering their practicals.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary h-13 px-10 text-base font-semibold rounded-xl">
                <Link to="/auth">Create free account <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="glass-card border-white/15 h-13 px-8 text-base rounded-xl">
                <Link to="/auth">Sign in</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ProFooter() {
  const links = {
    Product: [
      { label: "Chemistry Labs", href: "/labs/chemistry" },
      { label: "Physics Labs", href: "/labs/physics" },
      { label: "AI Tutor", href: "/tutor" },
      { label: "Exam Mode", href: "/exam" },
      { label: "Lab Reports", href: "/reports" },
    ],
    Curriculum: [
      { label: "ZIMSEC O-Level", href: "#labs" },
      { label: "ZIMSEC A-Level", href: "#labs" },
      { label: "Cambridge IGCSE", href: "#labs" },
      { label: "IB Science", href: "#labs" },
    ],
    Company: [
      { label: "About FundoLabs", href: "#" },
      { label: "For Schools", href: "#pricing" },
      { label: "Teacher Dashboard", href: "/teacher" },
      { label: "Blog", href: "#" },
      { label: "Contact us", href: "#" },
    ],
    Legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  };

  return (
    <footer className="border-t border-white/8 py-16 mt-10">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-5 gap-12 mb-14">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-sm">
                <FlaskConical className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Fundo<span className="text-gradient">Labs</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
              Africa's AI-powered virtual science laboratory. Making world-class ZIMSEC practical education accessible to every student, everywhere.
            </p>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-4 w-4 text-accent" />
              <span className="text-sm text-muted-foreground">fundolabs.co.zw</span>
            </div>
            <div className="flex gap-3">
              {["𝕏", "📘", "📸", "▶"].map((icon, i) => (
                <button key={i} className="h-9 w-9 glass-card rounded-lg flex items-center justify-center text-sm hover:bg-primary/10 transition">
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-sm font-bold mb-5 text-foreground/80 uppercase tracking-wider">{title}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link to={item.href as "/" | "/auth"} className="text-sm text-muted-foreground hover:text-foreground transition flex items-center gap-1.5 group">
                      <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -ml-1 transition" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FundoLabs · Made in Africa, for Africa 🌍
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Built with AI</span>
            <span>·</span>
            <span>ZIMSEC aligned</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
