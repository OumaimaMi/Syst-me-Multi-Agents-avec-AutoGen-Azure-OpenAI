import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { DocSourceTag, KpiCard, Metric, PageHeader, Panel, StatusBadge } from "@/components/industrial";
import { ZONES } from "@/lib/demo-data";

export const Route = createFileRoute("/company")({
  head: () => ({
    meta: [
      { title: "Ciments de Bizerte — Informations société" },
      {
        name: "description",
        content:
          "Présentation de la société Ciments de Bizerte : capacités de production, lignes de fabrication, produits cimentiers et organisation industrielle.",
      },
      { property: "og:title", content: "Ciments de Bizerte — Informations société" },
      { property: "og:description", content: "Capacités, procédé, produits et organisation de la cimenterie de Bizerte." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CompanyPage,
});

const IDENTITY = [
  { label: "Raison sociale", value: "Société des Ciments de Bizerte (SCB)" },
  { label: "Site industriel", value: "Baie de Sebra, Bizerte — Tunisie" },
  { label: "Activité", value: "Production de ciment et de clinker" },
  { label: "Procédé", value: "Voie sèche avec préchauffeur et précalcinateur" },
  { label: "Effectif site", value: "≈ 600 collaborateurs" },
  { label: "Certifications", value: "ISO 9001 / ISO 14001 (démarche qualité-environnement)" },
];

const PRODUCTS = [
  { name: "CEM I 42,5", use: "Béton armé, ouvrages structurels", pack: "Sac 50 kg / vrac" },
  { name: "CEM II/A-L 32,5", use: "Maçonnerie, bâtiment courant", pack: "Sac 50 kg / vrac" },
  { name: "CEM II/B-P 32,5", use: "Travaux de masse, dallages", pack: "Sac 50 kg" },
  { name: "Clinker", use: "Vente à d'autres cimenteries", pack: "Vrac / expédition portuaire" },
];

const LINES = [
  { name: "Concassage", equipment: "Concasseur THYSSEN", capacity: "1 000 t/h" },
  { name: "Broyage cru", equipment: "Broyeur vertical PFEIFFER 3F1", capacity: "298 t/h" },
  { name: "Cuisson", equipment: "Four rotatif POLYSIUS 4K1", capacity: "3 940 t/j de clinker" },
  { name: "Broyage ciment", equipment: "Broyeurs à boulets 6B1 / 6B2", capacity: "142 t/h" },
  { name: "Ensachage", equipment: "Ensacheuses 8E1 / 8E2", capacity: "112 t/h" },
];

const ORG = [
  { dept: "Production", role: "Conduite du procédé, salle de contrôle, équipes A/B/C" },
  { dept: "Maintenance", role: "Préventif, correctif, maintenance prédictive" },
  { dept: "Laboratoire / Qualité", role: "Contrôle cru, clinker et ciment, conformité normes" },
  { dept: "IT / Cybersécurité", role: "Réseaux IT/OT, pare-feu, supervision sécurité" },
  { dept: "Expédition", role: "Chargement vrac et sacs, logistique portuaire" },
];

function CompanyPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Informations société"
        subtitle="Ciments de Bizerte — présentation industrielle du site et du procédé de fabrication."
        simulated={false}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Clinker / jour" value="3 940" unit="t" tone="ok" />
        <KpiCard label="Ciment / heure" value="142" unit="t" tone="info" />
        <KpiCard label="Zones de procédé" value={ZONES.length} tone="neutral" />
        <KpiCard label="Produits" value={PRODUCTS.length} tone="neutral" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Identité de la société">
          <div className="grid gap-2 sm:grid-cols-2">
            {IDENTITY.map((i) => (
              <Metric key={i.label} label={i.label} value={i.value} />
            ))}
          </div>
          <DocSourceTag className="mt-3 block" />
        </Panel>

        <Panel title="Lignes de fabrication">
          <ul className="space-y-2">
            {LINES.map((l) => (
              <li key={l.name} className="flex items-center justify-between rounded-md border border-border bg-background/40 px-3 py-2">
                <div>
                  <div className="text-sm font-medium">{l.name}</div>
                  <div className="text-xs text-muted-foreground">{l.equipment}</div>
                </div>
                <span className="text-mono-num text-xs text-info">{l.capacity}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Gamme de produits">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {PRODUCTS.map((p) => (
            <div key={p.name} className="rounded-md border border-border bg-background/40 p-3">
              <div className="text-sm font-semibold">{p.name}</div>
              <p className="mt-1 text-xs text-muted-foreground">{p.use}</p>
              <div className="text-mono-num mt-2 text-xs text-info">{p.pack}</div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Organisation">
          <ul className="space-y-2">
            {ORG.map((o) => (
              <li key={o.dept} className="rounded-md border border-border bg-background/40 px-3 py-2">
                <div className="text-sm font-medium">{o.dept}</div>
                <div className="text-xs text-muted-foreground">{o.role}</div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="État actuel des zones" subtitle="Données de supervision simulées">
          <div className="grid gap-2 sm:grid-cols-2">
            {ZONES.map((z) => (
              <div key={z.id} className="flex items-center justify-between rounded-md border border-border bg-background/40 px-3 py-2">
                <div>
                  <div className="text-sm">{z.fr}</div>
                  <div className="text-mono-num text-xs text-muted-foreground">{z.throughput}</div>
                </div>
                <StatusBadge status={z.status} />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppLayout>
  );
}
