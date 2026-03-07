import Link from "next/link"
import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/billing", label: "Billing" },
]

export async function TenantNavbar() {
  const session = await auth()

  async function logoutAction() {
    "use server"
    await signOut({ redirectTo: "/login" })
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <p className="text-sm font-semibold tracking-tight">Billstack Tenant</p>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Button key={item.href} variant="ghost" size="sm" asChild>
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">
              {session?.user?.name ?? session?.user?.email ?? "Tenant User"}
            </p>
            
            <p className="text-xs text-muted-foreground">{session?.user?.role ?? "USER"}</p>
          </div>
          <form action={logoutAction}>
            <Button type="submit" variant="outline" size="sm">
              Logout
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
