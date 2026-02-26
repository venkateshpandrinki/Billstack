import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getTenantFromHost } from "@/utils/tenant"

export async function proxy(req: NextRequest) {
  const res = NextResponse.next()

  const tenant = await getTenantFromHost(req.headers)

 
  const session = await auth()

 
  if (tenant?.id) {
    res.headers.set("x-tenant-id", tenant.id)
  }

  if (session?.user?.role) {
    res.headers.set("x-user-role", session.user.role)
  }


  const { pathname } = req.nextUrl


  if (pathname.startsWith("/admin")) {
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

 
  const host = req.headers.get("host") ?? ""
  const isTenantDomain =
    host.endsWith(process.env.BASE_DOMAIN!) &&
    host !== process.env.BASE_DOMAIN!

  if (isTenantDomain && !session) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return res
}

export const config = {
  matcher: [
    "/((?!api/auth|_next|favicon.ico).*)",
  ],
}
