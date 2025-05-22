// Đặt lại mật khẩu người dùng

import { NextRequest, NextResponse } from "next/server"
import { resetPassword } from "@/lib/db"
import { createHash } from "crypto"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = Number(params.id)
  const body = await req.json()
  const { newPassword } = body

  if (!newPassword) {
    return NextResponse.json({ success: false, message: "Thiếu mật khẩu mới" }, { status: 400 })
  }

  const hashedPassword = createHash("sha256").update(newPassword).digest("hex")

  try {
    await resetPassword(userId, hashedPassword)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ success: false, message: "Lỗi đặt lại mật khẩu" }, { status: 500 })
  }
}
