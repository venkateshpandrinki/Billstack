"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"

export function SignupForm() {
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    const res = await fetch("/api/tenant/signup", {
      method: "POST",
      body: JSON.stringify({
        company: formData.get("company"),
        slug: formData.get("slug"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    })

    if (res.ok) {
      const { redirectUrl } = await res.json()
      window.location.href = redirectUrl
    }

    setLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
          Company name
        </Label>
        <Input name="company" placeholder="Acme Labs" required />
      </div>

      <div className="space-y-2">
        <Label className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
          Workspace URL
        </Label>
        <Input name="slug" placeholder="acme" required />
        <p className="mt-1 text-xs text-slate-500">
          acme.billstack.vercel.app
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
          Admin email
        </Label>
        <Input name="email" type="email" placeholder="admin@acme.com" required />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
            Password
          </Label>
          <span className="text-xs text-slate-400">Use a strong admin password</span>
        </div>
        <Input name="password" type="password" placeholder="Create a password" required />
      </div>

      <Button className="w-full" size="lg" disabled={loading}>
        {loading ? "Creating workspace..." : "Create workspace"}
      </Button>

      
    </form>
  )
}
