"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DailyMetric = {
  date: string;
  label: string;
  orders: number;
  revenue: number;
};

type StatusMetric = {
  status: string;
  label: string;
  value: number;
};

type TopItem = {
  label: string;
  totalQuantity: number;
  totalRevenueInMillimes: number;
};

type DashboardChartsProps = {
  dailyMetrics: DailyMetric[];
  statusMetrics: StatusMetric[];
  topProducts: TopItem[];
  topCategories: TopItem[];
};

const statusColors = [
  "#2563eb",
  "#16a34a",
  "#d97706",
  "#059669",
  "#dc2626",
];

function formatTnd(value: number): string {
  return new Intl.NumberFormat("fr-TN", {
    style: "currency",
    currency: "TND",
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(value / 1000);
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>

        {description ? (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        ) : null}
      </div>

      <div className="mt-5 h-80">{children}</div>
    </div>
  );
}

export default function DashboardCharts({
  dailyMetrics,
  statusMetrics,
  topProducts,
  topCategories,
}: DashboardChartsProps) {
  return (
    <div className="space-y-8">
      <ChartCard
        title="Évolution des ventes"
        description="Commandes et chiffre d’affaires sur les 30 derniers jours."
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dailyMetrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis yAxisId="left" />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(value) => `${Number(value) / 1000}`}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === "revenue") {
                  return [formatTnd(Number(value)), "Chiffre d’affaires"];
                }

                return [Number(value), "Commandes"];
              }}
            />
            <Legend />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              name="Chiffre d’affaires"
              stroke="#111827"
              fill="#111827"
              fillOpacity={0.12}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="orders"
              name="Commandes"
              stroke="#2563eb"
              fill="#2563eb"
              fillOpacity={0.12}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid gap-8 xl:grid-cols-2">
        <ChartCard
          title="Commandes par statut"
          description="Répartition actuelle des commandes."
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusMetrics}
                dataKey="value"
                nameKey="label"
                outerRadius={110}
                label
              >
                {statusMetrics.map((entry, index) => (
                  <Cell
                    key={entry.status}
                    fill={statusColors[index % statusColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Produits les plus vendus"
          description="Classement par quantité vendue."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "totalRevenueInMillimes") {
                    return [formatTnd(Number(value)), "CA"];
                  }

                  return [Number(value), "Quantité vendue"];
                }}
              />
              <Legend />
              <Bar
                dataKey="totalQuantity"
                name="Quantité vendue"
                fill="#111827"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard
        title="Catégories les plus vendues"
        description="Classement des catégories par volume de vente."
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topCategories}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => {
                if (name === "totalRevenueInMillimes") {
                  return [formatTnd(Number(value)), "CA"];
                }

                return [Number(value), "Quantité vendue"];
              }}
            />
            <Legend />
            <Bar
              dataKey="totalQuantity"
              name="Quantité vendue"
              fill="#2563eb"
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}