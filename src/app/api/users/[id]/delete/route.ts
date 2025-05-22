import { NextResponse } from "next/server"
import { deleteUser } from "@/lib/db"

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const userId = parseInt(params.id)
  await deleteUser(userId)
  return NextResponse.json({ success: true })
}
