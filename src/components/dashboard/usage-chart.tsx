"use client"

import {
  CartesianGrid,
  LineChart,
  Line,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type UsageChartPoint = {
  day: string
  usage: number
}

// 1. The key here is 'usage'
const chartConfig = {
  usage: {
    label: "Usage",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function UsageChart({ data }: { data: UsageChartPoint[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <LineChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey="usage"
          stroke="var(--color-usage)"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5, fill: "var(--color-usage)", stroke: "#ffffff" }}
          connectNulls
        />
      </LineChart>
    </ChartContainer>
  )
}
