import type React from "react"
import Navbar from "@/components/navbar"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const userCookie = (await cookies()).get("user")

  if (!userCookie || !userCookie.value?.trim()) {
    redirect("/login")
  }

  const user = JSON.parse(userCookie.value)

  if (user.role !== "staff") {
    redirect("/login")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  )
}
