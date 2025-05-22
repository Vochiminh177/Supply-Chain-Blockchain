"use server"

import { createHash } from "crypto"
import { createBlock, getLastBlock } from "@/lib/db"

// Hàm tính hash cho block
export async function calculateHash(txId: number, timestamp: string, previousHash: string, data: any): Promise<string> {
  const dataString = JSON.stringify(data)
  return createHash("sha256").update(`${txId}${timestamp}${previousHash}${dataString}`).digest("hex")
}

// Hàm tạo block mới trong blockchain
export async function addToBlockchain(txId: number, userId: number, data: any) {
  try {
    // Lấy block cuối cùng để lấy previous hash
    const lastBlock = await getLastBlock()
    const previousHash = lastBlock ? lastBlock.hash : "0".repeat(64) // Genesis block

    // Tạo timestamp
    const timestamp = new Date().toISOString()

    // Tính hash cho block mới
    const hash = await calculateHash(txId, timestamp, previousHash, data)

    // Lưu block vào database
    const blockId = await createBlock(txId, previousHash, hash, userId)

    return {
      success: true,
      blockId,
      hash,
    }
  } catch (error) {
    console.error("Blockchain error:", error)
    return {
      success: false,
      error: "Lỗi khi thêm vào blockchain",
    }
  }
}

// Hàm kiểm tra tính toàn vẹn của blockchain
export async function verifyBlockchain(blocks: any[]) {
  if (blocks.length === 0) return true

  for (let i = 1; i < blocks.length; i++) {
    const currentBlock = blocks[i]
    const previousBlock = blocks[i - 1]

    // Kiểm tra previous_hash
    if (currentBlock.previous_hash !== previousBlock.hash) {
      return {
        valid: false,
        errorAt: i,
        message: "Chuỗi hash không khớp",
      }
    }

    // Tính lại hash và kiểm tra
    const data = {
      step: currentBlock.step,
      location: currentBlock.location,
      note: currentBlock.note,
      username: currentBlock.username,
    }

    const calculatedHash = calculateHash(
      currentBlock.tx_id,
      new Date(currentBlock.timestamp).toISOString(),
      currentBlock.previous_hash,
      data,
    )

    if (calculatedHash !== currentBlock.hash) {
      return {
        valid: false,
        errorAt: i,
        message: "Hash không khớp, dữ liệu có thể đã bị thay đổi",
      }
    }
  }

  return { valid: true }
}
