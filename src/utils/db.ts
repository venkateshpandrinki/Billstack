import { prisma } from "@/lib/prisma"

export async function getUserFromDb(
  email: string,
  tenantId: string
) {
  return prisma.user.findFirst({
    where: {
      email,
      tenant_id: tenantId,
    },
  })
}
