import { useState, useRef, useEffect } from "react";
import { Brain, Send, Sparkles, FlaskConical, Atom, BookOpen, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { askBK9 } from "@/lib/bk9api";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const QUICK_PROMPTS = [
  { text: "Explain acid-base titration step by step", icon: FlaskConical },
  { text: "What is Ohm's Law and how do I use it?", icon: Atom },
  { text: "How do I write a balanced chemical equation?", icon: BookOpen },
  { text: "What are the safety rules in a chemistry lab?", icon: Sparkles },
  { text: "Explain the photoelectric effect for A-Level", icon: Atom },
  { text: "What is the difference between O-Level and A-Level chemistry?", icon: BookOpen },
];

const WELCOME = "Hello! I am FundoBot, your AI science tutor.\n\nI specialise in ZIMSEC Chemistry and Physics for O-Level and A-Level students. I can explain concepts, help with experiments, balance equations, and prepare you for exams.\n\nWhat would you like to learn today?";

function FormattedMessage({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-semibold">{line.slice(2, -2)}</p>;
        if (line.startsWith("- ")) return <p key={i} className="flex gap-1.5"><span className="text-accent mt-0.5">-</span><span>{line.slice(2)}</span></p>;
        if (/^\d+\. /.test(line)) {
          const num = line.match(/^(\d+)\. /)?.[1];
          return <p key={i} className="flex gap-2"><span className="text-accent font-semibold">{num}.</span><span>{line.replace(/^\d+\. /, "")}</span></p>;
        }
        if (line === "") return <div key={i} className="h-1" />;
        return <p key={i}>{line}</p>;
      })}
    </div>
  );
}

export default function TutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: WELCOME, timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState<"all" | "chemistry" | "physics">("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg || loading) return;
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: msg, timestamp: new Date() }]);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("ai_conversations").insert({
        user_id: user.id,
        title: msg.slice(0, 60),
        messages: [{ role: "user", content: msg, ts: new Date().toISOString() }],
      });
    }

    let response: string;
    try {
      const ctx = subject !== "all" ? `Focus on ZIMSEC ${subject} topics.` : undefined;
      response = await askBK9(msg, ctx);
    } catch {
      response = "Sorry, I could not reach the AI tutor right now. Please try again.";
    }

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: response, timestamp: new Date() }]);
    setLoading(false);
  };

  const filtered = QUICK_PROMPTS.filter((p) =>
    subject === "all" ||
    (subject === "chemistry" && (p.text.toLowerCase().includes("acid") || p.text.toLowerCase().includes("chem") || p.text.toLowerCase().includes("equation") || p.text.toLowerCase().includes("safety"))) ||
    (subject === "physics" && (p.text.toLowerCase().includes("ohm") || p.text.toLowerCase().includes("photo") || p.text.toLowerCase().includes("physics")))
  ).slice(0, 4);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Brain className="h-6 w-6 text-primary" /> AI Science Tutor</h1>
          <p className="text-muted-foreground text-sm">Powered by FundoBot — ZIMSEC O and A-Level specialist</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 glass-card rounded-xl p-1">
            {(["all", "chemistry", "physics"] as const).map((s) => (
              <button key={s} onClick={() => setSubject(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${subject === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>
          <button onClick={() => setMessages([{ id: "welcome", role: "assistant", content: "Hello again! Ready to learn more ZIMSEC science?", timestamp: new Date() }])}
            className="glass-card rounded-xl p-2 text-muted-foreground hover:text-foreground transition">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`h-8 w-8 rounded-xl flex-shrink-0 flex items-center justify-center ${msg.role === "assistant" ? "bg-gradient-to-br from-primary to-accent glow-sm" : "bg-white/10"}`}>
                {msg.role === "assistant" ? <Brain className="h-4 w-4 text-primary-foreground" /> : <span className="text-sm">U</span>}
              </div>
              <div className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "assistant" ? "glass-card" : "bg-gradient-to-br from-primary/80 to-accent/80 text-primary-foreground"}`}>
                  <FormattedMessage content={msg.content} />
                </div>
                <span className="text-[10px] text-muted-foreground/50 px-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-accent glow-sm flex items-center justify-center">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="glass-card rounded-2xl px-4 py-3 flex items-center gap-2">
              {[0, 0.15, 0.3].map((d, i) => <div key={i} className="h-2 w-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: `${d}s` }} />)}
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="space-y-3 pt-3 border-t border-white/8">
        <div className="flex flex-wrap gap-2">
          {filtered.map((p) => {
            const Icon = p.icon;
            return (
              <button key={p.text} onClick={() => sendMessage(p.text)} disabled={loading}
                className="glass-card rounded-xl px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition flex items-center gap-1.5">
                <Icon className="h-3 w-3 flex-shrink-0" /> {p.text}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Ask me about ZIMSEC chemistry or physics..." disabled={loading}
            className="flex-1 glass-card border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40 transition placeholder:text-muted-foreground/50 disabled:opacity-60" />
          <Button onClick={() => sendMessage()} disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground glow-sm rounded-xl px-5">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
