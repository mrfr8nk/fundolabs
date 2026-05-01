import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  FlaskConical, Atom, Brain, GraduationCap, FileText, TrendingUp, Beaker,
  ArrowRight, Bookmark, Sparkles, Clock, Play, ChevronRight, Award, Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { EXPERIMENTS, DIFFICULTY_LABELS } from "@/data/experiments";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ sessions: 0, reports: 0, exams: 0, saved: 0 });
  const [name, setName] = useState<string>("");
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ count: sessions }, { count: reports }, { count: exams }, { count: saved }, { data: profile }, { data: sessions_data }] = await Promise.all([
        supabase.from("lab_sessions").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("reports").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("exam_attempts").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("saved_experiments").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
        supabase.from("lab_sessions").select("experiment_id").eq("user_id", user.id).order("started_at", { ascending: false }).limit(3),
      ]);
      setStats({ sessions: sessions ?? 0, reports: reports ?? 0, exams: exams ?? 0, saved: saved ?? 0 });
      setName(profile?.full_name ?? user.email?.split("@")[0] ?? "");
      if (sessions_data) {
        setRecentSlugs(sessions_data.map((s: { experiment_id: string | null }) => s.experiment_id).filter(Boolean) as string[]);
      }
    })();
  }, [user]);

  const featuredExperiments = EXPERIMENTS.slice(0, 6);
  const savedExperiments = EXPERIMENTS.filter((e) => e.subject === "chemistry").slice(0, 3);

  const quickLinks = [
    { to: "/labs/chemistry", label: "Chemistry Labs", icon: FlaskConical, desc: "Titrations, electrolysis, salts and more", color: "from-cyan-500/20 to-emerald-500/10" },
    { to: "/labs/physics", label: "Physics Labs", icon: Atom, desc: "Circuits, optics, mechanics", color: "from-violet-500/20 to-blue-500/10" },
    { to: "/tutor", label: "AI Tutor", icon: Brain, desc: "Get instant explanations from FundoBot", color: "from-primary/20 to-accent/10" },
    { to: "/exam", label: "Exam Mode", icon: GraduationCap, desc: "ZIMSEC-style timed practicals", color: "from-orange-500/20 to-red-500/10" },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-muted-foreground text-sm mb-1">{greeting}, ready to experiment?</p>
            <h1 className="text-3xl font-bold">{name || "Scientist"} 👋</h1>
          </div>
          <div className="glass-card rounded-xl px-4 py-2 flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-muted-foreground">FundoBot is online</span>
            <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Beaker, label: "Lab Sessions", value: stats.sessions, color: "text-cyan-400", bg: "from-cyan-500/10 to-transparent" },
          { icon: FileText, label: "Reports Written", value: stats.reports, color: "text-green-400", bg: "from-green-500/10 to-transparent" },
          { icon: GraduationCap, label: "Exam Attempts", value: stats.exams, color: "text-orange-400", bg: "from-orange-500/10 to-transparent" },
          { icon: Bookmark, label: "Saved Experiments", value: stats.saved, color: "text-purple-400", bg: "from-purple-500/10 to-transparent" },
        ].map(({ icon: Icon, label, value, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className={`glass-card rounded-2xl p-5 bg-gradient-to-br ${bg}`}
          >
            <Icon className={`h-5 w-5 ${color} mb-3`} />
            <div className="text-3xl font-bold mb-0.5">{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </motion.div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Quick start</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((q, i) => {
            const Icon = q.icon;
            return (
              <motion.div
                key={q.to}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  to={q.to}
                  className={`glass-card rounded-2xl p-5 hover:border-primary/40 transition group flex flex-col gap-3 h-full bg-gradient-to-br ${q.color}`}
                >
                  <div className="h-11 w-11 rounded-xl bg-white/10 flex items-center justify-center group-hover:glow-primary transition">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">{q.label}</div>
                    <div className="text-xs text-muted-foreground">{q.desc}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition mt-auto self-end" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Featured Experiments</h2>
          <Link to="/labs/chemistry" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition">
            View all <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredExperiments.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              whileHover={{ y: -3 }}
            >
              <Link
                to="/labs/$slug"
                params={{ slug: exp.slug }}
                className="glass-card rounded-2xl p-5 hover:border-primary/40 transition group block"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:glow-sm transition">
                    {exp.subject === "chemistry" ? <FlaskConical className="h-4.5 w-4.5 text-primary" /> : <Atom className="h-4.5 w-4.5 text-primary" />}
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${exp.level === "o_level" ? "bg-cyan-500/15 text-cyan-400" : "bg-violet-500/15 text-violet-400"}`}>
                    {exp.level === "o_level" ? "O-Level" : "A-Level"}
                  </span>
                </div>
                <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition">{exp.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{exp.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{exp.duration_minutes}m</span>
                    <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />{DIFFICULTY_LABELS[exp.difficulty]}</span>
                  </div>
                  <Play className="h-3.5 w-3.5 group-hover:text-accent transition" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-semibold">Learning Goals</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: "Complete 5 Chemistry experiments", progress: Math.min((stats.sessions / 5) * 100, 100), done: stats.sessions >= 5 },
              { label: "Try the AI Tutor", progress: 0, done: false },
              { label: "Generate your first lab report", progress: Math.min((stats.reports / 1) * 100, 100), done: stats.reports >= 1 },
              { label: "Attempt an exam mode session", progress: Math.min((stats.exams / 1) * 100, 100), done: stats.exams >= 1 },
            ].map(({ label, progress, done }) => (
              <div key={label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className={done ? "line-through text-muted-foreground" : ""}>{label}</span>
                  {done && <span className="text-accent text-xs font-semibold">Done ✓</span>}
                </div>
                <div className="h-1.5 bg-white/5 rounded-full">
                  <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Daily Tips from FundoBot</h2>
          </div>
          <div className="space-y-3">
            {[
              { tip: "In titrations, always rinse your burette with the solution you'll be putting in it before filling.", type: "Chemistry" },
              { tip: "For Ohm's Law graphs: the gradient of V vs I = resistance. Make sure your ammeter is in series!", type: "Physics" },
              { tip: "When writing observations: always say WHAT you see (colour, precipitate, gas), not WHY.", type: "Exam Tip" },
              { tip: "Memorise OIL RIG: Oxidation Is Loss (of electrons), Reduction Is Gain (of electrons).", type: "Chemistry" },
            ].map(({ tip, type }) => (
              <div key={tip} className="flex gap-3 text-sm">
                <span className={`flex-shrink-0 text-[10px] px-2 py-0.5 rounded-full font-semibold h-fit mt-0.5 ${
                  type === "Chemistry" ? "bg-cyan-500/15 text-cyan-400" :
                  type === "Physics" ? "bg-violet-500/15 text-violet-400" :
                  "bg-accent/15 text-accent"
                }`}>{type}</span>
                <p className="text-muted-foreground leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
