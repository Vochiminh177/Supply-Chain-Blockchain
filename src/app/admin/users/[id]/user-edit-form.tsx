"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { updateUser } from "@/lib/db"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UserEditForm({ user }: { user: any }) {
  const router = useRouter()
  const [fullName, setFullName] = useState(user.full_name)
  const [role, setRole] = useState(user.role)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Các bước trong chuỗi cung ứng
  const supplyChainSteps = [
    { id: "supplier", label: "Nhà cung cấp" },
    { id: "warehouse", label: "Kho" },
    { id: "transport", label: "Vận chuyển" },
    { id: "retail", label: "Bán lẻ" },
    { id: "customer", label: "Khách hàng" },
  ]

  // Khởi tạo các bước đã được cấp quyền
  const initialSteps = user.authorized_steps
    ? user.authorized_steps
        .split(",")
        .map((step: string) => {
          const stepObj = supplyChainSteps.find((s) => s.label === step.trim())
          return stepObj ? stepObj.id : null
        })
        .filter(Boolean)
    : []

  const [selectedSteps, setSelectedSteps] = useState<string[]>(initialSteps)

  const handleStepToggle = (step: string) => {
    setSelectedSteps((prev) => (prev.includes(step) ? prev.filter((s) => s !== step) : [...prev, step]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      if (!fullName) {
        setError("Vui lòng điền đầy đủ thông tin")
        setIsLoading(false)
        return
      }

      // Chuyển đổi các bước đã chọn thành chuỗi
      const authorizedSteps = selectedSteps
        .map((stepId) => {
          const step = supplyChainSteps.find((s) => s.id === stepId)
          return step ? step.label : ""
        })
        .filter(Boolean)
        .join(",")

      await fetch(`/api/users/${user.user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          role,
          authorizedSteps,
        }),
      })
      router.refresh()
    } catch (err) {
      setError("Có lỗi xảy ra khi cập nhật người dùng")
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

      {success && (
        <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
          <AlertDescription>Cập nhật thông tin thành công</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Tên đăng nhập</Label>
          <Input id="username" value={user.username} disabled />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName">Họ tên</Label>
          <Input
            id="fullName"
            placeholder="Nhập họ tên"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Vai trò</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn vai trò" />
            </SelectTrigger>
            <SelectContent className="text-blue-600">
              <SelectItem value="admin">Quản trị viên</SelectItem>
              <SelectItem value="staff">Nhân viên</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {role === "staff" && (
          <div className="space-y-2">
            <Label>Quyền xử lý các khâu</Label>
            <div className="grid grid-cols-2 gap-4 pt-2">
              {supplyChainSteps.map((step) => (
                <div key={step.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={step.id}
                    checked={selectedSteps.includes(step.id)}
                    onCheckedChange={() => handleStepToggle(step.id)}
                  />
                  <Label htmlFor={step.id} className="font-normal">
                    {step.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button type="submit" className="w-full text-white" disabled={isLoading}>
          {isLoading ? "Đang xử lý..." : "Cập nhật thông tin"}
        </Button>
      </form>
    </div>
  )
}
