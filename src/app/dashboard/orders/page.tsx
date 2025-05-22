import { getOrders } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Package, Plus } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"

const user = await getCurrentUser()
const isSupplier = user?.authorized_steps.includes("Nhà cung cấp")

export default async function OrdersPage() {
  const orders = (await getOrders()) as any[]

  return (
    <div className="container mx-auto p-6 bg-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black pt-4">Danh sách đơn hàng</h1>
        {isSupplier && (
          <Link href="/dashboard/orders/new">
            <Button variant="outline" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Tạo đơn hàng mới
            </Button>
          </Link>
        )}
      </div>

      {orders.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order: any) => (
            <Card key={order.order_id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">
                  #{order.order_id} - {order.product_name}
                </CardTitle>
                <Package className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Trạng thái:</span>
                    <span className="font-medium">{order.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Xuất phát:</span>
                    <span>{order.origin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Đích đến:</span>
                    <span>{order.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Ngày tạo:</span>
                    <span>{new Date(order.created_at).toLocaleDateString("vi-VN")}</span>
                  </div>

                  <div className="pt-4">
                    <Link href={`/dashboard/orders/${order.order_id}`}>
                      <Button variant="default" className="w-full text-white">
                        <span>Xem chi tiết</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Chưa có đơn hàng nào</p>
            <div className="mt-4">
              <Link href="/dashboard/orders/new">
                <Button>Tạo đơn hàng mới</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
