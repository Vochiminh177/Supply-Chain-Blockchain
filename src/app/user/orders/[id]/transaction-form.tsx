"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TransactionForm({
  orderId,
  nextStep,
  userId,
}: {
  orderId: number
  nextStep: string
  userId: number
}) {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [note, setNote] = useState("")
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  setError("")

  try {
    if (!location || !pin) {
      setError("Vui lòng điền đầy đủ thông tin")
      setIsLoading(false)
      return
    }

    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        step: nextStep,
        location,
        note,
        userId,
        pin,
      }),
    })

    const result = await res.json()
    if (!result.success) {
      setError(result.message || "Xác nhận thất bại")
      return
    }

    else if (result.success) {
      setNote("Xác nhận thành công")
      return
    }

    router.refresh()
    setLocation("")
    setNote("")
    setPin("")
  } catch (err) {
    setError("Có lỗi xảy ra khi xử lý giao dịch")
    console.error(err)
  } finally {
    setIsLoading(false)
  }
}

  return (
    <div>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="step">Bước tiếp theo</Label>
          <Input id="step" value={nextStep} disabled />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Địa điểm</Label>
          <Input
            id="location"
            placeholder="Nhập địa điểm xử lý"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="note">Ghi chú</Label>
          <Textarea
            id="note"
            placeholder="Nhập ghi chú (nếu có)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pin">Mã PIN xác nhận</Label>
          <Input
            id="pin"
            type="password"
            placeholder="Nhập mã PIN để xác nhận"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full text-white" disabled={isLoading}>
          {isLoading ? "Đang xử lý..." : "Xác nhận giao dịch"}
        </Button>
      </form>
    </div>
  )
}
