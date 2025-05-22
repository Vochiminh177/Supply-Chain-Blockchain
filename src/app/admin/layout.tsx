import type React from "react"
import Navbar from "@/components/navbar"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Kiểm tra cookie người dùng
  const userCookie = (await cookies()).get("user")
  if (!userCookie || !userCookie.value?.trim()) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  )
}
