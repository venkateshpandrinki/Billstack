import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { ZodError } from "zod"
import { signInSchema } from "@/lib/zod"
import { getUserFromDb } from "@/utils/db"
import { verifyPassword } from "@/utils/password"
import { getTenantFromRequest } from "@/utils/tenant" 
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/prisma"


export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      authorize: async (credentials, req) => {
        try {
          // 1. Validate input
          const { email, password } = await signInSchema.parseAsync(credentials)

          // 2. Resolve tenant from subdomain
          const tenant = await getTenantFromRequest(req)
          if (!tenant) return null

          // 3. Fetch user scoped to tenant
          const user = await getUserFromDb(email, tenant.id)
          if (!user) return null

          // 4. Verify password
          const isValid = await verifyPassword(
            password,
            user.hashed_password
          )
          if (!isValid) return null

          // 5. Return minimal session-safe user object
          return {
            id: user.id,
            email: user.email,
            role: user.role,
            tenantId: tenant.id,
          }
        } catch (error) {
          if (error instanceof ZodError) {
            return null
          }
          throw error
        }
      },
    }),
  ],
})
