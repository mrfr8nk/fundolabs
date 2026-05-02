import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import {
  Shield, Users, MessageSquare, Activity, BarChart3, Eye,
  Mail, Calendar, ChevronRight, Loader2, FlaskConical,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

type Stats = { users: number; visits: number; messages: number; sessions: number };
type Visit = { id: string; path: string; created_at: string; user_id: string | null };
type Msg = {
  id: string; full_name: string; email: string; phone: string | null;
  plan: string | null; subject: string | null; message: string;
  status: string; created_at: string;
};
type Profile = { id: string; full_name: string | null; created_at: string };

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [stats, setStats] = useState<Stats>({ users: 0, visits: 0, messages: 0, sessions: 0 });
  const [visits, setVisits] = useState<Visit[]>([]);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "users" | "messages" | "traffic">("overview");

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      setIsAdmin(!!data);
    })();
  }, [user]);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      const [
        { count: userCount },
        { count: visitCount },
        { count: msgCount },
        { count: sessionCount },
        { data: visitData },
        { data: msgData },
        { data: profileData },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("site_visits").select("*", { count: "exact", head: true }),
        supabase.from("support_messages").select("*", { count: "exact", head: true }),
        supabase.from("lab_sessions").select("*", { count: "exact", head: true }),
        supabase.from("site_visits").select("id, path, created_at, user_id").order("created_at", { ascending: false }).limit(50),
        supabase.from("support_messages").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("profiles").select("id, full_name, created_at").order("created_at", { ascending: false }).limit(50),
      ]);
      setStats({
        users: userCount ?? 0,
        visits: visitCount ?? 0,
        messages: msgCount ?? 0,
        sessions: sessionCount ?? 0,
      });
      setVisits((visitData as Visit[]) ?? []);
      setMessages((msgData as Msg[]) ?? []);
      setProfiles((profileData as Profile[]) ?? []);
      setLoading(false);
    })();
  }, [isAdmin]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("support_messages").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    toast.success(`Marked as ${status}`);
  };

  if (authLoading || isAdmin === null) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const StatCard = ({ icon: Icon, label, value, color }: { icon: typeof Shield; label: string; value: number; color: string }) => (
    <div className={`glass-card rounded-2xl p-5 bg-gradient-to-br ${color}`}>
      <Icon className="h-5 w-5 mb-3 text-foreground/80" />
      <div className="text-3xl font-bold mb-0.5">{value.toLocaleString()}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );

  // top paths analytics
  const pathCounts: Record<string, number> = {};
  visits.forEach((v) => { pathCounts[v.path] = (pathCounts[v.path] ?? 0) + 1; });
  const topPaths = Object.entries(pathCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

  return (
    <div className="space-y-8 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Portal</h1>
            <p className="text-sm text-muted-foreground">Site traffic, users, plan inquiries & moderation.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total users" value={stats.users} color="from-primary/20 to-transparent" />
        <StatCard icon={Eye} label="Site visits" value={stats.visits} color="from-cyan-500/20 to-transparent" />
        <StatCard icon={MessageSquare} label="Plan inquiries" value={stats.messages} color="from-orange-500/20 to-transparent" />
        <StatCard icon={FlaskConical} label="Lab sessions" value={stats.sessions} color="from-green-500/20 to-transparent" />
      </div>

      <div className="flex gap-1 glass-card rounded-xl p-1 w-fit overflow-x-auto">
        {([
          { k: "overview", label: "Overview", icon: BarChart3 },
          { k: "users", label: "Users", icon: Users },
          { k: "messages", label: "Inquiries", icon: MessageSquare },
          { k: "traffic", label: "Traffic", icon: Activity },
        ] as const).map(({ k, label, icon: Icon }) => (
          <button key={k} onClick={() => setTab(k)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
              tab === k ? "bg-gradient-to-r from-primary to-accent text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}>
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <>
          {tab === "overview" && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-accent" /> Top pages</h3>
                <div className="space-y-2">
                  {topPaths.length === 0 && <p className="text-sm text-muted-foreground">No traffic yet.</p>}
                  {topPaths.map(([path, count]) => {
                    const max = topPaths[0][1];
                    return (
                      <div key={path} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-mono text-muted-foreground truncate">{path}</span>
                          <span className="text-accent font-semibold">{count}</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: `${(count / max) * 100}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><MessageSquare className="h-4 w-4 text-accent" /> Latest inquiries</h3>
                <div className="space-y-3">
                  {messages.slice(0, 5).map((m) => (
                    <div key={m.id} className="flex items-start gap-3 text-sm">
                      <div className="h-8 w-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {m.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{m.full_name}</div>
                        <div className="text-xs text-muted-foreground truncate">{m.plan ? `Plan: ${m.plan}` : m.subject ?? "General"}</div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${m.status === "new" ? "bg-accent/15 text-accent" : "bg-white/5 text-muted-foreground"}`}>{m.status}</span>
                    </div>
                  ))}
                  {messages.length === 0 && <p className="text-sm text-muted-foreground">No inquiries yet.</p>}
                </div>
              </div>
            </div>
          )}

          {tab === "users" && (
            <div className="glass-card rounded-2xl p-5 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground uppercase">
                    <th className="py-2">Name</th>
                    <th className="py-2">User ID</th>
                    <th className="py-2">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((p) => (
                    <tr key={p.id} className="border-t border-white/5">
                      <td className="py-3 font-medium">{p.full_name ?? "—"}</td>
                      <td className="py-3 font-mono text-xs text-muted-foreground">{p.id.slice(0, 8)}…</td>
                      <td className="py-3 text-muted-foreground text-xs">{new Date(p.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "messages" && (
            <div className="space-y-3">
              {messages.length === 0 && <p className="text-sm text-muted-foreground">No inquiries yet.</p>}
              {messages.map((m) => (
                <div key={m.id} className="glass-card rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{m.full_name}</span>
                        {m.plan && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-bold uppercase">{m.plan}</span>}
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${m.status === "new" ? "bg-accent/15 text-accent" : m.status === "resolved" ? "bg-green-500/15 text-green-400" : "bg-white/5 text-muted-foreground"}`}>{m.status}</span>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-3 flex-wrap">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{m.email}</span>
                        {m.phone && <span>📱 {m.phone}</span>}
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(m.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => updateStatus(m.id, "in_progress")} className="text-xs glass rounded-lg px-2.5 py-1 hover:text-primary transition">In progress</button>
                      <button onClick={() => updateStatus(m.id, "resolved")} className="text-xs glass rounded-lg px-2.5 py-1 hover:text-green-400 transition">Resolve</button>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap">{m.message}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "traffic" && (
            <div className="glass-card rounded-2xl p-5 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground uppercase">
                    <th className="py-2">Path</th>
                    <th className="py-2">User</th>
                    <th className="py-2">When</th>
                  </tr>
                </thead>
                <tbody>
                  {visits.map((v) => (
                    <tr key={v.id} className="border-t border-white/5">
                      <td className="py-2 font-mono text-xs">{v.path}</td>
                      <td className="py-2 text-muted-foreground text-xs">{v.user_id ? v.user_id.slice(0, 8) + "…" : "anon"}</td>
                      <td className="py-2 text-muted-foreground text-xs">{new Date(v.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}