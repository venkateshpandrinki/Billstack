import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  const tenantId = session?.user?.tenantId

  const plans = await prisma.plan.findMany({
    orderBy: { priceCents: "asc" },
  })

  let activePlanId: string | null = null

  if (tenantId) {
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        tenantId,
        status: "ACTIVE",
      },
      orderBy: { updatedAt: "desc" },
      select: { planId: true },
    })

    activePlanId = activeSubscription?.planId ?? null
  }

  return NextResponse.json({ plans, activePlanId })
}
