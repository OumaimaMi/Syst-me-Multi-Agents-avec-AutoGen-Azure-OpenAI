import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, AlertTriangle, Cpu, Flame, Gauge, Siren, Wrench, Boxes } from "lucide-react";
import { AppLayout, useClock } from "@/components/app-layout";
import { KpiCard, PageHeader, Panel, SeverityBadge, StatusBadge } from "@/components/industrial";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Bars, Donut, TrendArea } from "@/components/charts";
import { useStore } from "@/lib/store";
import { ANALYTICS, PRODUCTION_SERIES, SILOS, ZONES, series } from "@/lib/demo-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard supervision — CBI Control" },
      {
        name: "description",
        content:
          "Vue d'ensemble temps réel de la cimenterie : machines en service, alarmes actives, production journalière, silos et incidents réseau.",
      },
      { property: "og:title", content: "Dashboard supervision — CBI Control" },
      { property: "og:description", content: "État global de l'usine, alarmes critiques et KPI de production." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { machines, alarms, tickets, incidents } = useStore();
  const clock = useClock();

  const operational = machines.filter((m) => m.status === "operational").length;
  const anomalies = machines.filter((m) => m.status === "anomaly" || m.status === "warning").length;
  const criticals = machines.filter((m) => m.status === "critical" || m.status === "stopped").length;
  const activeAlarms = alarms.filter((a) => a.status !== "resolved");
  const openTickets = tickets.filter((t) => !["Resolved", "Closed"].includes(t.status));
  const openIncidents = incidents.filter((i) => i.status !== "Closed");

  const statusDonut = [
    { name: "Operational", value: operational, color: "var(--color-ok)" },
    { name: "Warning / Anomaly", value: anomalies, color: "var(--color-warn)" },
    { name: "Critical / Stopped", value: criticals, color: "var(--color-critical)" },
    { name: "Maintenance", value: machines.filter((m) => m.status === "maintenance").length, color: "var(--color-maint)" },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Dashboard — Supervision usine"
        subtitle={`${clock.date} · ${clock.shift} · Ligne de cuisson en marche · Données simulées rafraîchies en continu`}
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <Link to="/alarms">
                <Siren className="mr-2 size-4" /> Alarmes actives ({activeAlarms.length})
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/plant">
                <Flame className="mr-2 size-4" /> Vue procédé
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Machines en service" value={`${operational}/${machines.length}`} tone="ok" icon={<Cpu className="size-4" />} hint="Équipements documentés supervisés" to="/machines" />
        <KpiCard label="Alarmes actives" value={activeAlarms.length} tone="critical" icon={<Siren className="size-4" />} hint={`${alarms.filter((a) => a.severity === "critical" && a.status !== "resolved").length} critiques`} to="/alarms" />
        <KpiCard label="Tickets maintenance" value={openTickets.length} tone="maint" icon={<Wrench className="size-4" />} hint="Correctif + préventif en cours" to="/maintenance" />
        <KpiCard label="Incidents cyber" value={openIncidents.length} tone="anomaly" icon={<AlertTriangle className="size-4" />} hint="Réseau IT / OT" to="/cyber-incidents" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Clinker aujourd'hui" value="3 940" unit="t" tone="info" icon={<Flame className="size-4" />} hint="Objectif 4 000 t" />
        <KpiCard label="Ciment broyé" value="2 985" unit="t" tone="info" icon={<Gauge className="size-4" />} hint="2 broyeurs / 3 en service" to="/production" />
        <KpiCard label="Disponibilité ligne" value={ANALYTICS.availability} unit="%" tone="ok" icon={<Activity className="size-4" />} hint={`MTBF ${ANALYTICS.mtbf} h · MTTR ${ANALYTICS.mttr} h`} to="/analytics" />
        <KpiCard label="Stock silos ciment" value="54" unit="%" tone="warn" icon={<Boxes className="size-4" />} hint="9 silos supervisés" to="/silos" />
      </div>

      <div className="grid gap-3 xl:grid-cols-3">
        <Panel title="Production 14 derniers jours" subtitle="Clinker · Ciment · Ensachage (t)" className="xl:col-span-2">
          <Bars
            data={PRODUCTION_SERIES}
            xKey="day"
            bars={[
              { key: "clinker", label: "Clinker", color: "var(--color-chart-1)" },
              { key: "cement", label: "Ciment", color: "var(--color-chart-2)" },
              { key: "ensachage", label: "Ensachage", color: "var(--color-chart-3)" },
            ]}
            height={260}
          />
        </Panel>
        <Panel title="Répartition état machines">
          <Donut data={statusDonut} height={260} />
        </Panel>
      </div>

      <div className="grid gap-3 xl:grid-cols-3">
        <Panel
          title="Alarmes récentes"
          subtitle="Priorité décroissante"
          className="xl:col-span-2"
          actions={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/alarms">Tout voir</Link>
            </Button>
          }
        >
          <ul className="divide-y divide-border">
            {activeAlarms.slice(0, 6).map((a) => (
              <li key={a.id} className="flex flex-wrap items-center gap-3 py-2.5">
                <SeverityBadge severity={a.severity} />
                <Link
                  to="/machines/$id"
                  params={{ id: a.machineId }}
                  className="text-mono-num text-xs text-primary hover:underline"
                >
                  {a.machineId}
                </Link>
                <span className="min-w-0 flex-1 truncate text-sm">{a.label}</span>
                <span className="text-mono-num text-xs text-muted-foreground">
                  {a.date} {a.time}
                </span>
                <Badge variant="outline" className="text-[10px] capitalize">
                  {a.status}
                </Badge>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Température four 4K1" subtitle="Zone de cuisson (°C) — 24 h">
          <TrendArea data={series(24, 1420, 60, 5)} color="var(--color-chart-3)" height={180} />
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-md border border-border p-2">
              <div className="text-muted-foreground">Débit clinker</div>
              <div className="text-mono-num font-semibold">164 t/h</div>
            </div>
            <div className="rounded-md border border-border p-2">
              <div className="text-muted-foreground">Vitesse rotation</div>
              <div className="text-mono-num font-semibold">3.1 tr/min</div>
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        <Panel
          title="État des zones de production"
          actions={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/plant">Synoptique</Link>
            </Button>
          }
        >
          <div className="grid gap-2 sm:grid-cols-2">
            {ZONES.map((z) => (
              <div key={z.id} className="flex items-center justify-between gap-2 rounded-md border border-border p-2.5">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{z.name}</div>
                  <div className="truncate text-[11px] text-muted-foreground">
                    {z.fr} · {z.machines} équipements · {z.throughput}
                  </div>
                </div>
                <StatusBadge status={z.status} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Silos ciment"
          actions={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/silos">Détails</Link>
            </Button>
          }
        >
          <ul className="space-y-3">
            {SILOS.slice(0, 6).map((s) => (
              <li key={s.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{s.id}</span>
                  <span className="text-mono-num text-xs text-muted-foreground">
                    {s.level}% · {s.capacityLabel}
                  </span>
                </div>
                <Progress value={s.level} className="mt-1.5 h-2" />
                <div className="mt-1 text-[11px] text-muted-foreground">{s.product}</div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </AppLayout>
  );
}
