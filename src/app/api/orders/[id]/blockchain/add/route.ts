//ghi block mới 

import { NextRequest, NextResponse } from "next/server"
import { createBlock } from "@/lib/db"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const orderId = Number(params.id)
  const body = await req.json()
  const { txId, previousHash, hash, verifiedBy } = body

  if (!txId || !previousHash || !hash || !verifiedBy) {
    return NextResponse.json({ success: false, message: "Thiếu thông tin block" }, { status: 400 })
  }

  try {
    const blockId = await createBlock(txId, previousHash, hash, verifiedBy)
    return NextResponse.json({ success: true, blockId })
  } catch (error) {
    console.error(" Ghi block thất bại:", error)
    return NextResponse.json({ success: false, message: "Lỗi ghi block" }, { status: 500 })
  }
}
