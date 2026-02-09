import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { Card, CardContent } from "@/components/ui/card"

export default async function BillingPage() {
  const session = await auth()
  if (!session?.user?.tenantId) return null

  const invoices = await prisma.invoice.findMany({
    where: { tenantId: session.user.tenantId },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Billing</h1>

      {invoices.length === 0 ? (
        <p className="text-muted-foreground">No invoices yet</p>
      ) : (
        invoices.map((inv) => (
          <Card key={inv.id}>
            <CardContent className="flex justify-between p-4">
              <span>{inv.status}</span>
              <span>₹{inv.amountCents / 100}</span>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
