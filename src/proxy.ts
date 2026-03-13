// export const runtime = "nodejs"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

export async function proxy(req: NextRequest) {
  const res = NextResponse.next()

  const session = await auth()

  const { pathname } = req.nextUrl
  const host = req.headers.get("host") ?? ""

  
  if (session?.user?.role) {
    res.headers.set("x-user-role", session.user.role)
  }

  
  if (pathname.startsWith("/admin")) {
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }


  const isTenantDomain =
    host.endsWith(process.env.BASE_DOMAIN!) &&
    host !== process.env.BASE_DOMAIN!

  if (isTenantDomain && !session) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return res
}

export const config = {
  matcher: ["/((?!api/auth|_next|favicon.ico).*)"],
}