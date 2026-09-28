import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppLayout } from "@/components/app-layout";
import { KpiCard, PageHeader, Panel, SeverityBadge } from "@/components/industrial";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { MACHINES, type Ticket } from "@/lib/demo-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/maintenance")({
  head: () => ({
    meta: [
      { title: "Gestion de la maintenance — CBI Control" },
      {
        name: "description",
        content:
          "Créez et suivez les ordres de travail préventifs et correctifs de la cimenterie : priorité, technicien affecté, échéance et avancement.",
      },
      { property: "og:title", content: "Gestion de la maintenance — CBI Control" },
      { property: "og:description", content: "Ordres de travail préventifs et correctifs, suivi et affectation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MaintenancePage,
});

const STATUSES: Ticket["status"][] = ["Open", "Assigned", "In Progress", "Waiting Parts", "Resolved", "Closed"];
const ASSIGNEES = ["Maintenance Team A", "Maintenance Team B", "M. Trabelsi", "S. Hamdi", "Équipe Prédictive", "Équipe Four"];

function MaintenancePage() {
  const { tickets, createTicket, updateTicketStatus } = useStore();
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("all");
  const [form, setForm] = useState({
    machineId: MACHINES[0]!.id,
    problem: "",
    kind: "corrective" as Ticket["kind"],
    priority: "medium" as Ticket["priority"],
    assignee: ASSIGNEES[0]!,
    due: "2026-09-01",
  });

  const rows = tickets.filter((t) => {
    const term = q.trim().toLowerCase();
    return (
      (!term || (t.id + t.machineId + t.problem + t.assignee).toLowerCase().includes(term)) &&
      (kind === "all" || t.kind === kind)
    );
  });

  const open = tickets.filter((t) => !["Resolved", "Closed"].includes(t.status)).length;

  const submit = () => {
    if (!form.problem.trim()) {
      toast.error("Décrivez le problème avant de créer l'ordre de travail.");
      return;
    }
    const id = createTicket({
      machineId: form.machineId,
      problem: form.problem.trim(),
      kind: form.kind,
      priority: form.priority,
      status: "Open",
      assignee: form.assignee,
      created: new Date().toISOString().slice(0, 10),
      due: form.due,
      duration: "—",
    });
    toast.success(`Ordre de travail ${id} créé`);
    setForm((f) => ({ ...f, problem: "" }));
  };

  return (
    <AppLayout>
      <PageHeader
        title="Gestion de la maintenance"
        subtitle="Ordres de travail préventifs et correctifs : création, affectation et suivi d'avancement."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Ordres ouverts" value={open} tone="warn" />
        <KpiCard label="Préventifs" value={tickets.filter((t) => t.kind === "preventive").length} tone="info" />
        <KpiCard label="Correctifs" value={tickets.filter((t) => t.kind === "corrective").length} tone="anomaly" />
        <KpiCard label="Clôturés" value={tickets.filter((t) => ["Resolved", "Closed"].includes(t.status)).length} tone="ok" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-1" title="Nouvel ordre de travail">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Équipement</Label>
              <Select value={form.machineId} onValueChange={(v) => setForm((f) => ({ ...f, machineId: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MACHINES.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.id} — {m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Problème / intervention</Label>
              <Textarea
                rows={3}
                value={form.problem}
                onChange={(e) => setForm((f) => ({ ...f, problem: e.target.value }))}
                placeholder="Ex. Température moteur élevée sur broyeur ciment 1"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Type</Label>
                <Select value={form.kind} onValueChange={(v) => setForm((f) => ({ ...f, kind: v as Ticket["kind"] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corrective">Correctif</SelectItem>
                    <SelectItem value="preventive">Préventif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Priorité</Label>
                <Select value={form.priority} onValueChange={(v) => setForm((f) => ({ ...f, priority: v as Ticket["priority"] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["critical", "high", "medium", "low"].map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Affecté à</Label>
                <Select value={form.assignee} onValueChange={(v) => setForm((f) => ({ ...f, assignee: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ASSIGNEES.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Échéance</Label>
                <Input type="date" value={form.due} onChange={(e) => setForm((f) => ({ ...f, due: e.target.value }))} />
              </div>
            </div>
            <Button className="w-full" onClick={submit}>Créer l'ordre de travail</Button>
          </div>
        </Panel>

        <Panel className="lg:col-span-2" title="Ordres de travail">
          <div className="grid gap-2 sm:grid-cols-2">
            <Input placeholder="Rechercher (ID, machine, technicien)..." value={q} onChange={(e) => setQ(e.target.value)} />
            <Select value={kind} onValueChange={setKind}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous types</SelectItem>
                <SelectItem value="preventive">Préventif</SelectItem>
                <SelectItem value="corrective">Correctif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Machine</TableHead>
                  <TableHead>Intervention</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Technicien</TableHead>
                  <TableHead>Échéance</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="text-mono-num text-xs">{t.id}</TableCell>
                    <TableCell>
                      <Link to="/machines/$id" params={{ id: t.machineId }} className="text-mono-num text-xs text-primary hover:underline">
                        {t.machineId}
                      </Link>
                    </TableCell>
                    <TableCell className="max-w-64 text-sm">
                      {t.problem}
                      <Badge variant="outline" className="ml-2 text-[10px] capitalize">{t.kind}</Badge>
                      {t.diagnosis && <div className="text-xs text-muted-foreground">{t.diagnosis}</div>}
                    </TableCell>
                    <TableCell><SeverityBadge severity={t.priority} /></TableCell>
                    <TableCell className="text-xs">{t.assignee}</TableCell>
                    <TableCell className="text-mono-num text-xs">{t.due}</TableCell>
                    <TableCell>
                      <Select
                        value={t.status}
                        onValueChange={(v) => {
                          updateTicketStatus(t.id, v as Ticket["status"]);
                          toast.success(`${t.id} → ${v}`);
                        }}
                      >
                        <SelectTrigger className="h-8 w-36 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">Aucun ordre de travail.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Panel>
      </div>
    </AppLayout>
  );
}
