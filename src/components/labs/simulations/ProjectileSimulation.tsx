import { useEffect, useState, useRef } from "react";
import { type Experiment } from "@/data/experiments";

export function ProjectileSimulation({ experiment }: { slug: string; experiment: Experiment }) {
  const [velocity, setVelocity] = useState(20);
  const [angleDeg, setAngleDeg] = useState(45);
  const [running, setRunning] = useState(false);
  const [t, setT] = useState(0);
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);
  const animRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  const g = 9.81;
  const angle = (angleDeg * Math.PI) / 180;
  const vx = velocity * Math.cos(angle);
  const vy = velocity * Math.sin(angle);
  const totalTime = (2 * vy) / g;
  const maxRange = vx * totalTime;
  const maxHeight = (vy * vy) / (2 * g);

  const scaleX = 280 / Math.max(maxRange, 1);
  const scaleY = 160 / Math.max(maxHeight, 1);
  const scale = Math.min(scaleX, scaleY, 8);

  const groundY = 280;
  const originX = 40;

  const posX = (time: number) => originX + vx * time * scale;
  const posY = (time: number) => groundY - (vy * time - 0.5 * g * time * time) * scale;

  const currentX = posX(t);
  const currentY = posY(t);

  useEffect(() => {
    if (!running) return;
    startRef.current = performance.now();
    let lastT = 0;

    const animate = (now: number) => {
      const elapsed = (now - startRef.current) / 1000;
      if (elapsed >= totalTime) {
        setT(totalTime);
        setRunning(false);
        return;
      }
      if (elapsed - lastT > 0.05) {
        setTrail((prev) => [...prev.slice(-60), { x: posX(elapsed), y: posY(elapsed) }]);
        lastT = elapsed;
      }
      setT(elapsed);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [running]);

  const launch = () => {
    setTrail([]);
    setT(0);
    setRunning(true);
  };

  const reset = () => {
    setRunning(false);
    cancelAnimationFrame(animRef.current);
    setT(0);
    setTrail([]);
  };

  const currentHeight = Math.max(0, vy * t - 0.5 * g * t * t);
  const currentVx = vx;
  const currentVy = vy - g * t;
  const speed = Math.sqrt(currentVx * currentVx + currentVy * currentVy);

  const trajectoryPoints = [];
  for (let i = 0; i <= 60; i++) {
    const ti = (totalTime * i) / 60;
    trajectoryPoints.push({ x: posX(ti), y: posY(ti) });
  }

  return (
    <div className="w-full h-full flex flex-col md:flex-row items-stretch min-h-0">
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <svg viewBox="0 0 500 360" className="w-full h-full" fill="none" style={{ maxHeight: "100%" }}>
          <defs>
            <linearGradient id="projBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#060c1a" /><stop offset="60%" stopColor="#0a1a35" /><stop offset="100%" stopColor="#1a3a1a" />
            </linearGradient>
            <radialGradient id="ballGrad" cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#ff9800" /><stop offset="100%" stopColor="#e65100" />
            </radialGradient>
          </defs>
          <rect width="500" height="360" fill="url(#projBg)" rx="12" />

          <text x="250" y="22" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="13" fontFamily="Space Grotesk" fontWeight="700">
            {experiment?.title || "Projectile Motion"}
          </text>
          <text x="250" y="37" textAnchor="middle" fill="rgba(150,200,255,0.5)" fontSize="8" fontFamily="monospace">
            x = v0*cos(a)*t | y = v0*sin(a)*t - 0.5*g*t2 | g = 9.81 m/s2
          </text>

          <rect x="0" y={groundY} width="500" height="360" fill="rgba(20,50,20,0.5)" />
          <line x1="0" y1={groundY} x2="500" y2={groundY} stroke="rgba(100,180,100,0.6)" strokeWidth="2" />

          {[0, 20, 40, 60, 80, 100].map((d) => (
            <g key={d}>
              <line x1={originX + d * scale} y1={groundY} x2={originX + d * scale} y2={groundY + 8} stroke="rgba(150,200,150,0.4)" strokeWidth="1" />
              <text x={originX + d * scale} y={groundY + 18} textAnchor="middle" fill="rgba(150,200,150,0.5)" fontSize="7" fontFamily="monospace">{d}m</text>
            </g>
          ))}
          {[0, 10, 20, 30, 40].map((h) => (
            <g key={h}>
              <line x1={originX - 8} y1={groundY - h * scale} x2={originX} y2={groundY - h * scale} stroke="rgba(150,200,150,0.4)" strokeWidth="1" />
              <text x={originX - 12} y={groundY - h * scale + 3} textAnchor="end" fill="rgba(150,200,150,0.5)" fontSize="7" fontFamily="monospace">{h}</text>
            </g>
          ))}
          <text x="6" y={groundY - 60} fill="rgba(150,200,150,0.5)" fontSize="7.5" transform={`rotate(-90,6,${groundY - 60})`} fontFamily="monospace">Height (m)</text>

          <polyline
            points={trajectoryPoints.map((p) => `${p.x},${p.y}`).join(" ")}
            stroke="rgba(100,150,255,0.2)" strokeWidth="1.5" fill="none" strokeDasharray="4 3"
          />

          {trail.length > 1 && (
            <polyline
              points={trail.map((p) => `${p.x},${p.y}`).join(" ")}
              stroke="rgba(255,150,50,0.7)" strokeWidth="2" fill="none"
            />
          )}

          {t > 0 && (
            <>
              <line x1={originX} y1={groundY} x2={currentX} y2={groundY} stroke="rgba(100,255,150,0.4)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1={currentX} y1={groundY} x2={currentX} y2={currentY} stroke="rgba(100,200,255,0.4)" strokeWidth="1" strokeDasharray="3 3" />
              <text x={originX + (currentX - originX) / 2} y={groundY + 26} textAnchor="middle" fill="rgba(100,255,150,0.7)" fontSize="7" fontFamily="monospace">
                {(vx * t).toFixed(1)} m
              </text>
              <text x={currentX + 8} y={currentY + (groundY - currentY) / 2} fill="rgba(100,200,255,0.7)" fontSize="7" fontFamily="monospace">
                {currentHeight.toFixed(1)} m
              </text>
            </>
          )}

          <circle cx={originX} cy={groundY} r="6" fill="rgba(100,200,255,0.4)" />
          <line x1={originX} y1={groundY} x2={originX + Math.cos(angle) * 30} y2={groundY - Math.sin(angle) * 30}
            stroke="rgba(100,200,255,0.8)" strokeWidth="2" markerEnd="url(#arrow)" />
          <text x={originX + 35} y={groundY - 28} fill="rgba(100,200,255,0.7)" fontSize="8" fontFamily="monospace">{angleDeg}</text>

          {(t > 0 || !running) && (
            <circle cx={currentX} cy={Math.min(currentY, groundY - 8)} r="10" fill="url(#ballGrad)" />
          )}

          {!running && t >= totalTime && t > 0 && (
            <g>
              <text x={currentX} y={groundY - 14} textAnchor="middle" fill="rgba(100,255,150,0.9)" fontSize="8" fontWeight="700">LANDED!</text>
              <text x={currentX} y={groundY - 4} textAnchor="middle" fill="rgba(100,255,150,0.7)" fontSize="7">Range: {maxRange.toFixed(1)} m</text>
            </g>
          )}

          {maxHeight > 0 && (
            <g>
              <circle cx={originX + vx * (vy / g) * scale} cy={groundY - maxHeight * scale} r="3" fill="rgba(255,220,100,0.5)" />
              <text x={originX + vx * (vy / g) * scale} y={groundY - maxHeight * scale - 8} textAnchor="middle" fill="rgba(255,220,100,0.7)" fontSize="7" fontFamily="monospace">
                H={maxHeight.toFixed(1)}m
              </text>
            </g>
          )}

          <rect x="310" y="52" width="180" height="78" rx="6" fill="rgba(10,20,50,0.85)" stroke="rgba(100,150,255,0.2)" strokeWidth="1" />
          <text x="400" y="66" textAnchor="middle" fill="rgba(150,200,255,0.8)" fontSize="8" fontFamily="Space Grotesk" fontWeight="600">Live Values</text>
          {[
            { label: "Height", value: `${currentHeight.toFixed(2)} m`, c: "#64b4ff" },
            { label: "Horiz. dist", value: `${(vx * t).toFixed(2)} m`, c: "#69f0ae" },
            { label: "Speed", value: `${speed.toFixed(2)} m/s`, c: "#ffa726" },
            { label: "Time", value: `${t.toFixed(2)} / ${totalTime.toFixed(2)} s`, c: "#ce93d8" },
            { label: "Vy", value: `${currentVy.toFixed(2)} m/s`, c: "#80cbc4" },
          ].map(({ label, value, c }, i) => (
            <g key={label}>
              <text x="318" y={78 + i * 11} fill="rgba(150,180,255,0.6)" fontSize="7.5" fontFamily="monospace">{label}:</text>
              <text x="468" y={78 + i * 11} textAnchor="end" fill={c} fontSize="7.5" fontFamily="monospace" fontWeight="600">{value}</text>
            </g>
          ))}
        </svg>
      </div>

      <div className="w-full md:w-52 p-4 space-y-3 border-t md:border-t-0 md:border-l border-white/8 flex flex-col overflow-y-auto">
        <div className="glass rounded-xl p-3 space-y-3">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Controls</div>
          <div>
            <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Initial Speed</span><span className="font-mono text-accent">{velocity} m/s</span></div>
            <input type="range" min={5} max={50} step={1} value={velocity} onChange={(e) => { setVelocity(Number(e.target.value)); reset(); }} className="w-full accent-primary" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Launch Angle</span><span className="font-mono text-accent">{angleDeg} deg</span></div>
            <input type="range" min={5} max={85} step={5} value={angleDeg} onChange={(e) => { setAngleDeg(Number(e.target.value)); reset(); }} className="w-full accent-primary" />
          </div>
        </div>

        <div className="glass rounded-xl p-3 space-y-1">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-1">Calculated</div>
          <Row label="Max Height" value={`${maxHeight.toFixed(2)} m`} color="text-accent" />
          <Row label="Range" value={`${maxRange.toFixed(2)} m`} color="text-green-400" />
          <Row label="Total Time" value={`${totalTime.toFixed(3)} s`} color="text-blue-400" />
          <Row label="vx" value={`${vx.toFixed(2)} m/s`} color="text-orange-400" />
          <Row label="vy (initial)" value={`${vy.toFixed(2)} m/s`} color="text-purple-400" />
        </div>

        <div className="space-y-2 mt-auto">
          <button onClick={running ? reset : launch}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition ${
              running ? "bg-red-500/20 text-red-400" : "bg-gradient-to-r from-primary to-accent text-primary-foreground glow-sm"
            }`}>
            {running ? "Stop" : "Launch Projectile!"}
          </button>
          <button onClick={reset} className="w-full py-2 rounded-xl text-sm glass text-muted-foreground hover:text-foreground transition">
            Reset
          </button>
        </div>

        <div className="glass rounded-xl p-3 text-[10px] text-muted-foreground leading-relaxed">
          <span className="text-accent font-semibold">AI Tip: </span>
          Maximum range is achieved at 45 degrees. Horizontal velocity is constant (no air resistance). Vertical velocity decreases at g = 9.81 m/s2.
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
