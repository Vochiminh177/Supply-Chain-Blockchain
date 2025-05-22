import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getOrders } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Package, Truck, Users } from "lucide-react"

export default async function Dashboard() {
  const user = await getCurrentUser()
  const orders = (await getOrders()) as any[]
  const canCreateOrder = user?.authorizedSteps?.includes("Nhà cung cấp") || false

  // Lọc các đơn hàng mà người dùng có quyền xử lý
  const authorizedSteps = user?.authorizedSteps || []
  const filteredOrders = orders.filter(
    (order) =>
      authorizedSteps.includes(order.status) ||
      (order.status === "Khởi tạo" && authorizedSteps.includes("Nhà cung cấp")),
  )

  // Đếm số đơn hàng theo trạng thái
  const ordersByStatus = orders.reduce((acc: any, order: any) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {})

  return (
    <div className="container mx-auto p-6 bg-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {canCreateOrder && (
          <Link href="/dashboard/orders/new">
            <Button variant="outline" className="flex items-center">
              <Package className="mr-2 h-4 w-4" />
              Tạo đơn hàng mới
            </Button>
          </Link>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">{ordersByStatus["Khởi tạo"] || 0} đơn hàng mới</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đơn hàng đang xử lý</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredOrders.length}</div>
            <p className="text-xs text-muted-foreground">Đơn hàng bạn có thể xử lý</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bước được phân quyền</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{authorizedSteps.length}</div>
            <p className="text-xs text-muted-foreground">{authorizedSteps.join(", ")}</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mb-4">Đơn hàng cần xử lý</h2>

      {filteredOrders.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredOrders.map((order: any) => (
            <Card key={order.order_id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  #{order.order_id} - {order.product_name}
                </CardTitle>
                <CardDescription>Trạng thái: {order.status}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p>
                    <strong>Xuất phát:</strong> {order.origin}
                  </p>
                  <p>
                    <strong>Đích đến:</strong> {order.destination}
                  </p>
                  <p>
                    <strong>Ngày tạo:</strong> {new Date(order.created_at).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </CardContent>
              <div className="px-6 pb-4">
                <Link href={`/dashboard/orders/${order.order_id}`}>
                  <Button variant="outline" className="w-full">
                    <span>Xem chi tiết</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">Không có đơn hàng nào cần xử lý</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
