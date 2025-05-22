// src/app/api/transactions/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createTransaction, createBlock, getLastBlock } from "@/lib/db"
import { createHash } from "crypto"

function calculateHash(txId: number, timestamp: string, previousHash: string, data: any): string {
  return createHash("sha256")
    .update(txId + timestamp + previousHash + JSON.stringify(data))
    .digest("hex")
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { orderId, step, location, note, userId, pin } = body

    if (!orderId || !step || !location || !userId || !pin) {
      return NextResponse.json({ success: false, message: "Thiếu thông tin cần thiết" }, { status: 400 })
    }

    // 👉 Nếu muốn kiểm tra PIN thật sự:
    // const user = await getUserById(userId)
    // const hashedInput = createHash("sha256").update(pin).digest("hex")
    // if (user.password_hash !== hashedInput) {
    //   return NextResponse.json({ success: false, message: "Mã PIN không đúng" }, { status: 401 })
    // }

    // 1. Ghi giao dịch
    const txId = await createTransaction(orderId, step, location, userId, note)

    // 2. Lấy block trước đó
    const lastBlock = await getLastBlock()
    const previousHash = lastBlock?.hash || "GENESIS"

    // 3. Tính hash block mới
    const data = { step, location, note, userId }
    const timestamp = new Date().toISOString()
    const hash = calculateHash(txId, timestamp, previousHash, data)

    // 4. Ghi block mới
    await createBlock(txId, previousHash, hash, userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Transaction Error:", error)
    return NextResponse.json({ success: false, message: "Lỗi máy chủ" }, { status: 500 })
  }
}
