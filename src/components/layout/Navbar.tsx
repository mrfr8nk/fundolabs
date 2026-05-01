import { Link } from "@tanstack/react-router";
import { FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass-strong border-b border-white/10">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent glow-primary">
              <FlaskConical className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Fundo<span className="text-gradient">Labs</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="/#features" className="hover:text-foreground transition">Features</a>
            <a href="/#labs" className="hover:text-foreground transition">Labs</a>
            <a href="/#pricing" className="hover:text-foreground transition">Pricing</a>
            <Link to="/dashboard" className="hover:text-foreground transition">Dashboard</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth">Sign in</Link>
            </Button>
            <Button asChild size="sm" className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 glow-primary">
              <Link to="/auth">Get started</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}