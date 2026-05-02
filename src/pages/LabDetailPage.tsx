import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, FlaskConical, Bookmark, Share2, CheckCircle2,
  Clock, BarChart3, Brain, Download, ChevronRight, AlertCircle,
  Sparkles, Maximize2, Send, X, Table2, ZoomIn, ZoomOut
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { getExperiment, DIFFICULTY_LABELS, type Experiment } from "@/data/experiments";
import { askBK9 } from "@/lib/bk9api";
import { TitrationSimulation } from "@/components/labs/simulations/TitrationSimulation";
import { OhmsLawSimulation } from "@/components/labs/simulations/OhmsLawSimulation";
import { PendulumSimulation } from "@/components/labs/simulations/PendulumSimulation";
import { ProjectileSimulation } from "@/components/labs/simulations/ProjectileSimulation";
import { FlameTestSimulation } from "@/components/labs/simulations/FlameTestSimulation";
import { RatesSimulation } from "@/components/labs/simulations/RatesSimulation";
import { GenericSimulation } from "@/components/labs/simulations/GenericSimulation";

function getSimulation(slug: string) {
  switch (slug) {
    case "acid-base-titration":      return TitrationSimulation;
    case "ohms-law":
    case "parallel-series-circuits": return OhmsLawSimulation;
    case "pendulum":                 return PendulumSimulation;
    case "projectile-motion":        return ProjectileSimulation;
    case "flame-tests":              return FlameTestSimulation;
    case "rates-of-reaction":        return RatesSimulation;
    default:                         return GenericSimulation;
  }
}

const RESULTS_TEMPLATES: Record<string, { headers: string[]; rows: string[][] }> = {
  "acid-base-titration": {
    headers: ["Titre", "Initial reading (cm³)", "Final reading (cm³)", "Volume used (cm³)"],
    rows: [["Rough", "", "", ""], ["1st", "", "", ""], ["2nd", "", "", ""], ["3rd", "", "", ""], ["Mean", "", "", ""]],
  },
  "ohms-law": {
    headers: ["Voltage V (V)", "Current I (A)", "Resistance R (Ω)"],
    rows: [["1.0", "", ""], ["2.0", "", ""], ["3.0", "", ""], ["4.0", "", ""], ["5.0", "", ""]],
  },
  "pendulum": {
    headers: ["Length L (m)", "Time for 20 osc (s)", "Period T (s)", "T² (s²)"],
    rows: [["0.30", "", "", ""], ["0.50", "", "", ""], ["0.70", "", "", ""], ["0.90", "", "", ""], ["1.10", "", "", ""]],
  },
  "hookes-law": {
    headers: ["Mass (g)", "Force F (N)", "Extension e (cm)", "Spring const. k (N/m)"],
    rows: [["100", "0.98", "", ""], ["200", "1.96", "", ""], ["300", "2.94", "", ""], ["400", "3.92", "", ""], ["500", "4.90", "", ""]],
  },
  "rates-of-reaction": {
    headers: ["Temperature (°C)", "Time for cross to disappear (s)", "Rate (1/t)"],
    rows: [["20", "", ""], ["30", "", ""], ["40", "", ""], ["50", "", ""], ["60", "", ""]],
  },
  "specific-heat-capacity": {
    headers: ["Time (s)", "Temperature (°C)", "Change in temp (°C)", "Energy added (J)"],
    rows: [["0", "", "0", "0"], ["60", "", "", ""], ["120", "", "", ""], ["180", "", "", ""], ["240", "", "", ""]],
  },
};

function ResultsTable({ slug }: { slug: string }) {
  const template = RESULTS_TEMPLATES[slug] ?? {
    headers: ["Trial", "Measurement 1", "Measurement 2", "Result"],
    rows: Array(5).fill(null).map((_, i) => [`${i + 1}`, "", "", ""]),
  };
  const [data, setData] = useState(template.rows.map((r) => [...r]));

  const update = (r: number, c: number, val: string) => {
    setData((prev) => { const n = prev.map((row) => [...row]); n[r][c] = val; return n; });
  };

  const download = () => {
    const csv = [template.headers.join(","), ...data.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${slug}-results.csv`; a.click();
    toast.success("Results downloaded as CSV!");
  };

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2"><Table2 className="h-4 w-4 text-accent" /> Results Table</h3>
        <button onClick={download} className="glass rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition flex items-center gap-1.5">
          <Download className="h-3 w-3" /> Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              {template.headers.map((h) => (
                <th key={h} className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground bg-white/5 border border-white/10 first:rounded-tl-lg last:rounded-tr-lg">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, ri) => (
              <tr key={ri} className="group">
                {row.map((cell, ci) => (
                  <td key={ci} className="border border-white/8 p-0">
                    <input
                      value={cell}
                      onChange={(e) => update(ri, ci, e.target.value)}
                      className="w-full px-3 py-2 bg-transparent focus:outline-none focus:bg-primary/5 transition text-sm"
                      placeholder="—"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground mt-2">Click any cell to enter your measured values. Export as CSV when done.</p>
    </div>
  );
}

function AskAIPanel({ exp, aiMessages, aiQuestion, setAiQuestion, aiLoading, onAsk }: {
  exp: Experiment;
  aiMessages: { role: "user" | "ai"; text: string }[];
  aiQuestion: string;
  setAiQuestion: (v: string) => void;
  aiLoading: boolean;
  onAsk: () => void;
}) {
  const suggestions = [
    `What is the aim of ${exp.title}?`,
    "What are the sources of error?",
    "Write a balanced equation for this reaction",
    "What safety precautions should I take?",
    "How do I calculate the results?",
  ];

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Ask AI Tutor</h3>
        <span className="text-[10px] bg-primary/15 text-primary px-2 py-0.5 rounded-full font-semibold">FundoBot</span>
      </div>
      {aiMessages.length > 0 && (
        <div className="space-y-3 mb-4 max-h-80 overflow-y-auto pr-1">
          {aiMessages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`h-7 w-7 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold ${msg.role === "ai" ? "bg-gradient-to-br from-primary to-accent text-white" : "bg-white/10"}`}>
                {msg.role === "ai" ? <Brain className="h-3.5 w-3.5" /> : "U"}
              </div>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "ai" ? "glass border border-primary/20" : "bg-gradient-to-br from-primary/80 to-accent/80 text-white"}`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {aiLoading && (
            <div className="flex gap-2">
              <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"><Brain className="h-3.5 w-3.5 text-white" /></div>
              <div className="glass rounded-2xl px-4 py-3 flex items-center gap-1.5">
                {[0, 0.15, 0.3].map((d, i) => <div key={i} className="h-1.5 w-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: `${d}s` }} />)}
              </div>
            </div>
          )}
        </div>
      )}
      <div className="flex flex-wrap gap-2 mb-3">
        {suggestions.map((s) => (
          <button key={s} onClick={() => setAiQuestion(s)} className="glass rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition">{s}</button>
        ))}
      </div>
      <div className="flex gap-2">
        <input type="text" value={aiQuestion} onChange={(e) => setAiQuestion(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onAsk()}
          placeholder="Ask FundoBot about this experiment…"
          className="flex-1 bg-transparent border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/40 transition" />
        <Button onClick={onAsk} disabled={aiLoading || !aiQuestion.trim()} className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
          {aiLoading ? "…" : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}

export default function LabDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const safeSlug = slug ?? "";
  const [exp, setExp] = useState<Experiment | null>(null);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"simulate" | "steps" | "report">("simulate");
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [observations, setObservations] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [aiMessages, setAiMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const SimComponent = exp ? getSimulation(safeSlug) : null;

  useEffect(() => {
    (async () => {
      const local = getExperiment(safeSlug);
      if (local) setExp(local);
      else {
        const { data } = await supabase.from("experiments").select("*").eq("slug", safeSlug).maybeSingle();
        if (data) {
          const seed = getExperiment(data.slug);
          const merged = seed
            ? {
                ...seed,
                ...data,
                description: data.description ?? seed.description,
                difficulty: data.difficulty ?? seed.difficulty,
                duration_minutes: data.duration_minutes ?? seed.duration_minutes,
              }
            : (data as unknown as Experiment);
          setExp(merged as Experiment);
        }
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: savedData } = await supabase.from("saved_experiments").select("id").eq("user_id", user.id).eq("experiment_id", local?.id ?? "").maybeSingle();
      setSaved(!!savedData);
      const { error } = await supabase.from("lab_sessions").insert({ user_id: user.id, experiment_id: local?.id, status: "in_progress" });
      if (error) console.warn("Session:", error.message);
    })();
  }, [safeSlug]);

  const handleSave = async () => {
    if (!exp) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Sign in to save"); return; }
    if (saved) {
      await supabase.from("saved_experiments").delete().eq("user_id", user.id).eq("experiment_id", exp.id);
      setSaved(false); toast.success("Removed from saved");
    } else {
      await supabase.from("saved_experiments").insert({ user_id: user.id, experiment_id: exp.id });
      setSaved(true); toast.success("Experiment saved!");
    }
  };

  const handleShare = () => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); };

  const handleAskAI = async () => {
    if (!aiQuestion.trim() || !exp) return;
    const question = aiQuestion.trim();
    setAiQuestion("");
    setAiMessages((prev) => [...prev, { role: "user", text: question }]);
    setAiLoading(true);
    try {
      const context = `${exp.title} (${exp.subject}, ${exp.level === "o_level" ? "O-Level" : "A-Level"} ZIMSEC). ${exp.description}`;
      const answer = await askBK9(question, context);
      setAiMessages((prev) => [...prev, { role: "ai", text: answer }]);
    } catch {
      setAiMessages((prev) => [...prev, { role: "ai", text: "Sorry, I could not connect to the AI tutor. Please try again." }]);
    } finally {
      setAiLoading(false);
    }
  };

  const generateReport = () => {
    if (!exp) return;
    const report = `LABORATORY REPORT\n${"=".repeat(50)}\n\nExperiment: ${exp.title}\nLevel: ${exp.level === "o_level" ? "O-Level" : "A-Level"} | Subject: ${exp.subject}\nDifficulty: ${DIFFICULTY_LABELS[exp.difficulty]}\nDuration: ${exp.duration_minutes} minutes\n\nAIM\n${"─".repeat(40)}\n${exp.description}\n\nAPPARATUS\n${"─".repeat(40)}\n${exp.tools?.join(", ") ?? ""}\n\nMETHOD\n${"─".repeat(40)}\n${exp.steps?.map((s, i) => `${i + 1}. ${s}`).join("\n") ?? ""}\n\nOBSERVATIONS\n${"─".repeat(40)}\n${observations || exp.expectedResults}\n\nCONCLUSION\n${"─".repeat(40)}\n${conclusion || "The experiment demonstrated the expected outcomes."}\n\nDate: ${new Date().toLocaleDateString()}\nGenerated by FundoLabs`;
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${safeSlug}-report.txt`; a.click();
    toast.success("Report downloaded!");
  };

  if (!exp) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="glass-card rounded-2xl p-10 text-center">
        <div className="h-8 w-8 mx-auto mb-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">Loading experiment…</p>
      </div>
    </div>
  );

  const progress = exp.steps ? Math.round((completedSteps.size / exp.steps.length) * 100) : 0;

  return (
    <div className="max-w-6xl space-y-6">
      {/* Fullscreen overlay */}
      <AnimatePresence>
        {fullscreen && SimComponent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#07101e] flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/8 bg-[#0a1628]/90 backdrop-blur flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span className="font-semibold text-sm">{exp.title}</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/15 text-accent font-semibold">Live Simulation</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))} className="glass rounded-lg p-2 text-muted-foreground hover:text-foreground transition" title="Zoom out">
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="text-xs text-muted-foreground w-10 text-center">{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom((z) => Math.min(2, z + 0.1))} className="glass rounded-lg p-2 text-muted-foreground hover:text-foreground transition" title="Zoom in">
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button onClick={() => { setFullscreen(false); setZoom(1); }} className="glass rounded-xl p-2 text-muted-foreground hover:text-foreground transition ml-2">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-auto flex items-start justify-center">
              <div style={{ transform: `scale(${zoom})`, transformOrigin: "top center", width: `${100 / zoom}%`, transition: "transform 0.2s" }}>
                <SimComponent slug={safeSlug} experiment={exp} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Link to={exp.subject === "physics" ? "/labs/physics" : "/labs/chemistry"} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="h-4 w-4" /> Back to {exp.subject} labs
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="glass-card border-white/10" onClick={handleSave}>
            <Bookmark className="h-4 w-4 mr-2" fill={saved ? "currentColor" : "none"} />{saved ? "Saved" : "Save"}
          </Button>
          <Button variant="outline" size="sm" className="glass-card border-white/10" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" /> Share
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-primary to-accent text-primary-foreground" onClick={generateReport}>
            <Download className="h-4 w-4 mr-2" /> Report
          </Button>
        </div>
      </div>

      {/* Experiment info */}
      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary flex-shrink-0">
            <FlaskConical className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-2xl font-bold">{exp.title}</h1>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/15 text-accent font-semibold">
                {exp.level === "o_level" ? "O-Level" : "A-Level"}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">{exp.description}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-accent" />{exp.duration_minutes} min</span>
          <span className="flex items-center gap-1.5"><BarChart3 className="h-4 w-4 text-primary" />{DIFFICULTY_LABELS[exp.difficulty ?? 1]}</span>
          <span className="flex items-center gap-1.5 capitalize"><FlaskConical className="h-4 w-4" />{exp.subject}</span>
        </div>
        {exp.steps && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs font-semibold text-accent">{progress}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 glass-card rounded-xl p-1">
        {([
          { key: "simulate", label: "Simulation", icon: Sparkles },
          { key: "steps", label: "Procedure", icon: ChevronRight },
          { key: "report", label: "Lab Report", icon: Download },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition ${activeTab === key ? "bg-gradient-to-r from-primary to-accent text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>

          {activeTab === "simulate" && (
            <div className="space-y-5">
              {/* Large simulation panel */}
              <div className="glass-card rounded-3xl overflow-hidden border border-white/10">
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-sm font-semibold">Live Simulation</span>
                    <span className="text-[10px] text-muted-foreground hidden sm:block">— Interactive ZIMSEC lab</span>
                  </div>
                  <button onClick={() => setFullscreen(true)} className="glass rounded-lg px-3 py-1.5 text-xs text-accent hover:text-foreground flex items-center gap-1.5 transition">
                    <Maximize2 className="h-3.5 w-3.5" /> Full Screen
                  </button>
                </div>
                {/* Taller simulation container: 640px */}
                <div style={{ height: "640px" }} className="bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden">
                  {SimComponent && <SimComponent slug={safeSlug} experiment={exp} />}
                </div>
              </div>

              {/* Results Table */}
              <ResultsTable slug={safeSlug} />

              {exp.tools && (
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="font-semibold mb-3 flex items-center gap-2"><Sparkles className="h-4 w-4 text-accent" /> Apparatus &amp; Materials</h3>
                  <div className="flex flex-wrap gap-2">
                    {exp.tools.map((tool) => (
                      <span key={tool} className="glass rounded-lg px-3 py-1.5 text-xs text-muted-foreground border border-white/8">{tool}</span>
                    ))}
                  </div>
                </div>
              )}

              {exp.safetyNotes && (
                <div className="glass-card rounded-2xl p-5 border border-destructive/20">
                  <h3 className="font-semibold mb-2 flex items-center gap-2 text-destructive/80"><AlertCircle className="h-4 w-4" /> Safety Notes</h3>
                  <p className="text-sm text-muted-foreground">{exp.safetyNotes}</p>
                </div>
              )}

              <AskAIPanel exp={exp} aiMessages={aiMessages} aiQuestion={aiQuestion} setAiQuestion={setAiQuestion} aiLoading={aiLoading} onAsk={handleAskAI} />
            </div>
          )}

          {activeTab === "steps" && (
            <div className="space-y-3">
              {exp.steps?.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className={`glass-card rounded-xl p-4 flex items-start gap-4 cursor-pointer group transition ${completedSteps.has(i) ? "border-accent/30 bg-accent/5" : "hover:border-primary/30"}`}
                  onClick={() => setCompletedSteps((prev) => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; })}>
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm transition ${completedSteps.has(i) ? "bg-accent text-accent-foreground" : "bg-primary/15 text-primary group-hover:bg-primary/25"}`}>
                    {completedSteps.has(i) ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </div>
                  <p className={`text-sm leading-relaxed mt-1 transition ${completedSteps.has(i) ? "line-through text-muted-foreground" : ""}`}>{step}</p>
                </motion.div>
              ))}
              {exp.expectedResults && (
                <div className="glass-card rounded-2xl p-5 bg-primary/5 border border-primary/20 mt-4">
                  <h3 className="font-semibold mb-2 text-primary">Expected Results</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{exp.expectedResults}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "report" && (
            <div className="space-y-5">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-semibold mb-2">Aim</h3>
                <p className="text-sm text-muted-foreground">{exp.description}</p>
              </div>
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-semibold mb-3">Observations</h3>
                <textarea value={observations} onChange={(e) => setObservations(e.target.value)}
                  placeholder={`Write your observations here…\n\nExpected:\n${exp.expectedResults}`}
                  rows={6} className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none resize-none leading-relaxed" />
              </div>
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-semibold mb-3">Conclusion</h3>
                <textarea value={conclusion} onChange={(e) => setConclusion(e.target.value)}
                  placeholder="Write your conclusion here…" rows={4}
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none resize-none leading-relaxed" />
              </div>
              <div className="flex gap-3">
                <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground" onClick={generateReport}>
                  <Download className="h-4 w-4 mr-2" /> Download Report
                </Button>
                <Button variant="outline" className="glass-card border-white/10"
                  onClick={() => { setObservations(exp.expectedResults ?? ""); toast.success("AI filled in expected observations!"); }}>
                  <Brain className="h-4 w-4 mr-2" /> AI Auto-fill
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
