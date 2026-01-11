import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

const BASE_DOMAIN = process.env.BASE_DOMAIN!

export async function getTenantFromHost(headers: Headers) {
  const host = headers.get("host")
  if (!host) return null

  // billstack.vercel.app → no tenant
  if (host === BASE_DOMAIN) return null

  // acme.billstack.vercel.app → acme
  const slug = host.replace(`.${BASE_DOMAIN}`, "")
  if (!slug || slug === "www") return null

  return prisma.tenant.findUnique({
    where: { slug },
    select: { id: true, slug: true },
  })
}
