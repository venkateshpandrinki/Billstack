import { BillingPlans } from "@/components/tenant/billing-plans"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import {
  CalendarClock,
  CreditCard,
  Receipt,
  Sparkles,
  Wallet,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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

  const usageTotal = usageByMetric.reduce(
    (sum, item) => sum + (item._sum.quantity ?? 0),
    0
  )
  const topMetric = usageByMetric.reduce<{
    metric: string | null
    quantity: number
  }>(
    (best, item) => {
      const quantity = item._sum.quantity ?? 0
      if (quantity > best.quantity) {
        return { metric: item.metric, quantity }
      }
      return best
    },
    { metric: null, quantity: 0 }
  )
  const latestInvoice = invoices[0] ?? null

  return (
    <div className="space-y-8">
      <section className="glass-panel overflow-hidden px-6 py-8 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-100/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-700">
              <Sparkles className="h-3.5 w-3.5" />
              Billing control
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold leading-[1.05] text-slate-900 sm:text-5xl">
                Manage invoices, plans, and <span className="italic text-blue-600">usage economics</span>.
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-600">
                Review current-month consumption, confirm invoice history, and switch plans without leaving the tenant console.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200/70 bg-white/80 px-5 py-4 shadow-sm">
              <p className="text-[13px] font-semibold uppercase tracking-widest text-slate-500">
                Month usage
              </p>
              <p className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                {usageTotal.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="rounded-3xl border border-blue-100 bg-blue-50/70 px-5 py-4 shadow-sm">
              <p className="text-[13px] font-semibold uppercase tracking-widest text-blue-700">
                Invoices
              </p>
              <p className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                {invoices.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="gap-4">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Monthly usage</CardTitle>
              <div className="rounded-2xl bg-blue-50 p-2 text-blue-600">
                <Wallet className="h-4 w-4" />
              </div>
            </div>
            <CardDescription>Total units recorded since the start of this month.</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tracking-tight text-slate-900">
            {usageTotal.toLocaleString("en-IN")}
          </CardContent>
        </Card>

        <Card className="gap-4">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Top metric</CardTitle>
              <div className="rounded-2xl bg-blue-50 p-2 text-blue-600">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
            <CardDescription>Largest usage driver in the current billing cycle.</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tracking-tight text-slate-900">
            {topMetric.metric ? formatMetricLabel(topMetric.metric) : "No usage yet"}
          </CardContent>
        </Card>

        <Card className="gap-4">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Latest invoice</CardTitle>
              <div className="rounded-2xl bg-blue-50 p-2 text-blue-600">
                <CalendarClock className="h-4 w-4" />
              </div>
            </div>
            <CardDescription>Most recent issued invoice on this tenant account.</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tracking-tight text-slate-900">
            {latestInvoice ? formatDate(latestInvoice.issuedAt) : "No invoices yet"}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-blue-100/70 pb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">Usage This Month</CardTitle>
                <CardDescription className="mt-2 max-w-lg text-sm leading-6">
                  A metric-by-metric view of what will feed into your billing cycle.
                </CardDescription>
              </div>
              <div className="rounded-full border border-blue-200/70 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-700">
                Live usage
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            {usageByMetric.length === 0 ? (
              <p className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-6 text-sm text-slate-500">
                No usage recorded this month.
              </p>
            ) : (
              usageByMetric.map((item) => (
                <div
                  key={item.metric}
                  className="flex items-center justify-between rounded-3xl border border-slate-200/70 bg-white/80 px-4 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-blue-50 p-2 text-blue-600">
                      <Receipt className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {formatMetricLabel(item.metric)}
                      </p>
                      <p className="text-sm text-slate-500">Metered this cycle</p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold tracking-tight text-slate-900">
                    {(item._sum.quantity ?? 0).toLocaleString("en-IN")}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="border-b border-blue-100/70 pb-6">
            <CardTitle className="text-2xl">Invoices</CardTitle>
            <CardDescription className="mt-2 text-sm leading-6">
              Issued invoices and collection status.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {invoices.length === 0 ? (
              <p className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-6 text-sm text-slate-500">
                No invoices yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-3 text-sm">
                  <thead>
                    <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="rounded-3xl bg-white/80 shadow-sm">
                        <td className="rounded-l-3xl border-y border-l border-slate-200/70 px-4 py-4 text-slate-700">
                          {formatDate(invoice.issuedAt)}
                        </td>
                        <td className="border-y border-slate-200/70 px-4 py-4">
                          <span className="rounded-full border border-blue-200/70 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-700">
                            {invoice.status}
                          </span>
                        </td>
                        <td className="rounded-r-3xl border-y border-r border-slate-200/70 px-4 py-4 text-right font-semibold text-slate-900">
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
      </div>

      <BillingPlans />
    </div>
  )
}
