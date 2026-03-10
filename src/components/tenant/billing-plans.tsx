"use client"

import { useEffect, useState } from "react"
import { BillingInterval } from "@prisma/client"
import { Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
    return (
      <div className="glass-panel px-6 py-8">
        <p className="text-sm text-slate-500">Loading plans...</p>
      </div>
    )
  }

  if (plans.length === 0) {
    return (
      <div className="glass-panel px-6 py-8">
        <p className="text-sm text-slate-500">No plans available.</p>
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-100/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-700">
            <Sparkles className="h-3.5 w-3.5" />
            Plans
          </div>
          <div>
            <h2 className="text-3xl font-semibold leading-tight text-slate-900">
              Choose a plan that scales <span className="italic text-blue-600">smoothly</span>.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Each plan updates the active subscription for this tenant account.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {plans.map((plan) => {
          const features = getFeatures(plan.metadata)
          const isActive = activePlanId === plan.id
          const isActivating = activatingPlanId === plan.id
          return (
            <Card
              key={plan.id}
              className={
                isActive
                  ? "border-blue-500/40 bg-white/90 shadow-[0_28px_90px_-35px_rgba(37,99,235,0.35)]"
                  : ""
              }
            >
              <CardHeader className="border-b border-blue-100/70 pb-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="mt-2 text-sm leading-6">
                      Billed per {plan.billingInterval === "MONTHLY" ? "month" : "year"}.
                    </CardDescription>
                  </div>
                  {isActive && (
                    <span className="rounded-full border border-blue-200/70 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-700">
                      Active
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <p className="text-4xl font-semibold tracking-tight text-slate-900">
                    {formatCurrency(plan.priceCents)}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    per {plan.billingInterval === "MONTHLY" ? "month" : "year"}
                  </p>
                </div>

                {features.length > 0 && (
                  <ul className="space-y-3 text-sm text-slate-600">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        <span>{feature}</span>
                      </li>
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
        <div className="glass-panel fixed right-4 top-4 z-50 px-4 py-3 text-sm text-slate-700">
          {toastMessage}
        </div>
      )}
    </section>
  )
}
