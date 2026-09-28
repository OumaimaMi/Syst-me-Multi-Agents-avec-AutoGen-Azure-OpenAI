import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const axis = { stroke: "var(--color-muted-foreground)", fontSize: 11 };
const tooltipStyle = {
  contentStyle: {
    background: "var(--color-popover)",
    border: "1px solid var(--color-border)",
    borderRadius: 8,
    fontSize: 12,
  },
  labelStyle: { color: "var(--color-muted-foreground)" },
};

export function TrendArea({
  data,
  dataKey = "value",
  xKey = "t",
  color = "var(--color-chart-1)",
  height = 200,
  unit,
}: {
  data: Record<string, unknown>[];
  dataKey?: string;
  xKey?: string;
  color?: string;
  height?: number;
  unit?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 6, right: 8, bottom: 0, left: -12 }}>
        <defs>
          <linearGradient id={`g-${dataKey}-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.45} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={xKey} tick={axis} tickLine={false} axisLine={false} />
        <YAxis tick={axis} tickLine={false} axisLine={false} width={44} {...(unit ? { unit } : {})} />
        <Tooltip {...tooltipStyle} />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          fill={`url(#g-${dataKey}-${color})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function MultiLine({
  data,
  xKey,
  lines,
  height = 240,
}: {
  data: Record<string, unknown>[];
  xKey: string;
  lines: { key: string; label: string; color: string }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 6, right: 8, bottom: 0, left: -12 }}>
        <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={xKey} tick={axis} tickLine={false} axisLine={false} />
        <YAxis tick={axis} tickLine={false} axisLine={false} width={48} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {lines.map((l) => (
          <Line key={l.key} type="monotone" dataKey={l.key} name={l.label} stroke={l.color} strokeWidth={2} dot={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function Bars({
  data,
  xKey,
  bars,
  height = 240,
}: {
  data: Record<string, unknown>[];
  xKey: string;
  bars: { key: string; label: string; color: string }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 6, right: 8, bottom: 0, left: -12 }}>
        <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={xKey} tick={axis} tickLine={false} axisLine={false} />
        <YAxis tick={axis} tickLine={false} axisLine={false} width={48} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {bars.map((b) => (
          <Bar key={b.key} dataKey={b.key} name={b.label} fill={b.color} radius={[3, 3, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function Donut({
  data,
  height = 220,
}: {
  data: { name: string; value: number; color: string }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="82%" paddingAngle={2}>
          {data.map((d) => (
            <Cell key={d.name} fill={d.color} stroke="var(--color-panel)" />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
