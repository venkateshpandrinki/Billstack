import { ReactNode } from "react"
import { TenantNavbar } from "@/components/tenant/tenant-navbar"

export default function TenantLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[12%] -top-[12%] h-[34rem] w-[34rem] rounded-full bg-blue-300/15 blur-[140px] mix-blend-soft-light" />
        <div className="absolute -right-[10%] top-[8%] h-[30rem] w-[30rem] rounded-full bg-sky-200/15 blur-[140px] mix-blend-soft-light" />
        <div className="absolute bottom-[-22%] left-[18%] h-[36rem] w-[36rem] rounded-full bg-indigo-200/10 blur-[160px] mix-blend-soft-light" />
        <div className="soft-grid absolute inset-0 opacity-30 [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />
      </div>

      <div className="relative z-10">
        <TenantNavbar />
        <main className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
