import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FlaskConical, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_app/labs/$slug")({
  component: LabDetail,
});

function LabDetail() {
  const { slug } = Route.useParams();
  const [exp, setExp] = useState<{ title: string; description: string | null; subject: string } | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("experiments")
        .select("title, description, subject")
        .eq("slug", slug)
        .maybeSingle();
      setExp(data);
    })();
  }, [slug]);

  return (
    <div className="max-w-4xl space-y-6">
      <Link to={exp?.subject === "physics" ? "/labs/physics" : "/labs/chemistry"} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to labs
      </Link>

      <div className="glass-strong rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
            <FlaskConical className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold">{exp?.title ?? "Loading…"}</h1>
        </div>
        <p className="text-muted-foreground mb-8">{exp?.description}</p>

        <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-white/10 flex flex-col items-center justify-center text-center p-8 mb-6">
          <Sparkles className="h-10 w-10 text-accent mb-3 animate-pulse-glow" />
          <h3 className="text-xl font-semibold mb-2">Interactive simulation coming soon</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            We're building a fully interactive 3D simulation for this experiment. You'll be able to manipulate apparatus, observe reactions, and get AI guidance in real time.
          </p>
        </div>

        <div className="flex gap-3">
          <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary">
            Start experiment
          </Button>
          <Button asChild variant="outline" className="glass border-white/15">
            <Link to="/tutor">Ask AI tutor</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}