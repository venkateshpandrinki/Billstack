import { BillingInterval, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function upsertPlan(input: {
  name: string
  priceCents: number
  billingInterval: BillingInterval
  metadata: Record<string, unknown>
}) {
  const existing = await prisma.plan.findFirst({
    where: {
      name: input.name,
      billingInterval: input.billingInterval,
    },
    select: { id: true },
  })

  if (existing) {
    await prisma.plan.update({
      where: { id: existing.id },
      data: input,
    })
    return
  }

  await prisma.plan.create({
    data: input,
  })
}

async function main() {
  await upsertPlan({
    name: "Starter",
    priceCents: 1900,
    billingInterval: BillingInterval.MONTHLY,
    metadata: {
      features: ["Up to 3 users", "Basic analytics", "Email support"],
    },
  })

  await upsertPlan({
    name: "Pro",
    priceCents: 4900,
    billingInterval: BillingInterval.MONTHLY,
    metadata: {
      features: ["Up to 25 users", "Advanced analytics", "Priority support"],
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
