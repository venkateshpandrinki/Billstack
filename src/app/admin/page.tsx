import { prisma } from "@/lib/prisma"
import {
  Activity,
  ArrowUpRight,
  Building2,
  CreditCard,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  const averageRevenuePerTenant =
    activeTenants === 0 ? 0 : Math.round(mrr / activeTenants)
  const topUsageMetric = usageByMetric.reduce<{
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

  return (
    <div className="space-y-8">
      <section className="glass-panel overflow-hidden px-6 py-8 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-100/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-700">
              <Sparkles className="h-3.5 w-3.5" />
              Platform overview
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold leading-[1.05] text-slate-900 sm:text-5xl">
                Monitor the whole billing system from one <span className="italic text-blue-600">admin cockpit</span>.
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-600">
                Keep track of tenant growth, subscription revenue, and platform-wide consumption from a single operational view.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200/70 bg-white/80 px-5 py-4 shadow-sm">
              <p className="text-[13px] font-semibold uppercase tracking-widest text-slate-500">
                Top usage signal
              </p>
              <p className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                {topUsageMetric.metric ? formatMetric(topUsageMetric.metric) : "No usage yet"}
              </p>
            </div>
            <div className="rounded-3xl border border-blue-100 bg-blue-50/70 px-5 py-4 shadow-sm">
              <p className="text-[13px] font-semibold uppercase tracking-widest text-blue-700">
                Avg. revenue
              </p>
              <p className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                {averageRevenuePerTenant.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="gap-4">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Total Tenants</CardTitle>
              <div className="rounded-2xl bg-blue-50 p-2 text-blue-600">
                <Building2 className="h-4 w-4" />
              </div>
            </div>
            <CardDescription>All tenant workspaces created on the platform.</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold tracking-tight text-slate-900">
            {tenantsCount}
          </CardContent>
        </Card>

        <Card className="gap-4">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Active Subscriptions</CardTitle>
              <div className="rounded-2xl bg-blue-50 p-2 text-blue-600">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
            <CardDescription>Subscriptions currently in the active state.</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold tracking-tight text-slate-900">
            {activeSubscriptionCount}
          </CardContent>
        </Card>

        <Card className="gap-4">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Active Tenants</CardTitle>
              <div className="rounded-2xl bg-blue-50 p-2 text-blue-600">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <CardDescription>Distinct tenants with at least one live subscription.</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold tracking-tight text-slate-900">
            {activeTenants}
          </CardContent>
        </Card>

        <Card className="gap-4">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">MRR</CardTitle>
              <div className="rounded-2xl bg-blue-50 p-2 text-blue-600">
                <Activity className="h-4 w-4" />
              </div>
            </div>
            <CardDescription>Monthly recurring revenue across active subscriptions.</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold tracking-tight text-slate-900">
            {mrr.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.8fr)]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-blue-100/70 pb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">MRR Over Time</CardTitle>
                <CardDescription className="mt-2 max-w-lg text-sm leading-6">
                  Current recurring revenue shown on the same theme as the tenant dashboard.
                </CardDescription>
              </div>
              <div className="rounded-full border border-blue-200/70 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-700">
                Revenue
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <MRRChart data={mrrTrend} />
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="border-b border-blue-100/70 pb-6">
            <CardTitle className="text-2xl">Admin Notes</CardTitle>
            <CardDescription className="mt-2 text-sm leading-6">
              Short platform highlights for the current billing state.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-4">
              <p className="text-[13px] font-semibold uppercase tracking-widest text-blue-700">
                Leading metric
              </p>
              <p className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                {topUsageMetric.metric ? formatMetric(topUsageMetric.metric) : "No usage yet"}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-4">
              <p className="text-[13px] font-semibold uppercase tracking-widest text-slate-500">
                Per active tenant
              </p>
              <p className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                {averageRevenuePerTenant.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3 text-sm text-slate-600">
              <ArrowUpRight className="h-4 w-4 text-blue-600" />
              Platform usage is led by{" "}
              <span className="font-semibold text-slate-900">
                {topUsageMetric.metric ? formatMetric(topUsageMetric.metric) : "no tracked metric yet"}
              </span>
              .
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="border-b border-blue-100/70 pb-6">
          <CardTitle className="text-2xl">Platform Usage Metrics</CardTitle>
          <CardDescription className="mt-2 text-sm leading-6">
            Cross-tenant usage totals for the tracked platform metrics.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <PlatformUsageChart data={usageChartData} />
        </CardContent>
      </Card>
    </div>
  )
}
