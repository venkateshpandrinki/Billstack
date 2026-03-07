import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const plans = await prisma.plan.findMany({
    orderBy: { priceCents: "asc" },
  })

  return NextResponse.json({ plans })
}
