import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { FlaskConical, Atom, Brain, GraduationCap, FileText, TrendingUp, Beaker } from "lucide-react";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ sessions: 0, reports: 0, exams: 0 });
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ count: sessions }, { count: reports }, { count: exams }, { data: profile }] = await Promise.all([
        supabase.from("lab_sessions").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("reports").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("exam_attempts").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
      ]);
      setStats({ sessions: sessions ?? 0, reports: reports ?? 0, exams: exams ?? 0 });
      setName(profile?.full_name ?? user.email?.split("@")[0] ?? "");
    })();
  }, [user]);

  const quickLinks = [
    { to: "/labs/chemistry", label: "Chemistry Labs", icon: FlaskConical, desc: "Titrations, electrolysis, salts" },
    { to: "/labs/physics", label: "Physics Labs", icon: Atom, desc: "Circuits, optics, motion" },
    { to: "/tutor", label: "Ask AI Tutor", icon: Brain, desc: "Get instant explanations" },
    { to: "/exam", label: "Practice Exam", icon: GraduationCap, desc: "ZIMSEC-style timed exams" },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold mb-1">Welcome back, {name || "scientist"} 👋</h1>
        <p className="text-muted-foreground">Pick a lab and pick up where you left off.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard icon={Beaker} label="Lab sessions" value={stats.sessions} />
        <StatCard icon={FileText} label="Reports written" value={stats.reports} />
        <StatCard icon={TrendingUp} label="Exam attempts" value={stats.exams} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Quick start</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {quickLinks.map((q) => {
            const Icon = q.icon;
            return (
              <Link
                key={q.to}
                to={q.to}
                className="glass rounded-2xl p-5 hover:border-primary/40 transition group flex items-center gap-4"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:glow-primary transition">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">{q.label}</div>
                  <div className="text-sm text-muted-foreground">{q.desc}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-2">
        <Icon className="h-5 w-5 text-accent" />
      </div>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}