import { ReactNode } from "react"

export default function TenantLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b p-4 font-semibold">
        Billstack – Tenant Dashboard
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}
