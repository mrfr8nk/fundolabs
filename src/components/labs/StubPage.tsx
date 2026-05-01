import { type LucideIcon } from "lucide-react";

export function StubPage({
  icon: Icon, title, subtitle, description,
}: { icon: LucideIcon; title: string; subtitle: string; description: string }) {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      <div className="glass-strong rounded-3xl p-12 text-center">
        <div className="h-16 w-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center glow-primary">
          <Icon className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-xl font-semibold mb-3">Coming soon</h2>
        <p className="text-muted-foreground max-w-md mx-auto">{description}</p>
      </div>
    </div>
  );
}