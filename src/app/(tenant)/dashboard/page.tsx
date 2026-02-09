import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { UsageChart } from "@/components/dashboard/usage-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.tenantId) return null

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId },
  })

  const usage = await prisma.usageRecord.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { recordedAt: "asc" },
  })

  const chartData = usage.map((u) => ({
    month: u.recordedAt.toLocaleDateString("en-US", { month: "short" }),
    usage: u.quantity,
  }))

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
          <CardContent>Pro (Mock)</CardContent>
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
          <CardTitle>Usage (API Calls)</CardTitle>
        </CardHeader>
        <CardContent>
          <UsageChart data={chartData} />
        </CardContent>
      </Card>
    </div>
  )
}
