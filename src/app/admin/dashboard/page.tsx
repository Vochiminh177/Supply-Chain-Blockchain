import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getOrders, getUsers } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Package, Users } from "lucide-react"

export default async function AdminDashboard() {
  const orders = (await getOrders()) as any[]
  const users = (await getUsers()) as any[]

  // Đếm số đơn hàng theo trạng thái
  const ordersByStatus = orders.reduce((acc: any, order: any) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {})

  // Đếm số người dùng theo vai trò
  const usersByRole = users.reduce((acc: any, user: any) => {
    acc[user.role] = (acc[user.role] || 0) + 1
    return acc
  }, {})

  return (
    <div className="container mx-auto p-6 bg-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black pt-4">Admin Dashboard</h1>
        <div className="flex gap-4">
          <Link href="/admin/users/new">
            <Button variant="default">Thêm người dùng</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Tổng đơn hàng</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">{ordersByStatus["Khởi tạo"] || 0} đơn hàng mới</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Người dùng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              {usersByRole["admin"] || 0} quản trị viên, {usersByRole["staff"] || 0} nhân viên
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Blockchain</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.reduce((sum, order) => sum + (order.status !== "Khởi tạo" ? 1 : 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Block đã được tạo</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
            <CardDescription>{orders.length} đơn hàng đã được tạo</CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order: any) => (
                  <div key={order.order_id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        #{order.order_id} - {order.product_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.status} - {new Date(order.created_at).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <Link href={`/dashboard/orders/${order.order_id}`}>
                      <Button variant="ghost" size="icon">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ))}

                <div className="pt-2">
                  <Link href="/dashboard/orders">
                    <Button variant="default" className="w-full text-white">
                      Xem tất cả đơn hàng
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">Chưa có đơn hàng nào</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Người dùng</CardTitle>
            <CardDescription>{users.length} người dùng trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            {users.length > 0 ? (
              <div className="space-y-4">
                {users.slice(0, 5).map((user: any) => (
                  <div key={user.user_id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{user.full_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.username} - {user.role === "admin" ? "Quản trị viên" : "Nhân viên"}
                      </p>
                    </div>
                    <Link href={`/admin/users/${user.user_id}`}>
                      <Button variant="ghost" size="icon">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ))}

                <div className="pt-2">
                  <Link href="/admin/users">
                    <Button variant="default" className="w-full text-white">
                      Quản lý người dùng
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">Chưa có người dùng nào</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
