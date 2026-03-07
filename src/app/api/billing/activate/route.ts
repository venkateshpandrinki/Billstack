import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  const tenantId = session?.user?.tenantId

  if (!tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const planId = body?.planId

  if (!planId || typeof planId !== "string") {
    return NextResponse.json({ error: "planId is required" }, { status: 400 })
  }

  const plan = await prisma.plan.findUnique({
    where: { id: planId },
    select: { id: true },
  })

  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 })
  }

  const currentPeriodEnd = new Date()
  currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30)

  const subscription = await prisma.$transaction(async (tx) => {
    const existingSubscription = await tx.subscription.findFirst({
      where: { tenantId },
      orderBy: { updatedAt: "desc" },
      select: { id: true },
    })

    await tx.tenant.update({
      where: { id: tenantId },
      data: { planId },
    })

    if (existingSubscription) {
      return tx.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          planId,
          status: "ACTIVE",
          currentPeriodEnd,
        },
      })
    }

    return tx.subscription.create({
      data: {
        tenantId,
        planId,
        status: "ACTIVE",
        currentPeriodEnd,
      },
    })
  })

  return NextResponse.json({
    success: true,
    subscription,
  })
}
