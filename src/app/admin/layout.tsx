import { Command, Shield } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[12%] -top-[12%] h-[34rem] w-[34rem] rounded-full bg-blue-300/15 blur-[140px] mix-blend-soft-light" />
        <div className="absolute -right-[10%] top-[8%] h-[30rem] w-[30rem] rounded-full bg-sky-200/15 blur-[140px] mix-blend-soft-light" />
        <div className="absolute bottom-[-22%] left-[18%] h-[36rem] w-[36rem] rounded-full bg-indigo-200/10 blur-[160px] mix-blend-soft-light" />
        <div className="soft-grid absolute inset-0 opacity-30 [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />
      </div>

      <div className="relative z-10">
        <header className="px-4 pt-6 sm:px-6 lg:px-8">
          <div className="glass-panel mx-auto max-w-7xl px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                  <Command className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold uppercase tracking-widest text-slate-500">
                    Platform console
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold tracking-tight text-slate-900">
                      billstack admin
                    </p>
                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-200/70 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-700">
                      <Shield className="h-3.5 w-3.5" />
                      Internal
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/" className="rounded-full px-4 uppercase tracking-widest">
                    Landing
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="rounded-full px-5">
                  <Link href="/dashboard">Tenant dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
