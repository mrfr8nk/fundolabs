import { useEffect, useState, useCallback } from "react";
import { type Experiment } from "@/data/experiments";

type Point = { v: number; i: number };

export function OhmsLawSimulation({ slug, experiment }: { slug: string; experiment: Experiment }) {
  const [voltage, setVoltage] = useState(3);
  const [resistance, setResistance] = useState(10);
  const [dataPoints, setDataPoints] = useState<Point[]>([]);
  const [autoSweep, setAutoSweep] = useState(false);
  const [component, setComponent] = useState<"resistor" | "led" | "ldr" | "buzzer">("led");

  const current = voltage / resistance;
  const power = voltage * current;

  const ledBrightness = Math.min(1, (voltage / 12) * 1.2);
  const ledColor = (() => {
    if (component === "led") return `rgba(100,255,100,${ledBrightness})`;
    if (component === "ldr") return `rgba(255,220,60,${Math.min(1, voltage / 8)})`;
    if (component === "buzzer") return `rgba(255,100,100,${voltage > 3 ? 0.9 : 0.2})`;
    return `rgba(150,180,255,${ledBrightness * 0.7})`;
  })();
  const glowStrength = Math.round(ledBrightness * 18);

  const graphW = 200, graphH = 130;
  const maxV = 12, maxI = maxV / 2;
  const ptX = (v: number) => 10 + (v / maxV) * (graphW - 20);
  const ptY = (i: number) => graphH - 10 - (i / maxI) * (graphH - 20);

  const recordPoint = useCallback(() => {
    setDataPoints((prev) => {
      const exists = prev.find((p) => Math.abs(p.v - voltage) < 0.1);
      if (exists) return prev;
      return [...prev, { v: Number(voltage.toFixed(1)), i: Number(current.toFixed(4)) }].sort((a, b) => a.v - b.v);
    });
  }, [voltage, current]);

  useEffect(() => {
    if (!autoSweep) return;
    let v = 0.5;
    const id = setInterval(() => {
      v = v >= 12 ? 0.5 : v + 0.5;
      setVoltage(parseFloat(v.toFixed(1)));
      setDataPoints((prev) => {
        const i = parseFloat((v / resistance).toFixed(4));
        const exists = prev.find((p) => Math.abs(p.v - v) < 0.1);
        if (exists) return prev;
        return [...prev, { v: parseFloat(v.toFixed(1)), i }].sort((a, b) => a.v - b.v);
      });
      if (v >= 12) setAutoSweep(false);
    }, 300);
    return () => clearInterval(id);
  }, [autoSweep, resistance]);

  const reset = () => { setDataPoints([]); setVoltage(3); setAutoSweep(false); };

  const componentLabel = { resistor: "Resistor", led: "LED", ldr: "LDR", buzzer: "Buzzer" }[component];

  return (
    <div className="w-full h-full flex flex-col md:flex-row items-stretch min-h-0">
      <div className="flex-1 flex items-center justify-center p-3 overflow-hidden">
        <svg viewBox="0 0 540 390" className="w-full h-full" fill="none" style={{ maxHeight: "100%" }}>
          <defs>
            <radialGradient id="ledGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={ledColor} stopOpacity="1" />
              <stop offset="100%" stopColor={ledColor} stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation={Math.max(1, glowStrength / 3)} result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a1628" />
              <stop offset="100%" stopColor="#0d1f42" />
            </linearGradient>
          </defs>
          <rect width="540" height="390" fill="url(#bg2)" rx="12" />

          <text x="270" y="22" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="13" fontFamily="Space Grotesk" fontWeight="700">
            {slug === "parallel-series-circuits" ? "Series & Parallel Circuits" : "Ohm's Law — V = IR"}
          </text>

          <rect x="20" y="52" width="60" height="80" rx="8" fill="rgba(20,40,80,0.9)" stroke="rgba(100,200,255,0.5)" strokeWidth="1.5" />
          <text x="50" y="78" textAnchor="middle" fill="rgba(180,210,255,0.7)" fontSize="8" fontFamily="Space Grotesk">POWER</text>
          <text x="50" y="98" textAnchor="middle" fill="rgba(100,200,255,1)" fontSize="15" fontFamily="monospace" fontWeight="700">{voltage.toFixed(1)}V</text>
          <text x="50" y="113" textAnchor="middle" fill="rgba(180,210,255,0.5)" fontSize="7">variable supply</text>
          <line x1="20" y1="92" x2="10" y2="92" stroke="rgba(100,200,255,0.6)" strokeWidth="2" />
          <line x1="10" y1="92" x2="10" y2="155" stroke="rgba(100,200,255,0.6)" strokeWidth="2" />
          <line x1="80" y1="92" x2="90" y2="92" stroke="rgba(100,200,255,0.6)" strokeWidth="2" />
          <line x1="90" y1="92" x2="90" y2="55" stroke="rgba(100,200,255,0.6)" strokeWidth="2" />
          <line x1="90" y1="55" x2="145" y2="55" stroke="rgba(100,200,255,0.6)" strokeWidth="2" />

          <rect x="145" y="40" width="55" height="30" rx="6" fill="rgba(20,40,80,0.9)" stroke="rgba(200,150,255,0.5)" strokeWidth="1.5" />
          <text x="172" y="53" textAnchor="middle" fill="rgba(200,150,255,0.8)" fontSize="8" fontFamily="monospace">A</text>
          <text x="172" y="64" textAnchor="middle" fill="rgba(100,255,150,1)" fontSize="9" fontFamily="monospace" fontWeight="700">{current.toFixed(3)}A</text>
          <line x1="200" y1="55" x2="230" y2="55" stroke="rgba(100,200,255,0.6)" strokeWidth="2" />

          {component === "led" && (
            <g filter="url(#glow)">
              <ellipse cx="260" cy="55" rx="22" ry="20" fill={`rgba(100,255,100,${ledBrightness * 0.25})`} />
              <rect x="240" y="40" width="40" height="30" rx="6" fill="rgba(20,40,80,0.9)" stroke={ledColor} strokeWidth="2" />
              <circle cx="260" cy="55" r="10" fill={ledColor} />
              <text x="260" y="59" textAnchor="middle" fill="rgba(0,0,0,0.8)" fontSize="8" fontWeight="700">LED</text>
              {voltage > 2 && (
                <>
                  <line x1="268" y1="44" x2="272" y2="38" stroke={ledColor} strokeWidth="1.5" />
                  <line x1="272" y1="44" x2="276" y2="38" stroke={ledColor} strokeWidth="1.5" />
                </>
              )}
            </g>
          )}
          {component === "resistor" && (
            <g>
              <rect x="240" y="43" width="40" height="24" rx="4" fill="rgba(200,150,60,0.3)" stroke="rgba(200,150,60,0.7)" strokeWidth="1.5" />
              <text x="260" y="53" textAnchor="middle" fill="rgba(230,180,80,0.9)" fontSize="7" fontFamily="monospace">{resistance}Ω</text>
              <text x="260" y="63" textAnchor="middle" fill="rgba(200,150,60,0.6)" fontSize="6">RESISTOR</text>
            </g>
          )}
          {component === "ldr" && (
            <g>
              <circle cx="260" cy="55" r="16" fill="rgba(255,220,60,0.15)" stroke={ledColor} strokeWidth="1.5" />
              <circle cx="260" cy="55" r="8" fill={`rgba(255,220,60,${Math.min(0.9, voltage / 8)})`} />
              <text x="260" y="59" textAnchor="middle" fill="rgba(0,0,0,0.8)" fontSize="7" fontWeight="700">LDR</text>
              <text x="260" y="80" textAnchor="middle" fill="rgba(255,220,60,0.6)" fontSize="6.5">Light sensor</text>
            </g>
          )}
          {component === "buzzer" && (
            <g>
              <rect x="242" y="40" width="36" height="30" rx="6" fill="rgba(20,40,80,0.9)" stroke="rgba(255,100,100,0.5)" strokeWidth="1.5" />
              <text x="260" y="57" textAnchor="middle" fill={voltage > 3 ? "rgba(255,100,100,0.9)" : "rgba(150,150,150,0.5)"} fontSize="10">
                {voltage > 3 ? "BUZZ!" : "OFF"}
              </text>
              {voltage > 3 && [1, 2, 3].map((r) => (
                <circle key={r} cx="260" cy="55" r={r * 12 + 10} fill="none" stroke="rgba(255,100,100,0.2)" strokeWidth="1">
                  <animate attributeName="r" values={`${r * 8};${r * 14};${r * 8}`} dur="0.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0;0.5" dur="0.4s" repeatCount="indefinite" />
                </circle>
              ))}
            </g>
          )}

          <line x1="280" y1="55" x2="310" y2="55" stroke="rgba(100,200,255,0.6)" strokeWidth="2" />
          <rect x="310" y="40" width="60" height="30" rx="6" fill="rgba(20,40,80,0.9)" stroke="rgba(100,255,150,0.5)" strokeWidth="1.5" />
          <text x="340" y="51" textAnchor="middle" fill="rgba(180,210,255,0.7)" fontSize="7">VOLTMETER</text>
          <text x="340" y="64" textAnchor="middle" fill="rgba(100,255,150,1)" fontSize="9" fontFamily="monospace" fontWeight="700">{voltage.toFixed(1)} V</text>
          <line x1="370" y1="55" x2="385" y2="55" stroke="rgba(100,200,255,0.6)" strokeWidth="2" />
          <line x1="385" y1="55" x2="385" y2="155" stroke="rgba(100,200,255,0.6)" strokeWidth="2" />
          <line x1="10" y1="155" x2="385" y2="155" stroke="rgba(100,200,255,0.6)" strokeWidth="2" />

          {[50, 100, 140, 185, 235, 290, 345].map((x, i) => (
            <circle key={i} cx={x} cy={55} r="3.5" fill="rgba(100,200,255,0.8)">
              <animateTransform
                attributeName="transform" type="translate"
                values={`0,0;${Math.min(30, current * 40)},0;0,0`}
                dur={`${Math.max(0.3, 1.5 - current)}s`}
                begin={`${i * 0.18}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
          <text x="197" y="170" textAnchor="middle" fill="rgba(100,200,255,0.6)" fontSize="8" fontFamily="monospace">
            V = IR: {voltage.toFixed(1)} = {current.toFixed(3)} x {resistance} Ohm
          </text>
          <text x="197" y="183" textAnchor="middle" fill="rgba(180,200,255,0.5)" fontSize="7.5" fontFamily="monospace">
            Power P = VI = {power.toFixed(2)} W
          </text>

          <rect x="20" y="195" width={graphW + 20} height={graphH + 30} rx="8" fill="rgba(10,20,50,0.85)" stroke="rgba(100,150,255,0.25)" strokeWidth="1" />
          <text x="120" y="210" textAnchor="middle" fill="rgba(150,200,255,0.8)" fontSize="8.5" fontFamily="Space Grotesk" fontWeight="600">
            V-I Graph (Ohm's Law)
          </text>
          <line x1="30" y1={195 + graphH + 8} x2={30 + graphW} y2={195 + graphH + 8} stroke="rgba(150,200,255,0.5)" strokeWidth="1" />
          <line x1="30" y1="215" x2="30" y2={195 + graphH + 8} stroke="rgba(150,200,255,0.5)" strokeWidth="1" />
          {[0, 3, 6, 9, 12].map((v) => (
            <text key={v} x={30 + ptX(v)} y={195 + graphH + 18} textAnchor="middle" fill="rgba(150,200,255,0.5)" fontSize="6.5" fontFamily="monospace">{v}</text>
          ))}
          <text x="130" y={195 + graphH + 25} textAnchor="middle" fill="rgba(150,200,255,0.5)" fontSize="7">Voltage (V)</text>

          {dataPoints.length > 1 && (
            <polyline
              points={dataPoints.map((p) => `${30 + ptX(p.v)},${215 + ptY(p.i)}`).join(" ")}
              stroke="rgba(100,220,255,0.9)" strokeWidth="1.5" fill="none"
            />
          )}
          {dataPoints.map((p, i) => (
            <circle key={i} cx={30 + ptX(p.v)} cy={215 + ptY(p.i)} r="3" fill="rgba(100,220,255,0.9)" />
          ))}
          {dataPoints.length > 1 && (
            <text x="120" y={195 + graphH + 8} textAnchor="middle" fill="rgba(100,255,180,0.7)" fontSize="6.5" fontFamily="monospace">
              R = {(dataPoints[dataPoints.length - 1].v / dataPoints[dataPoints.length - 1].i).toFixed(1)} Ohm (from gradient)
            </text>
          )}

          <rect x="260" y="195" width="264" height={graphH + 30} rx="8" fill="rgba(10,20,50,0.85)" stroke="rgba(100,150,255,0.25)" strokeWidth="1" />
          <text x="392" y="210" textAnchor="middle" fill="rgba(150,200,255,0.8)" fontSize="8.5" fontFamily="Space Grotesk" fontWeight="600">
            Component Comparison
          </text>
          {(["led", "resistor", "ldr", "buzzer"] as const).map((c, i) => {
            const labels = { led: "LED (0.3V threshold)", resistor: "Fixed Resistor (ohmic)", ldr: "LDR (light-dependent)", buzzer: "Buzzer (threshold)" };
            return (
              <g key={c}>
                <rect x="268" y={220 + i * 28} width="248" height="22" rx="5"
                  fill={component === c ? "rgba(100,200,255,0.15)" : "rgba(0,0,0,0)"}
                  stroke={component === c ? "rgba(100,200,255,0.4)" : "rgba(100,150,255,0.1)"}
                  strokeWidth="1"
                  onClick={() => setComponent(c)}
                  style={{ cursor: "pointer" }}
                />
                <text x="340" y={234 + i * 28} fill={component === c ? "rgba(100,220,255,0.9)" : "rgba(150,180,255,0.5)"}
                  fontSize="8.5" fontFamily="Space Grotesk" onClick={() => setComponent(c)} style={{ cursor: "pointer" }}>
                  {labels[c]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="w-full md:w-52 p-4 space-y-3 border-t md:border-t-0 md:border-l border-white/8 flex flex-col overflow-y-auto">
        <div className="glass rounded-xl p-3 space-y-3">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Controls</div>
          <div>
            <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Voltage (V)</span><span className="font-mono text-accent">{voltage.toFixed(1)} V</span></div>
            <input type="range" min={0.5} max={12} step={0.5} value={voltage} onChange={(e) => { setVoltage(Number(e.target.value)); setAutoSweep(false); }} className="w-full accent-primary" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Resistance (Ohm)</span><span className="font-mono text-accent">{resistance} Ohm</span></div>
            <input type="range" min={2} max={50} step={2} value={resistance} onChange={(e) => setResistance(Number(e.target.value))} className="w-full accent-primary" />
          </div>
        </div>

        <div className="glass rounded-xl p-3 space-y-1">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-1">Live Readings</div>
          <Row label="Voltage V" value={`${voltage.toFixed(1)} V`} color="text-accent" />
          <Row label="Current I" value={`${current.toFixed(3)} A`} color="text-green-400" />
          <Row label="Resistance R" value={`${resistance} Ohm`} color="text-blue-400" />
          <Row label="Power P" value={`${power.toFixed(2)} W`} color="text-orange-400" />
        </div>

        <div className="glass rounded-xl p-3 text-[10px] text-muted-foreground max-h-32 overflow-y-auto">
          <div className="text-[10px] uppercase tracking-wide font-semibold mb-1">Data ({dataPoints.length})</div>
          {dataPoints.length === 0 && <div className="text-muted-foreground/40">Record readings to build V-I graph</div>}
          {dataPoints.slice(-8).map((d, i) => (
            <div key={i} className="flex justify-between font-mono text-[9px]">
              <span className="text-accent">{d.v}V</span>
              <span className="text-green-400">{d.i.toFixed(4)}A</span>
              <span className="text-muted-foreground/60">{(d.v / d.i).toFixed(1)}Ohm</span>
            </div>
          ))}
        </div>

        <div className="space-y-2 mt-auto">
          <button onClick={recordPoint} className="w-full py-2.5 rounded-xl text-sm bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold">
            Record Reading
          </button>
          <button
            onClick={() => { setDataPoints([]); setAutoSweep(true); setVoltage(0.5); }}
            className="w-full py-2 rounded-xl text-sm glass text-accent hover:text-foreground transition font-semibold"
          >
            Auto Sweep 0-12V
          </button>
          <button onClick={reset} className="w-full py-2 rounded-xl text-sm glass text-muted-foreground hover:text-foreground transition">
            Reset
          </button>
        </div>

        <div className="glass rounded-xl p-3 text-[10px] text-muted-foreground leading-relaxed">
          <span className="text-accent font-semibold">AI Tip: </span>
          {component === "led" ? "An LED is non-ohmic. It only conducts above ~2V (forward voltage). The V-I graph is curved, not a straight line." :
           component === "ldr" ? "An LDR (light dependent resistor) changes resistance with light intensity. Lower light = higher resistance = lower current." :
           component === "buzzer" ? "A buzzer only activates above a threshold voltage. Click 'Auto Sweep' to see how current varies with voltage." :
           "A fixed resistor is ohmic — V-I graph is a straight line. Gradient = 1/R. Record at least 6 points for a good graph."}
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
