import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { MultiLine, TrendArea } from "@/components/charts";
import { KpiCard, PageHeader, Panel, StatusBadge, Metric } from "@/components/industrial";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MACHINES, ZONES } from "@/lib/demo-data";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title: "Supervision du procédé — CBI Control" },
      {
        name: "description",
        content:
          "Supervision temps réel du procédé de cuisson et de broyage : température, vibration, charge et débits par zone de la cimenterie.",
      },
      { property: "og:title", content: "Supervision du procédé — CBI Control" },
      { property: "og:description", content: "Vue SCADA des paramètres procédé zone par zone." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProcessPage,
});

const series = (base: number, amp: number, seed: number) =>
  Array.from({ length: 24 }, (_, i) => ({
    t: `${String(i).padStart(2, "0")}h`,
    value: Math.round((base + Math.sin((i + seed) / 2.4) * amp + ((i * seed) % 5)) * 10) / 10,
  }));

function ProcessPage() {
  const [zone, setZone] = useState("kiln");
  const machines = useMemo(() => MACHINES.filter((m) => m.zone === zone), [zone]);
  const z = ZONES.find((x) => x.id === zone)!;

  const kilnSeries = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        t: `${String(i).padStart(2, "0")}h`,
        cuisson: 1440 + Math.round(Math.sin(i / 2.2) * 22),
        precal: 880 + Math.round(Math.cos(i / 1.9) * 18),
        gaz: 320 + Math.round(Math.sin(i / 3.1) * 12),
      })),
    [],
  );

  return (
    <AppLayout>
      <PageHeader
        title="Supervision du procédé"
        subtitle="Vue de type SCADA : sélectionnez une zone du procédé pour suivre ses paramètres et ses équipements."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Débit four" value="3 940" unit="t/j" tone="ok" />
        <KpiCard label="Température cuisson" value="1 442" unit="°C" tone="warn" />
        <KpiCard label="Broyage ciment" value="142" unit="t/h" tone="critical" />
        <KpiCard label="Énergie spécifique" value="96.4" unit="kWh/t" tone="info" />
      </div>

      <Panel title="Zones du procédé" subtitle="Cliquez pour changer de zone supervisée">
        <div className="flex flex-wrap gap-2">
          {ZONES.map((x) => (
            <Button
              key={x.id}
              size="sm"
              variant={x.id === zone ? "default" : "outline"}
              onClick={() => setZone(x.id)}
              className="text-xs"
            >
              {x.fr}
            </Button>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2" title={`Courbes 24 h — ${z.fr}`} subtitle="Valeurs simulées, pas de commande possible (lecture seule)">
          {zone === "kiln" ? (
            <MultiLine
              data={kilnSeries}
              xKey="t"
              lines={[
                { key: "cuisson", label: "Zone cuisson (°C)", color: "var(--color-critical)" },
                { key: "precal", label: "Précalcinateur (°C)", color: "var(--color-warn)" },
                { key: "gaz", label: "Gaz sortie (°C)", color: "var(--color-info)" },
              ]}
            />
          ) : (
            <TrendArea data={series(z.machines * 12 + 40, 8, z.machines)} height={240} />
          )}
        </Panel>

        <Panel title="État de la zone">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">{z.name}</span>
              <StatusBadge status={z.status} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Metric label="Débit" value={z.throughput} />
              <Metric label="Équipements" value={z.machines} />
              <Metric label="Marche" value="Auto" />
              <Metric label="Mode" value="Lecture seule" />
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Équipements de la zone" subtitle="Paramètres instantanés">
        {machines.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Aucun équipement instrumenté dans cette zone pour le moment.
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {machines.map((m) => (
              <Link
                key={m.id}
                to="/machines/$id"
                params={{ id: m.id }}
                className="rounded-md border border-border bg-background/40 p-3 transition-colors hover:bg-accent/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-medium">{m.name}</div>
                    <div className="text-mono-num text-xs text-muted-foreground">{m.id}</div>
                  </div>
                  <StatusBadge status={m.status} />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <Metric label="Temp." value={m.temperature ?? "—"} unit="°C" />
                  <Metric label="Vibr." value={m.vibration ?? "—"} unit="mm/s" />
                  <Metric label="Charge" value={m.load ?? "—"} unit="%" />
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {m.params.slice(0, 3).map((p) => (
                    <Badge key={p.key} variant="outline" className="text-[10px]">
                      {p.label} : {p.value ?? "—"} {p.unit}
                    </Badge>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </Panel>
    </AppLayout>
  );
}
