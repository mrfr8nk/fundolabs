import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FlaskConical, Bookmark, Share2, CheckCircle2, Clock, BarChart3, Brain, Play, RotateCcw, Download, ChevronRight, AlertCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { getExperiment, DIFFICULTY_LABELS, type Experiment } from "@/data/experiments";
import { TitrationSimulation } from "@/components/labs/simulations/TitrationSimulation";
import { OhmsLawSimulation } from "@/components/labs/simulations/OhmsLawSimulation";
import { PendulumSimulation } from "@/components/labs/simulations/PendulumSimulation";
import { GenericSimulation } from "@/components/labs/simulations/GenericSimulation";

export const Route = createFileRoute("/_app/labs/$slug")({
  component: LabDetail,
});

function getSimulation(slug: string) {
  if (slug === "acid-base-titration") return TitrationSimulation;
  if (slug === "ohms-law" || slug === "parallel-series-circuits") return OhmsLawSimulation;
  if (slug === "pendulum") return PendulumSimulation;
  return GenericSimulation;
}

function LabDetail() {
  const { slug } = Route.useParams();
  const [exp, setExp] = useState<Experiment | null>(null);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"simulate" | "steps" | "report">("simulate");
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [observations, setObservations] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const SimComponent = exp ? getSimulation(slug) : null;

  useEffect(() => {
    (async () => {
      const local = getExperiment(slug);
      if (local) { setExp(local); }
      else {
        const { data } = await supabase.from("experiments").select("*").eq("slug", slug).maybeSingle();
        if (data) setExp(data as Experiment);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: savedData } = await supabase.from("saved_experiments").select("id").eq("user_id", user.id).eq("experiment_id", local?.id ?? "").maybeSingle();
      setSaved(!!savedData);

      const { data: session, error } = await supabase.from("lab_sessions").insert({
        user_id: user.id,
        experiment_id: local?.id,
        status: "in_progress",
      }).select("id").maybeSingle();
      if (!error && session) setSessionId(session.id);
    })();
  }, [slug]);

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

  const handleShare = async () => {
    if (!sessionId) { toast.info("Start an experiment session first"); return; }
    await supabase.from("lab_sessions").update({ is_public: true, share_token: crypto.randomUUID() }).eq("id", sessionId);
    const url = `${window.location.origin}/labs/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const handleAskAI = async () => {
    if (!aiQuestion.trim() || !exp) return;
    setAiLoading(true);
    setAiAnswer("");
    await new Promise((r) => setTimeout(r, 800));
    const answers = getAIAnswer(aiQuestion, exp);
    setAiAnswer(answers);
    setAiLoading(false);
    setAiQuestion("");
  };

  const generateReport = () => {
    if (!exp) return;
    const report = `LABORATORY REPORT\n${"=".repeat(50)}\n\nExperiment: ${exp.title}\nLevel: ${exp.level === "o_level" ? "O-Level" : "A-Level"} | Subject: ${exp.subject}\nDifficulty: ${DIFFICULTY_LABELS[exp.difficulty]}\nDuration: ${exp.duration_minutes} minutes\n\n${"─".repeat(50)}\nAIM\n${"─".repeat(50)}\n${exp.description}\n\n${"─".repeat(50)}\nAPPARATUS AND MATERIALS\n${"─".repeat(50)}\n${exp.tools?.join(", ") ?? "See experiment instructions"}\n\n${"─".repeat(50)}\nMETHOD\n${"─".repeat(50)}\n${exp.steps?.map((s, i) => `${i + 1}. ${s}`).join("\n") ?? ""}\n\n${"─".repeat(50)}\nOBSERVATIONS\n${"─".repeat(50)}\n${observations || exp.expectedResults}\n\n${"─".repeat(50)}\nCONCLUSION\n${"─".repeat(50)}\n${conclusion || "The experiment successfully demonstrated the expected outcomes in accordance with theoretical predictions."}\n\n${"─".repeat(50)}\nDate: ${new Date().toLocaleDateString()}\n`;

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}-lab-report.txt`;
    a.click();
    toast.success("Lab report downloaded!");
  };

  if (!exp) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="glass-card rounded-2xl p-10 text-center">
          <div className="h-8 w-8 mx-auto mb-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading experiment…</p>
        </div>
      </div>
    );
  }

  const progress = exp.steps ? Math.round((completedSteps.size / exp.steps.length) * 100) : 0;

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Link
          to={exp.subject === "physics" ? "/labs/physics" : "/labs/chemistry"}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to {exp.subject} labs
        </Link>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="glass-card border-white/10 hover:border-primary/30"
            onClick={handleSave}
          >
            <Bookmark className="h-4 w-4 mr-2" fill={saved ? "currentColor" : "none"} />
            {saved ? "Saved" : "Save"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="glass-card border-white/10 hover:border-primary/30"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-2" /> Share
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground glow-sm"
            onClick={generateReport}
          >
            <Download className="h-4 w-4 mr-2" /> Export Report
          </Button>
        </div>
      </div>

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
          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-accent" />{exp.duration_minutes} minutes</span>
          <span className="flex items-center gap-1.5"><BarChart3 className="h-4 w-4 text-primary" />{DIFFICULTY_LABELS[exp.difficulty ?? 1]}</span>
          <span className="flex items-center gap-1.5 capitalize"><FlaskConical className="h-4 w-4" />{exp.subject}</span>
        </div>

        {exp.steps && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Experiment progress</span>
              <span className="text-xs font-semibold text-accent">{progress}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-1 glass-card rounded-xl p-1">
        {([
          { key: "simulate", label: "Simulation", icon: Play },
          { key: "steps", label: "Procedure", icon: ChevronRight },
          { key: "report", label: "Lab Report", icon: Download },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition ${
              activeTab === key
                ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "simulate" && (
            <div className="space-y-5">
              <div className="glass-card rounded-3xl overflow-hidden border border-white/10">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-sm font-semibold">Live Simulation</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="glass rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5">
                      <RotateCcw className="h-3 w-3" /> Reset
                    </button>
                    <button className="glass rounded-lg px-3 py-1.5 text-xs text-accent flex items-center gap-1.5">
                      <Play className="h-3 w-3" /> Run
                    </button>
                  </div>
                </div>
                <div className="aspect-video bg-gradient-to-br from-primary/5 to-accent/5">
                  {SimComponent && <SimComponent slug={slug} experiment={exp} />}
                </div>
              </div>

              {exp.tools && (
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="font-semibold mb-3 flex items-center gap-2"><Sparkles className="h-4 w-4 text-accent" /> Apparatus & Materials</h3>
                  <div className="flex flex-wrap gap-2">
                    {exp.tools.map((tool) => (
                      <span key={tool} className="glass rounded-lg px-3 py-1.5 text-xs text-muted-foreground border border-white/8">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {exp.safetyNotes && (
                <div className="glass-card rounded-2xl p-5 border border-destructive/20">
                  <h3 className="font-semibold mb-2 flex items-center gap-2 text-destructive/80">
                    <AlertCircle className="h-4 w-4" /> Safety Notes
                  </h3>
                  <p className="text-sm text-muted-foreground">{exp.safetyNotes}</p>
                </div>
              )}

              <AskAIPanel
                exp={exp}
                aiQuestion={aiQuestion}
                setAiQuestion={setAiQuestion}
                aiAnswer={aiAnswer}
                aiLoading={aiLoading}
                onAsk={handleAskAI}
              />
            </div>
          )}

          {activeTab === "steps" && (
            <div className="space-y-3">
              {exp.steps?.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass-card rounded-xl p-4 flex items-start gap-4 cursor-pointer group transition ${
                    completedSteps.has(i) ? "border-accent/30 bg-accent/5" : "hover:border-primary/30"
                  }`}
                  onClick={() =>
                    setCompletedSteps((prev) => {
                      const next = new Set(prev);
                      next.has(i) ? next.delete(i) : next.add(i);
                      return next;
                    })
                  }
                >
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm transition ${
                    completedSteps.has(i)
                      ? "bg-accent text-accent-foreground"
                      : "bg-primary/15 text-primary group-hover:bg-primary/25"
                  }`}>
                    {completedSteps.has(i) ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm leading-relaxed transition ${completedSteps.has(i) ? "line-through text-muted-foreground" : ""}`}>{step}</p>
                  </div>
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
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder={`Write your observations here...\n\nExample:\n${exp.expectedResults}`}
                  rows={5}
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none resize-none leading-relaxed"
                />
              </div>
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-semibold mb-3">Conclusion</h3>
                <textarea
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  placeholder="Write your conclusion here..."
                  rows={4}
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none resize-none leading-relaxed"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary"
                  onClick={generateReport}
                >
                  <Download className="h-4 w-4 mr-2" /> Download Report
                </Button>
                <Button
                  variant="outline"
                  className="glass-card border-white/10"
                  onClick={() => {
                    setObservations(exp.expectedResults ?? "");
                    toast.success("AI filled in expected observations!");
                  }}
                >
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

function AskAIPanel({ exp, aiQuestion, setAiQuestion, aiAnswer, aiLoading, onAsk }: {
  exp: Experiment;
  aiQuestion: string;
  setAiQuestion: (v: string) => void;
  aiAnswer: string;
  aiLoading: boolean;
  onAsk: () => void;
}) {
  const suggestions = [
    `What is the aim of ${exp.title}?`,
    "Why do we use an indicator?",
    "What are sources of error?",
    "Write a balanced equation",
  ];

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Ask AI Tutor</h3>
        <span className="text-[10px] bg-primary/15 text-primary px-2 py-0.5 rounded-full font-semibold">Powered by AI</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => setAiQuestion(s)}
            className="glass rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={aiQuestion}
          onChange={(e) => setAiQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onAsk()}
          placeholder="Ask anything about this experiment…"
          className="flex-1 bg-transparent border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/40 transition"
        />
        <Button
          onClick={onAsk}
          disabled={aiLoading || !aiQuestion.trim()}
          className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
        >
          {aiLoading ? "…" : "Ask"}
        </Button>
      </div>

      <AnimatePresence>
        {aiAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 p-4 glass rounded-xl border border-primary/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary">AI Tutor Response</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{aiAnswer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getAIAnswer(question: string, exp: Experiment): string {
  const q = question.toLowerCase();
  if (q.includes("aim") || q.includes("purpose") || q.includes("objective")) {
    return `The aim of this experiment is to ${exp.description.toLowerCase()}\n\nThis experiment helps you understand the underlying scientific principles through direct observation and measurement.`;
  }
  if (q.includes("indicator") || q.includes("colour") || q.includes("color")) {
    return "Indicators are substances that change colour at a specific pH. In acid-base titrations, phenolphthalein is colourless in acid/neutral and pink in alkali. This colour change marks the equivalence point where moles of acid = moles of base.";
  }
  if (q.includes("error") || q.includes("mistake") || q.includes("accurate")) {
    return "Common sources of error in this experiment include:\n\n1. Parallax error when reading the meniscus in a burette or measuring cylinder\n2. Not rinsing apparatus with the correct solution before use\n3. Overshooting the endpoint by adding too much titrant\n4. Systematic errors from calibration of equipment\n\nTo improve accuracy: use a white tile, take multiple readings and calculate a mean.";
  }
  if (q.includes("equation") || q.includes("formula") || q.includes("balanced")) {
    const equations: Record<string, string> = {
      "acid-base-titration": "H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O\n\nThis shows that 1 mole of sulphuric acid reacts with 2 moles of sodium hydroxide.",
      "electrolysis-brine": "2NaCl + 2H₂O → Cl₂ + H₂ + 2NaOH\n\nAt the cathode: 2H⁺ + 2e⁻ → H₂\nAt the anode: 2Cl⁻ → Cl₂ + 2e⁻",
      "ohms-law": "V = IR\n\nWhere V = voltage (volts), I = current (amperes), R = resistance (ohms)\n\nThe gradient of a V-I graph gives resistance R.",
      "pendulum": "T = 2π√(L/g)\n\nWhere T = period (s), L = length (m), g = 9.81 m/s²\n\nRearranging: g = 4π²L/T²",
    };
    return equations[exp.slug] ?? `For ${exp.title}, the key equation is derived from the experimental data. Check your textbook for the specific formula relevant to this experiment.`;
  }
  if (q.includes("safety") || q.includes("hazard") || q.includes("danger")) {
    return `Safety precautions for ${exp.title}:\n\n${exp.safetyNotes}\n\nAlways wear appropriate PPE (goggles, gloves, lab coat) and follow your teacher's instructions.`;
  }
  if (q.includes("why") && q.includes("repeat")) {
    return "We repeat experiments to get concordant results (results that agree within acceptable limits, typically ±0.10 cm³ for titrations). Repeating reduces the effect of random errors and increases confidence in the data.";
  }
  if (q.includes("result") || q.includes("expect")) {
    return `Expected results for ${exp.title}:\n\n${exp.expectedResults}`;
  }
  return `Great question about ${exp.title}! 

${exp.description}

Key points to remember:
• This is a ${DIFFICULTY_LABELS[exp.difficulty ?? 1].toLowerCase()} level ${exp.subject} experiment
• It takes approximately ${exp.duration_minutes} minutes
• Always record all observations as they happen, even unexpected ones

For this specific question: ${question}

Think about the underlying scientific principle — what do you expect to happen based on theory? Write down your hypothesis before starting, then compare with your actual results. This is the scientific method in action!`;
}
