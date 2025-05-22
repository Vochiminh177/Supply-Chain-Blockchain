//Tạo giao dịch từ đơn hàng 

import { NextRequest, NextResponse } from "next/server"
import { createTransaction } from "@/lib/db"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const orderId = Number(params.id)
  const body = await req.json()
  const { step, location, userId, note } = body

  if (!step || !location || !userId) {
    return NextResponse.json({ success: false, message: "Thiếu dữ liệu giao dịch" }, { status: 400 })
  }

  try {
    const txId = await createTransaction(orderId, step, location, userId, note || "")
    return NextResponse.json({ success: true, txId })
  } catch (error) {
    console.error("Ghi giao dịch thất bại:", error)
    return NextResponse.json({ success: false, message: "Lỗi ghi giao dịch" }, { status: 500 })
  }
}
