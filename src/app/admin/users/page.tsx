import { getUsers } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Edit, Plus } from "lucide-react"
import DeleteUserButton from "./delete-user-button"

export default async function UsersPage() {
  const users = (await getUsers()) as any[]

  return (
    <div className="container mx-auto p-6 bg-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black pt-4">Quản lý người dùng</h1>
        <Link href="/admin/users/new">
          <Button variant="default">
            <Plus className="mr-2 h-4 w-4" />
            Thêm người dùng
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Tên đăng nhập</th>
                  <th className="text-left py-3 px-4">Họ tên</th>
                  <th className="text-left py-3 px-4">Vai trò</th>
                  <th className="text-left py-3 px-4">Quyền xử lý</th>
                  <th className="text-left py-3 px-4">Ngày tạo</th>
                  <th className="text-right py-3 px-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user.user_id} className="border-b">
                    <td className="py-3 px-4">{user.user_id}</td>
                    <td className="py-3 px-4">{user.username}</td>
                    <td className="py-3 px-4">{user.full_name}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.role === "admin" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role === "admin" ? "Quản trị viên" : "Nhân viên"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="max-w-xs truncate">{user.authorized_steps || "Không có"}</div>
                    </td>
                    <td className="py-3 px-4">{new Date(user.created_at).toLocaleDateString("vi-VN")}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/users/${user.user_id}`}>
                          <Button className="bg-blue-300" variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <DeleteUserButton userId={user.user_id} username={user.username} />
                      </div>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-muted-foreground">
                      Chưa có người dùng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
