"use client"

import {
  CartesianGrid,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type PlatformUsagePoint = {
  metric: string
  quantity: number
}

const chartConfig = {
  quantity: {
    label: "Usage",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function PlatformUsageChart({ data }: { data: PlatformUsagePoint[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">No usage data available.</p>
  }

  return (
    <ChartContainer config={chartConfig} className="h-72 w-full">
        <BarChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="metric" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="quantity" fill="var(--color-quantity)" radius={[6, 6, 0, 0]} />
        </BarChart>
    </ChartContainer>
  )
}
