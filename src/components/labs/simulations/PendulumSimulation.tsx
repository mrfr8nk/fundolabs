import { useEffect, useState, useRef, useCallback } from "react";
import { type Experiment } from "@/data/experiments";

export function PendulumSimulation({ experiment }: { slug: string; experiment: Experiment }) {
  const [length, setLength] = useState(0.5);
  const [angle, setAngle] = useState(0);
  const [running, setRunning] = useState(false);
  const [dataPoints, setDataPoints] = useState<{ L: number; T: number; Tsq: number }[]>([]);
  const [oscillations, setOscillations] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const animRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const prevAngle = useRef<number>(0);
  const oscCount = useRef<number>(0);

  const g = 9.81;
  const T = 2 * Math.PI * Math.sqrt(length / g);

  const tick = useCallback((now: number) => {
    if (!running) return;
    const t = (now - startRef.current) / 1000;
    setElapsed(t);
    const omega = (2 * Math.PI) / T;
    const newAngle = (15 * Math.PI / 180) * Math.cos(omega * t);
    if (prevAngle.current > 0 && newAngle <= 0) {
      oscCount.current += 1;
      setOscillations(Math.floor(oscCount.current / 2));
    }
    prevAngle.current = newAngle;
    setAngle(newAngle);
    animRef.current = requestAnimationFrame(tick);
  }, [running, T]);

  useEffect(() => {
    if (!running) return;
    startRef.current = performance.now();
    prevAngle.current = 0;
    oscCount.current = 0;
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [running, tick]);

  const stop = () => { setRunning(false); cancelAnimationFrame(animRef.current); };
  const reset = () => { stop(); setAngle(0); setElapsed(0); setOscillations(0); };

  const recordPoint = () => {
    if (oscillations < 1) return;
    const measT = elapsed / oscillations;
    setDataPoints((prev) => [...prev, { L: length, T: measT, Tsq: measT * measT }].sort((a, b) => a.L - b.L));
  };

  const pivotX = 180, pivotY = 60;
  const bobX = pivotX + Math.sin(angle) * (length * 190);
  const bobY = pivotY + Math.cos(angle) * (length * 190);

  const maxL = 1.5;
  const graphW = 160, graphH = 100;
  const gx = (l: number) => 8 + (l / maxL) * (graphW - 16);
  const gy = (t: number) => graphH - 8 - (t / ((4 * Math.PI * Math.PI * maxL) / g)) * (graphH - 16);
  const expectedGrad = (4 * Math.PI * Math.PI) / g;

  return (
    <div className="w-full h-full flex flex-col md:flex-row items-stretch min-h-0">
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <svg viewBox="0 0 490 390" className="w-full h-full" fill="none" style={{ maxHeight: "100%" }}>
          <defs>
            <radialGradient id="bobGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#64b4ff" /><stop offset="100%" stopColor="#1a4fa0" />
            </radialGradient>
            <linearGradient id="pendBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a1628" /><stop offset="100%" stopColor="#0d1f42" />
            </linearGradient>
          </defs>
          <rect width="490" height="390" fill="url(#pendBg)" rx="12" />
          <text x="245" y="22" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="13" fontFamily="Space Grotesk" fontWeight="700">
            {experiment.title}
          </text>
          <text x="245" y="37" textAnchor="middle" fill="rgba(150,200,255,0.5)" fontSize="8.5" fontFamily="monospace">
            T = 2pi * sqrt(L/g) | g = 9.81 m/s2
          </text>

          <line x1="80" y1="52" x2="280" y2="52" stroke="rgba(150,200,255,0.5)" strokeWidth="3" />
          <rect x="170" y="44" width="20" height="16" rx="3" fill="rgba(150,200,255,0.3)" stroke="rgba(150,200,255,0.5)" strokeWidth="1" />

          <line x1={pivotX} y1={pivotY} x2={bobX} y2={bobY} stroke="rgba(200,220,255,0.7)" strokeWidth="1.5" />
          <circle cx={bobX} cy={bobY} r="13" fill="url(#bobGrad)" stroke="rgba(100,180,255,0.6)" strokeWidth="1.5" />

          <line x1={pivotX} y1={pivotY} x2={pivotX} y2={pivotY + length * 190 + 20}
            stroke="rgba(100,200,255,0.12)" strokeWidth="1" strokeDasharray="4 4" />
          <text x={pivotX + 14} y={pivotY + (length * 95) + 10} fill="rgba(150,200,255,0.7)" fontSize="9" fontFamily="Space Grotesk">
            L = {length.toFixed(2)} m
          </text>

          <rect x="8" y={pivotY + length * 190 + 32} width="280" height="52" rx="6" fill="rgba(10,20,50,0.85)" stroke="rgba(100,150,255,0.2)" strokeWidth="1" />
          <text x="148" y={pivotY + length * 190 + 48} textAnchor="middle" fill="rgba(150,200,255,0.7)" fontSize="8" fontFamily="monospace">
            T (theory)={T.toFixed(3)} s | T (measured)={oscillations > 0 ? (elapsed / oscillations).toFixed(3) : "—"} s
          </text>
          <text x="148" y={pivotY + length * 190 + 62} textAnchor="middle" fill="rgba(100,255,180,0.8)" fontSize="8" fontFamily="monospace">
            Oscillations: {oscillations} | Time: {elapsed.toFixed(1)} s
          </text>
          <text x="148" y={pivotY + length * 190 + 74} textAnchor="middle" fill="rgba(200,200,255,0.6)" fontSize="7.5" fontFamily="monospace">
            g (calc.) = {oscillations > 1 ? (4 * Math.PI * Math.PI * length / Math.pow(elapsed / oscillations, 2)).toFixed(3) : "9.81"} m/s2
          </text>

          <rect x="298" y="44" width={graphW + 24} height={graphH + 44} rx="8" fill="rgba(10,20,50,0.85)" stroke="rgba(100,150,255,0.25)" strokeWidth="1" />
          <text x={298 + graphW / 2 + 12} y="60" textAnchor="middle" fill="rgba(150,200,255,0.8)" fontSize="8.5" fontFamily="Space Grotesk" fontWeight="600">T2 vs L Graph</text>
          <line x1="306" y1={50 + graphH} x2={306 + graphW} y2={50 + graphH} stroke="rgba(150,200,255,0.5)" strokeWidth="1" />
          <line x1="306" y1="64" x2="306" y2={50 + graphH} stroke="rgba(150,200,255,0.5)" strokeWidth="1" />
          <text x={306 + graphW / 2} y={50 + graphH + 16} textAnchor="middle" fill="rgba(150,200,255,0.5)" fontSize="6.5">L (m)</text>
          <text x="290" y={50 + graphH / 2} textAnchor="middle" fill="rgba(150,200,255,0.5)" fontSize="6.5" transform={`rotate(-90,290,${50 + graphH / 2})`}>T2 (s2)</text>
          <line x1="306" y1={50 + graphH} x2={306 + gx(maxL)} y2={50 + gy(expectedGrad * maxL)} stroke="rgba(100,255,150,0.25)" strokeWidth="1" strokeDasharray="3 3" />
          {dataPoints.map((p, i) => (
            <circle key={i} cx={306 + gx(p.L)} cy={50 + gy(p.Tsq)} r="4" fill="rgba(100,220,255,0.9)" />
          ))}
          {dataPoints.length > 1 && (
            <polyline
              points={dataPoints.map((p) => `${306 + gx(p.L)},${50 + gy(p.Tsq)}`).join(" ")}
              stroke="rgba(100,220,255,0.7)" strokeWidth="1.5" fill="none"
            />
          )}
          {dataPoints.length > 1 && (
            <text x={306 + graphW / 2} y={50 + graphH + 28} textAnchor="middle" fill="rgba(100,255,180,0.7)" fontSize="6.5" fontFamily="monospace">
              gradient = {(dataPoints[dataPoints.length - 1].Tsq / dataPoints[dataPoints.length - 1].L).toFixed(3)} | g = {(4 * Math.PI * Math.PI / (dataPoints[dataPoints.length - 1].Tsq / dataPoints[dataPoints.length - 1].L)).toFixed(3)} m/s2
            </text>
          )}

          <rect x="298" y={50 + graphH + 36} width={graphW + 24} height="100" rx="6" fill="rgba(10,20,50,0.7)" stroke="rgba(100,150,255,0.15)" strokeWidth="1" />
          <text x="310" y={50 + graphH + 52} fill="rgba(150,200,255,0.7)" fontSize="7.5" fontFamily="Space Grotesk" fontWeight="600">Results Table</text>
          <text x="310" y={50 + graphH + 64} fill="rgba(150,200,255,0.4)" fontSize="6.5" fontFamily="monospace">L(m)   T(s)   T2(s2)</text>
          {dataPoints.slice(-5).map((p, i) => (
            <text key={i} x="310" y={50 + graphH + 76 + i * 12} fill="rgba(100,200,255,0.8)" fontSize="6.5" fontFamily="monospace">
              {p.L.toFixed(2)}   {p.T.toFixed(3)}   {p.Tsq.toFixed(3)}
            </text>
          ))}
        </svg>
      </div>

      <div className="w-full md:w-52 p-4 space-y-3 border-t md:border-t-0 md:border-l border-white/8 flex flex-col overflow-y-auto">
        <div className="glass rounded-xl p-3 space-y-2">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Controls</div>
          <div>
            <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Length L</span><span className="font-mono text-accent">{length.toFixed(2)} m</span></div>
            <input type="range" min={0.1} max={1.5} step={0.05} value={length} onChange={(e) => { setLength(Number(e.target.value)); reset(); }} className="w-full accent-primary" />
          </div>
          <div className="text-xs text-muted-foreground/60">Change length, run, record point, repeat for 5+ lengths.</div>
        </div>

        <div className="glass rounded-xl p-3 space-y-1">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-1">Readings</div>
          <Row label="L" value={`${length.toFixed(2)} m`} color="text-accent" />
          <Row label="T (theory)" value={`${T.toFixed(3)} s`} color="text-green-400" />
          <Row label="T (measured)" value={oscillations > 0 ? `${(elapsed / oscillations).toFixed(3)} s` : "—"} color="text-blue-400" />
          <Row label="g (calc.)" value={oscillations > 1 ? `${(4 * Math.PI * Math.PI * length / Math.pow(elapsed / oscillations, 2)).toFixed(3)}` : "—"} color="text-orange-400" />
          <Row label="Oscillations" value={String(oscillations)} color="text-purple-400" />
        </div>

        <div className="space-y-2 mt-auto">
          <button onClick={() => running ? stop() : setRunning(true)}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition ${
              running ? "bg-red-500/20 text-red-400" : "bg-gradient-to-r from-primary to-accent text-primary-foreground glow-sm"
            }`}>
            {running ? "Stop" : "Release Pendulum"}
          </button>
          <button onClick={recordPoint} disabled={oscillations < 1}
            className="w-full py-2 rounded-xl text-sm glass text-accent hover:text-foreground transition font-semibold disabled:opacity-40">
            Record T for L = {length.toFixed(2)} m
          </button>
          <button onClick={reset} className="w-full py-2 rounded-xl text-sm glass text-muted-foreground hover:text-foreground transition">
            Reset
          </button>
        </div>

        <div className="glass rounded-xl p-3 text-[10px] text-muted-foreground leading-relaxed">
          <span className="text-accent font-semibold">AI Tip: </span>
          Time at least 20 oscillations for accuracy. T is independent of mass and amplitude (for small angles). Plot T2 vs L: gradient = 4pi2/g.
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
