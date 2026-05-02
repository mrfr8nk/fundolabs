import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [level, setLevel] = useState<"o_level" | "a_level">("o_level");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("profiles").select("full_name, level").eq("id", user.id).maybeSingle();
      if (data) {
        setFullName(data.full_name ?? "");
        setLevel((data.level as "o_level" | "a_level") ?? "o_level");
      }
    })();
  }, [user]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ full_name: fullName, level }).eq("id", user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile saved");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences.</p>
      </div>
      <div className="glass-strong rounded-3xl p-6 space-y-4">
        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input value={user?.email ?? ""} disabled className="glass border-white/10" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="glass border-white/10" />
        </div>
        <div className="space-y-1.5">
          <Label>Education level</Label>
          <div className="flex gap-2">
            {(["o_level", "a_level"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`px-4 py-2 rounded-lg text-sm transition ${
                  level === l
                    ? "bg-primary/20 border border-primary/40 text-primary"
                    : "glass border border-white/10 text-muted-foreground hover:text-foreground"
                }`}
              >
                {l === "o_level" ? "O-Level" : "A-Level"}
              </button>
            ))}
          </div>
        </div>
        <Button onClick={save} disabled={saving} className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
