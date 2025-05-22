// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import { createHash } from 'crypto'
import { use } from 'react'

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()

    const hashed = createHash("sha256").update(password).digest("hex")

    const rows = await executeQuery(
      `SELECT user_id, username, full_name, role, authorized_steps, password_hash 
       FROM users WHERE username = ?`,
      [username]
    ) as any[]

    const user = rows[0]
    console.log("Hashed :", hashed)
    console.log("user:", user.password_hash)
    if (!user || user.password_hash !== hashed) {
      return NextResponse.json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu" }, { status: 401 })
    }

    const userSession = {
      id: user.user_id,
      username: user.username,
      fullName: user.full_name,
      role: user.role,
      authorizedSteps: user.authorized_steps?.split(",") || [],
    }

    const res = NextResponse.json({ success: true, user: userSession, role: user.role})
    res.cookies.set("user", JSON.stringify(userSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 ngày
      sameSite: "lax",
    })

    return res
  } catch (err) {
    return NextResponse.json({ success: false, message: "Lỗi máy chủ" }, { status: 500 })
  }
}
