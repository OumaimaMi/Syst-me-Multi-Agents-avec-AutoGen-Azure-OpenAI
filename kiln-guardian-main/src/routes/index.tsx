import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Flame, Lock, ShieldCheck, Activity, Cpu, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SimulatedTag } from "@/components/industrial";
import { useStore, type Role } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Connexion — CBI Control | Ciments de Bizerte" },
      {
        name: "description",
        content:
          "Accès sécurisé à la plateforme de supervision industrielle des Ciments de Bizerte : machines, alarmes, maintenance, production et cybersécurité.",
      },
      { property: "og:title", content: "Connexion — CBI Control" },
      {
        property: "og:description",
        content: "Poste de contrôle numérique de la cimenterie Les Ciments de Bizerte.",
      },
    ],
  }),
  component: LoginPage,
});

const ROLES: Role[] = [
  "Administrateur",
  "Responsable maintenance",
  "Ingénieur",
  "Opérateur",
  "Responsable production",
  "Responsable IT / Cybersecurity",
];

const DEMO = [
  { matricule: "CB-1001", role: "Administrateur" },
  { matricule: "CB-1042", role: "Responsable maintenance" },
  { matricule: "CB-1400", role: "Responsable IT / Cybersecurity" },
];

function LoginPage() {
  const { login } = useStore();
  const navigate = useNavigate();
  const [matricule, setMatricule] = useState("CB-1001");
  const [password, setPassword] = useState("demo1234");
  const [role, setRole] = useState<Role | "">("");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matricule.trim() || password.length < 4) {
      toast.error("Matricule et mot de passe requis (min. 4 caractères).");
      return;
    }
    setLoading(true);
    const user = login(matricule, role || undefined);
    setTimeout(() => {
      toast.success(`Bienvenue ${user.name} — ${user.role}`);
      navigate({ to: "/dashboard" });
    }, 350);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="grid-tech relative hidden flex-col justify-between border-r border-border p-10 lg:flex">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-lg bg-primary/15 ring-1 ring-primary/40">
            <Flame className="size-6 text-primary" />
          </div>
          <div>
            <div className="text-lg font-semibold">CBI Control</div>
            <div className="text-[11px] tracking-widest text-muted-foreground uppercase">Les Ciments de Bizerte</div>
          </div>
        </div>

        <div className="max-w-lg">
          <h1 className="text-3xl font-semibold tracking-tight">
            Supervision industrielle, maintenance et cybersécurité — dans une seule plateforme.
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Carrière, concassage, broyage cru, four, refroidissement, broyage ciment, silos, ensachage et expédition :
            surveillez l'état des équipements, les alarmes, les anomalies, la production, la qualité et la sécurité du
            réseau IT / OT en temps réel.
          </p>
          <ul className="mt-8 grid gap-3 text-sm">
            {[
              { icon: Cpu, t: "12 équipements documentés (four POLYSIUS, broyeurs PFEIFFER, concasseur THYSSEN…)" },
              { icon: Activity, t: "Températures, vibrations, charge, débits et seuils d'alerte" },
              { icon: Wrench, t: "Diagnostic assisté, tickets de maintenance et plan préventif" },
              { icon: ShieldCheck, t: "Firewall, sécurité OT et incidents cyber corrélés aux automates" },
            ].map((f) => (
              <li key={f.t} className="flex items-start gap-3 rounded-md border border-border bg-panel/70 p-3">
                <f.icon className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="text-muted-foreground">{f.t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-3">
          <SimulatedTag />
          <span className="text-[11px] text-muted-foreground">
            Prototype de démonstration — aucune commande n'est envoyée aux PLC.
          </span>
        </div>
      </section>

      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <div className="grid size-10 place-items-center rounded-lg bg-primary/15 ring-1 ring-primary/40">
              <Flame className="size-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold">CBI Control</div>
              <div className="text-[10px] tracking-widest text-muted-foreground uppercase">Ciments de Bizerte</div>
            </div>
          </div>

          <h2 className="text-xl font-semibold">Connexion employé</h2>
          <p className="mt-1 text-sm text-muted-foreground">Identifiez-vous avec votre matricule interne.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="matricule">Matricule</Label>
              <Input
                id="matricule"
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
                placeholder="CB-1001"
                autoComplete="username"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Rôle (optionnel — déduit du matricule)</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger>
                  <SelectValue placeholder="Rôle automatique" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              <Lock className="mr-2 size-4" />
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-6 rounded-md border border-border bg-panel p-3">
            <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              Comptes de démonstration
            </div>
            <ul className="mt-2 space-y-1.5">
              {DEMO.map((d) => (
                <li key={d.matricule}>
                  <button
                    type="button"
                    onClick={() => {
                      setMatricule(d.matricule);
                      setPassword("demo1234");
                      setRole("");
                    }}
                    className="flex w-full items-center justify-between rounded px-2 py-1 text-left text-xs hover:bg-accent"
                  >
                    <span className="text-mono-num">{d.matricule}</span>
                    <span className="text-muted-foreground">{d.role}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
