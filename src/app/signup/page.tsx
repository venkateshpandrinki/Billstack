import { AuthCard } from "@/components/auth/auth-card"
import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <AuthCard title="Create your workspace">
        <SignupForm />
      </AuthCard>
    </div>
  )
}
