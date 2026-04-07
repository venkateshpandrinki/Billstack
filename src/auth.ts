import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { ZodError } from "zod"
import { signInSchema } from "@/lib/zod"
import { getSuperAdminFromDb, getUserFromDb } from "@/utils/db"
import { verifyPassword } from "@/utils/password"
import { getTenantFromHost } from "@/utils/tenant"

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      authorize: async (credentials, req) => {
        try {
          const { email, password } = await signInSchema.parseAsync(credentials)
          const tenant = await getTenantFromHost(req.headers)

          const user = tenant
            ? await getUserFromDb(email, tenant.id)
            : await getSuperAdminFromDb(email)

          if (!user) return null

          if (!user.hashedPassword) return null
          const isValid = await verifyPassword(
            password,
            user.hashedPassword
          )
          if (!isValid) return null

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            tenantId: user.tenantId ?? undefined,
            tenantSlug: tenant?.slug ?? undefined,
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
        token.tenantSlug = (user as any).tenantSlug
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as any
        session.user.tenantId = token.tenantId as string | undefined
        session.user.tenantSlug = token.tenantSlug as string | undefined
      }
      return session
    },
  },
})
