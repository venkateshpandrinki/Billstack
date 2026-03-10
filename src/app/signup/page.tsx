import { AuthCard } from "@/components/auth/auth-card"
import { SignupForm } from "@/components/auth/signup-form"
import { Globe2, Layers3, Sparkles } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[12%] -top-[12%] h-[34rem] w-[34rem] rounded-full bg-blue-300/15 blur-[140px] mix-blend-soft-light" />
        <div className="absolute -right-[10%] top-[8%] h-[30rem] w-[30rem] rounded-full bg-sky-200/15 blur-[140px] mix-blend-soft-light" />
        <div className="absolute bottom-[-22%] left-[18%] h-[36rem] w-[36rem] rounded-full bg-indigo-200/10 blur-[160px] mix-blend-soft-light" />
        <div className="soft-grid absolute inset-0 opacity-30 [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(440px,560px)] lg:items-center">
          <section className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-100/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-700">
                <Sparkles className="h-3.5 w-3.5" />
                New workspace
              </div>
              <h1 className="max-w-2xl text-4xl font-semibold leading-[1.05] text-slate-900 sm:text-5xl">
                Launch a tenant billing stack with the same <span className="italic text-blue-600">smooth control surface</span>.
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-600">
                Provision your company workspace, tenant slug, and primary admin account in one flow.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-5 shadow-sm">
                <Globe2 className="h-5 w-5 text-blue-600" />
                <p className="mt-4 text-lg font-semibold tracking-tight text-slate-900">
                  Subdomain-ready
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Set the workspace slug once and keep your tenant routing clear from day one.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-sm">
                <Layers3 className="h-5 w-5 text-blue-600" />
                <p className="mt-4 text-lg font-semibold tracking-tight text-slate-900">
                  Multi-tenant by default
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Start with isolation, billing plans, and usage reporting already built into the product.
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-500">
              Already have credentials?{" "}
              <Link href="/login" className="font-semibold text-blue-700 hover:text-blue-600">
                Sign in here
              </Link>
              .
            </p>
          </section>

          <AuthCard
            eyebrow="Create tenant"
            title="Create your workspace"
            description="Define the tenant identity and the first admin account that will manage billing."
            footerLabel="Already set up and ready to go?"
            footerHref="/login"
            footerAction="Sign in"
          >
            <SignupForm />
          </AuthCard>
        </div>
      </div>
    </div>
  )
}
