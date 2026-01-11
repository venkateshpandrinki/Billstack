import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { ZodError } from "zod"
import { signInSchema } from "@/lib/zod"
import { getUserFromDb } from "@/utils/db"
import { verifyPassword } from "@/utils/password"
import { getTenantFromHost } from "@/utils/tenant"



export const { handlers, auth, signIn, signOut } = NextAuth({
 
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
          const tenant = await getTenantFromHost(req.headers)
          if (!tenant) return null

          // 3. Fetch user scoped to tenant
          const user = await getUserFromDb(email, tenant.id)
          if (!user) return null

          // 4. Verify password
          if (!user.hashedPassword) return null
          const isValid = await verifyPassword(
            password,
            user.hashedPassword
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
  callbacks: {
  async jwt({ token, user }) {
        if (user) {
      token.role = (user as any).role
      token.tenantId = (user as any).tenantId
    }
    return token
  },

  async session({ session, token }) {
    if (session.user) {
      session.user.role = token.role as any
      session.user.tenantId = token.tenantId as string
    }
    return session
  },
},
})
