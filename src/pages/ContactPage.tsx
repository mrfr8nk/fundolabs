import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FlaskConical, Mail, MessageSquare, School, Send, MapPin, Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("general");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast.success("Message sent! We'll respond within 24 hours.");
  };

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
            Contact <span className="text-gradient">Us</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Questions about FundoLabs? Want to bring it to your school? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Get in touch</h2>
              {[
                { icon: Mail, label: "Email", value: "hello@fundolabs.co.zw" },
                { icon: Phone, label: "WhatsApp", value: "+263 77 123 4567" },
                { icon: MapPin, label: "Location", value: "Harare, Zimbabwe" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4 mb-5">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                    <div className="font-medium text-sm">{value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <School className="h-5 w-5 text-accent" />
                <h3 className="font-semibold">For Schools &amp; Teachers</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Want to bring FundoLabs to your school? We offer special pricing for institutions, teacher dashboards, and class management tools.
              </p>
              <div className="space-y-2">
                {["Class management dashboard", "Student progress tracking", "Bulk account creation", "Custom curriculum alignment", "Priority support"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-accent flex-shrink-0" /> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            {sent ? (
              <div className="glass-card rounded-2xl p-10 text-center h-full flex flex-col items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Message sent!</h3>
                <p className="text-muted-foreground text-sm">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" /> Send a message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="glass border-white/10" placeholder="Tendai Moyo" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="glass border-white/10" placeholder="tendai@example.com" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Subject</Label>
                    <select value={subject} onChange={(e) => setSubject(e.target.value)}
                      className="w-full glass border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/40 transition bg-transparent">
                      <option value="general" style={{ background: "#1a1f3a" }}>General enquiry</option>
                      <option value="school" style={{ background: "#1a1f3a" }}>School / institution pricing</option>
                      <option value="teacher" style={{ background: "#1a1f3a" }}>Teacher account</option>
                      <option value="technical" style={{ background: "#1a1f3a" }}>Technical support</option>
                      <option value="partnership" style={{ background: "#1a1f3a" }}>Partnership</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="message">Message</Label>
                    <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} required rows={5}
                      className="w-full glass border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40 transition bg-transparent resize-none placeholder:text-muted-foreground/50"
                      placeholder="Tell us what you need…" />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary h-11">
                    <Send className="h-4 w-4 mr-2" /> Send message
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
