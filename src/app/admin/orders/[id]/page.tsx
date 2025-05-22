import { getOrderById, getTransactionsByOrderId, getBlocksByOrderId } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Clock, Database } from "lucide-react"
import { verifyBlockchain } from "@/lib/blockchain"
import TransactionForm from "./transaction-form"
import BlockchainViewer from "./blockchain-viewer"

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const orderId = Number.parseInt(params.id)
  const user = await getCurrentUser()
  const order = await getOrderById(orderId)
  if (!order) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        <h2 className="text-2xl font-semibold">Không tìm thấy đơn hàng #{orderId}</h2>
        <Link href="/dashboard/orders">
          <Button className="mt-4">Quay lại</Button>
        </Link>
      </div>
    )
  }
  const transactions = (await getTransactionsByOrderId(orderId)) as any[]
  const blocks = (await getBlocksByOrderId(orderId)) as any[]

  // Kiểm tra tính toàn vẹn của blockchain
  const rawBlockchainVerification = await verifyBlockchain(blocks)
  const blockchainVerification =
    typeof rawBlockchainVerification === "boolean"
      ? { valid: rawBlockchainVerification }
      : rawBlockchainVerification

  // Xác định các bước trong chuỗi cung ứng
  const supplyChainSteps = ["Nhà cung cấp", "Kho", "Vận chuyển", "Bán lẻ", "Khách hàng"]

  // Xác định bước tiếp theo
  let currentStepIndex = supplyChainSteps.indexOf(order.status)
  if (currentStepIndex === -1) currentStepIndex = 0

  const nextStep = currentStepIndex < supplyChainSteps.length - 1 ? supplyChainSteps[currentStepIndex + 1] : null

  // Kiểm tra người dùng có quyền xử lý bước tiếp theo không
  const authorizedSteps = user?.authorizedSteps || []
  const canProcessNextStep = nextStep && authorizedSteps.includes(nextStep)

  return (
    <div className="container mx-auto p-6 bg-slate-100">
      <div className="flex items-center mb-6">
        <Link href="/admin/orders">
          <Button variant="default" size="icon" className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-black pt-4">Chi tiết đơn hàng #{orderId}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin đơn hàng</CardTitle>
            <CardDescription>Chi tiết về đơn hàng và trạng thái hiện tại</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sản phẩm</p>
                  <p className="text-lg font-semibold">{order.product_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trạng thái</p>
                  <div className="flex items-center">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-2">
                      <Clock className="h-3 w-3" />
                    </div>
                    <p className="text-lg font-semibold">{order.status}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nơi xuất phát</p>
                  <p>{order.origin}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nơi đích đến</p>
                  <p>{order.destination}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Ngày tạo</p>
                <p>{new Date(order.created_at).toLocaleString("vi-VN")}</p>
              </div>

              <div className="pt-4">
                <p className="text-sm font-medium mb-3">Tiến trình chuỗi cung ứng</p>
                <div className="flex justify-between items-center">
                  {supplyChainSteps.map((step, index) => {
                    const isCompleted = supplyChainSteps.indexOf(order.status) >= index
                    const isCurrent = order.status === step

                    return (
                      <div key={step} className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                            } ${isCurrent ? "ring-2 ring-blue-400" : ""}`}
                        >
                          {isCompleted ? <CheckCircle className="h-4 w-4" /> : <span>{index + 1}</span>}
                        </div>
                        <span className="text-xs mt-1">{step}</span>
                      </div>
                    )
                  })}
                </div>
                <div className="relative mt-3">
                  <div className="absolute top-0 h-1 bg-gray-200 w-full"></div>
                  <div
                    className="absolute top-0 h-1 bg-green-500"
                    style={{
                      width: `${(currentStepIndex / (supplyChainSteps.length - 1)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Xác nhận giao dịch</CardTitle>
            <CardDescription>
              {canProcessNextStep
                ? `Xác nhận chuyển đơn hàng sang bước "${nextStep}"`
                : "Bạn không có quyền xử lý bước tiếp theo của đơn hàng này"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {canProcessNextStep ? (
              <TransactionForm orderId={orderId} nextStep={nextStep!} userId={user.id} />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Database className="mx-auto h-12 w-12 mb-4 text-muted-foreground/50" />
                <p>Bạn không có quyền xử lý bước tiếp theo</p>
                <p className="text-sm mt-2">Liên hệ quản trị viên để được cấp quyền</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-black">Lịch sử giao dịch</h2>

        {transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((transaction: any) => (
              <Card key={transaction.tx_id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{transaction.step}</h3>
                      <p className="text-sm text-muted-foreground">Địa điểm: {transaction.location}</p>
                      <p className="text-sm text-muted-foreground">Ghi chú: {transaction.note}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Xác nhận bởi: {transaction.full_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.timestamp).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">Chưa có giao dịch nào được ghi nhận</p>
            </CardContent>
          </Card>
        )}
      </div>

      {blocks.length > 0 ? (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-black">Blockchain</h2>
          </div>

          <BlockchainViewer blocks={blocks} />
        </div>
      ) : (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-black">Blockchain</h2>

          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">Chưa có Block nào được ghi nhận</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
