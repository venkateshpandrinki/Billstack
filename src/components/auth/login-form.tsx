"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function LoginForm() {
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      callbackUrl: "/",
    })

    setLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label>Email</Label>
        <Input name="email" type="email" required />
      </div>

      <div>
        <Label>Password</Label>
        <Input name="password" type="password" required />
      </div>

      <Button className="w-full" disabled={loading}>
        Sign in
      </Button>
    </form>
  )
}
