import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppLayout } from "@/components/app-layout";
import { KpiCard, PageHeader, Panel, SeverityBadge } from "@/components/industrial";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/alarms")({
  head: () => ({
    meta: [
      { title: "Centre d'alarmes — CBI Control" },
      {
        name: "description",
        content:
          "Centre d'alarmes de la cimenterie : acquittement, affectation d'un technicien et résolution des alarmes machines par criticité.",
      },
      { property: "og:title", content: "Centre d'alarmes — CBI Control" },
      { property: "og:description", content: "Traitez les alarmes actives : acquitter, affecter, résoudre." },
    ],
  }),
  component: AlarmsPage,
});

const TECHS = ["M. Trabelsi", "A. Ben Salah", "S. Hamdi", "R. Ouertani", "Maintenance Team A", "Maintenance Team B"];

function AlarmsPage() {
  const { alarms, acknowledgeAlarm, assignAlarm, resolveAlarm, user } = useStore();
  const [sev, setSev] = useState("all");
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");

  const rows = alarms.filter((a) => {
    const term = q.trim().toLowerCase();
    return (
      (!term || (a.id + a.label + a.machineId).toLowerCase().includes(term)) &&
      (sev === "all" || a.severity === sev) &&
      (status === "all" || a.status === status)
    );
  });

  const count = (s: string) => alarms.filter((a) => a.severity === s && a.status !== "resolved").length;

  return (
    <AppLayout>
      <PageHeader
        title="Centre d'alarmes"
        subtitle={`Connecté en tant que ${user?.name ?? "invité"} — vous pouvez acquitter, affecter un technicien et clôturer une alarme.`}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Critiques" value={count("critical")} tone="critical" />
        <KpiCard label="Élevées" value={count("high")} tone="anomaly" />
        <KpiCard label="Moyennes" value={count("medium")} tone="warn" />
        <KpiCard label="Résolues" value={alarms.filter((a) => a.status === "resolved").length} tone="ok" />
      </div>

      <Panel>
        <div className="grid gap-2 sm:grid-cols-3">
          <Input placeholder="Rechercher une alarme..." value={q} onChange={(e) => setQ(e.target.value)} />
          <Select value={sev} onValueChange={setSev}>
            <SelectTrigger><SelectValue placeholder="Criticité" /></SelectTrigger>
            <SelectContent>
              {["all", "critical", "high", "medium", "low"].map((s) => (
                <SelectItem key={s} value={s} className="capitalize">{s === "all" ? "Toutes criticités" : s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue placeholder="Statut" /></SelectTrigger>
            <SelectContent>
              {["all", "active", "acknowledged", "resolved"].map((s) => (
                <SelectItem key={s} value={s} className="capitalize">{s === "all" ? "Tous statuts" : s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date / heure</TableHead>
                <TableHead>Machine</TableHead>
                <TableHead>Alarme</TableHead>
                <TableHead>Criticité</TableHead>
                <TableHead>Technicien</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="text-mono-num text-xs">{a.id}</TableCell>
                  <TableCell className="text-mono-num text-xs">{a.date} {a.time}</TableCell>
                  <TableCell>
                    <Link to="/machines/$id" params={{ id: a.machineId }} className="text-mono-num text-xs text-primary hover:underline">
                      {a.machineId}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-72 text-sm">
                    {a.label}
                    {a.resolution && <div className="text-xs text-ok">Résolution : {a.resolution}</div>}
                  </TableCell>
                  <TableCell><SeverityBadge severity={a.severity} /></TableCell>
                  <TableCell className="text-xs">
                    {a.status === "resolved" ? (
                      a.technician ?? "—"
                    ) : (
                      <Select
                        value={a.technician ?? ""}
                        onValueChange={(v) => {
                          assignAlarm(a.id, v);
                          toast.success(`Alarme ${a.id} affectée à ${v}`);
                        }}
                      >
                        <SelectTrigger className="h-8 w-40 text-xs"><SelectValue placeholder="Affecter..." /></SelectTrigger>
                        <SelectContent>
                          {TECHS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px] capitalize">{a.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      {a.status === "active" && (
                        <Button size="sm" variant="outline" onClick={() => { acknowledgeAlarm(a.id, a.technician ?? "Opérateur"); toast.success(`Alarme ${a.id} acquittée`); }}>
                          Acquitter
                        </Button>
                      )}
                      {a.status !== "resolved" && (
                        <Button size="sm" onClick={() => { resolveAlarm(a.id, "Intervention réalisée — paramètres revenus dans la plage"); toast.success(`Alarme ${a.id} résolue`); }}>
                          Résoudre
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow><TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">Aucune alarme.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Panel>
    </AppLayout>
  );
}
