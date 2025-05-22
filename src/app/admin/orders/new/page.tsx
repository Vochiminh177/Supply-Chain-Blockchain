"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function NewOrderPage() {
  const router = useRouter()
  const [productName, setProductName] = useState("")
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (!productName || !origin || !destination) {
        setError("Vui lòng điền đầy đủ thông tin")
        return
      }

      const orderId = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName,
          origin,
          destination,
        })
      })
      const result = await orderId.json()
      if (result.success) {
        router.push(`/dashboard/orders/orderId`)
      } else {
        setError(result.message || "Không thể tạo người dùng")
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tạo đơn hàng")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tạo đơn hàng mới</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Thông tin đơn hàng</CardTitle>
          <CardDescription>Nhập thông tin chi tiết cho đơn hàng mới</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Tên sản phẩm</Label>
                <Input
                  id="productName"
                  placeholder="Nhập tên sản phẩm"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="origin">Nơi xuất phát</Label>
                <Input
                  id="origin"
                  placeholder="Nhập nơi xuất phát"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">Nơi đích đến</Label>
                <Input
                  id="destination"
                  placeholder="Nhập nơi đích đến"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Tạo đơn hàng"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
