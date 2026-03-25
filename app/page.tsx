"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { encryptToken } from "@/app/utils/auth"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Simulate slight network delay for premium feel
    setTimeout(() => {
      // Static credentials check
      if ((email === "admin@zpl.com") && password === "admin123") {
        const token = encryptToken(email)
        localStorage.setItem("adminToken", token)
        router.push("/admin")
      } else {
        setError("Invalid email or password")
        setLoading(false)
      }
    }, 600)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden font-sans">
      {/* Decorative background elements matching the sleek aesthetic */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none flex justify-center items-center">
        <div className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-sidebar-primary/5 rounded-full blur-3xl absolute -top-40 -left-20"></div>
        <div className="w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-primary/5 rounded-full blur-3xl absolute -bottom-40 -right-20"></div>
      </div>

      <div className="z-10 w-full max-w-md bg-card text-card-foreground border border-border/40 shadow-2xl shadow-black/5 dark:shadow-black/40 rounded-2xl overflow-hidden backdrop-blur-xl">
        <div className="p-8 pb-6 flex flex-col items-center">
          <Image
            src="/assets/logo.png"
            alt="ZPL Logo"
            width={40}
            height={40}
            className="h-10 w-auto"
            priority
          />
          <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">Welcome Back</h1>
          <p className="text-sm text-muted-foreground text-center">
            Sign in to your ZPL Admin dashboard
          </p>
        </div>

        <div className="px-8 pb-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
                Email / Username
              </label>
              <Input
                id="email"
                type="text"
                placeholder="admin@zpl.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 px-4 rounded-xl bg-background/50 focus:bg-background transition-colors focus-visible:ring-sidebar-primary"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
                  Password
                </label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 px-4 rounded-xl bg-background/50 focus:bg-background transition-colors focus-visible:ring-sidebar-primary"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="text-sm font-medium text-destructive bg-destructive/10 p-3.5 rounded-xl flex items-center gap-2.5 animate-in fade-in zoom-in-95 duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium rounded-xl mt-4 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground transition-all shadow-md hover:shadow-lg disabled:opacity-70"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>

        <div className="bg-muted/30 p-4 border-t border-border/40 flex justify-center items-center">
          <p className="text-[13px] text-muted-foreground/80 font-medium">
            ZPL Admin &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  )
}
