import { PrismaClient } from "@prisma/client"
import { generateTenantApiKey } from "../src/utils/api-key"

const prisma = new PrismaClient()

async function main() {
  const tenants = await prisma.tenant.findMany({
    where: {
      apiKeys: {
        none: {},
      },
    },
    select: {
      id: true,
      slug: true,
      name: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  })

  if (tenants.length === 0) {
    console.log("No tenants are missing API keys.")
    return
  }

  for (const tenant of tenants) {
    const { apiKey, keyHash } = generateTenantApiKey()

    await prisma.tenantApiKey.create({
      data: {
        tenantId: tenant.id,
        keyHash,
      },
    })

    console.log(`${tenant.slug} (${tenant.name}): ${apiKey}`)
  }
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
