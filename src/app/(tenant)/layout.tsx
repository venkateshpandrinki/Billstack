import { ReactNode } from "react"
import { TenantNavbar } from "@/components/tenant/tenant-navbar"

export default function TenantLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      
      <TenantNavbar />
      <main className="p-6">{children}</main>
    </div>
  )
}
