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

type MRRPoint = {
  month: string
  value: number
}

const chartConfig = {
  value: {
    label: "MRR",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function MRRChart({ data }: { data: MRRPoint[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
        <LineChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => (
                  <span>
                    {Number(value).toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    })}
                  </span>
                )}
              />
            }
          />
          <Line
            type="natural"
            dataKey="value"
            stroke="var(--color-value)"
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
    </ChartContainer>
  )
}
