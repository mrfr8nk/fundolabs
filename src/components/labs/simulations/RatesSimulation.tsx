import { useEffect, useState, useCallback } from "react";
import { type Experiment } from "@/data/experiments";

type DataPoint = { t: number; vol: number };

export function RatesSimulation({ experiment }: { slug: string; experiment: Experiment }) {
  const [temperature, setTemperature] = useState(25);
  const [concentration, setConcentration] = useState(1.0);
  const [surfaceArea, setSurfaceArea] = useState<"lumps" | "powder">("lumps");
  const [catalyst, setCatalyst] = useState(false);
  const [running, setRunning] = useState(false);
  const [gasVol, setGasVol] = useState(0);
  const [time, setTime] = useState(0);
  const [data, setData] = useState<DataPoint[]>([]);
  const [bubbles, setBubbles] = useState<{ x: number; y: number; r: number; id: number }[]>([]);

  const maxGas = 80;

  const rateMultiplier = () => {
    let r = 1;
    r *= Math.pow(2, (temperature - 25) / 10);
    r *= concentration;
    if (surfaceArea === "powder") r *= 3;
    if (catalyst) r *= 2.5;
    return r;
  };

  const tick = useCallback(() => {
    if (!running) return;
    const rate = rateMultiplier() * 0.4;
    setGasVol((prev) => {
      const next = Math.min(prev + rate, maxGas);
      if (next >= maxGas) setRunning(false);
      return next;
    });
    setTime((prev) => {
      const next = prev + 0.1;
      setData((d) => [...d, { t: next, vol: Math.min(gasVol + rate, maxGas) }]);
      return next;
    });
    const bub = Math.random();
    if (bub > 0.6) {
      setBubbles((prev) => [
        ...prev.slice(-12),
        { x: 200 + (Math.random() - 0.5) * 60, y: 260, r: 2 + Math.random() * 4, id: Date.now() + Math.random() },
      ]);
    }
  }, [running, temperature, concentration, surfaceArea, catalyst, gasVol]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(tick, 100);
    return () => clearInterval(id);
  }, [running, tick]);

  const reset = () => {
    setRunning(false); setGasVol(0); setTime(0); setData([]); setBubbles([]);
  };

  const graphW = 200, graphH = 100;
  const gx = (t: number) => 8 + (t / Math.max(time + 1, 20)) * (graphW - 16);
  const gy = (v: number) => graphH - 8 - (v / maxGas) * (graphH - 16);

  const marbleColor = gasVol > 40 ? "rgba(180,220,255,0.6)" : "rgba(220,200,180,0.7)";

  return (
    <div className="w-full h-full flex flex-col md:flex-row items-stretch min-h-0">
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <svg viewBox="0 0 500 370" className="w-full h-full" fill="none" style={{ maxHeight: "100%" }}>
          <defs>
            <linearGradient id="rateBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#07101e" /><stop offset="100%" stopColor="#0a1a35" />
            </linearGradient>
            <radialGradient id="acidGrad" cx="50%" cy="80%" r="60%">
              <stop offset="0%" stopColor="rgba(200,230,255,0.15)" /><stop offset="100%" stopColor="rgba(100,150,255,0.05)" />
            </radialGradient>
          </defs>
          <rect width="500" height="370" fill="url(#rateBg)" rx="12" />
          <text x="250" y="22" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="13" fontFamily="Space Grotesk" fontWeight="700">
            {experiment?.title || "Rates of Reaction — CaCO3 + HCl"}
          </text>
          <text x="250" y="37" textAnchor="middle" fill="rgba(150,200,255,0.5)" fontSize="8" fontFamily="monospace">
            CaCO3 + 2HCl -- CaCl2 + H2O + CO2 | Collect gas over water
          </text>

          <rect x="155" y="185" width="90" height="105" rx="6" fill="url(#acidGrad)" stroke="rgba(100,200,255,0.4)" strokeWidth="1.5" />
          <rect x="157" y={270 - concentration * 20} width="86" height={concentration * 30 + 20}
            fill="rgba(100,200,255,0.15)" />
          {surfaceArea === "lumps"
            ? [0, 1, 2, 3, 4].map((i) => (
              <ellipse key={i} cx={175 + (i % 3) * 20} cy={220 + Math.floor(i / 3) * 15} rx="8" ry="6" fill={marbleColor} stroke="rgba(180,200,220,0.5)" strokeWidth="1" />
            ))
            : [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <rect key={i} x={162 + (i % 3) * 18} y={215 + Math.floor(i / 3) * 12} width="6" height="6" rx="1" fill={marbleColor} opacity="0.8" />
            ))
          }
          <text x="200" y="180" textAnchor="middle" fill="rgba(150,200,255,0.6)" fontSize="7.5">Flask (CaCO3 + HCl)</text>

          {bubbles.map((b) => (
            <circle key={b.id} cx={b.x} cy={b.y} r={b.r} fill="rgba(200,240,255,0.6)" opacity="0.7">
              <animate attributeName="cy" values={`${b.y};${b.y - 60}`} dur="1.2s" fill="freeze" />
              <animate attributeName="opacity" values="0.7;0" dur="1.2s" fill="freeze" />
            </circle>
          ))}

          <line x1="200" y1="185" x2="200" y2="155" stroke="rgba(200,220,255,0.5)" strokeWidth="2" />
          <line x1="200" y1="155" x2="310" y2="155" stroke="rgba(200,220,255,0.5)" strokeWidth="2" />
          <line x1="310" y1="155" x2="310" y2="130" stroke="rgba(200,220,255,0.5)" strokeWidth="2" />

          <rect x="290" y="100" width="80" height="110" rx="6" fill="rgba(10,30,60,0.8)" stroke="rgba(100,200,255,0.4)" strokeWidth="1.5" />
          <text x="330" y="116" textAnchor="middle" fill="rgba(150,200,255,0.6)" fontSize="7.5">Gas syringe</text>
          <rect x="296" y="122" width={68 * (gasVol / maxGas)} height="68" rx="3" fill="rgba(200,240,255,0.2)" style={{ transition: "width 0.1s" }} />
          <rect x="296" y="122" width="68" height="68" rx="3" fill="none" stroke="rgba(100,180,255,0.3)" strokeWidth="1" />
          <text x="330" y="172" textAnchor="middle" fill="rgba(100,220,255,0.9)" fontSize="12" fontFamily="monospace" fontWeight="700">{gasVol.toFixed(1)}</text>
          <text x="330" y="185" textAnchor="middle" fill="rgba(150,200,255,0.6)" fontSize="7.5">cm3 CO2</text>
          <text x="330" y="197" textAnchor="middle" fill="rgba(150,200,255,0.5)" fontSize="7" fontFamily="monospace">
            Rate: {running ? (rateMultiplier() * 4).toFixed(1) : "0.0"} cm3/s
          </text>

          <rect x="10" y="218" width={graphW + 26} height={graphH + 38} rx="8" fill="rgba(10,20,50,0.85)" stroke="rgba(100,150,255,0.25)" strokeWidth="1" />
          <text x={10 + graphW / 2 + 13} y="234" textAnchor="middle" fill="rgba(150,200,255,0.8)" fontSize="8.5" fontFamily="Space Grotesk" fontWeight="600">Gas Volume vs Time</text>
          <line x1="18" y1={224 + graphH} x2={18 + graphW} y2={224 + graphH} stroke="rgba(150,200,255,0.5)" strokeWidth="1" />
          <line x1="18" y1="238" x2="18" y2={224 + graphH} stroke="rgba(150,200,255,0.5)" strokeWidth="1" />
          <text x={18 + graphW / 2} y={224 + graphH + 14} textAnchor="middle" fill="rgba(150,200,255,0.5)" fontSize="6.5">Time (s)</text>
          <text x="8" y={224 + graphH / 2} textAnchor="middle" fill="rgba(150,200,255,0.5)" fontSize="6.5" transform={`rotate(-90,8,${224 + graphH / 2})`}>Vol (cm3)</text>
          {data.length > 1 && (
            <polyline
              points={data.map((p) => `${18 + gx(p.t)},${238 + gy(p.vol)}`).join(" ")}
              stroke="rgba(100,220,255,0.85)" strokeWidth="1.5" fill="none"
            />
          )}

          <rect x="10" y="52" width="220" height="155" rx="8" fill="rgba(10,20,50,0.85)" stroke="rgba(100,150,255,0.25)" strokeWidth="1" />
          <text x="120" y="68" textAnchor="middle" fill="rgba(150,200,255,0.8)" fontSize="8.5" fontFamily="Space Grotesk" fontWeight="600">Factors Affecting Rate</text>
          {[
            { label: "Temperature", value: `${temperature} C`, color: "#ffa726", note: temperature > 35 ? "faster" : temperature < 20 ? "slower" : "normal" },
            { label: "Concentration", value: `${concentration.toFixed(1)} mol/dm3`, color: "#64b4ff", note: concentration > 1.5 ? "faster" : "normal" },
            { label: "Surface area", value: surfaceArea === "powder" ? "Powder (large)" : "Lumps (small)", color: "#69f0ae", note: surfaceArea === "powder" ? "much faster" : "slower" },
            { label: "Catalyst", value: catalyst ? "MnO2 added" : "None", color: "#ce93d8", note: catalyst ? "faster" : "none" },
          ].map(({ label, value, color, note }, i) => (
            <g key={label}>
              <text x="20" y={84 + i * 28} fill="rgba(150,180,255,0.6)" fontSize="8" fontFamily="Space Grotesk">{label}</text>
              <text x="20" y={96 + i * 28} fill={color} fontSize="9" fontFamily="monospace" fontWeight="600">{value}</text>
              <text x="200" y={96 + i * 28} textAnchor="end" fill="rgba(100,255,150,0.6)" fontSize="7">{note}</text>
            </g>
          ))}

          <text x="120" y="200" textAnchor="middle" fill="rgba(150,200,255,0.7)" fontSize="8" fontFamily="monospace">
            Rate multiplier: x{rateMultiplier().toFixed(2)} vs baseline
          </text>
        </svg>
      </div>

      <div className="w-full md:w-52 p-4 space-y-3 border-t md:border-t-0 md:border-l border-white/8 flex flex-col overflow-y-auto">
        <div className="glass rounded-xl p-3 space-y-3">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Variables</div>
          <div>
            <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Temperature</span><span className="font-mono text-orange-400">{temperature} C</span></div>
            <input type="range" min={10} max={70} step={5} value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} className="w-full accent-primary" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">HCl Conc.</span><span className="font-mono text-blue-400">{concentration.toFixed(1)} mol/dm3</span></div>
            <input type="range" min={0.5} max={3} step={0.5} value={concentration} onChange={(e) => setConcentration(Number(e.target.value))} className="w-full accent-primary" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setSurfaceArea("lumps")} className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${surfaceArea === "lumps" ? "bg-primary/40 text-primary-foreground" : "glass text-muted-foreground"}`}>Lumps</button>
            <button onClick={() => setSurfaceArea("powder")} className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${surfaceArea === "powder" ? "bg-primary/40 text-primary-foreground" : "glass text-muted-foreground"}`}>Powder</button>
          </div>
          <button onClick={() => setCatalyst((c) => !c)} className={`w-full py-1.5 rounded-lg text-xs font-semibold transition ${catalyst ? "bg-purple-500/30 text-purple-300" : "glass text-muted-foreground"}`}>
            {catalyst ? "Catalyst: MnO2 ADDED" : "Add Catalyst (MnO2)"}
          </button>
        </div>

        <div className="glass rounded-xl p-3 space-y-1">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-1">Readings</div>
          <Row label="CO2 collected" value={`${gasVol.toFixed(1)} cm3`} color="text-accent" />
          <Row label="Time" value={`${time.toFixed(1)} s`} color="text-blue-400" />
          <Row label="Rate multiplier" value={`x${rateMultiplier().toFixed(2)}`} color="text-green-400" />
          <Row label="Data points" value={String(data.length)} color="text-purple-400" />
        </div>

        <div className="space-y-2 mt-auto">
          <button onClick={() => running ? setRunning(false) : setRunning(true)}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition ${
              running ? "bg-red-500/20 text-red-400" : "bg-gradient-to-r from-primary to-accent text-primary-foreground glow-sm"
            }`}>
            {running ? "Pause Reaction" : "Start Reaction"}
          </button>
          <button onClick={reset} className="w-full py-2 rounded-xl text-sm glass text-muted-foreground hover:text-foreground transition">
            Reset
          </button>
        </div>

        <div className="glass rounded-xl p-3 text-[10px] text-muted-foreground leading-relaxed">
          <span className="text-accent font-semibold">AI Tip: </span>
          Change ONE variable at a time (fair test). Steeper graph = faster rate. The curve flattens when a reactant is used up. Use 1/time as a measure of rate.
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
