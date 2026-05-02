import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FlaskConical, Atom, Brain, GraduationCap,
  FileText, Users, Settings, LogOut, Menu, X, PlusCircle
} from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/labs/chemistry", label: "Chemistry Labs", icon: FlaskConical },
  { to: "/labs/physics", label: "Physics Labs", icon: Atom },
  { to: "/labs/create", label: "Create Experiment", icon: PlusCircle },
  { to: "/tutor", label: "AI Tutor", icon: Brain },
  { to: "/exam", label: "Exam Mode", icon: GraduationCap },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/teacher", label: "Teacher", icon: Users },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex">
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full glass-strong border-r border-white/10 flex flex-col">
          <Link to="/" className="flex items-center gap-2 px-6 h-16 border-b border-white/10">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent glow-primary">
              <FlaskConical className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">
              Fundo<span className="text-gradient">Labs</span>
            </span>
          </Link>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {nav.map((item) => {
              const active = location.pathname === item.to || (item.to !== "/dashboard" && location.pathname.startsWith(item.to));
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                    active
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-white/10">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </Button>
          </div>
        </div>
      </aside>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden flex items-center justify-between h-14 px-4 border-b border-white/10 glass-strong">
          <button onClick={() => setOpen(!open)} className="p-2">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="font-semibold">FundoLabs</span>
          <div className="w-9" />
        </header>
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
