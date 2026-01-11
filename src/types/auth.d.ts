import { Role } from "@prisma/client"

declare module "next-auth" {
  interface User {
    role: Role
    tenantId?: string
  }

  interface Session {
    user: {
      role: Role
      tenantId?: string
    }
  }
}
