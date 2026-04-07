import { BillingInterval, Prisma, PrismaClient, Role } from "@prisma/client"
import { saltAndHashPassword } from "../src/utils/password"

const prisma = new PrismaClient()

async function upsertPlan(input: {
  name: string
  priceCents: number
  billingInterval: BillingInterval
  metadata: Prisma.InputJsonValue
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
    priceCents: 19900,
    billingInterval: BillingInterval.MONTHLY,
    metadata: {
      features: ["Up to 3 users", "Basic analytics", "Email support"],
    },
  })

  await upsertPlan({
    name: "Pro",
    priceCents: 49900,
    billingInterval: BillingInterval.MONTHLY,
    metadata: {
      features: ["Up to 25 users", "Advanced analytics", "Priority support"],
    },
  })

  const hashedPassword = await saltAndHashPassword("password123")

  await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {
      hashedPassword,
      role: Role.SUPER_ADMIN,
      tenantId: null,
    },
    create: {
      email: "admin@gmail.com",
      hashedPassword,
      role: Role.SUPER_ADMIN,
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
