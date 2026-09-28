import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ALARMS,
  CYBER_INCIDENTS,
  MACHINES,
  TICKETS,
  type Alarm,
  type CyberIncident,
  type Machine,
  type Ticket,
} from "./demo-data";

export type Role =
  | "Administrateur"
  | "Responsable maintenance"
  | "Ingénieur"
  | "Opérateur"
  | "Responsable production"
  | "Responsable IT / Cybersecurity";

export type SessionUser = { matricule: string; name: string; role: Role };

export type Notification = {
  id: string;
  level: "critical" | "high" | "medium" | "info" | "ok";
  title: string;
  detail: string;
  time: string;
  read: boolean;
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: "N1", level: "critical", title: "Critical machine failure", detail: "Broyeur Ciment 1 — motor temperature 94 °C", time: "14:07", read: false },
  { id: "N2", level: "high", title: "High temperature detected", detail: "Broyeur Cru 3F1 — bearing 81 °C", time: "11:42", read: false },
  { id: "N3", level: "critical", title: "Firewall security event", detail: "Unauthorized access attempt on port 502", time: "10:03", read: false },
  { id: "N4", level: "info", title: "Network connection lost", detail: "HMI Ensachage (192.168.10.33) unreachable", time: "09:12", read: true },
  { id: "N5", level: "medium", title: "Preventive maintenance due tomorrow", detail: "Ventilateur préchauffeur 5V1", time: "08:20", read: true },
  { id: "N6", level: "ok", title: "Maintenance completed", detail: "Graissage marteaux concasseur — CBI-2026-00108", time: "07:15", read: true },
];

const ROLE_BY_MATRICULE: Record<string, SessionUser> = {
  "CB-1001": { matricule: "CB-1001", name: "Ahmed Ben Salah", role: "Administrateur" },
  "CB-1042": { matricule: "CB-1042", name: "Mohamed Trabelsi", role: "Responsable maintenance" },
  "CB-1188": { matricule: "CB-1188", name: "Sami Hamdi", role: "Ingénieur" },
  "CB-1290": { matricule: "CB-1290", name: "Rania Ouertani", role: "Opérateur" },
  "CB-1305": { matricule: "CB-1305", name: "Karim Jaziri", role: "Responsable production" },
  "CB-1400": { matricule: "CB-1400", name: "Hela Gharbi", role: "Responsable IT / Cybersecurity" },
};

type Store = {
  user: SessionUser | null;
  login: (matricule: string, role?: Role) => SessionUser;
  logout: () => void;
  machines: Machine[];
  alarms: Alarm[];
  tickets: Ticket[];
  incidents: CyberIncident[];
  notifications: Notification[];
  acknowledgeAlarm: (id: string, technician: string) => void;
  resolveAlarm: (id: string, resolution: string) => void;
  assignAlarm: (id: string, technician: string) => void;
  createTicket: (t: Omit<Ticket, "id">) => string;
  updateTicketStatus: (id: string, status: Ticket["status"]) => void;
  assignIncident: (id: string, assignee: string) => void;
  updateIncidentStatus: (id: string, status: CyberIncident["status"]) => void;
  markNotificationsRead: () => void;
  audit: { id: string; text: string; time: string }[];
};

const Ctx = createContext<Store | null>(null);

const now = () => new Date().toISOString().slice(11, 16);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("cbi-session");
      if (raw) setUser(JSON.parse(raw) as SessionUser);
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (u: SessionUser | null) => {
    setUser(u);
    try {
      if (u) window.localStorage.setItem("cbi-session", JSON.stringify(u));
      else window.localStorage.removeItem("cbi-session");
    } catch {
      /* ignore */
    }
  };
  const [machines] = useState<Machine[]>(MACHINES);
  const [alarms, setAlarms] = useState<Alarm[]>(ALARMS);
  const [tickets, setTickets] = useState<Ticket[]>(TICKETS);
  const [incidents, setIncidents] = useState<CyberIncident[]>(CYBER_INCIDENTS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [audit, setAudit] = useState<{ id: string; text: string; time: string }[]>([]);

  const log = useCallback((text: string) => {
    setAudit((a) => [{ id: `L-${Date.now()}`, text, time: now() }, ...a].slice(0, 50));
  }, []);

  const value = useMemo<Store>(
    () => ({
      user,
      login: (matricule, role) => {
        const known = ROLE_BY_MATRICULE[matricule.trim().toUpperCase()];
        const session: SessionUser =
          known ?? { matricule: matricule || "CB-0000", name: matricule || "Utilisateur", role: role ?? "Opérateur" };
        const final = role ? { ...session, role } : session;
        persist(final);
        log(`${final.name} logged in (${final.role})`);
        return final;
      },
      logout: () => persist(null),
      machines,
      alarms,
      tickets,
      incidents,
      notifications,
      acknowledgeAlarm: (id, technician) => {
        setAlarms((a) => a.map((x) => (x.id === id ? { ...x, status: "acknowledged", technician } : x)));
        log(`Alarm ${id} acknowledged`);
      },
      assignAlarm: (id, technician) => {
        setAlarms((a) => a.map((x) => (x.id === id ? { ...x, technician } : x)));
        log(`Alarm ${id} assigned to ${technician}`);
      },
      resolveAlarm: (id, resolution) => {
        setAlarms((a) => a.map((x) => (x.id === id ? { ...x, status: "resolved", resolution } : x)));
        log(`Alarm ${id} marked as resolved`);
      },
      createTicket: (t) => {
        const id = `CBI-2026-${String(125 + tickets.length).padStart(5, "0")}`;
        setTickets((prev) => [{ ...t, id }, ...prev]);
        log(`Maintenance ticket ${id} created`);
        return id;
      },
      updateTicketStatus: (id, status) => {
        setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
        log(`Ticket ${id} status changed to ${status}`);
      },
      assignIncident: (id, assignee) => {
        setIncidents((prev) => prev.map((i) => (i.id === id ? { ...i, assignee } : i)));
        log(`Incident ${id} assigned to ${assignee}`);
      },
      updateIncidentStatus: (id, status) => {
        setIncidents((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
        log(`Incident ${id} status changed to ${status}`);
      },
      markNotificationsRead: () => setNotifications((n) => n.map((x) => ({ ...x, read: true }))),
      audit,
    }),
    [user, machines, alarms, tickets, incidents, notifications, audit, log],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
