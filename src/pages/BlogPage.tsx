import { Link } from "react-router-dom";
import { FlaskConical, Calendar, ArrowRight, BookOpen, Atom, Brain } from "lucide-react";

const POSTS = [
  {
    slug: "mastering-titrations",
    title: "Mastering Acid-Base Titrations for ZIMSEC O-Level",
    excerpt: "A step-by-step guide to performing accurate titrations — from setting up the burette to calculating concentration. Includes common exam mistakes to avoid.",
    date: "April 28, 2026",
    category: "Chemistry",
    icon: FlaskConical,
    readTime: "6 min read",
  },
  {
    slug: "ohms-law-explained",
    title: "Ohm's Law Explained: V-I Graphs and Circuit Analysis",
    excerpt: "Understanding the relationship between voltage, current, and resistance. Learn how to draw and interpret V-I graphs for your Physics practicals.",
    date: "April 20, 2026",
    category: "Physics",
    icon: Atom,
    readTime: "5 min read",
  },
  {
    slug: "zimsec-practical-tips",
    title: "10 Tips for Acing Your ZIMSEC Practical Examination",
    excerpt: "From writing clear observations to avoiding common errors, these tips will help you score maximum marks in your ZIMSEC practical exams.",
    date: "April 15, 2026",
    category: "Exam Tips",
    icon: BookOpen,
    readTime: "7 min read",
  },
  {
    slug: "ai-science-learning",
    title: "How AI is Changing Science Education in Africa",
    excerpt: "FundoBot and tools like it are making personalised science tutoring accessible to students across the continent. Here's how it works.",
    date: "April 8, 2026",
    category: "Education",
    icon: Brain,
    readTime: "4 min read",
  },
  {
    slug: "flame-tests-guide",
    title: "Flame Test Colours: A Complete ZIMSEC Reference Guide",
    excerpt: "Memorise all 7 flame test colours for metal ions with our interactive guide. Includes the full ZIMSEC-approved list and practice questions.",
    date: "April 1, 2026",
    category: "Chemistry",
    icon: FlaskConical,
    readTime: "3 min read",
  },
  {
    slug: "pendulum-experiment",
    title: "Simple Pendulum: Determining g with Confidence",
    excerpt: "How to plan, execute, and write up the simple pendulum experiment to determine the acceleration due to gravity. With sample results tables.",
    date: "March 25, 2026",
    category: "Physics",
    icon: Atom,
    readTime: "6 min read",
  },
];

export default function BlogPage() {
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
          <Link to="/auth" className="text-sm text-primary hover:underline">Get started</Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-20 max-w-5xl">
        <div className="text-center mb-14">
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            FundoLabs <span className="text-gradient">Blog</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Science tips, exam guides, and education news for ZIMSEC students and teachers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POSTS.map((post) => {
            const Icon = post.icon;
            return (
              <div key={post.slug} className="glass-card rounded-2xl p-6 flex flex-col group hover:border-primary/40 transition cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    post.category === "Chemistry" ? "bg-cyan-500/15 text-cyan-400" :
                    post.category === "Physics" ? "bg-violet-500/15 text-violet-400" :
                    post.category === "Exam Tips" ? "bg-orange-500/15 text-orange-400" :
                    "bg-primary/15 text-primary"
                  }`}>{post.category}</span>
                </div>
                <h2 className="font-semibold text-base mb-2 group-hover:text-primary transition leading-snug">{post.title}</h2>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <div className="glass-card rounded-2xl p-8 max-w-lg mx-auto">
            <h3 className="font-semibold text-lg mb-2">Want more study resources?</h3>
            <p className="text-muted-foreground text-sm mb-4">Join FundoLabs and get access to interactive simulations, AI tutoring, and practice exams.</p>
            <Link to="/auth" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl px-6 py-2.5 text-sm font-semibold hover:opacity-90 transition">
              Start learning free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
