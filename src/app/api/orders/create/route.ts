//Tạo đơn hàng mới

import { NextRequest, NextResponse } from "next/server"
import { createOrder } from "@/lib/db" 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { productName, origin, destination } = body

    if (!productName || !origin || !destination) {
      return NextResponse.json(
        { success: false, message: "Thiếu thông tin đơn hàng" },
        { status: 400 }
      )
    }

    const newOrderId = await createOrder(productName, origin, destination)

    return NextResponse.json({
      success: true,
      orderId: newOrderId,
      message: "Tạo đơn hàng thành công",
    })
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error)
    return NextResponse.json(
      { success: false, message: "Lỗi server khi tạo đơn hàng" },
      { status: 500 }
    )
  }
}
