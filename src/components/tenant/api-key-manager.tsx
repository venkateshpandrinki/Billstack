"use client"

import { useEffect, useState } from "react"
import { Copy, KeyRound, RefreshCcw, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type ApiKeyRecord = {
  id: string
  lastUsed: string | null
  createdAt: string
  updatedAt: string
  hasPlaintextValue: boolean
}

function formatDate(value: string | null) {
  if (!value) return "Never used"

  return new Date(value).toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function getMaskedApiKeyLabel() {
  return "bstk_live_••••••••••••••••••••••••"
}

export function ApiKeyManager() {
  const [apiKey, setApiKey] = useState<ApiKeyRecord | null>(null)
  const [revealedKey, setRevealedKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function loadApiKey() {
      const response = await fetch("/api/tenant/api-key")

      if (!response.ok) {
        setLoading(false)
        return
      }

      const data = await response.json()
      setApiKey(data.apiKey ?? null)
      setLoading(false)
    }

    loadApiKey()
  }, [])

  async function copyKey() {
    if (!revealedKey) return

    try {
      await navigator.clipboard.writeText(revealedKey)
      toast.success("API key copied")
    } catch {
      toast.error("Failed to copy API key")
    }
  }

  async function createApiKey() {
    setCreating(true)

    try {
      const response = await fetch("/api/tenant/api-key", {
        method: "POST",
      })

      const data = await response.json().catch(() => null)

      if (!response.ok || !data?.plaintextKey || !data?.apiKey) {
        throw new Error(data?.error ?? "Failed to create API key")
      }

      setApiKey(data.apiKey)
      setRevealedKey(data.plaintextKey)
      toast.success("New API key created")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error creating API key"
      )
    } finally {
      setCreating(false)
    }
  }

  async function deleteApiKey() {
    setDeleting(true)

    try {
      const response = await fetch("/api/tenant/api-key", {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete API key")
      }

      setApiKey(null)
      setRevealedKey(null)
      toast.success("API key deleted")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete API key"
      )
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="glass-panel px-6 py-8">
        <p className="text-sm text-slate-500">Loading API key...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section className="glass-panel overflow-hidden px-6 py-8 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-100/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-700">
              <KeyRound className="h-3.5 w-3.5" />
              API Access
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold leading-[1.05] text-slate-900 sm:text-5xl">
                Manage your tenant <span className="italic text-blue-600">usage key</span>.
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-600">
                Use one active API key to send usage from your servers, jobs, or client integrations into this tenant workspace.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200/70 bg-white/80 px-5 py-4 shadow-sm">
              <p className="text-[13px] font-semibold uppercase tracking-widest text-slate-500">
                Key status
              </p>
              <p className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                {apiKey ? "Active" : "Missing"}
              </p>
            </div>
            <div className="rounded-3xl border border-blue-100 bg-blue-50/70 px-5 py-4 shadow-sm">
              <p className="text-[13px] font-semibold uppercase tracking-widest text-blue-700">
                Last used
              </p>
              <p className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                {apiKey ? formatDate(apiKey.lastUsed) : "Never"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-blue-100/70 pb-6">
            <CardTitle className="text-2xl">Active API Key</CardTitle>
            <CardDescription className="mt-2 text-sm leading-6">
              Only one valid API key is kept at a time. Creating a new key automatically replaces the old one.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {revealedKey ? (
              <div className="space-y-4 rounded-3xl border border-blue-100 bg-blue-50/60 p-5">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">
                    Copy this now
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    For security, the plaintext key is shown only right after creation.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    readOnly
                    value={revealedKey}
                    className="font-mono text-sm"
                  />
                  <Button onClick={copyKey} className="shrink-0">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy key
                  </Button>
                </div>
              </div>
            ) : apiKey ? (
              <div className="space-y-4 rounded-3xl border border-slate-200/70 bg-white/80 p-5">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Stored securely
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Your current key exists, but only its hash is stored. Create a new key if you need to reveal and copy it again.
                  </p>
                </div>
                <Input
                  readOnly
                  value={getMaskedApiKeyLabel()}
                  className="font-mono text-sm text-slate-500"
                />
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 px-5 py-8 text-sm leading-6 text-slate-500">
                No active API key yet. Create one to start posting usage to <code>/api/usage</code>.
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button onClick={createApiKey} disabled={creating}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                {apiKey ? "Create new key" : "Create key"}
              </Button>
              <Button
                onClick={deleteApiKey}
                disabled={!apiKey || deleting}
                variant="outline"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {deleting ? "Deleting..." : "Delete key"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="border-b border-blue-100/70 pb-6">
            <CardTitle className="text-2xl">Key Details</CardTitle>
            <CardDescription className="mt-2 text-sm leading-6">
              Operational visibility for the active tenant integration key.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-4">
              <p className="text-[13px] font-semibold uppercase tracking-widest text-blue-700">
                Valid keys
              </p>
              <p className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                {apiKey ? "1 active key" : "0 active keys"}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-4">
              <p className="text-[13px] font-semibold uppercase tracking-widest text-slate-500">
                Created
              </p>
              <p className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                {apiKey ? formatDate(apiKey.createdAt) : "-"}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-4">
              <p className="text-[13px] font-semibold uppercase tracking-widest text-slate-500">
                Last used
              </p>
              <p className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                {apiKey ? formatDate(apiKey.lastUsed) : "Never used"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
