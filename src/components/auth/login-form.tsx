"use client"

import { signIn } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

type LoginFormProps = {
  defaultRedirectPath: string
}

export function LoginForm({ defaultRedirectPath }: LoginFormProps) {
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      callbackUrl: defaultRedirectPath,
    })

    setLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
          Email
        </Label>
        <Input
          name="email"
          type="email"
          placeholder="admin@acme.com"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
            Password
          </Label>
          <span className="text-xs text-slate-400">Minimum 8 characters</span>
        </div>
        <Input name="password" type="password" placeholder="Enter your password" required />
      </div>

      <Button className="w-full" size="lg" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </Button>

      {/* <p className="text-center text-sm text-slate-500">
        Need a workspace first?{" "}
        <Link href="/signup" className="font-semibold text-blue-700 hover:text-blue-600">
          Create one
        </Link>
      </p> */}
    </form>
  )
}
