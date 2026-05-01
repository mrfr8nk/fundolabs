import { useEffect, useState, useRef } from "react";
import { type Experiment } from "@/data/experiments";

export function PendulumSimulation({ experiment }: { slug: string; experiment: Experiment }) {
  const [length, setLength] = useState(1.0);
  const [running, setRunning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [oscillations, setOscillations] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [readings, setReadings] = useState<{ L: number; T: number }[]>([]);
  const timeRef = useRef(0);
  const startRef = useRef(0);
  const dirRef = useRef(1);
  const countRef = useRef(0);

  const g = 9.81;
  const T_theory = 2 * Math.PI * Math.sqrt(length / g);

  useEffect(() => {
    if (!running) return;
    startRef.current = Date.now() - elapsed * 1000;
    const id = setInterval(() => {
      const t = (Date.now() - startRef.current) / 1000;
      timeRef.current = t;
      setElapsed(t);
      const omega = Math.sqrt(g / length);
      const newAngle = 20 * Math.cos(omega * t);
      if (newAngle * dirRef.current < 0) {
        dirRef.current *= -1;
        countRef.current += 0.5;
        setOscillations(Math.floor(countRef.current));
      }
      setAngle(newAngle);
    }, 20);
    return () => clearInterval(id);
  }, [running, length]);

  const recordReading = () => {
    if (oscillations >= 10) {
      const T = elapsed / oscillations;
      setReadings((prev) => [...prev.slice(-5), { L: length, T: Number(T.toFixed(3)) }]);
    }
  };

  const reset = () => {
    setRunning(false);
    setAngle(0);
    setOscillations(0);
    setElapsed(0);
    countRef.current = 0;
    dirRef.current = 1;
  };

  const rad = (angle * Math.PI) / 180;
  const px = 180 + 130 * Math.sin(rad);
  const py = 60 + 130 * Math.cos(rad);

  return (
    <div className="w-full h-full flex flex-col md:flex-row items-stretch">
      <div className="flex-1 flex items-center justify-center p-4">
        <svg viewBox="0 0 360 280" className="w-full max-w-sm" fill="none">
          <text x="180" y="18" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="13" fontFamily="Space Grotesk" fontWeight="600">
            {experiment.title}
          </text>

          <rect x="60" y="30" width="240" height="12" rx="4" fill="rgba(40,60,120,0.8)" stroke="rgba(100,150,255,0.4)" strokeWidth="1" />

          <path d={`M 60 36 Q ${(180 + px) / 2} ${(36 + py) / 2} ${px} ${py}`} stroke="rgba(100,150,255,0.15)" strokeWidth="1" fill="none" strokeDasharray="3 4" />
          <path d={`M 300 36 Q ${(180 + px) / 2} ${(36 + py) / 2} ${px} ${py}`} stroke="rgba(100,150,255,0.15)" strokeWidth="1" fill="none" strokeDasharray="3 4" />

          <line x1="180" y1="42" x2={px} y2={py} stroke="rgba(200,220,255,0.8)" strokeWidth="2" />
          <circle cx="180" cy="42" r="5" fill="rgba(100,150,255,0.9)" />

          <circle cx={px} cy={py} r="20" fill="rgba(20,40,80,0.9)" stroke="rgba(100,200,255,0.5)" strokeWidth="2" />
          <text x={px} y={py + 4} textAnchor="middle" fill="rgba(100,200,255,0.9)" fontSize="7" fontFamily="monospace">200g</text>

          <line x1="130" y1="42" x2="130" y2={42 + length * 120} stroke="rgba(100,150,255,0.3)" strokeWidth="1" strokeDasharray="3 3" />
          <text x="112" y={42 + length * 60} fill="rgba(100,150,255,0.7)" fontSize="8" fontFamily="monospace">L={length.toFixed(2)}m</text>

          <text x="180" y="240" textAnchor="middle" fill="rgba(200,220,255,0.5)" fontSize="8" fontFamily="monospace">
            θ = {angle.toFixed(1)}°    T_theory = {T_theory.toFixed(2)} s
          </text>

          <rect x="240" y="175" width="110" height="75" rx="8" fill="rgba(20,40,80,0.8)" stroke="rgba(100,150,255,0.25)" strokeWidth="1" />
          <text x="295" y="196" textAnchor="middle" fill="rgba(200,220,255,0.5)" fontSize="8" fontFamily="monospace">READINGS</text>
          <text x="295" y="212" textAnchor="middle" fill="rgba(100,255,150,0.9)" fontSize="11" fontFamily="monospace">{oscillations}</text>
          <text x="295" y="224" textAnchor="middle" fill="rgba(200,220,255,0.5)" fontSize="7" fontFamily="monospace">oscillations</text>
          <text x="295" y="239" textAnchor="middle" fill="rgba(100,200,255,0.9)" fontSize="10" fontFamily="monospace">{elapsed.toFixed(1)} s</text>
        </svg>
      </div>

      <div className="w-full md:w-60 p-4 space-y-3 border-t md:border-t-0 md:border-l border-white/8">
        <div className="glass rounded-xl p-3">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-2">Length Control</div>
          <input type="range" min={0.2} max={1.5} step={0.1} value={length} onChange={(e) => { setLength(Number(e.target.value)); reset(); }} className="w-full accent-primary" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>20 cm</span><span className="text-accent font-mono">{(length * 100).toFixed(0)} cm</span><span>150 cm</span>
          </div>
        </div>

        <div className="glass rounded-xl p-3 space-y-1">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-1">Theoretical</div>
          <div className="flex justify-between text-xs"><span className="text-muted-foreground">T = 2π√(L/g)</span></div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Period T</span>
            <span className="font-mono text-accent">{T_theory.toFixed(3)} s</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Frequency f</span>
            <span className="font-mono text-accent">{(1 / T_theory).toFixed(3)} Hz</span>
          </div>
        </div>

        <div className="glass rounded-xl p-3">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-2">Recorded Data</div>
          <div className="space-y-0.5 max-h-24 overflow-y-auto">
            {readings.length === 0 && <div className="text-[10px] text-muted-foreground/50">No readings recorded</div>}
            {readings.map((r, i) => (
              <div key={i} className="flex justify-between text-[10px] font-mono">
                <span className="text-accent">L={r.L.toFixed(1)}m</span>
                <span className="text-green-400">T={r.T.toFixed(3)}s</span>
                <span className="text-blue-400">T²={(r.T * r.T).toFixed(3)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <button onClick={() => setRunning((r) => !r)} className={`w-full py-2.5 rounded-xl text-sm font-semibold ${running ? "bg-orange-500/20 text-orange-400" : "bg-gradient-to-r from-primary to-accent text-primary-foreground glow-sm"}`}>
            {running ? "Pause" : "Release Pendulum"}
          </button>
          <button onClick={recordReading} disabled={oscillations < 10} className="w-full py-2.5 rounded-xl text-sm glass text-muted-foreground hover:text-foreground disabled:opacity-40">
            Record T ({oscillations < 10 ? `${10 - oscillations} more` : "ready!"})
          </button>
          <button onClick={reset} className="w-full py-2 rounded-xl text-xs glass text-muted-foreground/70 hover:text-muted-foreground">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
