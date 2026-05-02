import { Link, useParams } from "react-router-dom";
import { FlaskConical, BookOpen, ArrowRight, CheckCircle2, Beaker, Atom, ChevronRight } from "lucide-react";

const CURRICULA: Record<string, {
  name: string;
  subtitle: string;
  description: string;
  color: string;
  subjects: { name: string; icon: typeof Beaker; topics: string[] }[];
}> = {
  "zimsec-o-level": {
    name: "ZIMSEC O-Level",
    subtitle: "Ordinary Level Science — Forms 3 & 4",
    description: "The ZIMSEC Ordinary Level science curriculum for Forms 3 and 4. FundoLabs covers all practical components of Chemistry and Physics, helping you prepare for internal assessments and the final ZIMSEC examination.",
    color: "from-cyan-500 to-blue-600",
    subjects: [
      {
        name: "Chemistry",
        icon: Beaker,
        topics: [
          "Acid-Base Titration (neutralisation)",
          "Flame Tests — metal ion identification",
          "Rates of Reaction",
          "Electrolysis of brine",
          "Preparation of salts",
          "Chromatography",
          "Combustion analysis",
          "pH and indicators",
          "Displacement reactions",
          "Thermal decomposition",
        ],
      },
      {
        name: "Physics",
        icon: Atom,
        topics: [
          "Ohm's Law and V-I characteristics",
          "Simple Pendulum — determining g",
          "Hooke's Law — spring constant",
          "Density of irregular solids",
          "Specific heat capacity",
          "Refraction and total internal reflection",
          "Moments and levers",
          "Waves — frequency and wavelength",
          "Radioactivity and half-life",
          "Pressure in fluids",
        ],
      },
    ],
  },
  "zimsec-a-level": {
    name: "ZIMSEC A-Level",
    subtitle: "Advanced Level Science — Forms 5 & 6",
    description: "The ZIMSEC Advanced Level curriculum for Forms 5 and 6. Deeper investigations into Chemistry and Physics at university entrance level, with rigorous data analysis and extended practical reports.",
    color: "from-violet-500 to-purple-700",
    subjects: [
      {
        name: "Chemistry",
        icon: Beaker,
        topics: [
          "Acid-base titrations and back-titrations",
          "Redox titrations (permanganate, iodine)",
          "Organic synthesis and reflux",
          "Enthalpy of combustion (calorimetry)",
          "Electrode potentials and electrochemistry",
          "Colorimetry and Beer-Lambert law",
          "Equilibrium constant determination",
          "Structural analysis (IR, mass spec, NMR)",
          "Qualitative organic analysis",
          "Transition metal chemistry",
        ],
      },
      {
        name: "Physics",
        icon: Atom,
        topics: [
          "Simple Harmonic Motion (SHM)",
          "Capacitor charge/discharge",
          "Young's modulus — wire stretching",
          "Gravitational fields — satellite motion",
          "Photoelectric effect — Planck's constant",
          "Standing waves on strings",
          "Thermal physics — ideal gas law",
          "Nuclear decay and activity",
          "Electric fields — Millikan experiment",
          "Magnetic flux and Faraday's law",
        ],
      },
    ],
  },
  "cambridge-igcse": {
    name: "Cambridge IGCSE",
    subtitle: "International General Certificate of Secondary Education",
    description: "The Cambridge IGCSE science curriculum is internationally recognised and emphasises practical science skills. FundoLabs aligns its simulations to IGCSE Physics, Chemistry, and Biology practicals.",
    color: "from-orange-500 to-rose-600",
    subjects: [
      {
        name: "Chemistry",
        icon: Beaker,
        topics: [
          "Titration and volumetric analysis",
          "Rates of reaction — temperature and concentration",
          "Identification of ions and gases",
          "Electrolysis",
          "Energy changes in reactions",
          "Preparation of pure dry salt",
          "Chromatography — food dyes",
          "Alloys and properties of metals",
          "Polymers and plastics",
          "Environmental chemistry",
        ],
      },
      {
        name: "Physics",
        icon: Atom,
        topics: [
          "Motion and kinematics — ticker tape",
          "Forces and Hooke's Law",
          "Pressure — manometers and barometers",
          "Thermal conductivity",
          "Reflection and refraction of light",
          "Electric circuits — series and parallel",
          "Electromagnetic induction",
          "Radioactivity",
          "Specific latent heat",
          "Resonance and standing waves",
        ],
      },
    ],
  },
  "ib-science": {
    name: "IB Science",
    subtitle: "International Baccalaureate — Standard & Higher Level",
    description: "The IB Diploma Programme science curriculum, covering Chemistry and Physics at Standard Level and Higher Level with rigorous internal assessments (IA) and data analysis.",
    color: "from-emerald-500 to-teal-600",
    subjects: [
      {
        name: "Chemistry",
        icon: Beaker,
        topics: [
          "Titration — acid-base and redox",
          "Enthalpy (Hess's Law experiments)",
          "Equilibrium — Le Chatelier's principle",
          "Electrochemical cells",
          "Spectroscopy and colorimetry",
          "Organic functional group tests",
          "Rate laws and activation energy",
          "Buffer solutions",
          "Environmental chemistry investigations",
          "Green chemistry experiments",
        ],
      },
      {
        name: "Physics",
        icon: Atom,
        topics: [
          "Uniform circular motion",
          "Simple harmonic oscillators",
          "Thermal conductivity (Searle's method)",
          "Electromagnetic induction",
          "Photoelectric effect",
          "Diffraction and interference",
          "Capacitance — charging curves",
          "Radioactive decay",
          "Astrophysics — HR diagrams",
          "Digital signal processing",
        ],
      },
    ],
  },
};

export default function CurriculumPage() {
  const { id } = useParams<{ id: string }>();
  const curriculum = CURRICULA[id ?? ""];

  if (!curriculum) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Curriculum not found</h1>
          <Link to="/" className="text-primary hover:underline">Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 glass-strong border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <FlaskConical className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold">Fundo<span className="text-gradient">Labs</span></span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{curriculum.name}</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-20 max-w-5xl">
        <div className={`rounded-3xl bg-gradient-to-r ${curriculum.color} p-px mb-14`}>
          <div className="glass rounded-3xl p-10">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="h-5 w-5 text-accent" />
              <span className="text-sm font-semibold text-accent">{curriculum.subtitle}</span>
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {curriculum.name} Science
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">{curriculum.description}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-14">
          {curriculum.subjects.map(({ name, icon: Icon, topics }) => (
            <div key={name} className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold">{name}</h2>
              </div>
              <ul className="space-y-2">
                {topics.map((topic) => (
                  <li key={topic} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-accent mt-0.5 flex-shrink-0" />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to practise these experiments?</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
            All {curriculum.name} simulations are available on FundoLabs. Create a free account to start experimenting.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/auth" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl px-8 py-3 font-semibold hover:opacity-90 transition text-sm">
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/labs/chemistry" className="inline-flex items-center justify-center gap-2 glass border border-white/10 rounded-xl px-8 py-3 text-sm font-semibold hover:border-primary/30 transition">
              Browse labs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
