"use client"

import { useEffect, useState } from "react"
import { BillingInterval } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Plan = {
  id: string
  name: string
  priceCents: number
  billingInterval: BillingInterval
  metadata: unknown
}

function formatCurrency(priceCents: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(priceCents / 100)
}

function getFeatures(metadata: unknown) {
  if (!metadata || typeof metadata !== "object") return []
  const features = (metadata as { features?: unknown }).features
  if (!Array.isArray(features)) return []
  return features.filter((item): item is string => typeof item === "string")
}

export function BillingPlans() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [activePlanId, setActivePlanId] = useState<string | null>(null)
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [activatingPlanId, setActivatingPlanId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    async function loadPlans() {
      const response = await fetch("/api/plans")
      const data = await response.json()
      setPlans(data.plans ?? [])
      setActivePlanId(data.activePlanId ?? null)
      setLoadingPlans(false)
    }

    loadPlans()
  }, [])

  useEffect(() => {
    if (!toastMessage) return
    const timeout = setTimeout(() => setToastMessage(null), 2500)
    return () => clearTimeout(timeout)
  }, [toastMessage])

  async function activatePlan(planId: string, planName: string) {
    setActivatingPlanId(planId)

    const response = await fetch("/api/billing/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId }),
    })

    if (response.ok) {
      setActivePlanId(planId)
      setToastMessage(`${planName} plan activated`)
    } else {
      setToastMessage("Failed to activate plan")
    }

    setActivatingPlanId(null)
  }

  if (loadingPlans) {
    return <p className="text-muted-foreground">Loading plans...</p>
  }

  if (plans.length === 0) {
    return <p className="text-muted-foreground">No plans available.</p>
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {plans.map((plan) => {
          const features = getFeatures(plan.metadata)
          const isActive = activePlanId === plan.id
          const isActivating = activatingPlanId === plan.id
          return (
            <Card key={plan.id}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-2xl font-bold">{formatCurrency(plan.priceCents)}</p>
                  <p className="text-sm text-muted-foreground">
                    per {plan.billingInterval === "MONTHLY" ? "month" : "year"}
                  </p>
                </div>

                {features.length > 0 && (
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {features.map((feature) => (
                      <li key={feature}>- {feature}</li>
                    ))}
                  </ul>
                )}

                <Button
                  onClick={() => activatePlan(plan.id, plan.name)}
                  disabled={isActive || isActivating}
                  className="w-full"
                >
                  {isActive
                    ? "Subscribed"
                    : isActivating
                    ? "Activating..."
                    : "Switch to Plan"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {toastMessage && (
        <div className="fixed right-4 top-4 rounded-md border bg-background px-4 py-2 text-sm shadow">
          {toastMessage}
        </div>
      )}
    </div>
  )
}
