import { BillingPlans } from "@/components/tenant/billing-plans"

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Billing</h1>
      <BillingPlans />
    </div>
  )
}
