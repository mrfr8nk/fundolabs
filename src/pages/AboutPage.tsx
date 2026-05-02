import { Link } from "react-router-dom";
import { FlaskConical, Brain, Globe, Users, Award, Target, ArrowRight, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
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

      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 glass-card px-4 py-1.5 rounded-full text-xs font-semibold text-accent mb-6">
            <Globe className="h-3.5 w-3.5" /> Made in Africa, for Africa
          </span>
          <h1 className="text-5xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            About <span className="text-gradient">FundoLabs</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We are building Africa's first AI-powered virtual science laboratory — making world-class ZIMSEC practical education accessible to every student, everywhere.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {[
            { icon: Target, title: "Our Mission", text: "To eliminate the gap between students who have access to well-equipped science labs and those who don't, by bringing real interactive experiments to any device." },
            { icon: Brain, title: "AI-First Learning", text: "FundoBot, our AI tutor powered by cutting-edge language models, provides personalised guidance for every ZIMSEC O-Level and A-Level topic — 24/7, free." },
            { icon: Award, title: "ZIMSEC Aligned", text: "Every simulation, exam question, and lab report template is aligned to the official ZIMSEC curriculum. From acid-base titrations to pendulum physics." },
            { icon: Users, title: "For Schools & Students", text: "Teachers can monitor class progress and assign experiments. Students can practice at their own pace and generate real lab reports." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="glass-card rounded-2xl p-6">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-3xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Why we built FundoLabs</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>In Zimbabwe, many schools lack the equipment, chemicals, and resources needed to conduct practical science experiments. This puts students at a disadvantage when it comes to ZIMSEC practical examinations and university science programmes.</p>
            <p>FundoLabs was created to solve this problem. By virtualising the science laboratory, we allow any student with a smartphone or computer to perform the same experiments they would in a fully-equipped lab — complete with accurate simulations, real physics, and AI guidance.</p>
            <p>We believe that access to quality science education should not depend on where you live or which school you attend.</p>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">What we offer</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "30+ interactive ZIMSEC-aligned simulations",
              "AI tutor (FundoBot) available 24/7",
              "Exam mode with AI marking and feedback",
              "Automated lab report generation",
              "Chemistry and Physics experiments",
              "O-Level and A-Level coverage",
              "Teacher dashboard and class management",
              "Custom experiment builder",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to start experimenting?</h2>
          <p className="text-muted-foreground mb-6">Join thousands of ZIMSEC students already using FundoLabs.</p>
          <Link to="/auth" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl px-8 py-3 font-semibold hover:opacity-90 transition">
            Create free account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
