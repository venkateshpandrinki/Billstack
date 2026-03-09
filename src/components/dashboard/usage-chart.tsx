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
    color: "hsl(var(--primary))", // This maps to --color-usage
  },
} satisfies ChartConfig

export function UsageChart({ data }: { data: UsageChartPoint[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
        {/* Added accessibilityLayer for better hover performance */}
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
  type="monotone" // This is the name of the curve you want
  dataKey="usage"
  stroke="#2563eb" // Using a hardcoded hex code to rule out CSS variable issues
  strokeWidth={2.5}
  // dot={false}
  connectNulls={true} 
/>
        </LineChart>
    </ChartContainer>
  )
}