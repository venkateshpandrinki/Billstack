import { AuthCard } from "@/components/auth/auth-card"
import { auth } from "@/auth"
import { LoginForm } from "@/components/auth/login-form"
import { getTenantSlugFromHostname, isTenantHostname } from "@/utils/tenant"
import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function LoginPage() {
  const session = await auth()
  const requestHeaders = await headers()
  const host = requestHeaders.get("host")
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https"
  const baseDomain = process.env.BASE_DOMAIN!
  const defaultRedirectPath = isTenantHostname(host)
    ? "/dashboard"
    : "/admin"
  const description =
    defaultRedirectPath === "/dashboard"
      ? "Use your tenant admin credentials to continue into the dashboard."
      : "Use your platform admin credentials to continue into the admin console."

  if (session?.user) {
    if (session.user.role === "SUPER_ADMIN") {
      redirect(`${protocol}://${baseDomain}/admin`)
    }

    const requestedTenantSlug = getTenantSlugFromHostname(host)
    if (session.user.tenantSlug) {
      if (requestedTenantSlug === session.user.tenantSlug) {
        redirect("/dashboard")
      }

      redirect(
        `${protocol}://${session.user.tenantSlug}.${baseDomain}/dashboard`
      )
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[12%] -top-[12%] h-136 w-136 rounded-full bg-blue-300/15 blur-[140px] mix-blend-soft-light" />
        <div className="absolute -right-[10%] top-[8%] h-120 w-120 rounded-full bg-sky-200/15 blur-[140px] mix-blend-soft-light" />
        <div className="absolute bottom-[-22%] left-[18%] h-144 w-xl rounded-full bg-indigo-200/10 blur-[160px] mix-blend-soft-light" />
        <div className="soft-grid absolute inset-0 opacity-30 mask-[radial-gradient(circle_at_center,black,transparent_80%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(420px,520px)] lg:items-center">
          <section className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-100/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-700">
                <Sparkles className="h-3.5 w-3.5" />
                Welcome back
              </div>
              <h1 className="max-w-2xl text-4xl font-semibold leading-[1.05] text-slate-900 sm:text-5xl">
                Return to your <span className="italic text-blue-600">billing workspace</span> with one clean sign-in.
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-600">
                Access tenant dashboards, invoices, and usage analytics from the same polished control surface.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-sm">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                <p className="mt-4 text-lg font-semibold tracking-tight text-slate-900">
                  Secure credential flow
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Sign in through the same auth system backing the tenant and admin consoles.
                </p>
              </div>

              <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-5 shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                <p className="mt-4 text-lg font-semibold tracking-tight text-slate-900">
                  Fast workspace access
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Jump straight back into billing operations without extra friction.
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-500">
              Need the public overview instead?{" "}
              <Link href="/" className="font-semibold text-blue-700 hover:text-blue-600">
                Visit the landing page
              </Link>
              .
            </p>
          </section>

          <AuthCard
            eyebrow="Sign in"
            title="Sign in to your workspace"
            description={description}
            footerLabel="Need a new tenant workspace?"
            footerHref="/signup"
            footerAction="Create one"
          >
            <LoginForm defaultRedirectPath={defaultRedirectPath} />
          </AuthCard>
        </div>
      </div>
    </div>
  )
}
