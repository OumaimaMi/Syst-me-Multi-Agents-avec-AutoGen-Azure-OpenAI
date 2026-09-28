/**
 * CBI Control — Demo data layer.
 *
 * All values here are SIMULATED unless flagged `documented: true`, in which case
 * they come from the Ciments de Bizerte technical documentation.
 *
 * Future real sources (SCADA / OPC-UA / MQTT / PLC / historian / firewall / SIEM)
 * should implement the `DataSource` interface in `src/lib/data-source.ts`.
 */

export type Status = "operational" | "warning" | "anomaly" | "critical" | "stopped" | "maintenance";
export type Severity = "critical" | "high" | "medium" | "low";

export const STATUS_LABEL: Record<Status, string> = {
  operational: "Operational",
  warning: "Warning",
  anomaly: "Anomaly",
  critical: "Critical",
  stopped: "Stopped",
  maintenance: "Maintenance",
};

export type Zone = {
  id: string;
  name: string;
  fr: string;
  status: Status;
  machines: number;
  throughput: string;
};

export const ZONES: Zone[] = [
  { id: "quarry", name: "Quarry", fr: "Carrière", status: "operational", machines: 6, throughput: "1 040 t/h" },
  { id: "crushing", name: "Crushing", fr: "Concassage", status: "operational", machines: 4, throughput: "1 000 t/h" },
  { id: "transport", name: "Raw Transport", fr: "Transport matières", status: "warning", machines: 9, throughput: "980 t/h" },
  { id: "prehomo", name: "Prehomogenization", fr: "Préhomogénéisation", status: "operational", machines: 3, throughput: "870 t/h" },
  { id: "rawmill", name: "Raw Mill", fr: "Broyage cru", status: "warning", machines: 5, throughput: "298 t/h" },
  { id: "homo", name: "Homogenization", fr: "Homogénéisation", status: "operational", machines: 3, throughput: "290 t/h" },
  { id: "preheater", name: "Preheater", fr: "Préchauffage", status: "operational", machines: 4, throughput: "175 t/h" },
  { id: "kiln", name: "Rotary Kiln", fr: "Four", status: "operational", machines: 6, throughput: "3 940 t/j" },
  { id: "cooler", name: "Clinker Cooler", fr: "Refroidissement", status: "operational", machines: 3, throughput: "3 940 t/j" },
  { id: "clinker", name: "Clinker Storage", fr: "Stock clinker", status: "operational", machines: 2, throughput: "—" },
  { id: "cementmill", name: "Cement Mills", fr: "Broyage ciment", status: "critical", machines: 6, throughput: "142 t/h" },
  { id: "silos", name: "Cement Silos", fr: "Silos ciment", status: "operational", machines: 9, throughput: "—" },
  { id: "packing", name: "Packaging", fr: "Ensachage", status: "maintenance", machines: 7, throughput: "112 t/h" },
  { id: "shipping", name: "Shipping", fr: "Expédition", status: "operational", machines: 4, throughput: "96 t/h" },
];

export type Param = {
  key: string;
  label: string;
  value: number | null;
  unit: string;
  min?: number;
  max: number;
};

export type Machine = {
  id: string;
  name: string;
  zone: string;
  type: string;
  status: Status;
  criticality: "A" | "B" | "C";
  lastAlarm: string;
  temperature: number | null;
  vibration: number | null;
  load: number | null;
  lastMaintenance: string;
  nextMaintenance: string;
  owner: string;
  documented?: boolean;
  specs: { label: string; value: string }[];
  params: Param[];
};

const p = (key: string, label: string, value: number | null, unit: string, max: number, min?: number): Param => ({
  key,
  label,
  value,
  unit,
  max,
  ...(min !== undefined ? { min } : {}),
});

export const MACHINES: Machine[] = [
  {
    id: "2C1.CR01",
    name: "Concasseur THYSSEN",
    zone: "crushing",
    type: "THYSSEN grupp",
    status: "operational",
    criticality: "A",
    lastAlarm: "2026-08-21 06:12",
    temperature: 62,
    vibration: 2.4,
    load: 74,
    lastMaintenance: "2026-07-30",
    nextMaintenance: "2026-09-15",
    owner: "Équipe Mécanique B",
    documented: true,
    specs: [
      { label: "Type", value: "THYSSEN grupp" },
      { label: "Débit", value: "1 000 t/h" },
      { label: "Granulométrie entrée max", value: "1500 × 1000 × 700 mm" },
      { label: "Granulométrie sortie", value: "0–60 mm" },
      { label: "Puissance moteur", value: "Data not available" },
    ],
    params: [
      p("temp", "Motor temperature", 62, "°C", 90),
      p("bearing", "Bearing temperature", 58, "°C", 85),
      p("vib", "Vibration", 2.4, "mm/s", 7),
      p("current", "Motor current", 310, "A", 480),
      p("flow", "Material flow", 972, "t/h", 1000),
    ],
  },
  {
    id: "3F1",
    name: "Broyeur Cru 3F1",
    zone: "rawmill",
    type: "PFEIFFER MPS 3750 modifié",
    status: "warning",
    criticality: "A",
    lastAlarm: "2026-08-25 11:42",
    temperature: 78,
    vibration: 3.2,
    load: 82,
    lastMaintenance: "2026-08-02",
    nextMaintenance: "2026-09-02",
    owner: "Équipe Maintenance A",
    documented: true,
    specs: [
      { label: "Machine ID", value: "3F1" },
      { label: "Type", value: "PFEIFFER MPS 3750 modifié" },
      { label: "Puissance moteur", value: "1 675 kW" },
      { label: "Débit", value: "310 t/h" },
      { label: "Séparateur", value: "PFEIFFER SLS 3750B" },
      { label: "Puissance séparateur", value: "132 kW" },
    ],
    params: [
      p("temp", "Motor temperature", 78, "°C", 90),
      p("bearing", "Bearing temperature", 81, "°C", 85),
      p("vib", "Vibration", 3.2, "mm/s", 7),
      p("current", "Motor current", 2410, "A", 3000),
      p("power", "Motor power", 1502, "kW", 1675),
      p("pressure", "Grinding pressure", 92, "bar", 120),
      p("flow", "Material flow", 298, "t/h", 310),
      p("sep", "Separator speed", 74, "rpm", 110),
      p("gastemp", "Gas temperature", 88, "°C", 130),
      p("gasflow", "Gas flow", 412, "km³/h", 600),
    ],
  },
  {
    id: "4K1.KN01",
    name: "Four POLYSIUS",
    zone: "kiln",
    type: "POLYSIUS",
    status: "operational",
    criticality: "A",
    lastAlarm: "2026-08-24 03:05",
    temperature: 1420,
    vibration: 1.8,
    load: 88,
    lastMaintenance: "2026-06-18",
    nextMaintenance: "2026-10-05",
    owner: "Équipe Four",
    documented: true,
    specs: [
      { label: "Machine ID", value: "4K1.KN01" },
      { label: "Type", value: "POLYSIUS" },
      { label: "Capacité nominale", value: "4 000 t/j de clinker" },
      { label: "Longueur", value: "83 m" },
      { label: "Diamètre", value: "5,18 m" },
      { label: "Vitesse maximale", value: "4 tr/min" },
      { label: "Combustibles", value: "Coke de pétrole + fuel lourd N°2" },
    ],
    params: [
      p("burn", "Burning zone temperature", 1420, "°C", 1550),
      p("shell", "Shell temperature", 312, "°C", 400),
      p("speed", "Kiln speed", 3.6, "tr/min", 4),
      p("vib", "Vibration", 1.8, "mm/s", 7),
      p("o2", "O₂ at kiln inlet", 2.8, "%", 6),
      p("torque", "Drive torque", 71, "%", 100),
    ],
  },
  {
    id: "4R1.PQ01",
    name: "Refroidisseur POLYTRACK",
    zone: "cooler",
    type: "POLYTRACK",
    status: "operational",
    criticality: "A",
    lastAlarm: "2026-08-19 22:40",
    temperature: 240,
    vibration: 2.1,
    load: 69,
    lastMaintenance: "2026-07-11",
    nextMaintenance: "2026-09-20",
    owner: "Équipe Four",
    documented: true,
    specs: [
      { label: "Machine ID", value: "4R1.PQ01" },
      { label: "Type", value: "POLYTRACK" },
      { label: "Surface", value: "86 m²" },
      { label: "Débit d'air", value: "Data not available" },
    ],
    params: [
      p("temp", "Clinker outlet temperature", 240, "°C", 320),
      p("vib", "Vibration", 2.1, "mm/s", 7),
      p("press", "Under-grate pressure", 48, "mbar", 80),
      p("load", "Drive load", 69, "%", 100),
    ],
  },
  {
    id: "6B1",
    name: "Broyeur Ciment 1",
    zone: "cementmill",
    type: "UNIDAN 44 × 13",
    status: "critical",
    criticality: "A",
    lastAlarm: "2026-08-25 14:07",
    temperature: 94,
    vibration: 7.1,
    load: 96,
    lastMaintenance: "2026-07-05",
    nextMaintenance: "2026-08-28",
    owner: "Équipe Maintenance A",
    documented: true,
    specs: [
      { label: "Type", value: "UNIDAN 44 × 13" },
      { label: "Débit", value: "100 t/h" },
      { label: "Nombre d'unités (atelier)", value: "2" },
      { label: "Puissance moteur", value: "Data not available" },
    ],
    params: [
      p("temp", "Motor temperature", 94, "°C", 85),
      p("bearing", "Bearing temperature", 89, "°C", 85),
      p("vib", "Vibration", 7.1, "mm/s", 7),
      p("current", "Motor current", 2890, "A", 3000),
      p("load", "Motor load", 96, "%", 100),
      p("flow", "Material flow", 74, "t/h", 100),
    ],
  },
  {
    id: "6B2",
    name: "Broyeur Ciment 2",
    zone: "cementmill",
    type: "UNIDAN 44 × 13",
    status: "operational",
    criticality: "A",
    lastAlarm: "2026-08-18 09:31",
    temperature: 72,
    vibration: 2.9,
    load: 84,
    lastMaintenance: "2026-08-08",
    nextMaintenance: "2026-09-25",
    owner: "Équipe Maintenance B",
    documented: true,
    specs: [
      { label: "Type", value: "UNIDAN 44 × 13" },
      { label: "Débit", value: "100 t/h" },
    ],
    params: [
      p("temp", "Motor temperature", 72, "°C", 85),
      p("bearing", "Bearing temperature", 68, "°C", 85),
      p("vib", "Vibration", 2.9, "mm/s", 7),
      p("load", "Motor load", 84, "%", 100),
      p("flow", "Material flow", 96, "t/h", 100),
    ],
  },
  {
    id: "C5",
    name: "Convoyeur C5",
    zone: "transport",
    type: "Bande transporteuse 1200 mm",
    status: "anomaly",
    criticality: "B",
    lastAlarm: "2026-08-25 12:55",
    temperature: 51,
    vibration: 5.4,
    load: 63,
    lastMaintenance: "2026-07-22",
    nextMaintenance: "2026-08-30",
    owner: "Équipe Mécanique B",
    specs: [
      { label: "Type", value: "Bande transporteuse" },
      { label: "Largeur", value: "Data not available" },
    ],
    params: [
      p("temp", "Drive temperature", 51, "°C", 80),
      p("vib", "Vibration", 5.4, "mm/s", 7),
      p("speed", "Belt speed", 1.6, "m/s", 2.5),
      p("load", "Drive load", 63, "%", 100),
    ],
  },
  {
    id: "8E1",
    name: "Ensacheuse rotative 1",
    zone: "packing",
    type: "Ensacheuse rotative ciment",
    status: "maintenance",
    criticality: "B",
    lastAlarm: "2026-08-23 07:18",
    temperature: 44,
    vibration: 1.4,
    load: 0,
    lastMaintenance: "2026-08-25",
    nextMaintenance: "2026-09-25",
    owner: "Équipe Ensachage",
    documented: true,
    specs: [
      { label: "Type", value: "Ensacheuse rotative ciment" },
      { label: "Parc documenté", value: "4 ensacheuses ciment, 1 ensacheuse chaux, 2 installations BIG BAGS" },
    ],
    params: [
      p("temp", "Drive temperature", 44, "°C", 75),
      p("vib", "Vibration", 1.4, "mm/s", 7),
      p("rate", "Bagging rate", 0, "bags/h", 2400),
    ],
  },
  {
    id: "8E2",
    name: "Ensacheuse rotative 2",
    zone: "packing",
    type: "Ensacheuse rotative ciment",
    status: "operational",
    criticality: "B",
    lastAlarm: "2026-08-15 16:02",
    temperature: 47,
    vibration: 1.6,
    load: 78,
    lastMaintenance: "2026-08-01",
    nextMaintenance: "2026-09-01",
    owner: "Équipe Ensachage",
    specs: [{ label: "Type", value: "Ensacheuse rotative ciment" }],
    params: [
      p("temp", "Drive temperature", 47, "°C", 75),
      p("rate", "Bagging rate", 1980, "bags/h", 2400),
    ],
  },
  {
    id: "8B1",
    name: "Installation BIG BAGS 1",
    zone: "packing",
    type: "BIG BAGS",
    status: "operational",
    criticality: "C",
    lastAlarm: "—",
    temperature: 39,
    vibration: 0.9,
    load: 52,
    lastMaintenance: "2026-07-19",
    nextMaintenance: "2026-10-19",
    owner: "Équipe Ensachage",
    specs: [{ label: "Type", value: "Installation BIG BAGS" }],
    params: [p("rate", "Filling rate", 34, "bags/h", 60)],
  },
  {
    id: "5V1",
    name: "Ventilateur préchauffeur",
    zone: "preheater",
    type: "Ventilateur de tirage",
    status: "warning",
    criticality: "A",
    lastAlarm: "2026-08-25 05:26",
    temperature: 83,
    vibration: 4.6,
    load: 91,
    lastMaintenance: "2026-06-28",
    nextMaintenance: "2026-08-29",
    owner: "Équipe Four",
    specs: [{ label: "Type", value: "Ventilateur de tirage" }],
    params: [
      p("temp", "Bearing temperature", 83, "°C", 85),
      p("vib", "Vibration", 4.6, "mm/s", 7),
      p("speed", "Fan speed", 940, "rpm", 1100),
      p("load", "Motor load", 91, "%", 100),
    ],
  },
  {
    id: "1E1",
    name: "Élévateur à godets E1",
    zone: "prehomo",
    type: "Élévateur à godets",
    status: "stopped",
    criticality: "B",
    lastAlarm: "2026-08-24 19:44",
    temperature: null,
    vibration: null,
    load: 0,
    lastMaintenance: "2026-08-12",
    nextMaintenance: "2026-09-12",
    owner: "Équipe Mécanique A",
    specs: [{ label: "Type", value: "Élévateur à godets" }],
    params: [p("load", "Drive load", 0, "%", 100)],
  },
];

export type Alarm = {
  id: string;
  date: string;
  time: string;
  machineId: string;
  zone: string;
  label: string;
  severity: Severity;
  status: "active" | "acknowledged" | "resolved";
  technician: string | null;
  resolution: string | null;
};

export const ALARMS: Alarm[] = [
  { id: "AL-3391", date: "2026-08-25", time: "14:07", machineId: "6B1", zone: "cementmill", label: "Abnormal motor temperature (94 °C)", severity: "critical", status: "active", technician: null, resolution: null },
  { id: "AL-3390", date: "2026-08-25", time: "13:58", machineId: "6B1", zone: "cementmill", label: "Vibration above alert threshold (7.1 mm/s)", severity: "critical", status: "active", technician: null, resolution: null },
  { id: "AL-3388", date: "2026-08-25", time: "12:55", machineId: "C5", zone: "transport", label: "Abnormal vibration on drive pulley", severity: "high", status: "acknowledged", technician: "M. Trabelsi", resolution: null },
  { id: "AL-3385", date: "2026-08-25", time: "11:42", machineId: "3F1", zone: "rawmill", label: "Bearing temperature drift", severity: "high", status: "acknowledged", technician: "A. Ben Salah", resolution: null },
  { id: "AL-3380", date: "2026-08-25", time: "05:26", machineId: "5V1", zone: "preheater", label: "Fan bearing temperature high", severity: "medium", status: "active", technician: null, resolution: null },
  { id: "AL-3376", date: "2026-08-24", time: "19:44", machineId: "1E1", zone: "prehomo", label: "Elevator stopped — chain slack detected", severity: "medium", status: "resolved", technician: "S. Hamdi", resolution: "Chaîne retendue, redémarrage validé" },
  { id: "AL-3372", date: "2026-08-24", time: "03:05", machineId: "4K1.KN01", zone: "kiln", label: "Shell temperature spot", severity: "low", status: "resolved", technician: "K. Jaziri", resolution: "Refractaire contrôlé — RAS" },
  { id: "AL-3364", date: "2026-08-23", time: "07:18", machineId: "8E1", zone: "packing", label: "Bag weight deviation", severity: "low", status: "resolved", technician: "R. Ouertani", resolution: "Calibration bascule" },
];

export type Ticket = {
  id: string;
  machineId: string;
  problem: string;
  kind: "preventive" | "corrective";
  priority: Severity;
  status: "Open" | "Assigned" | "In Progress" | "Waiting Parts" | "Resolved" | "Closed";
  assignee: string;
  created: string;
  due: string;
  duration: string;
  diagnosis?: string;
};

export const TICKETS: Ticket[] = [
  { id: "CBI-2026-00124", machineId: "6B1", problem: "High motor temperature", kind: "corrective", priority: "high", status: "In Progress", assignee: "Maintenance Team A", created: "2026-08-25", due: "2026-08-26", duration: "6 h", diagnosis: "Suspicion de surcharge mécanique / palier" },
  { id: "CBI-2026-00123", machineId: "C5", problem: "Abnormal vibration on drive pulley", kind: "corrective", priority: "medium", status: "Assigned", assignee: "M. Trabelsi", created: "2026-08-25", due: "2026-08-27", duration: "4 h", diagnosis: "Désalignement probable du tambour" },
  { id: "CBI-2026-00121", machineId: "3F1", problem: "Bearing temperature drift", kind: "corrective", priority: "high", status: "Waiting Parts", assignee: "Maintenance Team B", created: "2026-08-24", due: "2026-08-28", duration: "8 h", diagnosis: "Défaut de lubrification" },
  { id: "CBI-2026-00118", machineId: "5V1", problem: "Contrôle vibratoire trimestriel", kind: "preventive", priority: "medium", status: "Open", assignee: "Équipe Prédictive", created: "2026-08-22", due: "2026-08-29", duration: "3 h" },
  { id: "CBI-2026-00115", machineId: "4K1.KN01", problem: "Inspection réfractaire zone de cuisson", kind: "preventive", priority: "high", status: "Open", assignee: "Équipe Four", created: "2026-08-20", due: "2026-10-05", duration: "24 h" },
  { id: "CBI-2026-00112", machineId: "8E1", problem: "Révision ensacheuse — buses et bascule", kind: "preventive", priority: "low", status: "In Progress", assignee: "Équipe Ensachage", created: "2026-08-19", due: "2026-08-26", duration: "5 h" },
  { id: "CBI-2026-00108", machineId: "2C1.CR01", problem: "Graissage marteaux concasseur", kind: "preventive", priority: "low", status: "Resolved", assignee: "Équipe Mécanique B", created: "2026-08-14", due: "2026-08-15", duration: "2 h" },
  { id: "CBI-2026-00104", machineId: "1E1", problem: "Chaîne élévateur détendue", kind: "corrective", priority: "medium", status: "Closed", assignee: "S. Hamdi", created: "2026-08-12", due: "2026-08-13", duration: "3 h", diagnosis: "Usure de chaîne" },
];

export type TimelineEvent = { date: string; label: string; kind: "alarm" | "action" | "maintenance" | "info" };

export const MACHINE_TIMELINE: Record<string, TimelineEvent[]> = {
  "6B1": [
    { date: "2026-08-25 14:07", label: "Alarm detected — motor temperature 94 °C", kind: "alarm" },
    { date: "2026-08-25 14:12", label: "Technician assigned — Maintenance Team A", kind: "action" },
    { date: "2026-08-25 14:35", label: "AI diagnostic executed — mechanical overload suspected", kind: "info" },
    { date: "2026-08-25 15:10", label: "Bearing inspected — lubrication sample taken", kind: "action" },
    { date: "2026-08-26 09:00", label: "Maintenance planned — lubrication circuit", kind: "maintenance" },
  ],
  "3F1": [
    { date: "2026-08-25 11:42", label: "Alarm detected — bearing temperature drift", kind: "alarm" },
    { date: "2026-08-25 12:00", label: "Technician assigned — A. Ben Salah", kind: "action" },
    { date: "2026-08-24 08:00", label: "Separator SLS 3750B inspection", kind: "maintenance" },
    { date: "2026-08-02 06:00", label: "Preventive maintenance completed", kind: "maintenance" },
  ],
};

export const DEFAULT_TIMELINE: TimelineEvent[] = [
  { date: "2026-08-25", label: "Machine running — parameters within range", kind: "info" },
  { date: "2026-08-20", label: "Routine inspection completed", kind: "maintenance" },
  { date: "2026-08-10", label: "Sensor calibration", kind: "action" },
];

export type Diagnosis = {
  problem: string;
  severity: Severity;
  probability: number;
  causes: string[];
  actions: string[];
};

export const DIAGNOSES: Record<string, Diagnosis> = {
  "6B1": {
    problem: "Abnormal motor temperature with excessive vibration",
    severity: "critical",
    probability: 87,
    causes: ["Bearing lubrication problem", "Mechanical friction", "Bearing wear", "Excessive load (96 %)"],
    actions: [
      "Stop machine according to safety procedure.",
      "Inspect bearing temperature.",
      "Verify lubrication.",
      "Check vibration.",
      "Inspect mechanical components.",
      "Escalate to maintenance engineer.",
    ],
  },
  "3F1": {
    problem: "Abnormal bearing temperature",
    severity: "high",
    probability: 74,
    causes: ["Bearing lubrication problem", "Grinding pressure too high", "Bearing wear"],
    actions: ["Verify lubrication circuit.", "Check grinding pressure setpoint.", "Trend bearing temperature over 8 h.", "Plan bearing inspection."],
  },
  C5: {
    problem: "Abnormal vibration on drive pulley",
    severity: "medium",
    probability: 68,
    causes: ["Pulley misalignment", "Belt tension deviation", "Roller bearing wear"],
    actions: ["Check pulley alignment.", "Measure belt tension.", "Inspect idler rollers."],
  },
};

export function diagnosisFor(m: Machine): Diagnosis {
  const known = DIAGNOSES[m.id];
  if (known) return known;
  const bad = m.params.filter((x) => x.value !== null && x.value > x.max * 0.9);
  if (bad.length === 0 || m.status === "operational") {
    return {
      problem: "No abnormal pattern detected",
      severity: "low",
      probability: 12,
      causes: ["All monitored parameters within nominal range"],
      actions: ["Continue normal operation.", "Keep preventive maintenance schedule."],
    };
  }
  return {
    problem: `Parameter drift detected on ${bad.map((b) => b.label).join(", ")}`,
    severity: m.status === "critical" ? "critical" : "medium",
    probability: 55 + bad.length * 7,
    causes: ["Process setpoint deviation", "Component wear", "Insufficient cooling / lubrication"],
    actions: ["Verify sensor calibration.", "Inspect the affected component.", "Reduce load if possible.", "Create a maintenance ticket."],
  };
}

/* ---------------- Silos (documented capacities) ---------------- */

export type Silo = {
  id: string;
  product: string;
  capacity: number | null;
  capacityLabel: string;
  level: number;
  temperature: number | null;
  status: Status;
  lastFill: string;
  lastExtraction: string;
};

export const SILOS: Silo[] = [
  { id: "Silo 1", product: "CEM II/A-L 32,5 N", capacity: 2500, capacityLabel: "2 500 t", level: 72, temperature: 58, status: "operational", lastFill: "2026-08-25 09:10", lastExtraction: "2026-08-25 13:40" },
  { id: "Silo 2", product: "CEM I 42,5 N", capacity: 2500, capacityLabel: "2 500 t", level: 41, temperature: 61, status: "operational", lastFill: "2026-08-24 22:05", lastExtraction: "2026-08-25 14:02" },
  { id: "Silo 3", product: "CEM II/A-L 32,5 N", capacity: 10000, capacityLabel: "10 000 t", level: 86, temperature: 57, status: "warning", lastFill: "2026-08-25 07:30", lastExtraction: "2026-08-25 12:20" },
  { id: "Silo 4", product: "CEM I 42,5 N", capacity: 10000, capacityLabel: "10 000 t", level: 55, temperature: 60, status: "operational", lastFill: "2026-08-24 18:15", lastExtraction: "2026-08-25 11:00" },
  { id: "Silo 5", product: "CEM I 42,5 N", capacity: 10000, capacityLabel: "10 000 t", level: 23, temperature: 59, status: "operational", lastFill: "2026-08-23 16:45", lastExtraction: "2026-08-25 10:35" },
  { id: "Silo Bleu", product: "Ciment pour chaux", capacity: 750, capacityLabel: "750 t", level: 64, temperature: 54, status: "operational", lastFill: "2026-08-24 08:00", lastExtraction: "2026-08-25 08:20" },
  { id: "Silo Noir", product: "Poudre pour chaux", capacity: 750, capacityLabel: "750 t", level: 31, temperature: 52, status: "operational", lastFill: "2026-08-22 11:00", lastExtraction: "2026-08-24 17:10" },
  { id: "Silo Vert", product: "Chaux artificielle CHA 10", capacity: 750, capacityLabel: "750 t", level: 48, temperature: 53, status: "maintenance", lastFill: "2026-08-21 09:40", lastExtraction: "2026-08-23 15:05" },
  { id: "Silo Homo", product: "Poudre crue (farine)", capacity: null, capacityLabel: "Data not available", level: 67, temperature: null, status: "operational", lastFill: "2026-08-25 12:00", lastExtraction: "2026-08-25 14:10" },
];

/* ---------------- Quality control ---------------- */

export const LAB_EQUIPMENT = [
  {
    name: "X-Ray Workstation",
    manufacturer: "Thermo Scientific",
    model: "ARL 9900 Series",
    status: "operational" as Status,
    lastCalibration: "2026-07-15",
    nextCalibration: "2026-10-15",
    samples: 412,
    alerts: 0,
    documented: true,
  },
  {
    name: "Presse à broyer / Pastilleuse",
    manufacturer: "Data not available",
    model: "Data not available",
    status: "operational" as Status,
    lastCalibration: "2026-06-30",
    nextCalibration: "2026-09-30",
    samples: 388,
    alerts: 1,
  },
  {
    name: "Blaine — finesse ciment",
    manufacturer: "Data not available",
    model: "Data not available",
    status: "warning" as Status,
    lastCalibration: "2026-05-20",
    nextCalibration: "2026-08-26",
    samples: 254,
    alerts: 2,
  },
];

export const LAB_RESULTS = [
  { id: "S-20826-01", date: "2026-08-25 08:00", material: "Farine crue", analysis: "LSF", result: "97.4", spec: "96 – 99", status: "conforme" },
  { id: "S-20826-02", date: "2026-08-25 08:30", material: "Clinker", analysis: "Chaux libre (%)", result: "1.42", spec: "< 1.80", status: "conforme" },
  { id: "S-20826-03", date: "2026-08-25 10:00", material: "CEM I 42,5 N", analysis: "Blaine (cm²/g)", result: "3 210", spec: "3 000 – 3 600", status: "conforme" },
  { id: "S-20826-04", date: "2026-08-25 11:15", material: "CEM II/A-L 32,5 N", analysis: "SO₃ (%)", result: "3.71", spec: "< 3.50", status: "non conforme" },
  { id: "S-20826-05", date: "2026-08-25 12:40", material: "Calcaire carrière", analysis: "CaCO₃ (%)", result: "88.2", spec: "> 85", status: "conforme" },
  { id: "S-20826-06", date: "2026-08-25 13:50", material: "Clinker", analysis: "Résistance 2 j (MPa)", result: "21.8", spec: "> 20", status: "conforme" },
];

/* ---------------- IT / OT / Cyber ---------------- */

export type NetNode = {
  id: string;
  name: string;
  category: "Server" | "Workstation" | "PLC" | "SCADA" | "Switch" | "Router" | "Firewall" | "Internet" | "HMI";
  ip: string;
  state: "online" | "warning" | "offline";
  latency: number | null;
  uptime: string;
  segment: "IT" | "DMZ" | "OT" | "Edge";
};

export const NET_NODES: NetNode[] = [
  { id: "N-01", name: "Internet Link (Fiber)", category: "Internet", ip: "—", state: "online", latency: 18, uptime: "43 j", segment: "Edge" },
  { id: "N-02", name: "Firewall Périmètre", category: "Firewall", ip: "10.10.0.1", state: "warning", latency: 3, uptime: "112 j", segment: "Edge" },
  { id: "N-03", name: "Core Switch IT", category: "Switch", ip: "10.10.1.1", state: "online", latency: 1, uptime: "205 j", segment: "IT" },
  { id: "N-04", name: "Serveur AD / DNS", category: "Server", ip: "10.10.1.10", state: "online", latency: 2, uptime: "98 j", segment: "IT" },
  { id: "N-05", name: "Serveur Fichiers", category: "Server", ip: "10.10.1.12", state: "warning", latency: 9, uptime: "61 j", segment: "IT" },
  { id: "N-06", name: "Poste Bureau Méthodes", category: "Workstation", ip: "10.10.2.44", state: "online", latency: 4, uptime: "6 j", segment: "IT" },
  { id: "N-07", name: "Serveur Historian (DMZ)", category: "Server", ip: "10.20.0.5", state: "online", latency: 3, uptime: "77 j", segment: "DMZ" },
  { id: "N-08", name: "Firewall OT", category: "Firewall", ip: "10.20.0.1", state: "online", latency: 2, uptime: "150 j", segment: "DMZ" },
  { id: "N-09", name: "SCADA Server A", category: "SCADA", ip: "192.168.10.5", state: "online", latency: 1, uptime: "184 j", segment: "OT" },
  { id: "N-10", name: "SCADA Server B (redondant)", category: "SCADA", ip: "192.168.10.6", state: "online", latency: 1, uptime: "184 j", segment: "OT" },
  { id: "N-11", name: "HMI Salle de contrôle 1", category: "HMI", ip: "192.168.10.31", state: "online", latency: 2, uptime: "31 j", segment: "OT" },
  { id: "N-12", name: "HMI Ensachage", category: "HMI", ip: "192.168.10.33", state: "offline", latency: null, uptime: "—", segment: "OT" },
  { id: "N-13", name: "PLC Four 4K1", category: "PLC", ip: "192.168.20.11", state: "online", latency: 1, uptime: "212 j", segment: "OT" },
  { id: "N-14", name: "PLC Broyeur Cru 3F1", category: "PLC", ip: "192.168.20.14", state: "online", latency: 1, uptime: "212 j", segment: "OT" },
  { id: "N-15", name: "PLC Broyeurs Ciment", category: "PLC", ip: "192.168.20.16", state: "warning", latency: 27, uptime: "88 j", segment: "OT" },
  { id: "N-16", name: "Switch industriel Zone Four", category: "Switch", ip: "192.168.20.2", state: "online", latency: 1, uptime: "212 j", segment: "OT" },
  { id: "N-17", name: "Routeur site", category: "Router", ip: "10.10.0.2", state: "online", latency: 5, uptime: "121 j", segment: "Edge" },
  { id: "N-18", name: "Poste ingénierie automatisme", category: "Workstation", ip: "192.168.10.60", state: "online", latency: 2, uptime: "3 j", segment: "OT" },
];

export type FirewallEvent = {
  id: string;
  time: string;
  type: string;
  severity: Severity;
  source: string;
  destination: string;
  port: number;
  protocol: string;
  action: "blocked" | "allowed" | "flagged";
};

export const FIREWALL_EVENTS: FirewallEvent[] = [
  { id: "FW-9012", time: "2026-08-25 14:22", type: "Repeated connection attempts from unknown IP", severity: "high", source: "192.168.44.87", destination: "10.20.0.5", port: 502, protocol: "TCP", action: "blocked" },
  { id: "FW-9008", time: "2026-08-25 13:47", type: "Port scanning detected", severity: "high", source: "41.226.18.203", destination: "10.10.0.1", port: 0, protocol: "TCP", action: "blocked" },
  { id: "FW-9004", time: "2026-08-25 12:11", type: "Failed authentication (VPN)", severity: "medium", source: "197.14.62.9", destination: "10.10.0.1", port: 443, protocol: "TCP", action: "blocked" },
  { id: "FW-8999", time: "2026-08-25 10:03", type: "Unauthorized access attempt to industrial service", severity: "critical", source: "192.168.44.87", destination: "192.168.20.11", port: 502, protocol: "TCP", action: "blocked" },
  { id: "FW-8990", time: "2026-08-25 08:35", type: "Allowed OPC-UA session (historian)", severity: "low", source: "10.20.0.5", destination: "192.168.10.5", port: 4840, protocol: "TCP", action: "allowed" },
  { id: "FW-8981", time: "2026-08-25 06:12", type: "Suspicious outbound DNS volume", severity: "medium", source: "10.10.2.44", destination: "8.8.8.8", port: 53, protocol: "UDP", action: "flagged" },
  { id: "FW-8975", time: "2026-08-24 23:40", type: "Malware signature blocked (HTTP)", severity: "high", source: "10.10.2.51", destination: "185.62.190.4", port: 80, protocol: "TCP", action: "blocked" },
];

export type CyberIncident = {
  id: string;
  title: string;
  severity: Severity;
  source: string;
  destination: string;
  protocol: string;
  status: "Open" | "Investigating" | "Contained" | "Closed";
  detected: string;
  assignee: string | null;
  actions: string[];
};

export const CYBER_INCIDENTS: CyberIncident[] = [
  {
    id: "SEC-2026-0042",
    title: "Suspicious connection detected",
    severity: "high",
    source: "Unknown device (192.168.44.87)",
    destination: "Industrial network (192.168.20.11)",
    protocol: "TCP / Modbus 502",
    status: "Investigating",
    detected: "2026-08-25 10:03",
    assignee: "H. Gharbi (Cybersecurity)",
    actions: ["Investigate device", "Review firewall logs", "Assign cybersecurity engineer", "Create incident report"],
  },
  {
    id: "SEC-2026-0041",
    title: "Port scanning from external IP",
    severity: "medium",
    source: "41.226.18.203",
    destination: "Perimeter firewall",
    protocol: "TCP",
    status: "Contained",
    detected: "2026-08-25 13:47",
    assignee: "H. Gharbi (Cybersecurity)",
    actions: ["Confirm block rule", "Add IP to blocklist", "Monitor 24 h"],
  },
  {
    id: "SEC-2026-0039",
    title: "HMI Ensachage unreachable",
    severity: "medium",
    source: "192.168.10.33",
    destination: "OT network",
    protocol: "ICMP",
    status: "Open",
    detected: "2026-08-25 09:12",
    assignee: null,
    actions: ["Check switch port", "Check power supply", "Dispatch IT technician"],
  },
  {
    id: "SEC-2026-0035",
    title: "Malware signature blocked on workstation",
    severity: "high",
    source: "10.10.2.51",
    destination: "185.62.190.4",
    protocol: "TCP / HTTP",
    status: "Closed",
    detected: "2026-08-24 23:40",
    assignee: "H. Gharbi (Cybersecurity)",
    actions: ["Workstation isolated", "Full scan executed", "User awareness follow-up"],
  },
];

/* ---------------- Documentation / users / audit ---------------- */

export const DOCUMENTS = [
  { id: "DOC-001", title: "Manuel broyeur PFEIFFER MPS 3750", category: "Machine manuals", machineId: "3F1", size: "12.4 MB", updated: "2026-05-12" },
  { id: "DOC-002", title: "Procédure de maintenance four POLYSIUS", category: "Maintenance procedures", machineId: "4K1.KN01", size: "4.1 MB", updated: "2026-06-02" },
  { id: "DOC-003", title: "Consignation / LOTO — sécurité broyeurs", category: "Safety procedures", machineId: "6B1", size: "1.8 MB", updated: "2026-03-21" },
  { id: "DOC-004", title: "Plans mécaniques refroidisseur POLYTRACK", category: "Technical drawings", machineId: "4R1.PQ01", size: "22.7 MB", updated: "2026-01-30" },
  { id: "DOC-005", title: "Schémas électriques atelier ensachage", category: "Electrical diagrams", machineId: "8E1", size: "9.3 MB", updated: "2026-04-18" },
  { id: "DOC-006", title: "Architecture réseau IT / OT", category: "Network documentation", machineId: null, size: "3.2 MB", updated: "2026-07-09" },
  { id: "DOC-007", title: "Procédures qualité laboratoire ARL 9900", category: "Quality procedures", machineId: null, size: "2.6 MB", updated: "2026-02-14" },
  { id: "DOC-008", title: "Procédure de conduite atelier cuisson", category: "Production procedures", machineId: "4K1.KN01", size: "5.5 MB", updated: "2026-06-27" },
];

export const USERS = [
  { id: "U-001", matricule: "CB-1001", name: "Ahmed Ben Salah", role: "Administrateur", team: "Direction technique", status: "active", lastLogin: "2026-08-25 07:42" },
  { id: "U-002", matricule: "CB-1042", name: "Mohamed Trabelsi", role: "Responsable maintenance", team: "Maintenance", status: "active", lastLogin: "2026-08-25 06:10" },
  { id: "U-003", matricule: "CB-1188", name: "Sami Hamdi", role: "Ingénieur", team: "Méthodes", status: "active", lastLogin: "2026-08-24 21:55" },
  { id: "U-004", matricule: "CB-1290", name: "Rania Ouertani", role: "Opérateur", team: "Ensachage", status: "active", lastLogin: "2026-08-25 05:58" },
  { id: "U-005", matricule: "CB-1305", name: "Karim Jaziri", role: "Responsable production", team: "Production", status: "active", lastLogin: "2026-08-25 07:05" },
  { id: "U-006", matricule: "CB-1400", name: "Hela Gharbi", role: "Responsable IT / Cybersecurity", team: "SI & Cybersécurité", status: "active", lastLogin: "2026-08-25 08:30" },
  { id: "U-007", matricule: "CB-1455", name: "Nizar Chaabane", role: "Opérateur", team: "Cuisson", status: "suspended", lastLogin: "2026-07-30 14:12" },
];

export const AUDIT_LOGS = [
  { id: "A-9001", user: "Ahmed Ben Salah", action: "User logged in", resource: "Auth", date: "2026-08-25 07:42", ip: "10.10.2.31", result: "Success" },
  { id: "A-9002", user: "Mohamed Trabelsi", action: "Alarm acknowledged", resource: "AL-3388", date: "2026-08-25 13:01", ip: "10.10.2.44", result: "Success" },
  { id: "A-9003", user: "Mohamed Trabelsi", action: "Maintenance ticket created", resource: "CBI-2026-00124", date: "2026-08-25 14:15", ip: "10.10.2.44", result: "Success" },
  { id: "A-9004", user: "Sami Hamdi", action: "Machine viewed", resource: "3F1", date: "2026-08-25 11:50", ip: "10.10.2.60", result: "Success" },
  { id: "A-9005", user: "Hela Gharbi", action: "Cybersecurity incident assigned", resource: "SEC-2026-0042", date: "2026-08-25 10:20", ip: "10.10.2.9", result: "Success" },
  { id: "A-9006", user: "Nizar Chaabane", action: "User login attempt", resource: "Auth", date: "2026-08-25 09:04", ip: "10.10.2.77", result: "Failed" },
  { id: "A-9007", user: "Karim Jaziri", action: "Report generated", resource: "Daily Production Report", date: "2026-08-25 08:00", ip: "10.10.2.18", result: "Success" },
  { id: "A-9008", user: "Ahmed Ben Salah", action: "Ticket status changed (In Progress → Resolved)", resource: "CBI-2026-00108", date: "2026-08-24 16:44", ip: "10.10.2.31", result: "Success" },
];

/* ---------------- Series helpers ---------------- */

export function series(points: number, base: number, amplitude: number, seed = 1) {
  let s = seed * 9301;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return Array.from({ length: points }, (_, i) => ({
    t: `${String(Math.floor((i * 24) / points)).padStart(2, "0")}:00`,
    value: Number((base + Math.sin(i / 2.2) * amplitude * 0.6 + (rnd() - 0.5) * amplitude).toFixed(2)),
  }));
}

export const PRODUCTION_SERIES = Array.from({ length: 14 }, (_, i) => ({
  day: `${11 + i}/08`,
  clinker: 3600 + Math.round(Math.sin(i / 1.7) * 260 + (i % 3) * 55),
  cement: 2900 + Math.round(Math.cos(i / 2.1) * 210 + (i % 4) * 40),
  ensachage: 1800 + Math.round(Math.sin(i / 1.3) * 180),
}));

export const ANALYTICS = {
  availability: 91.4,
  mtbf: 148,
  mttr: 4.6,
  failures: 17,
  downtime: 38.2,
  cost: 128400,
  efficiency: 87.9,
  alarms: 212,
  energy: 96.4,
  netIncidents: 9,
};
