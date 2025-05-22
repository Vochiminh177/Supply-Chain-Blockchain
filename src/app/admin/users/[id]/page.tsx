import { getUsers } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import UserEditForm from "./user-edit-form"
import ResetPasswordForm from "./reset-password-form"

export default async function EditUserPage(context: { params: { id: string } }) {
  const { params } = context
  const userId = Number.parseInt(params.id)
  const users = (await getUsers()) as any[]
  const user = users.find((u) => (u.user_id) === userId)

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Link href="/admin/users">
            <Button variant="outline" size="icon" className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Không tìm thấy người dùng</h1>
        </div>

        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">Người dùng không tồn tại hoặc đã bị xóa</p>
            <div className="mt-4">
              <Link href="/admin/users">
                <Button>Quay lại danh sách</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 bg-slate-100">
      <div className="flex items-center mb-6">
        <Link href="/admin/users">
          <Button variant="default" size="icon" className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-black pt-4">Chỉnh sửa người dùng</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin người dùng</CardTitle>
            <CardDescription>Cập nhật thông tin và quyền của người dùng</CardDescription>
          </CardHeader>
          <CardContent>
            <UserEditForm user={user} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Đặt lại mật khẩu</CardTitle>
            <CardDescription>Đặt lại mật khẩu cho người dùng</CardDescription>
          </CardHeader>
          <CardContent>
            <ResetPasswordForm userId={userId} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
