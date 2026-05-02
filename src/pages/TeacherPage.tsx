import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, BookOpen, BarChart3, TrendingUp, Plus, Search,
  FlaskConical, CheckCircle2, Clock, Award, Bell, Download,
  ChevronRight, Eye, Trash2, Edit3, Mail, School
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const MOCK_CLASSES = [
  { id: "4a", name: "Form 4A", students: 28, completed: 18, avgScore: 74, subject: "Chemistry" },
  { id: "4b", name: "Form 4B", students: 25, completed: 21, avgScore: 81, subject: "Chemistry & Physics" },
  { id: "6a", name: "Form 6A", students: 15, completed: 12, avgScore: 88, subject: "A-Level Physics" },
];

const MOCK_STUDENTS = [
  { id: "s1", name: "Tendai Moyo", class: "Form 4A", experiments: 7, avgScore: 82, lastActive: "2h ago", status: "active" },
  { id: "s2", name: "Ruvimbo Chikwanda", class: "Form 4A", experiments: 12, avgScore: 91, lastActive: "5h ago", status: "active" },
  { id: "s3", name: "Tatenda Mapfumo", class: "Form 4B", experiments: 4, avgScore: 63, lastActive: "2d ago", status: "at-risk" },
  { id: "s4", name: "Nyasha Chirwa", class: "Form 6A", experiments: 18, avgScore: 95, lastActive: "1h ago", status: "top" },
  { id: "s5", name: "Farai Dube", class: "Form 4B", experiments: 9, avgScore: 77, lastActive: "3h ago", status: "active" },
  { id: "s6", name: "Chiedza Mutsvairo", class: "Form 4A", experiments: 2, avgScore: 55, lastActive: "5d ago", status: "at-risk" },
  { id: "s7", name: "Takudzwa Banda", class: "Form 6A", experiments: 21, avgScore: 89, lastActive: "1h ago", status: "top" },
  { id: "s8", name: "Simba Nhamo", class: "Form 4B", experiments: 6, avgScore: 70, lastActive: "1d ago", status: "active" },
];

const MOCK_ASSIGNMENTS = [
  { id: "a1", title: "Acid-Base Titration", class: "Form 4A", dueDate: "May 10", submitted: 18, total: 28, status: "open" },
  { id: "a2", title: "Ohm's Law Verification", class: "Form 4B", dueDate: "May 12", submitted: 25, total: 25, status: "closed" },
  { id: "a3", title: "Simple Pendulum — Finding g", class: "Form 6A", dueDate: "May 15", submitted: 8, total: 15, status: "open" },
  { id: "a4", title: "Flame Tests for Metal Ions", class: "Form 4A", dueDate: "May 20", submitted: 0, total: 28, status: "draft" },
];

const EXPERIMENTS_POOL = [
  "Acid-Base Titration", "Flame Tests", "Rates of Reaction", "Ohm's Law",
  "Simple Pendulum", "Hooke's Law", "Electrolysis", "Refraction of Light",
  "Specific Heat Capacity", "Radioactive Decay", "Chromatography",
];

type Tab = "overview" | "students" | "assignments" | "analytics";

export default function TeacherPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [search, setSearch] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignForm, setAssignForm] = useState({ experiment: "", class: "", dueDate: "" });

  const filteredStudents = MOCK_STUDENTS.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.class.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Assignment "${assignForm.experiment}" created for ${assignForm.class}`);
    setShowAssignModal(false);
    setAssignForm({ experiment: "", class: "", dueDate: "" });
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      active: "bg-blue-500/15 text-blue-400",
      "at-risk": "bg-red-500/15 text-red-400",
      top: "bg-emerald-500/15 text-emerald-400",
    };
    return map[s] ?? "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <School className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage classes, assignments, and track student progress</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-accent rounded-full" />
            </Button>
            <Button onClick={() => setShowAssignModal(true)} className="bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary gap-2">
              <Plus className="h-4 w-4" /> New Assignment
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 glass-card rounded-xl p-1 mb-6 w-fit">
          {(["overview", "students", "assignments", "analytics"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${tab === t ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Students", value: "68", icon: Users, change: "+3 this week", color: "text-blue-400" },
                { label: "Experiments Assigned", value: "4", icon: FlaskConical, change: "3 active", color: "text-accent" },
                { label: "Average Score", value: "81%", icon: Award, change: "+4% vs last month", color: "text-emerald-400" },
                { label: "Completion Rate", value: "76%", icon: TrendingUp, change: "On track", color: "text-violet-400" },
              ].map(({ label, value, icon: Icon, change, color }) => (
                <div key={label} className="glass-card rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-xs text-muted-foreground font-medium">{label}</p>
                    <Icon className={`h-4 w-4 ${color}`} />
                  </div>
                  <p className="text-3xl font-bold mb-1">{value}</p>
                  <p className="text-xs text-muted-foreground">{change}</p>
                </div>
              ))}
            </div>

            {/* Classes */}
            <div>
              <h2 className="font-semibold text-lg mb-4">My Classes</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {MOCK_CLASSES.map((cls) => (
                  <div key={cls.id} className="glass-card rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">{cls.name}</h3>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setTab("students")}>
                        View <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">{cls.subject}</p>
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{cls.students}</p>
                        <p className="text-xs text-muted-foreground">Students</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-accent">{cls.avgScore}%</p>
                        <p className="text-xs text-muted-foreground">Avg Score</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">{Math.round((cls.completed / cls.students) * 100)}%</p>
                        <p className="text-xs text-muted-foreground">Complete</p>
                      </div>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-1.5">
                      <div className="bg-gradient-to-r from-primary to-accent h-1.5 rounded-full transition-all"
                        style={{ width: `${Math.round((cls.completed / cls.students) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div>
              <h2 className="font-semibold text-lg mb-4">Recent Activity</h2>
              <div className="glass-card rounded-2xl divide-y divide-white/5">
                {[
                  { text: "Nyasha Chirwa submitted Simple Pendulum lab report", time: "1h ago", icon: CheckCircle2, color: "text-emerald-400" },
                  { text: "Tatenda Mapfumo has not started Ohm's Law assignment", time: "2h ago", icon: Clock, color: "text-red-400" },
                  { text: "Ruvimbo Chikwanda scored 96% on Acid-Base Titration", time: "5h ago", icon: Award, color: "text-accent" },
                  { text: "Form 4B class average improved to 81%", time: "1d ago", icon: TrendingUp, color: "text-blue-400" },
                ].map(({ text, time, icon: Icon, color }, i) => (
                  <div key={i} className="flex items-start gap-3 px-5 py-4">
                    <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{text}</p>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Students */}
        {tab === "students" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search students…" className="pl-9 glass border-white/10" />
              </div>
              <Button variant="outline" size="sm" className="gap-2 glass border-white/10">
                <Download className="h-4 w-4" /> Export CSV
              </Button>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Student", "Class", "Experiments", "Avg Score", "Last Active", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-white/2 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-xs font-bold">
                            {student.name.charAt(0)}
                          </div>
                          <span className="font-medium">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{student.class}</td>
                      <td className="px-4 py-3">{student.experiments}</td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${student.avgScore >= 80 ? "text-emerald-400" : student.avgScore >= 60 ? "text-yellow-400" : "text-red-400"}`}>
                          {student.avgScore}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{student.lastActive}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${statusBadge(student.status)}`}>
                          {student.status === "at-risk" ? "At Risk" : student.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast.info(`Viewing ${student.name}'s profile`)}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast.info(`Email sent to ${student.name}`)}>
                            <Mail className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Assignments */}
        {tab === "assignments" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Assignments</h2>
              <Button onClick={() => setShowAssignModal(true)} size="sm" className="bg-gradient-to-r from-primary to-accent text-primary-foreground gap-2">
                <Plus className="h-4 w-4" /> New
              </Button>
            </div>
            <div className="space-y-3">
              {MOCK_ASSIGNMENTS.map((a) => (
                <div key={a.id} className="glass-card rounded-2xl p-5 flex items-center gap-4">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                    <FlaskConical className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{a.title}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${
                        a.status === "open" ? "bg-emerald-500/15 text-emerald-400" :
                        a.status === "closed" ? "bg-muted text-muted-foreground" :
                        "bg-orange-500/15 text-orange-400"
                      }`}>{a.status}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{a.class} · Due {a.dueDate}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold">{a.submitted}/{a.total}</p>
                    <p className="text-xs text-muted-foreground">submitted</p>
                  </div>
                  <div className="w-20 flex-shrink-0">
                    <div className="w-full bg-muted/30 rounded-full h-1.5 mb-1">
                      <div className="bg-gradient-to-r from-primary to-accent h-1.5 rounded-full"
                        style={{ width: `${Math.round((a.submitted / a.total) * 100)}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground text-right">{Math.round((a.submitted / a.total) * 100)}%</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast.info("Edit assignment")}>
                      <Edit3 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-400" onClick={() => toast.error("Assignment deleted")}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics */}
        {tab === "analytics" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" /> Score Distribution</h3>
                <div className="space-y-3">
                  {[
                    { label: "90–100%", count: 8, pct: 12, color: "bg-emerald-500" },
                    { label: "80–89%", count: 22, pct: 32, color: "bg-blue-500" },
                    { label: "70–79%", count: 18, pct: 26, color: "bg-violet-500" },
                    { label: "60–69%", count: 12, pct: 18, color: "bg-yellow-500" },
                    { label: "Below 60%", count: 8, pct: 12, color: "bg-red-500" },
                  ].map(({ label, count, pct, color }) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-16">{label}</span>
                      <div className="flex-1 bg-muted/30 rounded-full h-2">
                        <div className={`${color} h-2 rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-semibold w-8 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-accent" /> Top Experiments by Completion</h3>
                <div className="space-y-3">
                  {[
                    { name: "Acid-Base Titration", pct: 94 },
                    { name: "Ohm's Law", pct: 88 },
                    { name: "Flame Tests", pct: 82 },
                    { name: "Simple Pendulum", pct: 71 },
                    { name: "Hooke's Law", pct: 65 },
                  ].map(({ name, pct }) => (
                    <div key={name} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground flex-1">{name}</span>
                      <div className="w-24 bg-muted/30 rounded-full h-2">
                        <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-semibold w-8 text-right">{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Class Performance Summary</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      {["Class", "Students", "Avg Score", "Completion", "Experiments", "Trend"].map((h) => (
                        <th key={h} className="pb-3 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {MOCK_CLASSES.map((cls) => (
                      <tr key={cls.id}>
                        <td className="py-3 font-medium">{cls.name}</td>
                        <td className="py-3 text-muted-foreground">{cls.students}</td>
                        <td className="py-3">
                          <span className={`font-semibold ${cls.avgScore >= 80 ? "text-emerald-400" : "text-yellow-400"}`}>{cls.avgScore}%</span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-muted/30 rounded-full h-1.5">
                              <div className="bg-gradient-to-r from-primary to-accent h-1.5 rounded-full"
                                style={{ width: `${Math.round((cls.completed / cls.students) * 100)}%` }} />
                            </div>
                            <span className="text-xs">{Math.round((cls.completed / cls.students) * 100)}%</span>
                          </div>
                        </td>
                        <td className="py-3 text-muted-foreground">{cls.completed}</td>
                        <td className="py-3 text-emerald-400 text-xs">↑ Improving</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Assignment modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-strong rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-primary" /> Create Assignment
            </h2>
            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Experiment</label>
                <select value={assignForm.experiment} onChange={(e) => setAssignForm({ ...assignForm, experiment: e.target.value })} required
                  className="w-full glass border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/40 bg-transparent">
                  <option value="" style={{ background: "#1a1f3a" }}>Select an experiment…</option>
                  {EXPERIMENTS_POOL.map((e) => <option key={e} value={e} style={{ background: "#1a1f3a" }}>{e}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Assign to class</label>
                <select value={assignForm.class} onChange={(e) => setAssignForm({ ...assignForm, class: e.target.value })} required
                  className="w-full glass border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/40 bg-transparent">
                  <option value="" style={{ background: "#1a1f3a" }}>Select a class…</option>
                  {MOCK_CLASSES.map((c) => <option key={c.id} value={c.name} style={{ background: "#1a1f3a" }}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Due date</label>
                <Input type="date" value={assignForm.dueDate} onChange={(e) => setAssignForm({ ...assignForm, dueDate: e.target.value })} required
                  className="glass border-white/10" />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" className="flex-1 glass border-white/10" onClick={() => setShowAssignModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground">Create Assignment</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
