import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { UsageChart } from "@/components/dashboard/usage-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function humanizeMetric(metric: string) {
  return metric
    .split("_")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ")
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.tenantId) return null

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId },
  })

  const usageThisMonth = await prisma.usageRecord.findMany({
    where: {
      tenantId: session.user.tenantId,
      recordedAt: { gte: startOfMonth },
    },
    orderBy: { recordedAt: "asc" },
    select: {
      metric: true,
      quantity: true,
      recordedAt: true,
    },
  })

  const totalByMetric = new Map<string, number>()
  for (const event of usageThisMonth) {
    totalByMetric.set(
      event.metric,
      (totalByMetric.get(event.metric) ?? 0) + event.quantity
    )
  }

  const selectedMetric =
    Array.from(totalByMetric.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    null

  const dailyTotals = new Map<string, number>()
  for (const event of usageThisMonth) {
    if (selectedMetric && event.metric !== selectedMetric) continue
    const key = event.recordedAt.toISOString().slice(0, 10)
    dailyTotals.set(key, (dailyTotals.get(key) ?? 0) + event.quantity)
  }

  const chartData: Array<{ day: string; usage: number }> = []
  const cursor = new Date(startOfMonth)
  while (cursor <= now) {
    const key = cursor.toISOString().slice(0, 10)
    chartData.push({
      day: cursor.toLocaleDateString("en-US", { day: "numeric" }),
      usage: dailyTotals.get(key) ?? 0,
    })
    cursor.setDate(cursor.getDate() + 1)
  }

  const usageThisMonthTotal = chartData.reduce((acc, item) => acc + item.usage, 0)
  const usageLabel = selectedMetric ? humanizeMetric(selectedMetric) : "Usage"

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Workspace</CardTitle>
          </CardHeader>
          <CardContent>{tenant?.name}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan</CardTitle>
          </CardHeader>
          <CardContent>Pro</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>Active</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage This Month</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-3xl font-bold">{usageThisMonthTotal}</p>
          <p className="text-sm text-muted-foreground">{usageLabel} per day</p>
          <UsageChart data={chartData} />
        </CardContent>
      </Card>
    </div>
  )
}
