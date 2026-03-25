"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { decryptToken } from "@/app/utils/auth"

export default function AdminProtect({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // 1. Get the encrypted token from localStorage
    const token = localStorage.getItem("adminToken")

    if (!token) {
      // No token found, redirect to login
      router.replace("/")
      return
    }

    // 2. Decrypt the token
    const email = decryptToken(token)

    // 3. Verify the email (static check as per requirements)
    if (email === "admin@zpl.com") {
      setIsAuthorized(true)
    } else {
      // Invalid token or wrong user
      localStorage.removeItem("adminToken") // Clear bad token
      router.replace("/")
    }
  }, [router])

  // Optional: show a loading state while verifying to prevent content flash
  if (!isAuthorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sidebar-primary border-t-transparent blur-[1px]"></div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Verifying Access...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
