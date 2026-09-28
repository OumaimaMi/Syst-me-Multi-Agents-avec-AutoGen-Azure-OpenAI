import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Bars, Donut } from "@/components/charts";
import { KpiCard, Metric, PageHeader, Panel, SeverityBadge } from "@/components/industrial";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FIREWALL_EVENTS } from "@/lib/demo-data";

export const Route = createFileRoute("/firewall")({
  head: () => ({
    meta: [
      { title: "Sécurité pare-feu — CBI Control" },
      {
        name: "description",
        content:
          "Surveillance du pare-feu industriel : tentatives d'accès bloquées, scans de ports, sessions autorisées et règles de filtrage IT/OT.",
      },
      { property: "og:title", content: "Sécurité pare-feu — CBI Control" },
      { property: "og:description", content: "Événements pare-feu, règles et état du filtrage IT/OT." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FirewallPage,
});

const RULES = [
  { id: "R-001", name: "IT → DMZ (HTTPS)", zone: "IT → DMZ", ports: "443", action: "allowed", hits: 18420 },
  { id: "R-014", name: "DMZ → OT OPC-UA (lecture)", zone: "DMZ → OT", ports: "4840", action: "allowed", hits: 6122 },
  { id: "R-021", name: "Modbus externe", zone: "WAN → OT", ports: "502", action: "blocked", hits: 341 },
  { id: "R-030", name: "SMB inter-zones", zone: "IT → OT", ports: "445", action: "blocked", hits: 87 },
  { id: "R-042", name: "VPN maintenance distante", zone: "WAN → DMZ", ports: "1194", action: "allowed", hits: 54 },
  { id: "R-055", name: "Sortie DNS non autorisée", zone: "OT → WAN", ports: "53", action: "blocked", hits: 19 },
];

const TRAFFIC = Array.from({ length: 12 }, (_, i) => ({
  h: `${String(i * 2).padStart(2, "0")}h`,
  blocked: 20 + Math.round(Math.abs(Math.sin(i / 1.6)) * 45),
  allowed: 380 + Math.round(Math.cos(i / 2.2) * 90),
}));

function FirewallPage() {
  const [q, setQ] = useState("");
  const [action, setAction] = useState("all");

  const rows = FIREWALL_EVENTS.filter((e) => {
    const term = q.trim().toLowerCase();
    return (
      (!term || (e.id + e.type + e.source + e.destination + e.protocol).toLowerCase().includes(term)) &&
      (action === "all" || e.action === action)
    );
  });

  const count = (a: string) => FIREWALL_EVENTS.filter((e) => e.action === a).length;

  return (
    <AppLayout>
      <PageHeader
        title="Sécurité pare-feu"
        subtitle="Journal des événements du pare-feu périmètre et des règles de segmentation IT / DMZ / OT."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Événements bloqués" value={count("blocked")} tone="critical" />
        <KpiCard label="Signalés" value={count("flagged")} tone="warn" />
        <KpiCard label="Autorisés" value={count("allowed")} tone="ok" />
        <KpiCard label="Règles actives" value={RULES.length} tone="info" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2" title="Trafic filtré (24 h)" subtitle="Paquets autorisés vs bloqués">
          <Bars
            data={TRAFFIC}
            xKey="h"
            bars={[
              { key: "allowed", label: "Autorisés", color: "var(--color-ok)" },
              { key: "blocked", label: "Bloqués", color: "var(--color-critical)" },
            ]}
          />
        </Panel>
        <Panel title="Répartition des actions">
          <Donut
            data={[
              { name: "Bloqués", value: count("blocked"), color: "var(--color-critical)" },
              { name: "Signalés", value: count("flagged"), color: "var(--color-warn)" },
              { name: "Autorisés", value: count("allowed"), color: "var(--color-ok)" },
            ]}
          />
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Metric label="Pare-feu" value="Fortigate" />
            <Metric label="État" value="Dégradé" />
            <Metric label="Firmware" value="7.4.3" />
            <Metric label="Uptime" value="112 j" />
          </div>
        </Panel>
      </div>

      <Panel title="Événements de sécurité">
        <div className="grid gap-2 sm:grid-cols-2">
          <Input placeholder="Rechercher (IP, type, protocole)..." value={q} onChange={(e) => setQ(e.target.value)} />
          <Select value={action} onValueChange={setAction}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["all", "blocked", "flagged", "allowed"].map((a) => (
                <SelectItem key={a} value={a} className="capitalize">{a === "all" ? "Toutes actions" : a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Horodatage</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Port</TableHead>
                <TableHead>Criticité</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="text-mono-num text-xs">{e.id}</TableCell>
                  <TableCell className="text-mono-num text-xs">{e.time}</TableCell>
                  <TableCell className="max-w-72 text-sm">{e.type}</TableCell>
                  <TableCell className="text-mono-num text-xs">{e.source}</TableCell>
                  <TableCell className="text-mono-num text-xs">{e.destination}</TableCell>
                  <TableCell className="text-mono-num text-xs">{e.port || "—"} / {e.protocol}</TableCell>
                  <TableCell><SeverityBadge severity={e.severity} /></TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        e.action === "blocked"
                          ? "text-critical text-[10px] capitalize"
                          : e.action === "flagged"
                            ? "text-warn text-[10px] capitalize"
                            : "text-ok text-[10px] capitalize"
                      }
                    >
                      {e.action}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">Aucun événement.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Panel>

      <Panel title="Règles de filtrage" subtitle="Segmentation IT / DMZ / OT — lecture seule">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Règle</TableHead>
                <TableHead>Libellé</TableHead>
                <TableHead>Zones</TableHead>
                <TableHead>Ports</TableHead>
                <TableHead>Action</TableHead>
                <TableHead className="text-right">Occurrences</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RULES.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="text-mono-num text-xs">{r.id}</TableCell>
                  <TableCell className="text-sm">{r.name}</TableCell>
                  <TableCell className="text-xs">{r.zone}</TableCell>
                  <TableCell className="text-mono-num text-xs">{r.ports}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={r.action === "blocked" ? "text-critical text-[10px]" : "text-ok text-[10px]"}>
                      {r.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-mono-num text-right text-xs">{r.hits.toLocaleString("fr-FR")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Panel>
    </AppLayout>
  );
}
