import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MRRChart } from "@/components/admin/mmr-chart"
import { PlatformUsageChart } from "@/components/admin/platform-usage-chart"

function formatMetric(metric: string) {
  return metric
    .split("_")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ")
}

export default async function AdminPage() {
  const tenantsCount = await prisma.tenant.count()

  const activeSubscriptions = await prisma.subscription.findMany({
    where: { status: "ACTIVE" },
    select: {
      tenantId: true,
      plan: {
        select: {
          priceCents: true,
        },
      },
    },
  })

  const activeSubscriptionCount = activeSubscriptions.length

  const mrr = activeSubscriptions.reduce((sum, subscription) => {
    return sum + (subscription.plan?.priceCents ?? 0)
  }, 0)

  const activeTenants = new Set(
    activeSubscriptions.map((subscription) => subscription.tenantId)
  ).size

  const usageByMetric = await prisma.usageRecord.groupBy({
    by: ["metric"],
    _sum: {
      quantity: true,
    },
    orderBy: {
      metric: "asc",
    },
  })

  const usageChartData = usageByMetric.map((item) => ({
    metric: formatMetric(item.metric),
    quantity: item._sum.quantity ?? 0,
  }))

  const mrrTrend = [{ month: "Current", value: mrr }]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Tenants</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{tenantsCount}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{activeSubscriptionCount}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Tenants</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{activeTenants}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>MRR</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {mrr.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>MRR Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <MRRChart data={mrrTrend} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Platform Usage Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <PlatformUsageChart data={usageChartData} />
        </CardContent>
      </Card>
    </div>
  )
}
