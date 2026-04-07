// export const runtime = "nodejs"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import {
  getTenantSlugFromHostname,
  isPublicRootHost,
  isTenantHostname,
} from "@/utils/tenant"

export async function proxy(req: NextRequest) {
  const res = NextResponse.next()
  const session = await auth()
  const { pathname } = req.nextUrl
  const host = req.headers.get("host") ?? ""
  const baseDomain = process.env.BASE_DOMAIN!

  if (session?.user?.role) {
    res.headers.set("x-user-role", session.user.role)
  }

  const isTenantDomain = isTenantHostname(host)
  const isPublicLandingPage = pathname === "/" && isPublicRootHost(host)

  if (isPublicLandingPage) {
    return res
  }

  if (pathname.startsWith("/admin")) {
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    if (isTenantDomain) {
      const adminUrl = new URL("/admin", req.url)
      adminUrl.host = baseDomain
      return NextResponse.redirect(adminUrl)
    }

    return res
  }

  if (!isTenantDomain) {
    return res
  }

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const requestedTenantSlug = getTenantSlugFromHostname(host)
  const sessionTenantSlug = session.user.tenantSlug

  if (!sessionTenantSlug || requestedTenantSlug !== sessionTenantSlug) {
    if (session.user.role === "SUPER_ADMIN") {
      const adminUrl = new URL("/admin", req.url)
      adminUrl.host = baseDomain
      return NextResponse.redirect(adminUrl)
    }

    if (sessionTenantSlug) {
      const tenantUrl = new URL("/dashboard", req.url)
      tenantUrl.host = `${sessionTenantSlug}.${baseDomain}`
      return NextResponse.redirect(tenantUrl)
    }

    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return res
}

export const config = {
  matcher: [
    "/((?!api/auth|api/usage|_next|favicon.ico|login).*)",
  ],
}
