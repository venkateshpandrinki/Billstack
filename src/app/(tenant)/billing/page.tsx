import { BillingPlans } from "@/components/tenant/billing-plans"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function formatMetricLabel(metric: string) {
  return metric
    .split("_")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ")
}

function formatDate(value: Date | null) {
  if (!value) return "-"
  return value.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default async function BillingPage() {
  const session = await auth()
  if (!session?.user?.tenantId) return null

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const usageByMetric = await prisma.usageRecord.groupBy({
    by: ["metric"],
    where: {
      tenantId: session.user.tenantId,
      recordedAt: { gte: startOfMonth },
    },
    _sum: {
      quantity: true,
    },
    orderBy: {
      metric: "asc",
    },
  })

  const invoices = await prisma.invoice.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { issuedAt: "desc" },
    select: {
      id: true,
      issuedAt: true,
      status: true,
      amountCents: true,
    },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Billing</h1>

      <Card>
        <CardHeader>
          <CardTitle>Usage This Month</CardTitle>
        </CardHeader>
        <CardContent>
          {usageByMetric.length === 0 ? (
            <p className="text-sm text-muted-foreground">No usage recorded this month.</p>
          ) : (
            <div className="space-y-2">
              {usageByMetric.map((item) => (
                <p key={item.metric} className="text-sm">
                  <span className="font-medium">{formatMetricLabel(item.metric)}:</span>{" "}
                  {(item._sum.quantity ?? 0).toLocaleString("en-IN")}
                </p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">No invoices yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="px-2 py-2 font-medium">Date</th>
                    <th className="px-2 py-2 font-medium">Status</th>
                    <th className="px-2 py-2 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b last:border-0">
                      <td className="px-2 py-2">{formatDate(invoice.issuedAt)}</td>
                      <td className="px-2 py-2">{invoice.status}</td>
                      <td className="px-2 py-2 text-right">
                        {(invoice.amountCents / 100).toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <BillingPlans />
    </div>
  )
}
