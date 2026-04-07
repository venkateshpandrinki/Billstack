import { prisma } from "@/lib/prisma"

const BASE_DOMAIN = process.env.BASE_DOMAIN!

function normalizeHostname(host: string | null | undefined) {
  return host?.split(":")[0].toLowerCase() ?? null
}

export function getTenantSlugFromHostname(host: string | null | undefined) {
  const hostname = normalizeHostname(host)
  if (!hostname) return null

  if (hostname.includes("localhost")) {
    if (hostname === "localhost") return null

    const slug = hostname.split(".")[0]
    return !slug || slug === "localhost" ? null : slug
  }

  const normalizedBaseDomain = BASE_DOMAIN.split(":")[0].toLowerCase()

  if (
    hostname === normalizedBaseDomain ||
    hostname === `www.${normalizedBaseDomain}`
  ) {
    return null
  }

  if (!hostname.endsWith(`.${normalizedBaseDomain}`)) {
    return null
  }

  const slug = hostname.replace(`.${normalizedBaseDomain}`, "")
  return !slug || slug === "www" ? null : slug
}

export function isTenantHostname(host: string | null | undefined) {
  return getTenantSlugFromHostname(host) !== null
}

export function isPublicRootHost(host: string | null | undefined) {
  const hostname = normalizeHostname(host)
  if (!hostname) return false

  const normalizedBaseDomain = BASE_DOMAIN.split(":")[0].toLowerCase()

  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === normalizedBaseDomain ||
    hostname === `www.${normalizedBaseDomain}`
  )
}

export async function getTenantFromHost(headers: Headers) {
  const slug = getTenantSlugFromHostname(headers.get("host"))
  if (!slug) return null

  return prisma.tenant.findUnique({
    where: { slug },
    select: { id: true, slug: true },
  })
}
