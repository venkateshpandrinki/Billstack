export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b p-4 font-semibold">
        Billstack – Admin
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}
