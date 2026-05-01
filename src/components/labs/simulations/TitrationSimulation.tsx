import { useEffect, useState, useCallback, useRef } from "react";
import { type Experiment } from "@/data/experiments";

type Point = { v: number; ph: number };

export function TitrationSimulation({ experiment }: { slug: string; experiment: Experiment }) {
  const [burette, setBurette] = useState(0);
  const [ph, setPh] = useState(2.1);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [dropRate, setDropRate] = useState(1);
  const [curve, setCurve] = useState<Point[]>([{ v: 0, ph: 2.1 }]);
  const [showFume, setShowFume] = useState(false);
  const fumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flaskColor = (p: number) => {
    if (p < 4) return "#2d6fcf55";
    if (p < 7.0) return "#f9a82555";
    if (p < 8.2) return "#66bb6a88";
    return "#ce93d8bb";
  };

  const indicatorLabel = (p: number) => {
    if (p < 4) return { text: "Colourless — acidic solution", color: "#64b4ff" };
    if (p < 7.0) return { text: "Pale orange — approaching endpoint", color: "#ffa726" };
    if (p < 8.2) return { text: "Pale pink — ENDPOINT reached!", color: "#69f0ae" };
    return { text: "Deep pink — alkaline (gone past endpoint)", color: "#e040fb" };
  };

  const phToCurveX = (v: number) => 32 + (v / 50) * 200;
  const phToCurveY = (p: number) => 150 - ((p - 1) / 13) * 130;

  const tick = useCallback(() => {
    if (!running || done) return;
    setBurette((prev) => {
      const next = Math.min(prev + dropRate * 0.3, 50);
      const newPh = computePh(next);
      setPh(newPh);
      setCurve((c) => [...c, { v: next, ph: newPh }]);
      if (newPh >= 7.0 && newPh < 8.5) {
        setShowFume(true);
        if (fumeRef.current) clearTimeout(fumeRef.current);
        fumeRef.current = setTimeout(() => setShowFume(false), 2000);
      }
      if (next >= 50) { setDone(true); setRunning(false); }
      return next;
    });
  }, [running, done, dropRate]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(tick, 100);
    return () => clearInterval(id);
  }, [running, tick]);

  const reset = () => {
    setBurette(0); setPh(2.1); setDone(false); setRunning(false);
    setCurve([{ v: 0, ph: 2.1 }]); setShowFume(false);
  };

  function computePh(v: number): number {
    if (v < 22) return 2.1 + (v / 22) * 2.0;
    if (v < 24.5) return 4.1 + ((v - 22) / 2.5) * 1.9;
    if (v < 24.9) return 6.0 + ((v - 24.5) / 0.4) * 1.4;
    if (v < 25.0) return 7.4 + ((v - 24.9) / 0.1) * 2.8;
    if (v < 25.5) return 10.2 + ((v - 25.0) / 0.5) * 1.0;
    return Math.min(11.8, 11.2 + ((v - 25.5) / 24.5) * 0.6);
  }

  const label = indicatorLabel(ph);
  const fillPct = Math.max(0, 100 - (burette / 50) * 100);
  const curvePoints = curve.map((p) => `${phToCurveX(p.v)},${phToCurveY(p.ph)}`).join(" ");
  const volUsed = ((burette / 50) * 24.8).toFixed(2);

  return (
    <div className="w-full h-full flex flex-col md:flex-row items-stretch gap-0 min-h-0">
      <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        <svg viewBox="0 0 560 400" className="w-full h-full" fill="none" style={{ maxHeight: "100%" }}>
          <defs>
            <radialGradient id="fumeGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#b2dfdb" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#b2dfdb" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a1628" />
              <stop offset="100%" stopColor="#0d1f42" />
            </linearGradient>
          </defs>
          <rect width="560" height="400" fill="url(#bgGrad)" rx="12" />

          <text x="280" y="24" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="14" fontFamily="Space Grotesk, sans-serif" fontWeight="700">
            {experiment.title}
          </text>
          <text x="280" y="40" textAnchor="middle" fill="rgba(150,200,255,0.5)" fontSize="9" fontFamily="monospace">
            NaOH + H2SO4 -- Na2SO4 + H2O | Indicator: Phenolphthalein
          </text>

          <rect x="48" y="52" width="54" height="155" rx="5" fill="rgba(40,80,160,0.12)" stroke="rgba(120,180,255,0.45)" strokeWidth="1.5" />
          <rect x="50" y={54} width="50" height={fillPct * 1.51} rx="4"
            fill="rgba(100,160,255,0.5)" style={{ transition: "height 0.1s" }} />
          {[0, 10, 20, 30, 40, 50].map((mark) => (
            <g key={mark}>
              <line x1="102" y1={54 + mark * 3.02} x2="108" y2={54 + mark * 3.02} stroke="rgba(200,220,255,0.5)" strokeWidth="1" />
              <text x="112" y={58 + mark * 3.02} fill="rgba(180,200,255,0.6)" fontSize="7" fontFamily="monospace">{mark}</text>
            </g>
          ))}
          <text x="75" y="46" textAnchor="middle" fill="rgba(180,220,255,0.7)" fontSize="8">Burette</text>
          <text x="75" y="217" textAnchor="middle" fill="rgba(150,200,255,0.8)" fontSize="9" fontFamily="monospace" fontWeight="600">
            {burette.toFixed(1)} cm3
          </text>

          <line x1="75" y1="207" x2="75" y2="232" stroke="rgba(120,180,255,0.6)" strokeWidth="2" />
          {running && (
            <>
              <circle cx="75" cy="233" r="5" fill="rgba(100,180,255,0.9)">
                <animate attributeName="cy" values="233;242;233" dur="0.9s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.2;1" dur="0.9s" repeatCount="indefinite" />
              </circle>
            </>
          )}

          <path d="M 28 255 L 55 325 L 95 325 L 122 255 Z"
            fill={flaskColor(ph)} stroke="rgba(150,200,255,0.6)" strokeWidth="1.5"
            style={{ transition: "fill 0.6s ease" }} />
          <ellipse cx="75" cy="253" rx="47" ry="9" fill={flaskColor(ph)} style={{ transition: "fill 0.6s ease" }} />
          <ellipse cx="75" cy="326" rx="20" ry="4" fill={flaskColor(ph)} opacity="0.7" style={{ transition: "fill 0.6s ease" }} />
          <rect x="65" y="235" width="20" height="18" rx="3" fill="rgba(30,50,100,0.7)" stroke="rgba(150,200,255,0.4)" />
          <text x="75" y="237" textAnchor="middle" fill="rgba(150,200,255,0.7)" fontSize="5">neck</text>

          {showFume && (
            <>
              {[0, 1, 2, 3, 4].map((i) => (
                <ellipse key={i}
                  cx={55 + i * 12} cy={240}
                  rx={8 + i * 3} ry={5 + i * 2}
                  fill="url(#fumeGrad)" opacity="0.7">
                  <animate attributeName="cy" values={`${240};${210 - i * 8};${240}`} dur={`${1.5 + i * 0.3}s`} repeatCount="3" />
                  <animate attributeName="opacity" values="0.7;0;0.7" dur={`${1.5 + i * 0.3}s`} repeatCount="3" />
                </ellipse>
              ))}
            </>
          )}

          <rect x="20" y="335" width="110" height="26" rx="5" fill="rgba(10,20,50,0.9)" stroke={label.color} strokeWidth="1" strokeOpacity="0.5" />
          <text x="75" y="348" textAnchor="middle" fill={label.color} fontSize="9" fontFamily="monospace" fontWeight="700" style={{ transition: "fill 0.6s" }}>
            pH {ph.toFixed(2)}
          </text>
          <text x="75" y="358" textAnchor="middle" fill={label.color} fontSize="7" fontFamily="Nunito, sans-serif" style={{ transition: "fill 0.6s" }}>
            {label.text.split(" — ")[0]}
          </text>

          <rect x="150" y="44" width="244" height="180" rx="8" fill="rgba(10,20,50,0.85)" stroke="rgba(100,150,255,0.25)" strokeWidth="1" />
          <text x="272" y="60" textAnchor="middle" fill="rgba(150,200,255,0.8)" fontSize="9" fontFamily="Space Grotesk" fontWeight="600">
            pH CURVE — Titration Graph
          </text>

          {[1, 3, 5, 7, 9, 11, 13].map((p) => (
            <g key={p}>
              <line x1="32" y1={phToCurveY(p) + 36} x2="242" y2={phToCurveY(p) + 36} stroke="rgba(100,150,255,0.1)" strokeWidth="0.5" transform="translate(118,0)" />
              <text x="152" y={phToCurveY(p) + 40} fill="rgba(150,180,255,0.55)" fontSize="6.5" fontFamily="monospace">{p}</text>
            </g>
          ))}
          <line x1="183" y1="54" x2="183" y2="218" stroke="rgba(120,180,255,0.6)" strokeWidth="1.5" />
          <line x1="183" y1="218" x2="392" y2="218" stroke="rgba(120,180,255,0.6)" strokeWidth="1.5" />
          <text x="287" y="230" textAnchor="middle" fill="rgba(150,200,255,0.6)" fontSize="7.5" fontFamily="Space Grotesk">Volume NaOH (cm3)</text>
          <text x="162" y="138" textAnchor="middle" fill="rgba(150,200,255,0.6)" fontSize="7.5" fontFamily="Space Grotesk" transform="rotate(-90,162,138)">pH</text>

          <line x1={phToCurveX(25) + 118} y1="54" x2={phToCurveX(25) + 118} y2="218" stroke="rgba(100,255,150,0.3)" strokeWidth="1" strokeDasharray="3 3" />
          <text x={phToCurveX(25) + 118} y="50" textAnchor="middle" fill="rgba(100,255,150,0.6)" fontSize="6.5">eq. pt</text>

          {curve.length > 1 && (
            <polyline
              points={curve.map((p) => `${phToCurveX(p.v) + 118},${phToCurveY(p.ph) + 36}`).join(" ")}
              stroke="rgba(100,220,255,0.9)"
              strokeWidth="2"
              fill="none"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}
          {curve.length > 0 && (
            <circle
              cx={phToCurveX(curve[curve.length - 1].v) + 118}
              cy={phToCurveY(curve[curve.length - 1].ph) + 36}
              r="4"
              fill={ph >= 7 ? "#69f0ae" : "#64b4ff"}
            />
          )}

          <rect x="150" y="236" width="244" height="40" rx="6" fill="rgba(10,20,50,0.8)" stroke="rgba(100,150,255,0.2)" strokeWidth="1" />
          <text x="272" y="252" textAnchor="middle" fill="rgba(180,220,255,0.7)" fontSize="8" fontFamily="Space Grotesk">
            Vol NaOH added: {volUsed} cm3 | Vol H2SO4: 25.00 cm3
          </text>
          <text x="272" y="267" textAnchor="middle" fill={label.color} fontSize="8.5" fontFamily="Space Grotesk" fontWeight="600" style={{ transition: "fill 0.6s" }}>
            {label.text}
          </text>

          {ph >= 7.0 && ph < 8.5 && (
            <g>
              <rect x="140" y="284" width="264" height="20" rx="5" fill="rgba(100,255,150,0.15)" stroke="rgba(100,255,150,0.4)" strokeWidth="1" />
              <text x="272" y="298" textAnchor="middle" fill="#69f0ae" fontSize="9" fontFamily="Space Grotesk" fontWeight="700">
                Equivalence Point Reached! Record titre reading now.
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className="w-full md:w-52 p-4 space-y-3 border-t md:border-t-0 md:border-l border-white/8 flex flex-col overflow-y-auto">
        <div className="glass rounded-xl p-3 space-y-2">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Readings</div>
          <Row label="NaOH added" value={`${volUsed} cm3`} color="text-accent" />
          <Row label="pH meter" value={ph.toFixed(2)} color={ph >= 7 ? "text-green-400" : "text-blue-400"} />
          <Row label="Burette" value={`${burette.toFixed(1)} / 50.0 cm3`} color="text-orange-400" />
          <Row label="Status" value={ph < 7 ? "Acidic" : ph < 7.5 ? "At endpoint" : "Alkaline"} color={ph < 7 ? "text-blue-400" : ph < 8 ? "text-green-400" : "text-purple-400"} />
        </div>

        <div className="glass rounded-xl p-3 space-y-2">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Drop Rate</div>
          <input type="range" min={1} max={6} value={dropRate} onChange={(e) => setDropRate(Number(e.target.value))} className="w-full accent-primary" />
          <div className="text-xs text-center text-muted-foreground">{dropRate <= 2 ? "Slow (near endpoint)" : dropRate <= 4 ? "Medium" : "Fast (rough titre)"}</div>
        </div>

        <div className="glass rounded-xl p-3 text-[10px] text-muted-foreground space-y-1">
          <div className="text-accent font-semibold text-xs mb-1">Colour Guide</div>
          <div className="flex items-center gap-2"><div className="h-3 w-6 rounded" style={{ background: "#2d6fcf55", border: "1px solid #64b4ff" }} /><span>Colourless (acid)</span></div>
          <div className="flex items-center gap-2"><div className="h-3 w-6 rounded" style={{ background: "#f9a82555", border: "1px solid #ffa726" }} /><span>Orange (near ep.)</span></div>
          <div className="flex items-center gap-2"><div className="h-3 w-6 rounded" style={{ background: "#66bb6a88", border: "1px solid #69f0ae" }} /><span>Pale pink (endpoint)</span></div>
          <div className="flex items-center gap-2"><div className="h-3 w-6 rounded" style={{ background: "#ce93d8bb", border: "1px solid #e040fb" }} /><span>Deep pink (past ep.)</span></div>
        </div>

        <div className="space-y-2 mt-auto">
          <button
            onClick={() => setRunning((r) => !r)}
            disabled={done}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition ${
              done ? "bg-green-500/20 text-green-400" : running
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                : "bg-gradient-to-r from-primary to-accent text-primary-foreground glow-sm"
            }`}
          >
            {done ? "Titration Complete!" : running ? "Pause NaOH" : "Add NaOH Drop by Drop"}
          </button>
          <button onClick={reset} className="w-full py-2 rounded-xl text-sm glass text-muted-foreground hover:text-foreground transition">
            Reset Experiment
          </button>
        </div>

        <div className="glass rounded-xl p-3 text-[10px] text-muted-foreground leading-relaxed">
          <span className="text-accent font-semibold">AI Tip: </span>
          {ph < 5 ? "Add NaOH quickly at first when well below the endpoint." :
           ph < 6.5 ? "Slow down now! Add NaOH dropwise. Watch for colour change." :
           ph < 7.5 ? "Stop! The endpoint is here. Record your titre. Concordant results need 3 readings within 0.10 cm3." :
           "You overshot the endpoint. Discard and repeat from the beginning."}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-mono ${color}`}>{value}</span>
    </div>
  );
}
