import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getOrderByStep, getOrders } from "@/lib/db"
import { getCurrentUser, getPreviousStep, requireAuth } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Package, Truck, Users } from "lucide-react"
import { get } from "http"
import { getOrdersUserCanProcess, groupOrdersByStatus } from "@/lib/utils"
import { SummaryCard } from "@/components/summaryCard"
import { OrderCard } from "@/components/orderCard"


export default async function Dashboard() {

  const user = await requireAuth()
  const orders = (await getOrders()) as any[]

  const supplyChainSteps = ["Khởi tạo", "Kho", "Vận chuyển", "Bán lẻ", "Khách hàng"]
  const authorizedSteps = user.authorizedSteps || []

  const ordersUserCanSee = getOrdersUserCanProcess(orders, authorizedSteps, supplyChainSteps)
  const ordersByStatus = groupOrdersByStatus(orders)

  return (
    <div className="container mx-auto p-6 bg-slate-100">
      <h1 className="text-3xl font-bold text-black mb-6">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <SummaryCard
          title="Tổng đơn hàng"
          value={orders.length}
          description={`${ordersByStatus["Khởi tạo"] || 0} đơn hàng mới`}
          icon={Package}
        />
        <SummaryCard
          title="Đơn hàng đang xử lý"
          value={ordersUserCanSee.length}
          description="Đơn hàng bạn có thể xử lý"
          icon={Truck}
        />
        <SummaryCard
          title="Bước được phân quyền"
          value={authorizedSteps.length}
          description={authorizedSteps.join(", ")}
          icon={Users}
        />
      </div>

      <h2 className="text-xl font-semibold mb-4 text-black">Đơn hàng cần xử lý</h2>

      {ordersUserCanSee.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ordersUserCanSee.map(order => (
            <OrderCard key={order.order_id} order={order} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Không có đơn hàng nào cần xử lý.</p>
      )}
    </div>
  )
}
