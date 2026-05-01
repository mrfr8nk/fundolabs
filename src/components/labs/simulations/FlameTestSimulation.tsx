import { useState } from "react";
import { type Experiment } from "@/data/experiments";

const METALS = [
  { name: "Sodium (Na)", formula: "NaCl", color1: "#ffdd00", color2: "#ff8800", obs: "Persistent bright yellow flame", ion: "Na+", level: "O-Level" },
  { name: "Potassium (K)", formula: "KCl", color1: "#cc80ff", color2: "#8800ff", obs: "Lilac/violet flame (seen through blue glass)", ion: "K+", level: "O-Level" },
  { name: "Copper (Cu)", formula: "CuSO4", color1: "#00ff88", color2: "#007744", obs: "Blue-green / emerald green flame", ion: "Cu2+", level: "O-Level" },
  { name: "Calcium (Ca)", formula: "CaCl2", color1: "#ff4400", color2: "#aa2200", obs: "Brick red / orange-red flame", ion: "Ca2+", level: "O-Level" },
  { name: "Lithium (Li)", formula: "LiCl", color1: "#ff2020", color2: "#cc0000", obs: "Crimson / bright red flame", ion: "Li+", level: "O-Level" },
  { name: "Barium (Ba)", formula: "BaCl2", color1: "#88ff00", color2: "#448800", obs: "Apple / pale green flame", ion: "Ba2+", level: "A-Level" },
  { name: "Strontium (Sr)", formula: "SrCl2", color1: "#ff3300", color2: "#cc2200", obs: "Crimson red flame (brighter than Li)", ion: "Sr2+", level: "A-Level" },
];

export function FlameTestSimulation({ experiment }: { slug: string; experiment: Experiment }) {
  const [selected, setSelected] = useState(0);
  const [burning, setBurning] = useState(false);
  const [step, setStep] = useState<"idle" | "clean" | "dip" | "burn">("idle");

  const metal = METALS[selected];

  const handleStep = () => {
    if (step === "idle") { setStep("clean"); setBurning(false); }
    else if (step === "clean") setStep("dip");
    else if (step === "dip") { setStep("burn"); setBurning(true); }
    else { setStep("idle"); setBurning(false); }
  };

  const stepLabel = {
    idle: "Start: Clean the wire",
    clean: "Next: Dip in sample",
    dip: "Next: Hold in flame",
    burn: "Next: Record & Reset",
  }[step];

  return (
    <div className="w-full h-full flex flex-col md:flex-row items-stretch min-h-0">
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <svg viewBox="0 0 500 380" className="w-full h-full" fill="none" style={{ maxHeight: "100%" }}>
          <defs>
            <radialGradient id="flameCore" cx="50%" cy="80%" r="60%">
              <stop offset="0%" stopColor="white" stopOpacity="0.9" />
              <stop offset="30%" stopColor={metal.color1} stopOpacity="0.9" />
              <stop offset="100%" stopColor={metal.color2} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="bunsenGlow" cx="50%" cy="100%" r="50%">
              <stop offset="0%" stopColor={metal.color1} stopOpacity={burning ? "0.4" : "0"} />
              <stop offset="100%" stopColor={metal.color2} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="flameBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#070d1e" /><stop offset="100%" stopColor="#0a1a2e" />
            </linearGradient>
          </defs>
          <rect width="500" height="380" fill="url(#flameBg)" rx="12" />

          <text x="250" y="22" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="13" fontFamily="Space Grotesk" fontWeight="700">
            {experiment?.title || "Flame Test — Metal Ion Identification"}
          </text>
          <text x="250" y="37" textAnchor="middle" fill="rgba(150,200,255,0.5)" fontSize="8" fontFamily="monospace">
            Heat metal compound on nichrome wire in Bunsen burner flame
          </text>

          <ellipse cx="250" cy="350" rx="100" ry="16" fill={burning ? metal.color1 : "rgba(100,100,100,0.1)"} opacity="0.2" />

          <rect x="220" y="290" width="60" height="70" rx="6" fill="rgba(80,80,100,0.6)" stroke="rgba(150,150,200,0.4)" strokeWidth="2" />
          <rect x="232" y="306" width="36" height="40" rx="4" fill="rgba(60,60,80,0.8)" />
          <rect x="200" y="355" width="100" height="14" rx="4" fill="rgba(100,100,130,0.5)" />
          <text x="250" y="322" textAnchor="middle" fill="rgba(150,180,255,0.6)" fontSize="7">Bunsen</text>
          <text x="250" y="333" textAnchor="middle" fill="rgba(150,180,255,0.6)" fontSize="7">Burner</text>

          {burning && (
            <>
              <ellipse cx="250" cy="295" rx="60" ry="20" fill={`url(#bunsenGlow)`} />
              {[0, 1, 2, 3, 4].map((i) => (
                <path key={i}
                  d={`M ${240 + i * 5} 295 Q ${235 + i * 5} ${260 - i * 8} ${240 + i * 5} ${210 - i * 15} Q ${248 + i * 4} ${230 - i * 5} ${245 + i * 5} 295`}
                  fill="url(#flameCore)" opacity={0.7 - i * 0.1}>
                  <animate attributeName="d"
                    values={`M ${240 + i * 5} 295 Q ${232 + i * 5} ${255 - i * 8} ${240 + i * 5} ${210 - i * 15} Q ${248 + i * 4} ${225 - i * 5} ${245 + i * 5} 295;
                             M ${240 + i * 5} 295 Q ${240 + i * 5} ${258 - i * 8} ${241 + i * 5} ${205 - i * 15} Q ${252 + i * 4} ${228 - i * 5} ${245 + i * 5} 295;
                             M ${240 + i * 5} 295 Q ${232 + i * 5} ${255 - i * 8} ${240 + i * 5} ${210 - i * 15} Q ${248 + i * 4} ${225 - i * 5} ${245 + i * 5} 295`}
                    dur={`${0.3 + i * 0.08}s`} repeatCount="indefinite" />
                </path>
              ))}
            </>
          )}

          {!burning && (
            <g>
              <ellipse cx="250" cy="285" rx="8" ry="15" fill="rgba(100,150,255,0.3)" />
              <text x="250" y="310" textAnchor="middle" fill="rgba(100,150,255,0.5)" fontSize="8">normal flame</text>
            </g>
          )}

          <line x1="300" y1={burning ? 215 : 270} x2="360" y2="160" stroke="rgba(200,190,170,0.8)" strokeWidth="3" />
          <circle cx="363" cy="157" r="7" fill={step === "dip" || step === "burn" ? metal.color1 : "rgba(200,190,170,0.6)"} stroke="rgba(200,190,170,0.8)" strokeWidth="1.5" />
          <text x="370" y="155" fill="rgba(200,190,170,0.7)" fontSize="8" fontFamily="monospace">nichrome wire</text>
          <text x="370" y="167" fill="rgba(200,190,170,0.5)" fontSize="7" fontFamily="monospace">{step === "dip" || step === "burn" ? metal.formula : "clean"}</text>

          <rect x="20" y="52" width="180" height="200" rx="8" fill="rgba(10,20,50,0.85)" stroke="rgba(100,150,255,0.25)" strokeWidth="1" />
          <text x="110" y="68" textAnchor="middle" fill="rgba(150,200,255,0.8)" fontSize="9" fontFamily="Space Grotesk" fontWeight="600">Metal Ions</text>
          {METALS.map((m, i) => (
            <g key={m.name} onClick={() => { setSelected(i); setBurning(false); setStep("idle"); }} style={{ cursor: "pointer" }}>
              <rect x="28" y={76 + i * 24} width="164" height="20" rx="4"
                fill={selected === i ? "rgba(100,200,255,0.15)" : "rgba(0,0,0,0)"}
                stroke={selected === i ? "rgba(100,200,255,0.4)" : "rgba(100,150,255,0.1)"}
                strokeWidth="1" />
              <rect x="34" y={82 + i * 24} width="10" height="10" rx="2" fill={m.color1} opacity="0.8" />
              <text x="50" y={91 + i * 24} fill={selected === i ? "rgba(200,230,255,0.9)" : "rgba(150,180,255,0.6)"} fontSize="8" fontFamily="Space Grotesk">{m.name}</text>
              <text x="168" y={91 + i * 24} textAnchor="end" fill="rgba(150,180,255,0.4)" fontSize="7">{m.level}</text>
            </g>
          ))}

          <rect x="20" y="260" width="180" height="100" rx="8" fill="rgba(10,20,50,0.85)" stroke="rgba(100,150,255,0.25)" strokeWidth="1" />
          <text x="110" y="276" textAnchor="middle" fill="rgba(150,200,255,0.8)" fontSize="9" fontFamily="Space Grotesk" fontWeight="600">Observation</text>
          <rect x="28" y="282" width="12" height="12" rx="2" fill={burning ? metal.color1 : "rgba(100,100,100,0.3)"} style={{ transition: "fill 0.5s" }} />
          <text x="46" y="291" fill="rgba(200,230,255,0.8)" fontSize="7.5" fontFamily="Space Grotesk">{metal.name}</text>
          <text x="28" y="305" fill="rgba(150,180,255,0.5)" fontSize="7" fontFamily="monospace">Ion: {metal.ion}</text>
          <foreignObject x="28" y="310" width="164" height="44">
            <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontSize: "7px", lineHeight: "1.4", color: burning ? metal.color1 : "rgba(150,180,255,0.5)", transition: "color 0.5s", fontFamily: "Space Grotesk" }}>
              {metal.obs}
            </div>
          </foreignObject>

          <rect x="360" y="195" width="130" height="80" rx="6" fill="rgba(10,20,50,0.85)" stroke="rgba(100,150,255,0.25)" strokeWidth="1" />
          <text x="425" y="211" textAnchor="middle" fill="rgba(150,200,255,0.7)" fontSize="8.5" fontFamily="Space Grotesk" fontWeight="600">Procedure</text>
          {[
            { s: "idle", label: "1. Clean wire in conc. HCl", done: step !== "idle" },
            { s: "clean", label: "2. Dip in metal compound", done: step === "dip" || step === "burn" },
            { s: "dip", label: "3. Hold in blue flame", done: step === "burn" },
            { s: "burn", label: "4. Observe & record colour", done: false },
          ].map(({ label, done }, i) => (
            <g key={i}>
              <circle cx="370" cy={223 + i * 14} r="4" fill={done ? "rgba(100,255,150,0.6)" : "rgba(100,150,255,0.2)"} />
              <text x="378" y={227 + i * 14} fill={done ? "rgba(100,255,150,0.8)" : "rgba(150,180,255,0.5)"} fontSize="7" fontFamily="Space Grotesk">{label}</text>
            </g>
          ))}
        </svg>
      </div>

      <div className="w-full md:w-52 p-4 space-y-3 border-t md:border-t-0 md:border-l border-white/8 flex flex-col overflow-y-auto">
        <div className="glass rounded-xl p-3 space-y-1">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-1">Selected Metal</div>
          <div className="font-semibold text-sm" style={{ color: metal.color1 }}>{metal.name}</div>
          <div className="text-xs text-muted-foreground">Ion: {metal.ion} | {metal.level}</div>
          <div className="text-xs text-muted-foreground mt-1">{metal.obs}</div>
        </div>

        <div className="glass rounded-xl p-3 space-y-2">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Quick Reference</div>
          {METALS.slice(0, 5).map((m) => (
            <div key={m.name} className="flex items-center gap-2 text-xs cursor-pointer" onClick={() => { setSelected(METALS.indexOf(m)); setBurning(false); setStep("idle"); }}>
              <div className="h-3 w-3 rounded flex-shrink-0" style={{ background: m.color1 }} />
              <span className="text-muted-foreground">{m.ion}</span>
              <span className="text-muted-foreground/50 text-[10px] ml-auto">{m.color1 === "#ffdd00" ? "yellow" : m.color1 === "#cc80ff" ? "lilac" : m.color1 === "#00ff88" ? "green" : m.color1 === "#ff4400" ? "brick red" : "crimson"}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2 mt-auto">
          <button onClick={handleStep}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition ${
              step === "burn"
                ? "bg-gradient-to-r from-orange-600 to-red-600 text-white glow-sm"
                : "bg-gradient-to-r from-primary to-accent text-primary-foreground"
            }`}>
            {stepLabel}
          </button>
          <button onClick={() => { setBurning(true); setStep("burn"); }}
            className="w-full py-2 rounded-xl text-sm glass text-accent hover:text-foreground transition font-semibold">
            Jump to Flame View
          </button>
          <button onClick={() => { setBurning(false); setStep("idle"); }}
            className="w-full py-2 rounded-xl text-sm glass text-muted-foreground hover:text-foreground transition">
            Reset
          </button>
        </div>

        <div className="glass rounded-xl p-3 text-[10px] text-muted-foreground leading-relaxed">
          <span className="text-accent font-semibold">AI Tip: </span>
          Clean the wire between each test with concentrated HCl to avoid contamination. Use blue glass to see K+ lilac through yellow Na+ flame. Na is a common contaminant!
        </div>
      </div>
    </div>
  );
}
