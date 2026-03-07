import { prisma } from "@/lib/prisma"

const BASE_DOMAIN = process.env.BASE_DOMAIN!

export async function getTenantFromHost(headers: Headers) {
  const host = headers.get("host")
  console.log("host header:", headers.get("host"))
  if (!host) return null

  // Normalize away local/prod ports (e.g. localhost:3000, foo.example.com:443)
  const hostname = host.split(":")[0].toLowerCase()

  let slug: string | null = null

  // ---------- LOCAL DEV ----------
  if (hostname.includes("localhost")) {
    if (hostname === "localhost") return null
    slug = hostname.split(".")[0]
    if (!slug || slug === "localhost") return null
  }

  // ---------- PRODUCTION ----------
  else {
    const normalizedBaseDomain = BASE_DOMAIN.split(":")[0].toLowerCase()
    if (hostname === normalizedBaseDomain) return null

    slug = hostname.replace(`.${normalizedBaseDomain}`, "")

    if (!slug || slug === "www") return null
  }

  return prisma.tenant.findUnique({
    where: { slug },
    select: { id: true, slug: true },
  })
}
