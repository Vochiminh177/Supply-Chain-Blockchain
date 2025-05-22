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
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NewUserPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [fullName, setFullName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("staff")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Các bước trong chuỗi cung ứng
  const supplyChainSteps = [
    { id: "supplier", label: "Nhà cung cấp" },
    { id: "warehouse", label: "Kho" },
    { id: "transport", label: "Vận chuyển" },
    { id: "retail", label: "Bán lẻ" },
    { id: "customer", label: "Khách hàng" },
  ]

  const [selectedSteps, setSelectedSteps] = useState<string[]>([])

  const handleStepToggle = (step: string) => {
    setSelectedSteps((prev) => (prev.includes(step) ? prev.filter((s) => s !== step) : [...prev, step]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (!username || !fullName || !password) {
        setError("Vui lòng điền đầy đủ thông tin")
        setIsLoading(false)
        return
      }

      if (password !== confirmPassword) {
        setError("Mật khẩu xác nhận không khớp")
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

      const res = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, fullName, password, role, authorizedSteps }),
      })

      const result = await res.json()

      if (result.success) {
        router.push("/admin/users")
      } else {
        setError(result.message || "Không thể tạo người dùng")
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tạo người dùng")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Thêm người dùng mới</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Thông tin người dùng</CardTitle>
          <CardDescription>Nhập thông tin chi tiết cho người dùng mới</CardDescription>
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
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input
                  id="username"
                  placeholder="Nhập tên đăng nhập"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
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
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Vai trò</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Quản trị viên</SelectItem>
                    <SelectItem value="staff">Nhân viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {role === "staff" && (
                <div className="space-y-2">
                  <Label>Quyền xử lý các bước</Label>
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
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Tạo người dùng"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
