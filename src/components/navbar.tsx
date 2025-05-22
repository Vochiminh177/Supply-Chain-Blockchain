"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getCurrentUser, logout } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Database, LayoutDashboard, LogOut, Package, Settings, Users } from "lucide-react"

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      const userData = await getCurrentUser()
      setUser(userData)
      setIsLoading(false)
    }

    loadUser()
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  if (isLoading) {
    return <div className="h-16 border-b"></div>
  }

  if (!user) {
    return null
  }

  const isAdmin = user.role === "admin"
  const basePath = isAdmin ? "/admin" : "/user"

  return (
<header className="sticky top-0 z-50 w-full border-b bg-blue-200 backdrop-blur supports-[backdrop-filter]:bg-blue-600">
      <div className="container flex h-16 items-center">
        <Link href={isAdmin ? "/admin/dashboard" : "/dashboard"} className="flex items-center gap-2 font-semibold">
          <Database className="h-5 w-5" />
          <span>SCB</span>
        </Link>

        <nav className="flex items-center gap-4 ml-6">
          <Link
            href={`${basePath}/dashboard`}
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname.includes("/dashboard") ? "text-primary" : "text-muted-foreground"}`}
          >
            <div className="flex items-center gap-1">
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </div>
          </Link>

          <Link
            href={`${basePath}/orders`}
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname.includes("/orders") ? "text-primary" : "text-muted-foreground"}`}
          >
            <div className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              <span>Đơn hàng</span>
            </div>
          </Link>

          {isAdmin && (
            <Link
              href="/admin/users"
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname.includes("/users") ? "text-primary" : "text-muted-foreground"}`}
            >
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Người dùng</span>
              </div>
            </Link>
          )}

          {isAdmin && (
            <Link
              href="/admin/blocks"
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname.includes("/settings") ? "text-primary" : "text-muted-foreground"}`}
            >
              <div className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                <span>Blockchain</span>
              </div>
            </Link>
          )}
    
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <div className="text-sm font-medium">
            {user.fullName} ({user.role === "admin" ? "Quản trị viên" : "Nhân viên"})
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Đăng xuất</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
