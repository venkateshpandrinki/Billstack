import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { generateTenantApiKey } from "@/utils/api-key"
import { NextResponse } from "next/server"

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export async function GET() {
  const session = await auth()
  const tenantId = session?.user?.tenantId

  if (!tenantId) {
    return unauthorized()
  }

  const apiKey = await prisma.tenantApiKey.findFirst({
    where: { tenantId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      lastUsed: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return NextResponse.json({
    apiKey: apiKey
      ? {
          ...apiKey,
          hasPlaintextValue: false,
        }
      : null,
  })
}

export async function POST() {
  const session = await auth()
  const tenantId = session?.user?.tenantId

  if (!tenantId) {
    return unauthorized()
  }

  const { apiKey, keyHash } = generateTenantApiKey()

  const nextKey = await prisma.$transaction(async (tx) => {
    await tx.tenantApiKey.deleteMany({
      where: { tenantId },
    })

    return tx.tenantApiKey.create({
      data: {
        tenantId,
        keyHash,
      },
      select: {
        id: true,
        lastUsed: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  })

  return NextResponse.json({
    apiKey: {
      ...nextKey,
      hasPlaintextValue: true,
    },
    plaintextKey: apiKey,
  })
}

export async function DELETE() {
  const session = await auth()
  const tenantId = session?.user?.tenantId

  if (!tenantId) {
    return unauthorized()
  }

  await prisma.tenantApiKey.deleteMany({
    where: { tenantId },
  })

  return NextResponse.json({ success: true })
}
