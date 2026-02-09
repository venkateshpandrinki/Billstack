import { prisma } from "@/lib/prisma"
import { saltAndHashPassword } from "@/utils/password"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { company, slug, email, password } = await req.json()

  const tenant = await prisma.tenant.create({
    data: {
      name: company,
      slug,
      users: {
        create: {
          email,
          hashedPassword: await saltAndHashPassword(password),
          role: "TENANT_ADMIN",
        },
      },
    },
  })

  return NextResponse.json({
    redirectUrl: `https://${slug}.${process.env.BASE_DOMAIN}/login`,
  })
}
