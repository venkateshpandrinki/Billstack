"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label>Company name</Label>
        <Input name="company" required />
      </div>

      <div>
        <Label>Workspace URL</Label>
        <Input name="slug" placeholder="acme" required />
        <p className="text-xs text-muted-foreground mt-1">
          acme.billstack.vercel.app
        </p>
      </div>

      <div>
        <Label>Admin email</Label>
        <Input name="email" type="email" required />
      </div>

      <div>
        <Label>Password</Label>
        <Input name="password" type="password" required />
      </div>

      <Button className="w-full" disabled={loading}>
        Create workspace
      </Button>
    </form>
  )
}
