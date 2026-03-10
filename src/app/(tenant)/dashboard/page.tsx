import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { UsageChart } from "@/components/dashboard/usage-chart"
import {
  Activity,
  ArrowUpRight,
  Building2,
  CalendarDays,
  Sparkles,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
  const activeDays = chartData.filter((item) => item.usage > 0).length
  const averageUsage = activeDays === 0 ? 0 : Math.round(usageThisMonthTotal / activeDays)
  const peakUsage = chartData.reduce(
    (best, item) => (item.usage > best.usage ? item : best),
    { day: "-", usage: 0 }
  )

  return (
    <div className="space-y-8">
      <section className="glass-panel overflow-hidden px-6 py-8 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-100/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-700">
              <Sparkles className="h-3.5 w-3.5" />
              Revenue cockpit
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold leading-[1.05] text-slate-900 sm:text-5xl">
                Keep your tenant <span className="italic text-blue-600">usage pulse</span> in view.
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-600">
                Monitor monthly activity, spot peaks early, and keep billing aligned with how your workspace is actually being used.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200/70 bg-white/80 px-5 py-4 shadow-sm">
              <p className="text-[13px] font-semibold uppercase tracking-widest text-slate-500">
                Workspace
              </p>
              <p className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                {tenant?.name ?? "Tenant workspace"}
              </p>
            </div>
            <div className="rounded-3xl border border-blue-100 bg-blue-50/70 px-5 py-4 shadow-sm">
              <p className="text-[13px] font-semibold uppercase tracking-widest text-blue-700">
                Primary metric
              </p>
              <p className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                {usageLabel}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="gap-4">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Workspace</CardTitle>
              <div className="rounded-2xl bg-blue-50 p-2 text-blue-600">
                <Building2 className="h-4 w-4" />
              </div>
            </div>
            <CardDescription>Name of the current tenant workspace.</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tracking-tight text-slate-900">
            {tenant?.name ?? "Tenant workspace"}
          </CardContent>
        </Card>

        <Card className="gap-4">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Active days</CardTitle>
              <div className="rounded-2xl bg-blue-50 p-2 text-blue-600">
                <CalendarDays className="h-4 w-4" />
              </div>
            </div>
            <CardDescription>Days with recorded usage in the current month.</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tracking-tight text-slate-900">
            {activeDays}
          </CardContent>
        </Card>

        <Card className="gap-4">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Daily average</CardTitle>
              <div className="rounded-2xl bg-blue-50 p-2 text-blue-600">
                <Activity className="h-4 w-4" />
              </div>
            </div>
            <CardDescription>Average units across days with activity.</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tracking-tight text-slate-900">
            {averageUsage.toLocaleString("en-IN")}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-blue-100/70 pb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">Usage This Month</CardTitle>
                <CardDescription className="mt-2 max-w-lg text-sm leading-6">
                  A running view of your dominant billing metric, tracked day by day for the current month.
                </CardDescription>
              </div>
              <div className="rounded-full border border-blue-200/70 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-700">
                {usageLabel}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                  {usageThisMonthTotal.toLocaleString("en-IN")}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Total {usageLabel.toLowerCase()} units so far this month
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3 text-sm text-slate-600">
                <ArrowUpRight className="h-4 w-4 text-blue-600" />
                Peak usage hit <span className="font-semibold text-slate-900">{peakUsage.usage}</span> on day {peakUsage.day}
              </div>
            </div>

            <UsageChart data={chartData} />
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="border-b border-blue-100/70 pb-6">
            <CardTitle className="text-2xl">Quick Notes</CardTitle>
            <CardDescription className="mt-2 text-sm leading-6">
              Fast context for this billing cycle.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-4">
              <p className="text-[13px] font-semibold uppercase tracking-widest text-blue-700">
                Dominant stream
              </p>
              <p className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                {usageLabel}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-4">
              <p className="text-[13px] font-semibold uppercase tracking-widest text-slate-500">
                Activity coverage
              </p>
              <p className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                {activeDays} active days
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-4">
              <p className="text-[13px] font-semibold uppercase tracking-widest text-slate-500">
                Cycle average
              </p>
              <p className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                {averageUsage.toLocaleString("en-IN")} / day
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
