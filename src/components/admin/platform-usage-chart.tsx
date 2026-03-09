"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

type PlatformUsagePoint = {
  metric: string
  quantity: number
}

export function PlatformUsageChart({ data }: { data: PlatformUsagePoint[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">No usage data available.</p>
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="metric" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="quantity" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
