//cập nhật thông tin người dùng

import { NextRequest, NextResponse } from "next/server"
import { updateUser } from "@/lib/db"

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const {id} = context.params
  const userId = Number(id)
  const body = await req.json()
  const { fullName, role, authorizedSteps } = body

  try {
    await updateUser(userId, fullName, role, authorizedSteps)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ success: false, message: "Lỗi cập nhật" }, { status: 500 })
  }
}
