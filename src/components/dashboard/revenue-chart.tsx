"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface RevenueChartProps {
  data?: { day: string; ventas: number }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data && data.length > 0 ? data : [
    { day: "Lun", ventas: 0 },
    { day: "Mar", ventas: 0 },
    { day: "Mié", ventas: 0 },
    { day: "Jue", ventas: 0 },
    { day: "Vie", ventas: 0 },
    { day: "Sáb", ventas: 0 },
    { day: "Dom", ventas: 0 },
  ];

  return (
    <div className="h-64 w-full pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#64748b" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickFormatter={(value) => `S/${value}`}
          />
          <Tooltip
            cursor={{ fill: "rgba(59, 130, 246, 0.05)" }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-xs font-semibold text-slate-500">{payload[0].payload.day}</p>
                    <p className="text-sm font-bold text-blue-600">
                      {formatCurrency(payload[0].value as number)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="ventas"
            fill="#3b82f6"
            radius={[6, 6, 0, 0]}
            maxBarSize={38}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
