import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import type { Severity, Status } from "@/lib/demo-data";
import { STATUS_LABEL } from "@/lib/demo-data";

export const STATUS_STYLE: Record<Status, { dot: string; text: string; bg: string; ring: string }> = {
  operational: { dot: "bg-ok", text: "text-ok", bg: "bg-ok/12", ring: "ring-ok/35" },
  warning: { dot: "bg-warn", text: "text-warn", bg: "bg-warn/12", ring: "ring-warn/35" },
  anomaly: { dot: "bg-anomaly", text: "text-anomaly", bg: "bg-anomaly/12", ring: "ring-anomaly/35" },
  critical: { dot: "bg-critical", text: "text-critical", bg: "bg-critical/14", ring: "ring-critical/40" },
  stopped: { dot: "bg-stopped", text: "text-stopped", bg: "bg-stopped/12", ring: "ring-stopped/30" },
  maintenance: { dot: "bg-maint", text: "text-maint", bg: "bg-maint/12", ring: "ring-maint/35" },
};

export const SEVERITY_STYLE: Record<Severity, string> = {
  critical: "bg-critical/14 text-critical ring-critical/40",
  high: "bg-anomaly/14 text-anomaly ring-anomaly/40",
  medium: "bg-warn/14 text-warn ring-warn/40",
  low: "bg-info/14 text-info ring-info/40",
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const s = STATUS_STYLE[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1",
        s.bg,
        s.text,
        s.ring,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", s.dot)} />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1", SEVERITY_STYLE[severity])}>
      {severity}
    </span>
  );
}

export function StateBadge({ state }: { state: "online" | "warning" | "offline" }) {
  const map = {
    online: "bg-ok/12 text-ok ring-ok/35",
    warning: "bg-warn/12 text-warn ring-warn/35",
    offline: "bg-critical/14 text-critical ring-critical/40",
  } as const;
  return <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1", map[state])}>{state}</span>;
}

export function SimulatedTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border border-warn/40 bg-warn/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-widest text-warn uppercase",
        className,
      )}
    >
      Simulated data
    </span>
  );
}

export function DocSourceTag({ className }: { className?: string }) {
  return (
    <span className={cn("text-[11px] text-info/80", className)}>Source: Ciments de Bizerte technical documentation</span>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
  simulated = true,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  simulated?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
          {simulated && <SimulatedTag />}
        </div>
        {subtitle && <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function KpiCard({
  label,
  value,
  unit,
  hint,
  tone = "neutral",
  icon,
  to,
}: {
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
  tone?: "neutral" | "ok" | "warn" | "anomaly" | "critical" | "info" | "maint";
  icon?: ReactNode;
  to?: string;
}) {
  const toneText = {
    neutral: "text-foreground",
    ok: "text-ok",
    warn: "text-warn",
    anomaly: "text-anomaly",
    critical: "text-critical",
    info: "text-info",
    maint: "text-maint",
  }[tone];

  const body = (
    <Card className="panel-surface gap-0 border-0 p-4 transition-colors hover:bg-accent/40">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">{label}</span>
        {icon && <span className="text-steel">{icon}</span>}
      </div>
      <div className={cn("mt-2 flex items-baseline gap-1 text-mono-num", toneText)}>
        <span className="text-2xl font-semibold">{value}</span>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </Card>
  );

  return to ? (
    <Link to={to as "/"} className="block">
      {body}
    </Link>
  ) : (
    body
  );
}

export function Panel({
  title,
  subtitle,
  actions,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("panel-surface p-4", className)}>
      {(title || actions) && (
        <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            {title && <h2 className="text-sm font-semibold tracking-wide">{title}</h2>}
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}

export function Metric({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
  return (
    <div className="rounded-md border border-border bg-background/40 px-3 py-2">
      <div className="text-[11px] tracking-wide text-muted-foreground uppercase">{label}</div>
      <div className="text-mono-num text-sm font-semibold">
        {value}
        {unit ? <span className="ml-1 text-xs font-normal text-muted-foreground">{unit}</span> : null}
      </div>
    </div>
  );
}

export function Timeline({ items }: { items: { date: string; label: string; kind: string }[] }) {
  const color: Record<string, string> = {
    alarm: "bg-critical",
    action: "bg-info",
    maintenance: "bg-maint",
    info: "bg-steel",
  };
  return (
    <ol className="relative space-y-4 border-l border-border pl-5">
      {items.map((it, i) => (
        <li key={i} className="relative">
          <span className={cn("absolute top-1.5 -left-[23px] size-2.5 rounded-full ring-4 ring-panel", color[it.kind] ?? "bg-steel")} />
          <div className="text-mono-num text-xs text-muted-foreground">{it.date}</div>
          <div className="text-sm">{it.label}</div>
        </li>
      ))}
    </ol>
  );
}
