"use server"

import { cookies } from "next/headers"
import { executeQuery } from "@/lib/db"
import { createHash } from "crypto"
import type { RowDataPacket } from "mysql2"
import { redirect } from "next/navigation"


// Hàm băm mật khẩu (SHA256 fallback)
export async function hashPassword(password: string): Promise<string> {
  return createHash("sha256").update(password).digest("hex")
}

// Hàm đăng nhập người dùng
export async function login(username: string, password: string) {
  try {
    const query = `
      SELECT user_id, username, full_name, role, authorized_steps, password_hash 
      FROM users 
      WHERE username = ?
    `

    const result = await executeQuery(query, [username]) as RowDataPacket[]
    const rows = result ?? []

    if (rows.length === 0) {
      return { success: false, message: "Tên đăng nhập không đúng" }
    }

    const user = rows[0]

    const hashedInput = await hashPassword(password)
    console.log(hashedInput, user.password_hash)

    // const match = await bcrypt.compare(password, user.password_hash)
    const match = hashedInput === user.password_hash

    if (!match) {
      return { success: false, message: "Mật khẩu không đúng" }
    }

    const userSession = {
      id: user.user_id,
      username: user.username,
      fullName: user.full_name,
      role: user.role,
      authorizedSteps: user.authorized_steps ? user.authorized_steps.split(",") : [],
    }

    const cookieStore = await cookies()
    cookieStore.set("user", JSON.stringify(userSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 ngày
      path: "/",
      sameSite: "lax",
    })

    return {
      success: true,
      role: user.role,
      user: userSession,
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "Đã xảy ra lỗi khi đăng nhập" }
  }
}

// Hàm lấy thông tin người dùng hiện tại
export async function getCurrentUser() {
  try {
    const cookiesStore = await cookies()
    const userCookie = cookiesStore.get("user")

    if (!userCookie || !userCookie.value?.trim()) return null
    console.log(userCookie.value)
    return JSON.parse(userCookie.value)
  } catch (error) {
    console.error("Parse user cookie error:", error)
    return null
  }
}

// Đăng xuất người dùng
export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("user")
}

export async function checkAuthorization(requiredRole?: string) {
  const user = await getCurrentUser()

  if (!user) {
    return { authorized: false, message: "Chưa đăng nhập" }
  }

  if (requiredRole && user.role !== requiredRole) {
    return { authorized: false, message: "Không có quyền truy cập" }
  }

  return { authorized: true, user }
}

export async function getPreviousStep(current: string): Promise<string | null> {
  const workflow = ["Khởi tạo", "Nhà cung cấp", "Kho", "Giao hàng", "Hoàn tất"]
  const index = workflow.indexOf(current)
  return index > 0 ? workflow[index - 1] : null
}

export async function requireAuth() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get("user")
  if (!cookie?.value?.trim()) {
    redirect("/login") // tự động chuyển hướng nếu chưa login
  }

  try {
    return JSON.parse(cookie.value)
  } catch (error) {
    redirect("/login") // lỗi parse cookie => cũng chuyển hướng
  }
}