import { PrismaClient, SubscriptionStatus } from "@prisma/client"

const prisma = new PrismaClient()

const USER_EMAIL = "acme@gmail.com"

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: USER_EMAIL },
    select: {
      id: true,
      email: true,
      tenantId: true,
    },
  })

  if (!user?.tenantId) {
    throw new Error(
      `User ${USER_EMAIL} was not found or has no tenantId.`
    )
  }

  const tenantId = user.tenantId
  const now = new Date()
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  const proPlan = await prisma.plan.findFirst({
    where: { name: "Pro" },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  })

  if (proPlan) {
    const existingSubscription = await prisma.subscription.findFirst({
      where: { tenantId },
      orderBy: { updatedAt: "desc" },
      select: { id: true },
    })

    if (existingSubscription) {
      await prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          planId: proPlan.id,
          status: SubscriptionStatus.ACTIVE,
          currentPeriodEnd: periodEnd,
        },
      })
    } else {
      await prisma.subscription.create({
        data: {
          tenantId,
          planId: proPlan.id,
          status: SubscriptionStatus.ACTIVE,
          currentPeriodEnd: periodEnd,
        },
      })
    }

    await prisma.tenant.update({
      where: { id: tenantId },
      data: { planId: proPlan.id },
    })
  }

  await prisma.usageRecord.deleteMany({
    where: {
      tenantId,
      metadata: {
        path: ["seedTag"],
        equals: "mock-dashboard",
      },
    },
  })

  const usageSeed = [
    { day: 1, metric: "emails_sent", quantity: 420 },
    { day: 2, metric: "emails_sent", quantity: 530 },
    { day: 3, metric: "emails_sent", quantity: 615 },
    { day: 4, metric: "emails_sent", quantity: 700 },
    { day: 5, metric: "emails_sent", quantity: 812 },
    { day: 6, metric: "emails_sent", quantity: 561 },
    { day: 7, metric: "emails_sent", quantity: 565 },
    { day: 1, metric: "api_calls", quantity: 1400 },
    { day: 2, metric: "api_calls", quantity: 1600 },
    { day: 3, metric: "api_calls", quantity: 1800 },
    { day: 4, metric: "api_calls", quantity: 1700 },
    { day: 5, metric: "api_calls", quantity: 1900 },
    { day: 6, metric: "api_calls", quantity: 1850 },
    { day: 7, metric: "api_calls", quantity: 1850 },
  ]

  await prisma.usageRecord.createMany({
    data: usageSeed.map((entry) => ({
      tenantId,
      metric: entry.metric,
      quantity: entry.quantity,
      recordedAt: new Date(now.getFullYear(), now.getMonth(), entry.day, 10, 30),
      metadata: {
        seedTag: "mock-dashboard",
      },
    })),
  })

  await prisma.invoice.deleteMany({
    where: {
      tenantId,
      description: {
        startsWith: "MOCK:",
      },
    },
  })

  const invoiceSeed = [
    {
      amountCents: 4900,
      status: "PAID" as const,
      issuedAt: new Date(now.getFullYear(), now.getMonth(), 1),
      description: "MOCK: Pro plan monthly invoice",
    },
    {
      amountCents: 4900,
      status: "PAID" as const,
      issuedAt: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      description: "MOCK: Pro plan monthly invoice",
    },
    {
      amountCents: 4900,
      status: "OPEN" as const,
      issuedAt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
      description: "MOCK: Upcoming Pro renewal",
    },
  ]

  await prisma.invoice.createMany({
    data: invoiceSeed.map((invoice) => ({
      tenantId,
      amountCents: invoice.amountCents,
      status: invoice.status,
      issuedAt: invoice.issuedAt,
      description: invoice.description,
    })),
  })

  console.log(`Mock billing/usage data seeded for ${USER_EMAIL}`)
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
