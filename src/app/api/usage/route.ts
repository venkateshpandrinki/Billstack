import { prisma } from "@/lib/prisma"
import { hashApiKey, getApiKeyFromRequest } from "@/utils/api-key"
import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"

export async function POST(req: Request) {
  const apiKey = getApiKeyFromRequest(req)

  if (!apiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const metric = body?.metric
  const quantity = body?.quantity
  const metadata = body?.metadata

  if (!metric || typeof metric !== "string") {
    return NextResponse.json({ error: "metric is required" }, { status: 400 })
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return NextResponse.json(
      { error: "quantity must be a positive integer" },
      { status: 400 }
    )
  }

  if (
    metadata !== undefined &&
    (metadata === null || typeof metadata !== "object" || Array.isArray(metadata))
  ) {
    return NextResponse.json(
      { error: "metadata must be a JSON object when provided" },
      { status: 400 }
    )
  }

  const keyHash = hashApiKey(apiKey)
  const now = new Date()

  const tenantApiKey = await prisma.tenantApiKey.findUnique({
    where: { keyHash },
    select: { id: true, tenantId: true },
  })

  if (!tenantApiKey) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
  }

  const usageRecord = await prisma.$transaction(async (tx) => {
    await tx.tenantApiKey.update({
      where: { id: tenantApiKey.id },
      data: { lastUsed: now },
    })

    return tx.usageRecord.create({
      data: {
        tenantId: tenantApiKey.tenantId,
        metric,
        quantity,
        recordedAt: now,
        metadata:
          metadata === undefined ? undefined : (metadata as Prisma.InputJsonValue),
      },
    })
  })

  return NextResponse.json({ success: true, usageRecord })
}
