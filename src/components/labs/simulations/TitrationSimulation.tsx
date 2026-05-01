import { useEffect, useState, useCallback } from "react";
import { type Experiment } from "@/data/experiments";

export function TitrationSimulation({ experiment }: { slug: string; experiment: Experiment }) {
  const [burette, setBurette] = useState(0);
  const [ph, setPh] = useState(2.1);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [dropRate, setDropRate] = useState(1);

  const flaskColor = () => {
    if (ph < 3.8) return "rgba(100,180,255,0.3)";
    if (ph < 7.2) return "rgba(255,160,60,0.35)";
    if (ph < 8.2) return "rgba(120,200,120,0.35)";
    return "rgba(200,100,220,0.4)";
  };

  const indicatorLabel = () => {
    if (ph < 3.8) return { text: "Colourless (acid)", color: "#64b4ff" };
    if (ph < 7.0) return { text: "Orange (near endpoint)", color: "#ff9933" };
    if (ph < 7.5) return { text: "Endpoint! pH = 7.0", color: "#4CAF50" };
    return { text: "Pink (alkaline)", color: "#e080f0" };
  };

  const tick = useCallback(() => {
    if (!running || done) return;
    setBurette((prev) => {
      const next = Math.min(prev + dropRate * 0.25, 50);
      const newPh = 2.1 + (next / 50) * 9.5;
      setPh(Math.min(11.6, newPh));
      if (next >= 50) { setDone(true); setRunning(false); }
      return next;
    });
  }, [running, done, dropRate]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(tick, 80);
    return () => clearInterval(id);
  }, [running, tick]);

  const reset = () => { setBurette(0); setPh(2.1); setDone(false); setRunning(false); };

  const label = indicatorLabel();
  const fillPct = Math.max(0, 100 - (burette / 50) * 100);
  const flaskFill = flaskColor();
  const volUsed = ((burette / 50) * 24.8).toFixed(2);

  return (
    <div className="w-full h-full flex flex-col md:flex-row items-stretch gap-0">
      <div className="flex-1 flex items-center justify-center p-6">
        <svg viewBox="0 0 320 380" className="w-full max-w-xs" fill="none">
          <text x="160" y="22" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="13" fontFamily="Space Grotesk, sans-serif" fontWeight="600">
            {experiment.title}
          </text>

          <rect x="125" y="30" width="70" height="160" rx="5" fill="rgba(100,150,255,0.08)" stroke="rgba(150,200,255,0.4)" strokeWidth="1.5" />
          <rect x="127" y={32} width="66" height={fillPct * 1.56} rx="4" fill="rgba(120,180,255,0.45)" style={{ transition: "height 0.1s" }} />

          {[0, 10, 20, 30, 40, 50].map((mark) => (
            <g key={mark}>
              <line x1="195" y1={32 + mark * 3.12} x2="200" y2={32 + mark * 3.12} stroke="rgba(200,220,255,0.5)" strokeWidth="1" />
              <text x="204" y={36 + mark * 3.12} fill="rgba(200,220,255,0.6)" fontSize="7" fontFamily="monospace">{mark}</text>
            </g>
          ))}

          <text x="160" y="46" textAnchor="middle" fill="rgba(200,220,255,0.8)" fontSize="8" fontFamily="monospace">0 cm³</text>
          <text x="160" y="188" textAnchor="middle" fill="rgba(200,220,255,0.8)" fontSize="8" fontFamily="monospace">50 cm³</text>
          <text x="160" y="204" textAnchor="middle" fill="rgba(150,200,255,0.7)" fontSize="9" fontFamily="monospace">
            NaOH: {burette.toFixed(1)} cm³
          </text>

          <line x1="160" y1="194" x2="160" y2="220" stroke="rgba(120,180,255,0.5)" strokeWidth="2" />
          {running && (
            <circle cx="160" cy="220" r="4" fill="rgba(100,200,255,0.9)" style={{ animation: "bubble 0.8s ease-in-out infinite" }} />
          )}

          <path d="M 100 230 L 130 290 L 190 290 L 220 230 Z" fill={flaskFill} stroke="rgba(150,200,255,0.5)" strokeWidth="1.5" style={{ transition: "fill 0.5s" }} />
          <ellipse cx="160" cy="228" rx="60" ry="10" fill={flaskFill} style={{ transition: "fill 0.5s" }} />
          <ellipse cx="160" cy="291" rx="30" ry="5" fill={flaskFill} opacity="0.6" />

          <rect x="140" y="295" width="40" height="18" rx="4" fill="rgba(30,40,80,0.8)" stroke="rgba(100,200,255,0.3)" />
          <text x="160" y="308" textAnchor="middle" fill={label.color} fontSize="8" fontFamily="monospace" style={{ transition: "fill 0.5s" }}>
            pH {ph.toFixed(1)}
          </text>

          <text x="160" y="340" textAnchor="middle" fill={label.color} fontSize="9" fontFamily="Nunito, sans-serif" fontWeight="600" style={{ transition: "fill 0.5s" }}>
            {label.text}
          </text>

          {ph >= 7.0 && ph <= 7.8 && (
            <text x="160" y="356" textAnchor="middle" fill="#4CAF50" fontSize="10" fontFamily="Space Grotesk" fontWeight="700">
              ✓ Equivalence point reached!
            </text>
          )}
        </svg>
      </div>

      <div className="w-full md:w-56 p-4 space-y-4 border-t md:border-t-0 md:border-l border-white/8 flex flex-col">
        <div className="glass rounded-xl p-3 space-y-2">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Readings</div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Volume NaOH</span>
            <span className="font-mono text-accent">{volUsed} cm³</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">pH</span>
            <span className="font-mono" style={{ color: label.color }}>{ph.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Status</span>
            <span className="font-mono text-xs" style={{ color: label.color, fontSize: 9 }}>
              {ph < 7 ? "Acidic" : ph < 7.5 ? "Neutral" : "Alkaline"}
            </span>
          </div>
        </div>

        <div className="glass rounded-xl p-3 space-y-2">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Drop Rate</div>
          <input type="range" min={1} max={5} value={dropRate} onChange={(e) => setDropRate(Number(e.target.value))} className="w-full accent-primary" />
          <div className="text-xs text-center text-muted-foreground">{dropRate === 1 ? "Slow" : dropRate === 5 ? "Fast" : "Medium"}</div>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => setRunning((r) => !r)}
            disabled={done}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition ${
              running
                ? "bg-destructive/20 text-destructive hover:bg-destructive/30"
                : "bg-gradient-to-r from-primary to-accent text-primary-foreground glow-sm"
            }`}
          >
            {done ? "Complete ✓" : running ? "Pause" : "Add NaOH"}
          </button>
          <button onClick={reset} className="w-full py-2.5 rounded-xl text-sm glass text-muted-foreground hover:text-foreground transition">
            Reset
          </button>
        </div>

        <div className="glass rounded-xl p-3 text-xs text-muted-foreground leading-relaxed flex-1">
          <span className="text-accent font-semibold">AI Tip: </span>
          {ph < 7 ? "Add NaOH slowly near the endpoint to avoid overshooting. Watch for the first permanent colour change." :
           ph < 8 ? "You've reached the equivalence point! Record your titre reading now." :
           "You've gone past the endpoint. The solution is now alkaline. Repeat for accurate results."}
        </div>
      </div>
    </div>
  );
}
