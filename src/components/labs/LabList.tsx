import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Beaker, ArrowRight, Clock, BarChart3 } from "lucide-react";

type Experiment = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  difficulty: number | null;
  duration_minutes: number | null;
  level: "o_level" | "a_level";
};

export function LabList({
  subject, title, subtitle,
}: { subject: "chemistry" | "physics"; title: string; subtitle: string }) {
  const [items, setItems] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("experiments")
        .select("id, slug, title, description, difficulty, duration_minutes, level")
        .eq("subject", subject)
        .order("difficulty");
      setItems((data as Experiment[]) ?? []);
      setLoading(false);
    })();
  }, [subject]);

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold mb-1">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>

      {loading ? (
        <div className="text-muted-foreground">Loading experiments…</div>
      ) : items.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">
          No experiments yet — check back soon.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((exp) => (
            <Link
              key={exp.id}
              to="/labs/$slug"
              params={{ slug: exp.slug }}
              className="glass rounded-2xl p-6 hover:border-primary/40 transition group block"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:glow-primary transition">
                  <Beaker className="h-5 w-5 text-primary" />
                </div>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/15 text-accent">
                  {exp.level === "o_level" ? "O-Level" : "A-Level"}
                </span>
              </div>
              <h3 className="font-semibold mb-2">{exp.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{exp.description}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{exp.duration_minutes}m</span>
                  <span className="flex items-center gap-1"><BarChart3 className="h-3 w-3" />Lvl {exp.difficulty}</span>
                </div>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}