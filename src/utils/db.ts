import { prisma } from "@/lib/prisma"

export async function getUserFromDb(
  email: string,
  tenantId: string
) {
  return prisma.user.findFirst({
    where: {
      email,
      tenantId,
    },
  })
}

export async function getSuperAdminFromDb(email: string) {
  return prisma.user.findFirst({
    where: {
      email,
      role: "SUPER_ADMIN",
    },
  })
}
