import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Beaker, ArrowRight, Clock, BarChart3, Atom, FlaskConical, Search, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { EXPERIMENTS, DIFFICULTY_LABELS, type Experiment } from "@/data/experiments";
import { toast } from "sonner";

export function LabList({
  subject, title, subtitle,
}: { subject: "chemistry" | "physics"; title: string; subtitle: string }) {
  const [items, setItems] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<"all" | "o_level" | "a_level">("all");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from("experiments")
          .select("id, slug, title, description, difficulty, duration_minutes, level")
          .eq("subject", subject)
          .order("difficulty");
        if (data && data.length > 0) {
          setItems(data as Experiment[]);
        } else {
          setItems(EXPERIMENTS.filter((e) => e.subject === subject));
        }
      } catch {
        setItems(EXPERIMENTS.filter((e) => e.subject === subject));
      }
      setLoading(false);
    })();
  }, [subject]);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("saved_experiments")
        .select("experiment_id")
        .eq("user_id", user.id);
      if (data) setSavedIds(new Set(data.map((d: { experiment_id: string }) => d.experiment_id)));
    })();
  }, []);

  const handleSave = async (exp: Experiment, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Sign in to save experiments"); return; }
    if (savedIds.has(exp.id)) {
      await supabase.from("saved_experiments").delete().eq("user_id", user.id).eq("experiment_id", exp.id);
      setSavedIds((prev) => { const next = new Set(prev); next.delete(exp.id); return next; });
      toast.success("Removed from saved");
    } else {
      await supabase.from("saved_experiments").insert({ user_id: user.id, experiment_id: exp.id });
      setSavedIds((prev) => new Set([...prev, exp.id]));
      toast.success("Experiment saved!");
    }
  };

  const filtered = items.filter((exp) => {
    const matchSearch = search === "" || exp.title.toLowerCase().includes(search.toLowerCase()) || (exp.description ?? "").toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === "all" || exp.level === levelFilter;
    return matchSearch && matchLevel;
  });

  const Icon = subject === "chemistry" ? FlaskConical : Atom;

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-sm">
              <Icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold">{title}</h1>
          </div>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        <div className="text-sm text-muted-foreground glass-card px-4 py-2 rounded-xl">
          {filtered.length} experiments
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search experiments…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 glass-card rounded-xl text-sm border border-white/10 bg-transparent focus:outline-none focus:border-primary/40 transition"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "o_level", "a_level"] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
                levelFilter === lvl
                  ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                  : "glass-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {lvl === "all" ? "All levels" : lvl === "o_level" ? "O-Level" : "A-Level"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
              <div className="h-11 w-11 bg-white/10 rounded-xl mb-4" />
              <div className="h-4 bg-white/10 rounded mb-2 w-3/4" />
              <div className="h-3 bg-white/5 rounded mb-1" />
              <div className="h-3 bg-white/5 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center text-muted-foreground">
          <Beaker className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>No experiments found. Try a different search.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <Link
                
                to={`/labs/${exp.slug}`}
                className="glass-card rounded-2xl p-6 hover:border-primary/40 transition group block relative"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:glow-primary transition">
                    <Beaker className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/15 text-accent font-semibold">
                      {exp.level === "o_level" ? "O-Level" : "A-Level"}
                    </span>
                    <button
                      onClick={(e) => handleSave(exp, e)}
                      className={`p-1.5 rounded-lg transition hover:scale-110 ${
                        savedIds.has(exp.id)
                          ? "text-accent bg-accent/10"
                          : "text-muted-foreground hover:text-accent hover:bg-accent/10"
                      }`}
                      title={savedIds.has(exp.id) ? "Remove from saved" : "Save experiment"}
                    >
                      <Bookmark className="h-3.5 w-3.5" fill={savedIds.has(exp.id) ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition">{exp.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{exp.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{exp.duration_minutes}m</span>
                    <span className="flex items-center gap-1">
                      <BarChart3 className="h-3 w-3" />
                      {DIFFICULTY_LABELS[exp.difficulty ?? 1]}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
