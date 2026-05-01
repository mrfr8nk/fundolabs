import { useEffect, useState } from "react";
import { type Experiment } from "@/data/experiments";

export function OhmsLawSimulation({ experiment }: { slug: string; experiment: Experiment }) {
  const [voltage, setVoltage] = useState(3);
  const [resistance, setResistance] = useState(10);
  const [dataPoints, setDataPoints] = useState<{ v: number; i: number }[]>([]);
  const [recording, setRecording] = useState(false);

  const current = voltage / resistance;
  const power = voltage * current;

  useEffect(() => {
    if (!recording) return;
    const id = setInterval(() => {
      setVoltage((v) => {
        const next = v >= 12 ? 1 : v + 1;
        return next;
      });
    }, 1200);
    return () => clearInterval(id);
  }, [recording]);

  const recordPoint = () => {
    setDataPoints((prev) => [...prev.slice(-9), { v: Number(voltage.toFixed(1)), i: Number(current.toFixed(3)) }]);
  };

  const reset = () => { setDataPoints([]); setVoltage(3); setRecording(false); };

  const electronSpeed = Math.min(current * 8, 40);

  return (
    <div className="w-full h-full flex flex-col md:flex-row items-stretch">
      <div className="flex-1 flex items-center justify-center p-6">
        <svg viewBox="0 0 380 260" className="w-full max-w-md" fill="none">
          <text x="190" y="20" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="13" fontFamily="Space Grotesk" fontWeight="600">
            {experiment.title} — V = IR
          </text>

          <rect x="20" y="70" width="55" height="90" rx="8" fill="rgba(20,40,80,0.8)" stroke="rgba(100,200,255,0.4)" strokeWidth="1.5" />
          <text x="47" y="100" textAnchor="middle" fill="rgba(200,220,255,0.6)" fontSize="8">SUPPLY</text>
          <text x="47" y="118" textAnchor="middle" fill="rgba(100,200,255,1)" fontSize="14" fontFamily="monospace" fontWeight="700">{voltage.toFixed(1)}V</text>
          <text x="47" y="134" textAnchor="middle" fill="rgba(200,220,255,0.5)" fontSize="7">adjustable</text>

          <rect x="155" y="80" width="70" height="40" rx="4" fill="rgba(20,40,80,0.8)" stroke="rgba(150,150,255,0.4)" strokeWidth="1.5" />
          <text x="190" y="98" textAnchor="middle" fill="rgba(150,150,255,0.8)" fontSize="9" fontFamily="monospace">{resistance}Ω</text>
          <text x="190" y="113" textAnchor="middle" fill="rgba(150,150,255,0.5)" fontSize="7">RESISTOR</text>

          <rect x="295" y="65" width="65" height="90" rx="8" fill="rgba(20,40,80,0.8)" stroke="rgba(100,255,150,0.4)" strokeWidth="1.5" />
          <text x="327" y="90" textAnchor="middle" fill="rgba(200,220,255,0.6)" fontSize="7">AMMETER</text>
          <text x="327" y="112" textAnchor="middle" fill="rgba(100,255,150,1)" fontSize="13" fontFamily="monospace" fontWeight="700">{current.toFixed(3)}</text>
          <text x="327" y="128" textAnchor="middle" fill="rgba(100,255,150,0.8)" fontSize="8">A</text>
          <text x="327" y="145" textAnchor="middle" fill="rgba(200,220,255,0.5)" fontSize="7">P={power.toFixed(2)}W</text>

          <line x1="75" y1="100" x2="155" y2="100" stroke="rgba(100,200,255,0.7)" strokeWidth="2.5" />
          <line x1="225" y1="100" x2="295" y2="100" stroke="rgba(100,200,255,0.7)" strokeWidth="2.5" />
          <line x1="360" y1="100" x2="380" y2="100" stroke="rgba(100,200,255,0.7)" strokeWidth="2.5" />
          <line x1="380" y1="100" x2="380" y2="175" stroke="rgba(100,200,255,0.7)" strokeWidth="2.5" />
          <line x1="0" y1="175" x2="380" y2="175" stroke="rgba(100,200,255,0.7)" strokeWidth="2.5" />
          <line x1="0" y1="100" x2="20" y2="100" stroke="rgba(100,200,255,0.7)" strokeWidth="2.5" />
          <line x1="0" y1="100" x2="0" y2="175" stroke="rgba(100,200,255,0.7)" strokeWidth="2.5" />

          {[80, 120, 160, 200, 240, 280, 330].map((x, i) => (
            <circle
              key={i}
              cx={x}
              cy={100}
              r="4"
              fill="rgba(100,200,255,0.9)"
              style={{ animation: `electron-move ${4 / Math.max(electronSpeed, 1) + 0.3}s linear ${i * 0.3}s infinite` }}
            />
          ))}

          <rect x="140" y="85" width="105" height="60" rx="6" fill="none" stroke="rgba(150,100,255,0.3)" strokeWidth="1" strokeDasharray="4 3" />
          <text x="192" y="193" textAnchor="middle" fill="rgba(150,100,255,0.6)" fontSize="8">Voltmeter across resistor</text>
          <text x="192" y="205" textAnchor="middle" fill="rgba(150,100,255,0.9)" fontSize="10" fontFamily="monospace">{voltage.toFixed(1)} V</text>

          <text x="190" y="235" textAnchor="middle" fill="rgba(200,220,255,0.5)" fontSize="9" fontFamily="monospace">
            V = IR → {voltage.toFixed(1)} = {current.toFixed(3)} × {resistance} ✓
          </text>
        </svg>
      </div>

      <div className="w-full md:w-60 p-4 space-y-4 border-t md:border-t-0 md:border-l border-white/8">
        <div className="glass rounded-xl p-3 space-y-3">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Controls</div>
          <div>
            <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Voltage (V)</span><span className="font-mono text-accent">{voltage.toFixed(1)} V</span></div>
            <input type="range" min={1} max={12} step={0.5} value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} className="w-full accent-primary" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Resistance (Ω)</span><span className="font-mono text-accent">{resistance} Ω</span></div>
            <input type="range" min={2} max={50} step={2} value={resistance} onChange={(e) => setResistance(Number(e.target.value))} className="w-full accent-primary" />
          </div>
        </div>

        <div className="glass rounded-xl p-3">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-2">Live Results</div>
          <div className="space-y-1">
            {[
              { label: "Voltage V", value: `${voltage.toFixed(1)} V`, color: "text-accent" },
              { label: "Current I", value: `${current.toFixed(3)} A`, color: "text-green-400" },
              { label: "Resistance R", value: `${resistance} Ω`, color: "text-blue-400" },
              { label: "Power P", value: `${power.toFixed(2)} W`, color: "text-orange-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{label}</span>
                <span className={`font-mono ${color}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-3">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-2">
            Data Table ({dataPoints.length} readings)
          </div>
          <div className="space-y-0.5 max-h-28 overflow-y-auto">
            {dataPoints.length === 0 && <div className="text-xs text-muted-foreground/50">No readings yet</div>}
            {dataPoints.map((d, i) => (
              <div key={i} className="flex justify-between text-[10px] font-mono">
                <span className="text-accent">{d.v}V</span>
                <span className="text-green-400">{d.i}A</span>
                <span className="text-muted-foreground">{(d.v / d.i).toFixed(1)}Ω</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <button onClick={recordPoint} className="w-full py-2.5 rounded-xl text-sm bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold">
            Record Reading
          </button>
          <button onClick={reset} className="w-full py-2 rounded-xl text-sm glass text-muted-foreground hover:text-foreground">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
