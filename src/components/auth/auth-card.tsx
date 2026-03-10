import { ArrowRight, Command, Lock } from "lucide-react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function AuthCard({
  eyebrow,
  title,
  description,
  children,
  footerLabel,
  footerHref,
  footerAction,
}: {
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
  footerLabel: string
  footerHref: string
  footerAction: string
}) {
  return (
    <Card className="w-full max-w-xl overflow-hidden">
      <CardHeader className="border-b border-blue-100/70 pb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-100/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-700">
              <Command className="h-3.5 w-3.5" />
              {eyebrow}
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl leading-tight text-slate-900">
                {title}
              </CardTitle>
              <CardDescription className="max-w-md text-sm leading-6 text-slate-600">
                {description}
              </CardDescription>
            </div>
          </div>

          <div className="hidden rounded-3xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-right shadow-sm sm:flex  justify-end">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-blue-600 shadow-sm">
              <Lock className="h-4 w-4" />
            </div>
            <div>

            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-700">
              Secure access
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              billstack
            </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {children}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3 text-sm text-slate-600">
          <span>{footerLabel}</span>
          <Link
            href={footerHref}
            className="inline-flex items-center gap-1 font-semibold text-blue-700 transition-colors hover:text-blue-600"
          >
            {footerAction}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
