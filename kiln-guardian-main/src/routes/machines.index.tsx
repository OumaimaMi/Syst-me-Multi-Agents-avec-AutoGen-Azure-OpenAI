import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { PageHeader, Panel, StatusBadge } from "@/components/industrial";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/lib/store";
import { ZONES, type Status } from "@/lib/demo-data";

export const Route = createFileRoute("/machines/")({
  head: () => ({
    meta: [
      { title: "Équipements industriels — CBI Control" },
      {
        name: "description",
        content:
          "Liste des machines de la cimenterie : concasseur, broyeurs, four rotatif, refroidisseur, ensacheuses. État, criticité, températures et maintenance.",
      },
      { property: "og:title", content: "Équipements industriels — CBI Control" },
      { property: "og:description", content: "Recherchez et filtrez les équipements par zone, état et criticité." },
    ],
  }),
  component: MachinesPage,
});

function MachinesPage() {
  const { machines } = useStore();
  const [q, setQ] = useState("");
  const [zone, setZone] = useState("all");
  const [status, setStatus] = useState("all");

  const rows = useMemo(
    () =>
      machines.filter((m) => {
        const term = q.trim().toLowerCase();
        const okTerm = !term || (m.id + m.name + m.type).toLowerCase().includes(term);
        return okTerm && (zone === "all" || m.zone === zone) && (status === "all" || m.status === status);
      }),
    [machines, q, zone, status],
  );

  return (
    <AppLayout>
      <PageHeader
        title="Machines & équipements"
        subtitle={`${machines.length} équipements documentés — cliquez sur une ligne pour ouvrir la fiche détaillée (paramètres, courbes, diagnostic).`}
      />

      <Panel>
        <div className="grid gap-2 sm:grid-cols-3">
          <Input placeholder="Rechercher (ID, nom, constructeur)..." value={q} onChange={(e) => setQ(e.target.value)} />
          <Select value={zone} onValueChange={setZone}>
            <SelectTrigger>
              <SelectValue placeholder="Zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les zones</SelectItem>
              {ZONES.map((z) => (
                <SelectItem key={z.id} value={z.id}>
                  {z.name} — {z.fr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="État" />
            </SelectTrigger>
            <SelectContent>
              {["all", "operational", "warning", "anomaly", "critical", "stopped", "maintenance"].map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s === "all" ? "Tous les états" : s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Équipement</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Crit.</TableHead>
                <TableHead>Temp.</TableHead>
                <TableHead>Vibration</TableHead>
                <TableHead>Charge</TableHead>
                <TableHead>Prochaine maint.</TableHead>
                <TableHead>État</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((m) => (
                <TableRow key={m.id} className="cursor-pointer">
                  <TableCell className="text-mono-num">
                    <Link to="/machines/$id" params={{ id: m.id }} className="text-primary hover:underline">
                      {m.id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.type}</div>
                  </TableCell>
                  <TableCell className="text-xs">{ZONES.find((z) => z.id === m.zone)?.fr ?? m.zone}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">
                      {m.criticality}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-mono-num text-xs">{m.temperature ?? "—"} {m.temperature ? "°C" : ""}</TableCell>
                  <TableCell className="text-mono-num text-xs">{m.vibration ?? "—"}</TableCell>
                  <TableCell className="text-mono-num text-xs">{m.load ?? "—"}{m.load ? " %" : ""}</TableCell>
                  <TableCell className="text-mono-num text-xs">{m.nextMaintenance}</TableCell>
                  <TableCell>
                    <StatusBadge status={m.status as Status} />
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="py-8 text-center text-sm text-muted-foreground">
                    Aucun équipement ne correspond aux filtres.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Panel>
    </AppLayout>
  );
}
