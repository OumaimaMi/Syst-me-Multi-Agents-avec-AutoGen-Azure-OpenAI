import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Brain, FileText, Wrench } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/app-layout";
import { DocSourceTag, Metric, PageHeader, Panel, SeverityBadge, StatusBadge, Timeline } from "@/components/industrial";
import { MultiLine, TrendArea } from "@/components/charts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/lib/store";
import { DEFAULT_TIMELINE, MACHINE_TIMELINE, ZONES, diagnosisFor, series } from "@/lib/demo-data";

export const Route = createFileRoute("/machines/$id")({
  head: () => ({
    meta: [
      { title: "Fiche équipement — CBI Control" },
      {
        name: "description",
        content:
          "Détail d'un équipement : paramètres temps réel, courbes de tendance, historique d'alarmes, diagnostic assisté et plan de maintenance.",
      },
      { property: "og:title", content: "Fiche équipement — CBI Control" },
      { property: "og:description", content: "Paramètres, tendances, diagnostic et maintenance de l'équipement." },
    ],
  }),
  component: MachineDetail,
});

function MachineDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { machines, alarms, tickets, createTicket } = useStore();
  const machine = machines.find((m) => m.id === id);

  if (!machine) {
    return (
      <AppLayout>
        <PageHeader title="Équipement introuvable" subtitle={`Aucun équipement avec le code ${id}.`} simulated={false} />
        <Button variant="outline" asChild>
          <Link to="/machines">
            <ArrowLeft className="mr-2 size-4" /> Retour à la liste
          </Link>
        </Button>
      </AppLayout>
    );
  }

  const zone = ZONES.find((z) => z.id === machine.zone);
  const diag = diagnosisFor(machine);
  const machineAlarms = alarms.filter((a) => a.machineId === machine.id);
  const machineTickets = tickets.filter((t) => t.machineId === machine.id);
  const timeline = MACHINE_TIMELINE[machine.id] ?? DEFAULT_TIMELINE;

  const tempSeries = series(24, machine.temperature ?? 60, 8, 3);
  const vibSeries = series(24, machine.vibration ?? 3, 1.2, 7);
  const combined = tempSeries.map((d, i) => ({
    t: d.t,
    temperature: d.value,
    vibration: vibSeries[i]?.value ?? 0,
  }));

  const openTicket = () => {
    const ticketId = createTicket({
      machineId: machine.id,
      problem: diag.problem,
      kind: "corrective",
      priority: diag.severity,
      status: "Open",
      assignee: "Maintenance Team A",
      created: new Date().toISOString().slice(0, 10),
      due: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      duration: "4 h",
      diagnosis: diag.causes[0] ?? "À confirmer",
    });
    toast.success(`Ticket ${ticketId} créé`, { description: "Consultez le module Maintenance." });
    navigate({ to: "/maintenance" });
  };

  return (
    <AppLayout>
      <PageHeader
        title={`${machine.id} — ${machine.name}`}
        subtitle={`${machine.type} · Zone ${zone?.fr ?? machine.zone} · Criticité ${machine.criticality} · Responsable ${machine.owner}`}
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <Link to="/machines">
                <ArrowLeft className="mr-2 size-4" /> Liste
              </Link>
            </Button>
            <Button size="sm" onClick={openTicket}>
              <Wrench className="mr-2 size-4" /> Créer un ticket
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={machine.status} />
        {machine.documented && <Badge variant="outline" className="text-[10px]">Documenté</Badge>}
        <span className="text-xs text-muted-foreground">Dernière alarme : {machine.lastAlarm}</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Température" value={machine.temperature ?? "—"} unit="°C" />
        <Metric label="Vibration" value={machine.vibration ?? "—"} unit="mm/s" />
        <Metric label="Charge" value={machine.load ?? "—"} unit="%" />
        <Metric label="Prochaine maintenance" value={machine.nextMaintenance} />
      </div>

      <Tabs defaultValue="params">
        <TabsList className="flex-wrap">
          <TabsTrigger value="params">Paramètres</TabsTrigger>
          <TabsTrigger value="trends">Courbes</TabsTrigger>
          <TabsTrigger value="diag">Diagnostic</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="specs">Fiche technique</TabsTrigger>
        </TabsList>

        <TabsContent value="params" className="mt-3">
          <Panel title="Paramètres surveillés" subtitle="Valeur courante vs seuil maximum admissible">
            <ul className="space-y-3">
              {machine.params.map((p) => {
                const pct = p.value !== null && p.max ? Math.min(100, Math.round((p.value / p.max) * 100)) : 0;
                return (
                  <li key={p.key}>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                      <span>{p.label}</span>
                      <span className="text-mono-num text-xs text-muted-foreground">
                        {p.value ?? "Data not available"} {p.value !== null ? p.unit : ""} · max {p.max} {p.unit}
                      </span>
                    </div>
                    <Progress value={pct} className="mt-1.5 h-2" />
                  </li>
                );
              })}
            </ul>
          </Panel>
        </TabsContent>

        <TabsContent value="trends" className="mt-3 space-y-3">
          <Panel title="Température — 24 h" subtitle="°C">
            <TrendArea data={tempSeries} color="var(--color-chart-3)" height={220} />
          </Panel>
          <Panel title="Température vs vibration" subtitle="Corrélation sur 24 h">
            <MultiLine
              data={combined}
              xKey="t"
              lines={[
                { key: "temperature", label: "Température (°C)", color: "var(--color-chart-3)" },
                { key: "vibration", label: "Vibration (mm/s)", color: "var(--color-chart-2)" },
              ]}
            />
          </Panel>
        </TabsContent>

        <TabsContent value="diag" className="mt-3">
          <Panel
            title="Diagnostic assisté"
            subtitle="Analyse basée sur les paramètres et l'historique — aide à la décision, pas une commande automatique"
          >
            <div className="flex flex-wrap items-center gap-3">
              <Brain className="size-5 text-primary" />
              <span className="font-medium">{diag.problem}</span>
              <SeverityBadge severity={diag.severity} />
              <Badge variant="outline" className="text-mono-num text-[10px]">
                Confiance {diag.probability}%
              </Badge>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Causes probables</h3>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {diag.causes.map((c) => (
                    <li key={c} className="rounded-md border border-border p-2">{c}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Actions recommandées</h3>
                <ol className="mt-2 space-y-1.5 text-sm">
                  {diag.actions.map((a, i) => (
                    <li key={a} className="flex gap-2 rounded-md border border-border p-2">
                      <span className="text-mono-num text-xs text-primary">{i + 1}</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="history" className="mt-3 grid gap-3 lg:grid-cols-2">
          <Panel title="Chronologie">
            <Timeline items={timeline} />
          </Panel>
          <div className="space-y-3">
            <Panel title="Alarmes de l'équipement">
              {machineAlarms.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune alarme enregistrée.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {machineAlarms.map((a) => (
                    <li key={a.id} className="flex flex-wrap items-center gap-2 py-2 text-sm">
                      <SeverityBadge severity={a.severity} />
                      <span className="min-w-0 flex-1 truncate">{a.label}</span>
                      <span className="text-mono-num text-xs text-muted-foreground">{a.date}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
            <Panel title="Tickets maintenance">
              {machineTickets.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun ticket.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {machineTickets.map((t) => (
                    <li key={t.id} className="flex flex-wrap items-center gap-2 py-2 text-sm">
                      <span className="text-mono-num text-xs text-primary">{t.id}</span>
                      <span className="min-w-0 flex-1 truncate">{t.problem}</span>
                      <Badge variant="outline" className="text-[10px]">{t.status}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>
        </TabsContent>

        <TabsContent value="specs" className="mt-3">
          <Panel title="Caractéristiques techniques" subtitle="Données constructeur / documentation interne">
            <dl className="grid gap-2 sm:grid-cols-2">
              {machine.specs.map((s) => (
                <div key={s.label} className="rounded-md border border-border p-2.5">
                  <dt className="text-[11px] tracking-wide text-muted-foreground uppercase">{s.label}</dt>
                  <dd className="text-mono-num text-sm">{s.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex items-center gap-3">
              <DocSourceTag />
              <Button variant="outline" size="sm" asChild>
                <Link to="/documentation">
                  <FileText className="mr-2 size-4" /> Documentation
                </Link>
              </Button>
            </div>
          </Panel>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
