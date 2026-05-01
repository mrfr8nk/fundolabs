import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { FileText } from "lucide-react";

type Report = { id: string; title: string; created_at: string };

export const Route = createFileRoute("/_app/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("reports")
        .select("id, title, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setReports((data as Report[]) ?? []);
      setLoading(false);
    })();
  }, [user]);

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">My Reports</h1>
        <p className="text-muted-foreground">AI-generated lab write-ups from your experiments.</p>
      </div>
      {loading ? (
        <div className="text-muted-foreground">Loading…</div>
      ) : reports.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No reports yet. Run an experiment to generate one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="glass rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">{r.title}</div>
                <div className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}