import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { PageHeader, Panel, StatusBadge, DocSourceTag } from "@/components/industrial";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { ZONES } from "@/lib/demo-data";

export const Route = createFileRoute("/plant")({
  head: () => ({
    meta: [
      { title: "Vue procédé usine — CBI Control" },
      {
        name: "description",
        content:
          "Synoptique du procédé cimentier : carrière, concassage, broyage cru, préchauffage, four, refroidissement, broyage ciment, silos, ensachage et expédition.",
      },
      { property: "og:title", content: "Vue procédé usine — CBI Control" },
      { property: "og:description", content: "Flux de production complet et état de chaque zone de la cimenterie." },
    ],
  }),
  component: PlantPage,
});

function PlantPage() {
  const { machines, alarms } = useStore();

  return (
    <AppLayout>
      <PageHeader
        title="Plant Overview — Synoptique du procédé"
        subtitle="Flux complet de la fabrication du ciment, de l'extraction du calcaire à l'expédition. Cliquez sur une zone pour voir ses équipements."
      />

      <Panel title="Chaîne de production" subtitle="14 zones supervisées">
        <div className="flex flex-wrap items-stretch gap-2">
          {ZONES.map((z, i) => {
            const zoneMachines = machines.filter((m) => m.zone === z.id);
            const zoneAlarms = alarms.filter((a) => a.zone === z.id && a.status !== "resolved");
            return (
              <div key={z.id} className="flex items-center gap-2">
                <div className="w-52 rounded-md border border-border bg-panel p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{z.name}</div>
                      <div className="truncate text-[11px] text-muted-foreground">{z.fr}</div>
                    </div>
                    <span className="text-mono-num text-[10px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <StatusBadge status={z.status} />
                    {zoneAlarms.length > 0 && (
                      <Badge variant="outline" className="border-critical/40 text-[10px] text-critical">
                        {zoneAlarms.length} alarme(s)
                      </Badge>
                    )}
                  </div>
                  <div className="text-mono-num mt-2 text-xs text-muted-foreground">{z.throughput}</div>
                  <div className="mt-2 space-y-1">
                    {zoneMachines.slice(0, 3).map((m) => (
                      <Link
                        key={m.id}
                        to="/machines/$id"
                        params={{ id: m.id }}
                        className="block truncate rounded px-1.5 py-0.5 text-[11px] text-primary hover:bg-accent"
                      >
                        {m.id} — {m.name}
                      </Link>
                    ))}
                    {zoneMachines.length === 0 && (
                      <span className="text-[11px] text-muted-foreground">{z.machines} équipements</span>
                    )}
                  </div>
                </div>
                {i < ZONES.length - 1 && <ArrowRight className="size-4 shrink-0 text-steel" />}
              </div>
            );
          })}
        </div>
        <DocSourceTag className="mt-4 block" />
      </Panel>
    </AppLayout>
  );
}
