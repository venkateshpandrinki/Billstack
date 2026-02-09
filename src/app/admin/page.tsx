import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MRRChart } from "@/components/admin/mmr-chart"

export default async function AdminPage() {
  const tenantsCount = await prisma.tenant.count()

  const activeSubs = await prisma.subscription.count({
    where: { status: "ACTIVE" },
  })

  // Mock MRR logic: assume ₹1000 per active subscription
  const mrr = activeSubs * 1000

  // Mock MRR trend
  const mrrTrend = [
    { month: "Jan", value: 2000 },
    { month: "Feb", value: 4000 },
    { month: "Mar", value: mrr },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Tenants</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {tenantsCount}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {activeSubs}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>MRR</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            ₹{mrr}
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
    </div>
  )
}
