import Link from "next/link"
import { Command, LayoutDashboard, WalletCards } from "lucide-react"
import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/billing", label: "Billing", icon: WalletCards },
]

export async function TenantNavbar() {
  const session = await auth()

  async function logoutAction() {
    "use server"
    await signOut({ redirectTo: "/login" })
  }

  return (
    <header className="px-4 pt-6 sm:px-6 lg:px-8">
      <div className="glass-panel mx-auto max-w-7xl px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                <Command className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-widest text-slate-500">
                  Tenant Console
                </p>
                <p className="text-lg font-semibold tracking-tight text-slate-900">
                  billstack
                </p>
              </div>
            </div>

            <nav className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => (
              <Button key={item.href} variant="ghost" size="sm" asChild>
                <Link
                  href={item.href}
                  className="gap-2 rounded-full px-4 uppercase tracking-widest"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-2 text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">
                {session?.user?.name ?? session?.user?.email ?? "Tenant User"}
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                {session?.user?.role ?? "USER"}
              </p>
            </div>
            <form action={logoutAction}>
              <Button type="submit" variant="outline" size="sm" className="rounded-full px-5">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}
