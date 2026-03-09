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
  const metric = body?.metric
  const quantity = body?.quantity

  if (!metric || typeof metric !== "string") {
    return NextResponse.json({ error: "metric is required" }, { status: 400 })
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return NextResponse.json(
      { error: "quantity must be a positive integer" },
      { status: 400 }
    )
  }

  const usageRecord = await prisma.usageRecord.create({
    data: {
      tenantId,
      metric,
      quantity,
      recordedAt: new Date(),
    },
  })

  return NextResponse.json({ success: true, usageRecord })
}
