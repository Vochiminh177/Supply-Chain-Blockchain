import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function OrderCard({ order }: { order: any }) {
  return (
    <Card key={order.order_id}>
      <CardHeader>
        <CardTitle className="text-lg">
          #{order.order_id} - {order.product_name}
        </CardTitle>
        <CardDescription>Trạng thái: {order.status}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm">
          <p><strong>Xuất phát:</strong> {order.origin}</p>
          <p><strong>Đích đến:</strong> {order.destination}</p>
          <p><strong>Ngày tạo:</strong> {new Date(order.created_at).toLocaleDateString("vi-VN")}</p>
        </div>
        <div className="pt-4">
          <Link href={`/user/orders/${order.order_id}`}>
            <Button variant="default" className="w-full text-white">
              <span>Xem chi tiết</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
