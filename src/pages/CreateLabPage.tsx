import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FlaskConical, Plus, Trash2, Save, Eye, ChevronRight,
  Beaker, Atom, BookOpen, Lightbulb, GripVertical, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Step {
  id: string;
  instruction: string;
}

interface Variable {
  id: string;
  name: string;
  unit: string;
  type: "independent" | "dependent" | "controlled";
}

const TEMPLATES = [
  { id: "titration", name: "Acid-Base Titration", subject: "Chemistry", icon: Beaker },
  { id: "ohms", name: "Ohm's Law", subject: "Physics", icon: Atom },
  { id: "pendulum", name: "Simple Pendulum", subject: "Physics", icon: Atom },
  { id: "rates", name: "Rates of Reaction", subject: "Chemistry", icon: Beaker },
  { id: "blank", name: "Start from scratch", subject: "Custom", icon: Plus },
];

const TEMPLATE_DEFAULTS: Record<string, { aim: string; hypothesis: string; steps: string[] }> = {
  titration: {
    aim: "To determine the concentration of a sodium hydroxide solution by titration against a standard hydrochloric acid solution.",
    hypothesis: "The volume of acid required to neutralise the base will be proportional to the concentration of the base.",
    steps: [
      "Rinse the burette with distilled water, then with the HCl solution.",
      "Fill the burette to the 0.00 cm³ mark with the HCl solution.",
      "Pipette exactly 25.0 cm³ of NaOH into the conical flask.",
      "Add 3 drops of phenolphthalein indicator to the conical flask.",
      "Run the acid from the burette slowly, swirling constantly.",
      "Stop at the endpoint (pink → colourless). Record the volume used.",
      "Repeat until three concordant results are obtained (within 0.10 cm³).",
    ],
  },
  ohms: {
    aim: "To verify Ohm's Law by investigating the relationship between current and voltage in a resistor.",
    hypothesis: "The current through a resistor is directly proportional to the potential difference across it, at constant temperature.",
    steps: [
      "Set up the circuit with resistor, ammeter (in series), and voltmeter (in parallel).",
      "Set the power supply to 1.0 V and record the current.",
      "Increase the voltage in steps of 1.0 V up to 6.0 V.",
      "Record the ammeter reading at each voltage.",
      "Calculate resistance R = V/I for each reading.",
      "Plot a V-I graph and determine the gradient (resistance).",
    ],
  },
  blank: {
    aim: "",
    hypothesis: "",
    steps: [""],
  },
};

export default function CreateLabPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"template" | "build" | "preview">("template");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState<"Chemistry" | "Physics" | "Biology">("Chemistry");
  const [level, setLevel] = useState<"O-Level" | "A-Level">("O-Level");
  const [aim, setAim] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [procedure, setProcedure] = useState<Step[]>([{ id: "1", instruction: "" }]);
  const [variables, setVariables] = useState<Variable[]>([
    { id: "1", name: "", unit: "", type: "independent" },
  ]);
  const [safety, setSafety] = useState("");

  const applyTemplate = (id: string) => {
    setSelectedTemplate(id);
    const t = TEMPLATE_DEFAULTS[id] ?? TEMPLATE_DEFAULTS.blank;
    setAim(t.aim);
    setHypothesis(t.hypothesis);
    setProcedure(t.steps.map((s, i) => ({ id: String(i + 1), instruction: s })));
    const tmpl = TEMPLATES.find((x) => x.id === id);
    if (tmpl && id !== "blank") {
      setTitle(tmpl.name);
      setSubject(tmpl.subject === "Physics" ? "Physics" : "Chemistry");
    }
    setStep("build");
  };

  const addStep = () => setProcedure((p) => [...p, { id: Date.now().toString(), instruction: "" }]);
  const removeStep = (id: string) => setProcedure((p) => p.filter((s) => s.id !== id));
  const updateStep = (id: string, val: string) => setProcedure((p) => p.map((s) => s.id === id ? { ...s, instruction: val } : s));

  const addVariable = () => setVariables((v) => [...v, { id: Date.now().toString(), name: "", unit: "", type: "independent" }]);
  const removeVariable = (id: string) => setVariables((v) => v.filter((x) => x.id !== id));
  const updateVariable = (id: string, field: keyof Variable, val: string) =>
    setVariables((v) => v.map((x) => x.id === id ? { ...x, [field]: val } : x));

  const handleSave = () => {
    if (!title.trim()) { toast.error("Please enter an experiment title"); return; }
    if (!aim.trim()) { toast.error("Please enter the aim of the experiment"); return; }
    toast.success("Experiment saved! It will appear in your labs once reviewed.");
    navigate("/labs/chemistry");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <FlaskConical className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Create Experiment</h1>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <span className={step === "template" ? "text-primary font-medium" : ""}>Choose template</span>
              <ChevronRight className="h-3 w-3" />
              <span className={step === "build" ? "text-primary font-medium" : ""}>Build experiment</span>
              <ChevronRight className="h-3 w-3" />
              <span className={step === "preview" ? "text-primary font-medium" : ""}>Preview &amp; save</span>
            </div>
          </div>
        </div>

        {/* Step 1: Template */}
        {step === "template" && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold mb-2">Choose a starting point</h2>
              <p className="text-muted-foreground text-sm">Start from a ZIMSEC-aligned template or create your own from scratch.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TEMPLATES.map((t) => {
                const Icon = t.icon;
                return (
                  <button key={t.id} onClick={() => applyTemplate(t.id)}
                    className="glass-card rounded-2xl p-6 text-left hover:border-primary/40 transition group flex flex-col gap-3">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{t.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{t.subject}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Build */}
        {step === "build" && (
          <div className="space-y-6">
            {/* Basic info */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" /> Experiment Details</h2>
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} className="glass border-white/10"
                  placeholder="e.g. Acid-Base Titration of HCl and NaOH" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Subject</Label>
                  <select value={subject} onChange={(e) => setSubject(e.target.value as any)}
                    className="w-full glass border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/40 bg-transparent">
                    {["Chemistry", "Physics", "Biology"].map((s) => (
                      <option key={s} value={s} style={{ background: "#1a1f3a" }}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Level</Label>
                  <select value={level} onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full glass border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/40 bg-transparent">
                    {["O-Level", "A-Level"].map((l) => (
                      <option key={l} value={l} style={{ background: "#1a1f3a" }}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Aim & Hypothesis */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold flex items-center gap-2"><Lightbulb className="h-4 w-4 text-accent" /> Aim &amp; Hypothesis</h2>
              <div className="space-y-1.5">
                <Label>Aim</Label>
                <textarea value={aim} onChange={(e) => setAim(e.target.value)} rows={3}
                  className="w-full glass border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40 bg-transparent resize-none"
                  placeholder="To investigate…" />
              </div>
              <div className="space-y-1.5">
                <Label>Hypothesis</Label>
                <textarea value={hypothesis} onChange={(e) => setHypothesis(e.target.value)} rows={3}
                  className="w-full glass border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40 bg-transparent resize-none"
                  placeholder="I predict that…" />
              </div>
            </div>

            {/* Variables */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Variables</h2>
                <Button size="sm" variant="outline" className="glass border-white/10 gap-1.5 h-8" onClick={addVariable}>
                  <Plus className="h-3.5 w-3.5" /> Add
                </Button>
              </div>
              <div className="space-y-3">
                {variables.map((v) => (
                  <div key={v.id} className="flex items-center gap-2">
                    <select value={v.type} onChange={(e) => updateVariable(v.id, "type", e.target.value as any)}
                      className="glass border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none bg-transparent w-32">
                      <option value="independent" style={{ background: "#1a1f3a" }}>Independent</option>
                      <option value="dependent" style={{ background: "#1a1f3a" }}>Dependent</option>
                      <option value="controlled" style={{ background: "#1a1f3a" }}>Controlled</option>
                    </select>
                    <Input value={v.name} onChange={(e) => updateVariable(v.id, "name", e.target.value)}
                      className="glass border-white/10 flex-1" placeholder="Variable name" />
                    <Input value={v.unit} onChange={(e) => updateVariable(v.id, "unit", e.target.value)}
                      className="glass border-white/10 w-24" placeholder="Unit" />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-400" onClick={() => removeVariable(v.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Procedure */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Procedure</h2>
                <Button size="sm" variant="outline" className="glass border-white/10 gap-1.5 h-8" onClick={addStep}>
                  <Plus className="h-3.5 w-3.5" /> Add step
                </Button>
              </div>
              <div className="space-y-2">
                {procedure.map((s, i) => (
                  <div key={s.id} className="flex items-start gap-2">
                    <div className="flex items-center gap-1 mt-2.5 flex-shrink-0">
                      <GripVertical className="h-3.5 w-3.5 text-muted-foreground/30" />
                      <span className="text-xs font-mono text-muted-foreground w-5 text-right">{i + 1}.</span>
                    </div>
                    <textarea value={s.instruction} onChange={(e) => updateStep(s.id, e.target.value)} rows={2}
                      className="flex-1 glass border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/40 bg-transparent resize-none"
                      placeholder={`Step ${i + 1}…`} />
                    {procedure.length > 1 && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-400 mt-1" onClick={() => removeStep(s.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Safety */}
            <div className="glass-card rounded-2xl p-6 space-y-3">
              <h2 className="font-semibold">Safety Precautions</h2>
              <textarea value={safety} onChange={(e) => setSafety(e.target.value)} rows={3}
                className="w-full glass border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40 bg-transparent resize-none"
                placeholder="Wear safety goggles. Handle acids with care…" />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="glass border-white/10" onClick={() => setStep("template")}>Back</Button>
              <Button variant="outline" className="glass border-white/10 gap-2" onClick={() => setStep("preview")}>
                <Eye className="h-4 w-4" /> Preview
              </Button>
              <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground gap-2">
                <Save className="h-4 w-4" /> Save Experiment
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {step === "preview" && (
          <div className="space-y-6">
            <div className="glass-card rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  {subject === "Physics" ? <Atom className="h-6 w-6 text-primary-foreground" /> : <Beaker className="h-6 w-6 text-primary-foreground" />}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{title || "Untitled Experiment"}</h1>
                  <p className="text-muted-foreground text-sm">{subject} · {level}</p>
                </div>
              </div>

              {aim && (
                <div className="mb-5">
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Aim</h2>
                  <p className="text-sm leading-relaxed">{aim}</p>
                </div>
              )}

              {hypothesis && (
                <div className="mb-5">
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Hypothesis</h2>
                  <p className="text-sm leading-relaxed">{hypothesis}</p>
                </div>
              )}

              {variables.some((v) => v.name) && (
                <div className="mb-5">
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Variables</h2>
                  <div className="space-y-1.5">
                    {variables.filter((v) => v.name).map((v) => (
                      <div key={v.id} className="flex items-center gap-2 text-sm">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          v.type === "independent" ? "bg-blue-500/15 text-blue-400" :
                          v.type === "dependent" ? "bg-accent/15 text-accent" :
                          "bg-muted text-muted-foreground"
                        } capitalize`}>{v.type}</span>
                        <span>{v.name}</span>
                        {v.unit && <span className="text-muted-foreground">({v.unit})</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {procedure.some((p) => p.instruction) && (
                <div className="mb-5">
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Procedure</h2>
                  <ol className="space-y-2">
                    {procedure.filter((p) => p.instruction).map((p, i) => (
                      <li key={p.id} className="flex gap-3 text-sm">
                        <span className="text-primary font-semibold flex-shrink-0">{i + 1}.</span>
                        <span className="leading-relaxed">{p.instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {safety && (
                <div className="glass rounded-xl p-4 border border-orange-500/20">
                  <h2 className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-1">Safety</h2>
                  <p className="text-sm text-muted-foreground">{safety}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="glass border-white/10" onClick={() => setStep("build")}>Edit</Button>
              <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground gap-2">
                <CheckCircle2 className="h-4 w-4" /> Save &amp; Publish
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
