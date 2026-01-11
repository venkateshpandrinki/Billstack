import { prisma } from "@/lib/prisma"

export async function withTenant<T>(
  req: Request,
  fn: (tx: any) => Promise<T>
) {
  const tenantId = req.headers.get("x-tenant-id")
  const role = req.headers.get("x-user-role") ?? "USER"

  return prisma.$transaction(async (tx) => {
    if (tenantId) {
      await tx.$executeRawUnsafe(
        `SET LOCAL app.current_tenant = '${tenantId}'`
      )
    }

    await tx.$executeRawUnsafe(
      `SET LOCAL app.role = '${role}'`
    )

    return fn(tx)
  })
}
