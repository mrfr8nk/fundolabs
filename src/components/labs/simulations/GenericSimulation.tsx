import { useState, useEffect, useRef } from "react";
import { type Experiment, DIFFICULTY_LABELS } from "@/data/experiments";

type Particle = { id: number; x: number; y: number; vx: number; vy: number; r: number; color: string; life: number };

export function GenericSimulation({ slug: _slug, experiment }: { slug: string; experiment: Experiment }) {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [dataRows, setDataRows] = useState<{ label: string; value: string }[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isChemistry = experiment.subject === "chemistry";

  const COLORS = isChemistry
    ? ["rgba(100,200,255,0.7)", "rgba(100,255,150,0.7)", "rgba(255,150,100,0.7)", "rgba(200,150,255,0.7)", "rgba(255,220,80,0.7)"]
    : ["rgba(100,150,255,0.7)", "rgba(255,100,150,0.7)", "rgba(100,255,200,0.7)", "rgba(255,200,80,0.7)"];

  const spawnParticle = () => ({
    id: Math.random(),
    x: 100 + Math.random() * 200,
    y: 100 + Math.random() * 120,
    vx: (Math.random() - 0.5) * 1.2,
    vy: (Math.random() - 0.5) * 1.2,
    r: 4 + Math.random() * 8,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    life: 1,
  });

  useEffect(() => {
    if (!running) return;
    animRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { setRunning(false); return 100; }
        const next = Math.min(p + 0.4, 100);
        const newStep = Math.floor((next / 100) * (experiment.steps?.length ?? 6));
        if (newStep > stepIndex && newStep < (experiment.steps?.length ?? 0)) {
          setStepIndex(newStep);
          setDataRows((prev) => {
            const row = getDataRow(newStep, experiment, isChemistry);
            return [...prev.slice(-7), row];
          });
        }
        return next;
      });
      setParticles((prev) => {
        const moved = prev
          .map((p) => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, life: p.life - 0.008 }))
          .filter((p) => p.life > 0 && p.x > 50 && p.x < 350 && p.y > 50 && p.y < 240);
        if (moved.length < 18) moved.push(spawnParticle());
        return moved;
      });
    }, 60);
    return () => { if (animRef.current) clearInterval(animRef.current); };
  }, [running, stepIndex, experiment, isChemistry]);

  const reset = () => {
    setProgress(0); setRunning(false); setStepIndex(0);
    setDataRows([]); setParticles([]);
  };

  const currentStep = experiment.steps?.[stepIndex] ?? "";
  const barColor = progress >= 100 ? "rgba(100,255,150,0.8)" : progress > 60 ? "rgba(100,220,255,0.8)" : "rgba(100,150,255,0.8)";

  return (
    <div className="w-full h-full flex flex-col md:flex-row items-stretch min-h-0">
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <svg viewBox="0 0 420 320" className="w-full h-full" fill="none" style={{ maxHeight: "100%" }}>
          <defs>
            <linearGradient id="genBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#08101e" /><stop offset="100%" stopColor="#0b1830" />
            </linearGradient>
            <radialGradient id="glowCenter" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={isChemistry ? "rgba(100,200,255,0.08)" : "rgba(100,150,255,0.08)"} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <rect width="420" height="320" fill="url(#genBg)" rx="12" />

          <text x="210" y="22" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="13" fontFamily="Space Grotesk" fontWeight="700">
            {experiment.title}
          </text>
          <text x="210" y="36" textAnchor="middle" fill="rgba(150,200,255,0.45)" fontSize="8" fontFamily="monospace">
            {DIFFICULTY_LABELS[experiment.difficulty ?? 1]} · {experiment.duration_minutes}min · {experiment.level === "o_level" ? "O-Level" : "A-Level"} · {experiment.subject}
          </text>

          <rect x="50" y="48" width="300" height="185" rx="10" fill="rgba(10,20,50,0.7)" stroke="rgba(100,150,255,0.18)" strokeWidth="1" />
          <rect x="50" y="48" width="300" height="185" rx="10" fill="url(#glowCenter)" />

          {isChemistry ? (
            <g>
              <ellipse cx="160" cy="200" rx="40" ry="15" fill="rgba(40,80,160,0.15)" />
              <path d="M 130 175 L 145 225 L 175 225 L 190 175 Z" fill={`rgba(100,200,255,${0.1 + progress / 400})`} stroke="rgba(100,200,255,0.5)" strokeWidth="1.5" />
              <path d="M 153 160 L 148 175 L 172 175 L 167 160 Z" fill="rgba(60,100,180,0.4)" stroke="rgba(100,200,255,0.4)" strokeWidth="1" />
              <text x="160" y="212" textAnchor="middle" fill="rgba(100,200,255,0.7)" fontSize="7.5">Flask</text>

              <rect x="240" y="155" width="30" height="60" rx="4" fill="rgba(40,80,160,0.2)" stroke="rgba(100,200,255,0.4)" strokeWidth="1" />
              <rect x="242" y={157 + 58 * (1 - progress / 100)} width="26" height={58 * progress / 100} rx="3" fill={`rgba(100,200,255,${0.2 + progress / 300})`} />
              <text x="255" y="225" textAnchor="middle" fill="rgba(100,200,255,0.6)" fontSize="7">Burette</text>

              <circle cx="360" cy="180" r="28" fill="rgba(10,20,50,0.6)" stroke="rgba(100,200,255,0.3)" strokeWidth="1" />
              <text x="360" y="176" textAnchor="middle" fill="rgba(100,200,255,0.8)" fontSize="10" fontFamily="monospace" fontWeight="700">{progress.toFixed(0)}%</text>
              <text x="360" y="190" textAnchor="middle" fill="rgba(150,200,255,0.5)" fontSize="7">complete</text>
            </g>
          ) : (
            <g>
              <line x1="80" y1="230" x2="340" y2="230" stroke="rgba(150,200,255,0.3)" strokeWidth="1.5" />
              <line x1="90" y1="80" x2="90" y2="230" stroke="rgba(150,200,255,0.3)" strokeWidth="1.5" />
              <polyline
                points={`90,230 ${90 + progress * 2.4},${230 - progress * 1.4}`}
                stroke="rgba(100,200,255,0.8)" strokeWidth="2" fill="none"
              />
              <circle cx={90 + progress * 2.4} cy={230 - progress * 1.4} r="5" fill="rgba(100,220,255,0.9)" />
              <text x="210" y="250" textAnchor="middle" fill="rgba(150,200,255,0.5)" fontSize="7.5">Measurement (independent variable)</text>
              <text x="70" y="155" fill="rgba(150,200,255,0.5)" fontSize="7.5" transform="rotate(-90,70,155)">Result (dependent)</text>

              <circle cx="320" cy="110" r="28" fill="rgba(10,20,50,0.6)" stroke="rgba(100,150,255,0.3)" strokeWidth="1" />
              <text x="320" y="106" textAnchor="middle" fill="rgba(100,200,255,0.8)" fontSize="10" fontFamily="monospace" fontWeight="700">{progress.toFixed(0)}%</text>
              <text x="320" y="120" textAnchor="middle" fill="rgba(150,200,255,0.5)" fontSize="7">complete</text>
            </g>
          )}

          {particles.map((p) => (
            <circle key={p.id} cx={p.x} cy={p.y} r={p.r} fill={p.color} opacity={p.life * 0.8}>
              {running && (
                <animate attributeName="cy" values={`${p.y};${p.y - 15};${p.y}`} dur="1.5s" repeatCount="indefinite" />
              )}
            </circle>
          ))}

          <rect x="50" y="242" width="300" height="34" rx="6" fill="rgba(10,20,50,0.8)" stroke="rgba(100,150,255,0.15)" strokeWidth="1" />
          <rect x="54" y="246" width={292 * progress / 100} height="6" rx="3" fill={barColor} style={{ transition: "width 0.2s" }} />
          <text x="210" y="263" textAnchor="middle" fill="rgba(150,200,255,0.7)" fontSize="7.5" fontFamily="monospace">
            {progress >= 100 ? "Experiment complete — record your results" : running ? `Running… Step ${stepIndex + 1} of ${experiment.steps?.length ?? "?"}` : "Press Start to run the simulation"}
          </text>
          <text x="210" y="272" textAnchor="middle" fill="rgba(120,160,255,0.5)" fontSize="7" fontFamily="Space Grotesk">
            {currentStep ? currentStep.slice(0, 72) + (currentStep.length > 72 ? "…" : "") : experiment.description.slice(0, 72)}
          </text>

          {progress >= 100 && (
            <g>
              <rect x="120" y="100" width="180" height="40" rx="8" fill="rgba(100,255,150,0.15)" stroke="rgba(100,255,150,0.4)" strokeWidth="1" />
              <text x="210" y="118" textAnchor="middle" fill="rgba(100,255,150,0.9)" fontSize="10" fontFamily="Space Grotesk" fontWeight="700">
                Experiment Complete!
              </text>
              <text x="210" y="132" textAnchor="middle" fill="rgba(100,255,150,0.6)" fontSize="8">
                Record your results in the Lab Report tab
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className="w-full md:w-56 p-4 space-y-3 border-t md:border-t-0 md:border-l border-white/8 flex flex-col overflow-y-auto">
        <div className="glass rounded-xl p-3 space-y-2">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Progress</div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-200" style={{ width: `${progress}%`, background: "linear-gradient(to right, hsl(var(--primary)), hsl(var(--accent)))" }} />
          </div>
          <div className="text-xs font-mono text-center text-accent">{progress.toFixed(0)}%</div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Step {Math.min(stepIndex + 1, experiment.steps?.length ?? 1)}</span>
            <span>of {experiment.steps?.length ?? "?"}</span>
          </div>
        </div>

        <div className="glass rounded-xl p-3 flex-1 overflow-y-auto max-h-52">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-2">Live Data</div>
          {dataRows.length === 0 && (
            <div className="text-[10px] text-muted-foreground/40 leading-relaxed">Start the simulation to collect data…</div>
          )}
          <div className="space-y-1">
            {dataRows.map((row, i) => (
              <div key={i} className="flex justify-between text-[10px]">
                <span className="text-muted-foreground truncate">{row.label}</span>
                <span className="font-mono text-accent ml-2 flex-shrink-0">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {experiment.expectedResults && (
          <div className="glass rounded-xl p-3">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-1">Expected</div>
            <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-5">{experiment.expectedResults}</p>
          </div>
        )}

        <div className="space-y-2 mt-auto">
          <button
            onClick={() => setRunning((r) => !r)}
            disabled={progress >= 100}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition ${
              progress >= 100 ? "bg-green-500/20 text-green-400" :
              running ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" :
              "bg-gradient-to-r from-primary to-accent text-primary-foreground glow-sm"
            }`}
          >
            {progress >= 100 ? "Complete!" : running ? "Pause" : progress > 0 ? "Continue" : "Start Experiment"}
          </button>
          <button onClick={reset} className="w-full py-2 rounded-xl text-sm glass text-muted-foreground hover:text-foreground transition">
            Reset
          </button>
        </div>

        <div className="glass rounded-xl p-3 text-[10px] text-muted-foreground leading-relaxed">
          <span className="text-accent font-semibold">AI Tip: </span>
          {isChemistry
            ? "Record all observations as you go — colour changes, temperature changes, precipitate formation. These are your raw data."
            : "Tabulate your measurements carefully. Plot a graph of your results — the shape reveals the relationship between variables."}
        </div>
      </div>
    </div>
  );
}

function getDataRow(step: number, exp: Experiment, isChemistry: boolean): { label: string; value: string } {
  const chemRows = [
    { label: "Initial temp.", value: `${(20 + Math.random() * 4).toFixed(1)} °C` },
    { label: "Mass (before)", value: `${(50 + Math.random() * 5).toFixed(2)} g` },
    { label: "Volume added", value: `${(step * 5.2 + Math.random() * 0.5).toFixed(1)} cm3` },
    { label: "Colour change", value: step < 3 ? "No change" : step < 5 ? "Slight" : "Distinct" },
    { label: "pH reading", value: `${(2 + step * 1.3 + Math.random() * 0.3).toFixed(2)}` },
    { label: "Mass (after)", value: `${(50 - step * 1.2 - Math.random() * 0.4).toFixed(2)} g` },
    { label: "Gas produced", value: `${(step * 8.5 + Math.random() * 2).toFixed(1)} cm3` },
  ];
  const physRows = [
    { label: "Reading 1", value: `${(step * 0.5 + Math.random() * 0.08).toFixed(3)} m` },
    { label: "Time", value: `${(step * 2.1 + Math.random() * 0.2).toFixed(2)} s` },
    { label: "Force applied", value: `${(step * 0.98 + Math.random() * 0.05).toFixed(3)} N` },
    { label: "Voltage", value: `${(step * 1.2 + Math.random() * 0.1).toFixed(2)} V` },
    { label: "Current", value: `${(step * 0.12 + Math.random() * 0.01).toFixed(3)} A` },
    { label: "Temperature", value: `${(20 + step * 5.2 + Math.random() * 0.8).toFixed(1)} °C` },
    { label: "Extension", value: `${(step * 1.4 + Math.random() * 0.1).toFixed(1)} cm` },
  ];
  const rows = isChemistry ? chemRows : physRows;
  return rows[step % rows.length];
}
