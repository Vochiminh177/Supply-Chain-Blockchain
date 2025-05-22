// File này dùng để tạo người dùng mới
import { NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/db" 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, fullName, password, role, authorizedSteps } = body
    const userId = await createUser(username, fullName, password, role, authorizedSteps)

    return NextResponse.json({ success: true, userId })
  } catch (error) {
    console.error(" API /api/users/create error:", error)
    return NextResponse.json({ success: false, message: "Lỗi khi tạo người dùng" }, { status: 500 })
  }
}
