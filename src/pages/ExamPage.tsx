import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Clock, Play, CheckCircle2, ArrowRight, Brain, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EXPERIMENTS } from "@/data/experiments";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ExamQuestion = {
  question: string;
  answer: string;
  marks: number;
  type: "observation" | "calculation" | "conclusion" | "method";
};

const EXAM_QUESTIONS: Record<string, ExamQuestion[]> = {
  "acid-base-titration": [
    { question: "State the colour change at the endpoint when phenolphthalein is used as the indicator.", answer: "The solution changes from colourless to permanent pale pink.", marks: 1, type: "observation" },
    { question: "Calculate the concentration of NaOH if 24.80 cm³ was used to neutralise 25.0 cm³ of 0.1 mol/dm³ H₂SO₄.", answer: "Moles H₂SO₄ = 0.1 × 25/1000 = 0.0025 mol. Ratio 1:2, moles NaOH = 0.005 mol. Concentration = 0.005/(24.80/1000) = 0.202 mol/dm³", marks: 3, type: "calculation" },
    { question: "Explain why you should repeat the titration to obtain concordant titres.", answer: "To reduce random errors and increase reliability. Concordant titres within 0.10 cm³ give a more accurate mean titre.", marks: 2, type: "conclusion" },
    { question: "State TWO safety precautions you should take in this experiment.", answer: "Wear safety goggles; wear gloves; handle acid/alkali carefully; wash hands after experiment.", marks: 2, type: "method" },
  ],
  "ohms-law": [
    { question: "Describe what happens to the current when the voltage across the resistor is doubled.", answer: "The current doubles. I = V/R. Doubling V doubles I since R is constant.", marks: 2, type: "conclusion" },
    { question: "Calculate the resistance if a current of 0.3 A flows when 6 V is applied.", answer: "R = V/I = 6/0.3 = 20 Ω", marks: 2, type: "calculation" },
    { question: "What does the gradient of a V-I graph represent for an ohmic conductor?", answer: "The gradient = V/I = resistance in ohms. The graph is a straight line through the origin.", marks: 1, type: "observation" },
    { question: "Why must the ammeter be in series and the voltmeter in parallel?", answer: "Ammeter in series to measure the same current. Voltmeter in parallel to measure potential difference without affecting current.", marks: 2, type: "method" },
  ],
  "pendulum": [
    { question: "State TWO variables that must be kept constant in this experiment.", answer: "Mass of the bob; amplitude of oscillation; material of bob; position of pivot.", marks: 2, type: "method" },
    { question: "A pendulum has a length of 0.90 m. Calculate its period. (g = 9.81 m/s²)", answer: "T = 2π√(L/g) = 2π√(0.90/9.81) = 2π × 0.303 = 1.90 s", marks: 3, type: "calculation" },
    { question: "Explain why 20 oscillations are timed rather than just 1.", answer: "To reduce the effect of reaction time (random error). Timing 20 and dividing by 20 gives a more accurate value of T.", marks: 2, type: "conclusion" },
  ],
  "flame-tests": [
    { question: "State the flame colour produced by sodium compounds.", answer: "Persistent yellow/orange flame.", marks: 1, type: "observation" },
    { question: "State the flame colour for potassium compounds.", answer: "Lilac (pale violet) flame.", marks: 1, type: "observation" },
    { question: "Explain why a clean platinum or nichrome wire is used in flame tests.", answer: "To avoid contamination — impurities in the wire could produce misleading flame colours.", marks: 2, type: "method" },
    { question: "Identify the metal ion if the flame colour is brick red.", answer: "Calcium (Ca²⁺).", marks: 1, type: "conclusion" },
  ],
  "rates-of-reaction": [
    { question: "State how increasing temperature affects the rate of reaction between CaCO₃ and HCl.", answer: "Increasing temperature increases the rate of reaction because particles have more kinetic energy and collide more frequently and with greater energy.", marks: 2, type: "conclusion" },
    { question: "State what is meant by 'activation energy'.", answer: "The minimum energy required for a successful collision between reactant particles to start a chemical reaction.", marks: 2, type: "observation" },
    { question: "Explain how using CaCO₃ powder instead of lumps increases the reaction rate.", answer: "Powder has a greater surface area, so more CaCO₃ particles are exposed to HCl, leading to more frequent collisions and a faster rate.", marks: 2, type: "conclusion" },
  ],
};

const DEFAULT_QUESTIONS: ExamQuestion[] = [
  { question: "State the aim of this experiment.", answer: "The aim is stated in the experiment description.", marks: 1, type: "method" },
  { question: "List THREE pieces of apparatus you would need for this experiment.", answer: "Three appropriate pieces of apparatus from the equipment list.", marks: 3, type: "method" },
  { question: "State ONE safety precaution relevant to this experiment.", answer: "A specific safety precaution relevant to the chemicals or equipment used.", marks: 1, type: "method" },
];

export default function ExamPage() {
  const [phase, setPhase] = useState<"select" | "exam" | "results">("select");
  const [selectedExp, setSelectedExp] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [score, setScore] = useState<{ earned: number; total: number; feedback: string[] } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const questions = selectedExp ? (EXAM_QUESTIONS[selectedExp] ?? DEFAULT_QUESTIONS) : DEFAULT_QUESTIONS;
  const experiment = selectedExp ? EXPERIMENTS.find((e) => e.slug === selectedExp) : null;

  const startExam = (slug: string) => {
    setSelectedExp(slug);
    const exp = EXPERIMENTS.find((e) => e.slug === slug);
    setTimeLeft((exp?.duration_minutes ?? 20) * 60);
    setAnswers(new Array((EXAM_QUESTIONS[slug] ?? DEFAULT_QUESTIONS).length).fill(""));
    setPhase("exam");
  };

  useEffect(() => {
    if (phase !== "exam") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => { if (t <= 1) { submitExam(); return 0; } return t - 1; });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const submitExam = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    let earned = 0;
    const feedback: string[] = [];
    questions.forEach((q, i) => {
      const userAns = (answers[i] ?? "").toLowerCase().trim();
      const keywords = q.answer.toLowerCase().split(/[\s,;.]+/).filter((w) => w.length > 3);
      const matchCount = keywords.filter((kw) => userAns.includes(kw)).length;
      const partial = Math.round((matchCount / Math.max(keywords.length, 1)) * q.marks);
      earned += partial;
      feedback.push(
        partial >= q.marks ? `Correct Q${i + 1}: Full marks (${q.marks}/${q.marks})` :
        partial > 0 ? `Partial Q${i + 1}: ${partial}/${q.marks} — Model answer: ${q.answer}` :
        `Incorrect Q${i + 1}: 0/${q.marks} — Model answer: ${q.answer}`
      );
    });
    const total = questions.reduce((s, q) => s + q.marks, 0);
    setScore({ earned, total, feedback });
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("exam_attempts").insert({
        user_id: user.id,
        experiment_id: experiment?.id,
        score: (earned / total) * 100,
        duration_seconds: (experiment?.duration_minutes ?? 20) * 60 - timeLeft,
        answers: { answers, feedback },
      });
    }
    setPhase("results");
    toast.success("Exam submitted!");
  };

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const examsWithQuestions = EXPERIMENTS.filter((e) => EXAM_QUESTIONS[e.slug]);

  if (phase === "select") return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3"><GraduationCap className="h-8 w-8 text-accent" /> Exam Mode</h1>
        <p className="text-muted-foreground">ZIMSEC-style timed practical exams marked by AI. Choose an experiment to begin.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        {examsWithQuestions.map((exp, i) => (
          <motion.div key={exp.slug} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -3 }}>
            <div className="glass-card rounded-2xl p-6 group hover:border-primary/40 transition">
              <div className="flex items-start justify-between mb-4">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:glow-sm">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div className="text-right">
                  <div className={`text-[10px] px-2 py-0.5 rounded-full font-semibold mb-1 ${exp.level === "o_level" ? "bg-cyan-500/15 text-cyan-400" : "bg-violet-500/15 text-violet-400"}`}>
                    {exp.level === "o_level" ? "O-Level" : "A-Level"}
                  </div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1 justify-end">
                    <Clock className="h-3 w-3" /> {exp.duration_minutes} min
                  </div>
                </div>
              </div>
              <h3 className="font-semibold mb-1">{exp.title}</h3>
              <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{exp.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {(EXAM_QUESTIONS[exp.slug] ?? []).length} questions · {(EXAM_QUESTIONS[exp.slug] ?? []).reduce((s, q) => s + q.marks, 0)} marks
                </div>
                <Button size="sm" onClick={() => startExam(exp.slug)} className="bg-gradient-to-r from-primary to-accent text-primary-foreground glow-sm">
                  <Play className="h-3.5 w-3.5 mr-1.5" /> Start Exam
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="glass-card rounded-2xl p-6 border border-accent/20">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><AlertCircle className="h-4 w-4 text-accent" /> How Exam Mode Works</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {["ZIMSEC-style questions based on the experiment", "Countdown timer matches the real exam duration", "Type your answers as in a real exam", "AI grades answers against model answers", "Score saved to your profile for tracking"].map((item) => (
            <li key={item} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" /> {item}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  if (phase === "exam") {
    const urgent = timeLeft < 300;
    return (
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-xl font-bold">{experiment?.title} — Exam</h1>
            <p className="text-xs text-muted-foreground">{experiment?.level === "o_level" ? "O-Level" : "A-Level"} · {questions.length} questions</p>
          </div>
          <div className={`glass-card rounded-xl px-4 py-2 flex items-center gap-2 font-mono font-bold text-lg ${urgent ? "border-destructive/50 text-destructive" : "text-accent"}`}>
            <Clock className="h-5 w-5" /> {fmt(timeLeft)}
          </div>
        </div>
        {experiment && <div className="glass-card rounded-xl p-4 text-sm"><span className="text-muted-foreground">Experiment: </span>{experiment.description}</div>}
        <div className="space-y-5">
          {questions.map((q, i) => (
            <div key={i} className="glass-card rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div><span className="text-xs font-semibold text-primary mr-2">Q{i + 1}</span><span className="text-xs text-muted-foreground capitalize">[{q.type}]</span></div>
                <span className="text-xs font-semibold text-accent flex-shrink-0">[{q.marks} mark{q.marks > 1 ? "s" : ""}]</span>
              </div>
              <p className="text-sm font-medium mb-3">{q.question}</p>
              <textarea value={answers[i]} onChange={(e) => { const n = [...answers]; n[i] = e.target.value; setAnswers(n); }}
                placeholder="Write your answer here…" rows={3}
                className="w-full bg-white/3 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40 transition resize-none placeholder:text-muted-foreground/40" />
            </div>
          ))}
        </div>
        <Button onClick={submitExam} className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary h-12 text-base font-semibold">
          Submit Exam <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (phase === "results" && score) {
    const pct = Math.round((score.earned / score.total) * 100);
    const grade = pct >= 80 ? "A" : pct >= 70 ? "B" : pct >= 60 ? "C" : pct >= 50 ? "D" : pct >= 40 ? "E" : "U";
    const gradeColor = pct >= 70 ? "text-accent" : pct >= 50 ? "text-yellow-400" : "text-red-400";
    return (
      <div className="max-w-3xl space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-3xl p-8 text-center">
          <Brain className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">Exam Complete!</h2>
          <div className={`text-6xl font-bold mb-1 ${gradeColor}`}>{grade}</div>
          <div className="text-2xl font-semibold mb-1">{score.earned}/{score.total} marks</div>
          <div className="text-muted-foreground">{pct}% · {experiment?.title}</div>
        </motion.div>
        <div className="glass-card rounded-2xl p-6 space-y-3">
          <h3 className="font-semibold mb-4">AI Feedback</h3>
          {score.feedback.map((f, i) => (
            <div key={i} className={`text-sm p-3 rounded-xl ${f.startsWith("Correct") ? "bg-accent/10 text-accent" : f.startsWith("Partial") ? "bg-yellow-500/10 text-yellow-400" : "bg-destructive/10 text-destructive/80"}`}>{f}</div>
          ))}
        </div>
        <div className="flex gap-3">
          <Button onClick={() => { setPhase("select"); setScore(null); }} className="flex-1 glass-card border-white/15">Try Another Exam</Button>
          <Button className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground"><Brain className="h-4 w-4 mr-2" /> Review with AI Tutor</Button>
        </div>
      </div>
    );
  }

  return null;
}
