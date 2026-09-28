import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  BellRing,
  Boxes,
  ClipboardList,
  Cpu,
  Database,
  FileText,
  Flame,
  Gauge,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  Network,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  Siren,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DOCUMENTS, FIREWALL_EVENTS, MACHINES, NET_NODES, ZONES } from "@/lib/demo-data";
import { SimulatedTag } from "@/components/industrial";

const NAV: { group: string; items: { to: string; label: string; icon: typeof Gauge }[] }[] = [
  {
    group: "Supervision",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/plant", label: "Plant Overview", icon: Flame },
      { to: "/machines", label: "Machines", icon: Cpu },
      { to: "/process", label: "Process Monitoring", icon: Activity },
      { to: "/alarms", label: "Alarms", icon: Siren },
    ],
  },
  {
    group: "Exploitation",
    items: [
      { to: "/maintenance", label: "Maintenance", icon: Wrench },
      { to: "/schematics", label: "Technical Schematics", icon: Network },
      { to: "/production", label: "Production", icon: Gauge },
      { to: "/quality", label: "Quality Control", icon: ClipboardList },
      { to: "/silos", label: "Silos", icon: Boxes },
      { to: "/analytics", label: "Analytics", icon: LineChart },
    ],
  },
  {
    group: "IT & Cybersecurity",
    items: [
      { to: "/it-monitoring", label: "IT Monitoring", icon: Database },
      { to: "/firewall", label: "Firewall Security", icon: Shield },
      { to: "/ot-security", label: "OT Security", icon: ShieldAlert },
      { to: "/cyber-incidents", label: "Cyber Incidents", icon: AlertTriangle },
    ],
  },
  {
    group: "Administration",
    items: [
      { to: "/reports", label: "Reports", icon: FileText },
      { to: "/documentation", label: "Documentation", icon: FileText },
      { to: "/company", label: "Company Information", icon: Boxes },
      { to: "/users", label: "Users", icon: Users },
      { to: "/audit-logs", label: "Audit Logs", icon: ClipboardList },
      { to: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

function shift(d: Date) {
  const h = d.getHours();
  if (h >= 6 && h < 14) return "Shift A (06:00 – 14:00)";
  if (h >= 14 && h < 22) return "Shift B (14:00 – 22:00)";
  return "Shift C (22:00 – 06:00)";
}

export function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return {
    date: now ? now.toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }) : "—",
    time: now ? now.toLocaleTimeString("fr-FR") : "--:--:--",
    shift: now ? shift(now) : "—",
  };
}

function GlobalSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { alarms, tickets, incidents } = useStore();
  const term = q.trim().toLowerCase();

  const results = term
    ? [
        ...MACHINES.filter((m) => (m.id + m.name + m.type).toLowerCase().includes(term)).map((m) => ({
          kind: "Machine",
          label: `${m.id} — ${m.name}`,
          go: () => navigate({ to: "/machines/$id" as "/", params: { id: m.id } as never }),
        })),
        ...ZONES.filter((z) => (z.name + z.fr).toLowerCase().includes(term)).map((z) => ({
          kind: "Zone",
          label: `${z.name} (${z.fr})`,
          go: () => navigate({ to: "/plant" as "/" }),
        })),
        ...alarms.filter((a) => (a.id + a.label).toLowerCase().includes(term)).map((a) => ({
          kind: "Alarm",
          label: `${a.id} — ${a.label}`,
          go: () => navigate({ to: "/alarms" as "/" }),
        })),
        ...tickets.filter((t) => (t.id + t.problem + t.assignee).toLowerCase().includes(term)).map((t) => ({
          kind: "Ticket",
          label: `${t.id} — ${t.problem}`,
          go: () => navigate({ to: "/maintenance" as "/" }),
        })),
        ...DOCUMENTS.filter((d) => d.title.toLowerCase().includes(term)).map((d) => ({
          kind: "Document",
          label: d.title,
          go: () => navigate({ to: "/documentation" as "/" }),
        })),
        ...NET_NODES.filter((n) => (n.name + n.ip).toLowerCase().includes(term)).map((n) => ({
          kind: "Network",
          label: `${n.name} — ${n.ip}`,
          go: () => navigate({ to: "/it-monitoring" as "/" }),
        })),
        ...FIREWALL_EVENTS.filter((f) => (f.id + f.type + f.source).toLowerCase().includes(term)).map((f) => ({
          kind: "Firewall",
          label: `${f.id} — ${f.type}`,
          go: () => navigate({ to: "/firewall" as "/" }),
        })),
        ...incidents.filter((i) => (i.id + i.title).toLowerCase().includes(term)).map((i) => ({
          kind: "Incident",
          label: `${i.id} — ${i.title}`,
          go: () => navigate({ to: "/cyber-incidents" as "/" }),
        })),
      ].slice(0, 12)
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-sm">Global search</DialogTitle>
        </DialogHeader>
        <Input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Machine, code équipement (4K1.KN01), alarme, ticket, incident réseau..."
        />
        <div className="max-h-80 space-y-1 overflow-y-auto">
          {term && results.length === 0 && <p className="p-3 text-sm text-muted-foreground">Aucun résultat.</p>}
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => {
                r.go();
                onOpenChange(false);
                setQ("");
              }}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
            >
              <Badge variant="outline" className="shrink-0 text-[10px]">
                {r.kind}
              </Badge>
              <span className="truncate">{r.label}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function NotificationBell() {
  const { notifications, markNotificationsRead } = useStore();
  const unread = notifications.filter((n) => !n.read).length;
  const dot: Record<string, string> = {
    critical: "bg-critical",
    high: "bg-anomaly",
    medium: "bg-warn",
    info: "bg-info",
    ok: "bg-ok",
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellRing className="size-4" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-critical text-[10px] font-bold text-foreground">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <span className="text-sm font-semibold">Notifications</span>
          <Button variant="ghost" size="sm" onClick={markNotificationsRead}>
            Tout marquer lu
          </Button>
        </div>
        <ScrollArea className="max-h-80">
          <ul className="divide-y divide-border">
            {notifications.map((n) => (
              <li key={n.id} className={cn("flex gap-3 px-3 py-2.5", !n.read && "bg-accent/30")}>
                <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", dot[n.level])} />
                <div className="min-w-0">
                  <div className="text-sm font-medium">{n.title}</div>
                  <div className="truncate text-xs text-muted-foreground">{n.detail}</div>
                  <div className="text-mono-num text-[11px] text-muted-foreground">{n.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileNav, setMobileNav] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const clock = useClock();

  useEffect(() => {
    setMobileNav(false);
  }, [pathname]);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        if (!window.localStorage.getItem("cbi-session")) navigate({ to: "/" });
      } catch {
        /* ignore */
      }
    }, 250);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:translate-x-0",
          mobileNav ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-2.5 border-b border-sidebar-border px-4 py-3.5">
          <div className="grid size-9 place-items-center rounded-md bg-primary/15 ring-1 ring-primary/40">
            <Flame className="size-5 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">CBI Control</div>
            <div className="truncate text-[10px] tracking-wide text-muted-foreground uppercase">Ciment Bizerte</div>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={() => setMobileNav(false)}>
            <X className="size-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <nav className="space-y-5 px-2 py-4">
            {NAV.map((g) => (
              <div key={g.group}>
                <div className="px-2.5 pb-1.5 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                  {g.group}
                </div>
                <ul className="space-y-0.5">
                  {g.items.map((it) => {
                    const active = pathname === it.to || pathname.startsWith(`${it.to}/`);
                    return (
                      <li key={it.to}>
                        <Link
                          to={it.to as "/dashboard"}
                          className={cn(
                            "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                            active
                              ? "bg-primary/15 font-medium text-primary ring-1 ring-primary/30"
                              : "text-sidebar-foreground hover:bg-sidebar-accent",
                          )}
                        >
                          <it.icon className="size-4 shrink-0" />
                          <span className="truncate">{it.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </ScrollArea>
        <div className="border-t border-sidebar-border p-3">
          <SimulatedTag className="w-full justify-center" />
        </div>
      </aside>

      {mobileNav && <div className="fixed inset-0 z-30 bg-background/70 lg:hidden" onClick={() => setMobileNav(false)} />}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-background/85 px-3 py-2.5 backdrop-blur sm:px-5">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileNav(true)}>
            <Menu className="size-5" />
          </Button>
          <button
            onClick={() => setSearchOpen(true)}
            className="flex h-9 flex-1 items-center gap-2 rounded-md border border-input bg-panel px-3 text-sm text-muted-foreground hover:bg-accent/50 sm:max-w-md"
          >
            <Search className="size-4" />
            <span className="truncate">Search machine, alarm, ticket, firewall event...</span>
          </button>
          <div className="ml-auto hidden text-right md:block">
            <div className="text-mono-num text-sm font-semibold">{clock.time}</div>
            <div className="text-[11px] text-muted-foreground">{clock.shift}</div>
          </div>
          <NotificationBell />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="h-9 gap-2 px-2">
                <span className="grid size-7 place-items-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                  {(user?.name ?? "?").slice(0, 2).toUpperCase()}
                </span>
                <span className="hidden text-left sm:block">
                  <span className="block text-xs font-medium leading-tight">{user?.name ?? "Invité"}</span>
                  <span className="block text-[10px] leading-tight text-muted-foreground">{user?.role ?? "—"}</span>
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56">
              <div className="mb-2">
                <div className="text-sm font-semibold">{user?.name ?? "Invité"}</div>
                <div className="text-xs text-muted-foreground">
                  {user?.matricule} · {user?.role}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  logout();
                  navigate({ to: "/" });
                }}
              >
                <LogOut className="mr-2 size-4" /> Se déconnecter
              </Button>
            </PopoverContent>
          </Popover>
        </header>

        <main className="min-w-0 flex-1 space-y-5 p-3 sm:p-5">{children}</main>
        <footer className="border-t border-border px-5 py-3 text-[11px] text-muted-foreground">
          CBI Control — Industrial Monitoring • Maintenance • Production • Cybersecurity. Prototype en mode démo :
          toutes les mesures sont simulées. Aucune commande n'est envoyée aux PLC, machines ou règles firewall.
        </footer>
      </div>

      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
