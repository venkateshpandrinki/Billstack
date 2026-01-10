// utils/tenant.ts
import { prisma } from "@/lib/prisma"
import type { RequestInternal } from "next-auth"

const BASE_DOMAIN = process.env.BASE_DOMAIN!


export async function getTenantFromRequest(req: RequestInternal) {
  const host =
    req.headers?.get?.("host") ??
    req.headers?.host ??
    ""

  if (!host) return null

  // Example:
  // acme.billstack.vercel.app → acme
  // billstack.vercel.app → null (platform)
  if (!host.endsWith(BASE_DOMAIN)) return null

  const subdomain = host.replace(`.${BASE_DOMAIN}`, "")

  // No subdomain → platform domain
  if (subdomain === BASE_DOMAIN) return null
  if (subdomain === "www") return null

  const tenant = await prisma.tenant.findUnique({
    where: {
      slug: subdomain,
    },
    select: {
      id: true,
      slug: true,
    },
  })

  return tenant
}
