import { useState, useEffect } from "react";
import { type Experiment } from "@/data/experiments";
import { DIFFICULTY_LABELS } from "@/data/experiments";

export function GenericSimulation({ slug, experiment }: { slug: string; experiment: Experiment }) {
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [observations, setObs] = useState<string[]>([]);
  const [stepIndex, setStepIndex] = useState(0);

  const isChemistry = experiment.subject === "chemistry";

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { setRunning(false); return 100; }
        const next = p + 0.5;
        if (next % 20 < 0.6 && experiment.steps) {
          const step = Math.floor(next / (100 / experiment.steps.length));
          if (step < experiment.steps.length && step > stepIndex) {
            setStepIndex(step);
            setObs((prev) => [...prev.slice(-4), `Step ${step + 1} complete: ${experiment.steps![step].slice(0, 50)}…`]);
          }
        }
        return next;
      });
    }, 60);
    return () => clearInterval(id);
  }, [running, stepIndex, experiment]);

  const reset = () => { setProgress(0); setRunning(false); setObs([]); setStepIndex(0); };

  const molecules = isChemistry
    ? [
        { cx: 160, cy: 140, r: 18, color: "rgba(100,200,255,0.7)", label: "H₂O" },
        { cx: 220, cy: 120, r: 14, color: "rgba(255,150,100,0.7)", label: "H⁺" },
        { cx: 190, cy: 175, r: 16, color: "rgba(100,255,150,0.7)", label: "OH⁻" },
        { cx: 140, cy: 185, r: 12, color: "rgba(200,150,255,0.7)", label: "Na⁺" },
      ]
    : [
        { cx: 180, cy: 140, r: 20, color: "rgba(100,150,255,0.7)", label: "m=1kg" },
        { cx: 240, cy: 130, r: 16, color: "rgba(255,150,100,0.7)", label: "v=2m/s" },
        { cx: 160, cy: 180, r: 14, color: "rgba(100,255,150,0.7)", label: "F=ma" },
      ];

  return (
    <div className="w-full h-full flex flex-col md:flex-row items-stretch">
      <div className="flex-1 flex items-center justify-center p-6">
        <svg viewBox="0 0 380 280" className="w-full max-w-md" fill="none">
          <text x="190" y="20" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="13" fontFamily="Space Grotesk" fontWeight="600">{experiment.title}</text>

          <rect x="40" y="35" width="300" height="170" rx="12" fill="rgba(15,25,60,0.6)" stroke="rgba(100,150,255,0.2)" strokeWidth="1" />

          {molecules.map((m, i) => (
            <g key={i} style={{ animation: `bubble ${2 + i * 0.5}s ease-in-out ${i * 0.3}s infinite`, transformOrigin: `${m.cx}px ${m.cy}px` }}>
              <circle cx={m.cx + (running ? Math.sin(Date.now() / 500 + i) * 10 : 0)} cy={m.cy} r={m.r} fill={m.color} />
              <circle cx={m.cx} cy={m.cy} r={m.r} fill={m.color} opacity="0.6" />
              <text x={m.cx} y={m.cy + 4} textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="8" fontFamily="monospace">{m.label}</text>
            </g>
          ))}

          {running && [0, 1, 2, 3, 4].map((i) => (
            <circle
              key={i}
              cx={80 + Math.random() * 220}
              cy={60 + Math.random() * 120}
              r={2 + Math.random() * 3}
              fill="rgba(100,255,200,0.5)"
              style={{ animation: `bubble ${1 + Math.random()}s ease-in-out ${Math.random()}s infinite` }}
            />
          ))}

          {isChemistry && (
            <g>
              <rect x="140" y="195" width="100" height="35" rx="6" fill="rgba(15,25,60,0.8)" stroke="rgba(100,150,255,0.2)" />
              <rect x="145" y="200" width={progress} height="5" rx="2" fill="rgba(100,200,255,0.5)" />
              <text x="190" y="220" textAnchor="middle" fill="rgba(100,200,255,0.8)" fontSize="8" fontFamily="monospace">Reaction: {progress.toFixed(0)}%</text>
            </g>
          )}

          <text x="190" y="255" textAnchor="middle" fill="rgba(200,220,255,0.4)" fontSize="8" fontFamily="Nunito">
            {DIFFICULTY_LABELS[experiment.difficulty ?? 1]} · {experiment.duration_minutes}min · {experiment.level === "o_level" ? "O-Level" : "A-Level"}
          </text>
        </svg>
      </div>

      <div className="w-full md:w-60 p-4 space-y-3 border-t md:border-t-0 md:border-l border-white/8">
        <div className="glass rounded-xl p-3">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-2">Experiment Progress</div>
          <div className="h-2 bg-white/5 rounded-full mb-2">
            <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-xs text-center text-accent font-mono">{progress.toFixed(0)}%</div>
        </div>

        <div className="glass rounded-xl p-3 flex-1">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-2">Live Observations</div>
          <div className="space-y-1 min-h-20">
            {observations.length === 0 && <div className="text-xs text-muted-foreground/50">Start the experiment to see observations…</div>}
            {observations.map((obs, i) => (
              <div key={i} className="text-[10px] text-muted-foreground flex items-start gap-1.5">
                <span className="text-accent mt-0.5">•</span>
                <span>{obs}</span>
              </div>
            ))}
          </div>
        </div>

        {experiment.expectedResults && (
          <div className="glass rounded-xl p-3">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-1">Expected Results</div>
            <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-4">{experiment.expectedResults}</p>
          </div>
        )}

        <div className="space-y-2">
          <button
            onClick={() => setRunning((r) => !r)}
            disabled={progress >= 100}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold ${
              progress >= 100 ? "bg-accent/20 text-accent" :
              running ? "bg-orange-500/20 text-orange-400" :
              "bg-gradient-to-r from-primary to-accent text-primary-foreground glow-sm"
            }`}
          >
            {progress >= 100 ? "Experiment Complete ✓" : running ? "Pause" : progress > 0 ? "Continue" : "Start Experiment"}
          </button>
          <button onClick={reset} className="w-full py-2 rounded-xl text-sm glass text-muted-foreground hover:text-foreground">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
