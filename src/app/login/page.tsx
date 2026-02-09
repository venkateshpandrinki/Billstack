import { AuthCard } from "@/components/auth/auth-card"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <AuthCard title="Sign in to your workspace">
        <LoginForm />
      </AuthCard>
    </div>
  )
}
