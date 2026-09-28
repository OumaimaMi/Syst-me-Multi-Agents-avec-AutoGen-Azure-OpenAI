/**
 * Abstract industrial data-source layer.
 *
 * The prototype ships with `DemoDataSource` (simulated values). Later versions can
 * add SCADA / OPC-UA / MQTT / PLC / Historian / Firewall API / SIEM adapters that
 * implement the same interfaces without touching the UI.
 *
 * SAFETY: this interface is intentionally READ-ONLY. No command / write path to a
 * PLC, machine, or firewall rule is exposed.
 */

import {
  ALARMS,
  FIREWALL_EVENTS,
  MACHINES,
  NET_NODES,
  SILOS,
  type Alarm,
  type FirewallEvent,
  type Machine,
  type NetNode,
  type Silo,
} from "./demo-data";

export type SourceKind = "demo" | "opcua" | "mqtt" | "scada" | "plc" | "historian" | "firewall-api" | "siem" | "rest";

export interface DataSource {
  readonly kind: SourceKind;
  readonly simulated: boolean;
  listMachines(): Promise<Machine[]>;
  listAlarms(): Promise<Alarm[]>;
  listSilos(): Promise<Silo[]>;
  listNetworkNodes(): Promise<NetNode[]>;
  listFirewallEvents(): Promise<FirewallEvent[]>;
}

export class DemoDataSource implements DataSource {
  readonly kind: SourceKind = "demo";
  readonly simulated = true;
  async listMachines() {
    return MACHINES;
  }
  async listAlarms() {
    return ALARMS;
  }
  async listSilos() {
    return SILOS;
  }
  async listNetworkNodes() {
    return NET_NODES;
  }
  async listFirewallEvents() {
    return FIREWALL_EVENTS;
  }
}

export const dataSource: DataSource = new DemoDataSource();

export const PLANNED_CONNECTORS: { id: SourceKind; label: string; status: "planned" }[] = [
  { id: "opcua", label: "OPC-UA (serveur SCADA)", status: "planned" },
  { id: "mqtt", label: "MQTT broker (capteurs IIoT)", status: "planned" },
  { id: "plc", label: "PLC gateway (lecture seule)", status: "planned" },
  { id: "historian", label: "Historian / base industrielle", status: "planned" },
  { id: "firewall-api", label: "Firewall API (logs)", status: "planned" },
  { id: "siem", label: "SIEM (événements sécurité)", status: "planned" },
  { id: "rest", label: "API REST interne", status: "planned" },
];
