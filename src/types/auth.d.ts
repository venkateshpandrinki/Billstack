import { Role } from "@prisma/client"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    role: Role
    tenantId?: string
    tenantSlug?: string
  }

  interface Session {
    user: DefaultSession["user"] & {
      role: Role
      tenantId?: string
      tenantSlug?: string
    }
  }
}
