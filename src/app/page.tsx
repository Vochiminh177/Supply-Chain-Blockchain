import Image from "next/image";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Database, Lock, Package, ShieldCheck, Truck } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-800 sm:text-5xl md:text-66xl">
            <span className="block">Mô phỏng chuỗi cung ứng</span>
            <span className="block text-blue-600 mt-2">với công nghệ Blockchain</span>
          </h1>
          
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/login">
              <Button className="hover:scale-[1.02] cursor-pointer" variant="outline" size="lg">Đăng nhập</Button>
            </Link>
            <Link href="/about">
              <Button className="hover:scale-[1.02] cursor-pointer" variant="outline" size="lg">
                Thông tin hệ thống
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-semibold leading-none tracking-tight">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                Bảo mật dữ liệu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Blockchain đảm bảo tính toàn vẹn của dữ liệu, ngăn chặn việc sửa đổi trái phép thông tin giao dịch.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-500" />
                Truy xuất nguồn gốc
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Theo dõi hàng hóa qua từng bước trong chuỗi cung ứng, từ nhà cung cấp đến khách hàng cuối cùng.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-500" />
                Xác thực giao dịch
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Mỗi giao dịch đều được xác thực bởi người dùng có thẩm quyền, đảm bảo tính chính xác.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-16">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quy trình chuỗi cung ứng giả lập</h2>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <Database className="h-8 w-8 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">Nhà cung cấp</span>
              </div>
              <div className="hidden md:block border-t-2 border-blue-200 w-full"></div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">Kho</span>
              </div>
              <div className="hidden md:block border-t-2 border-blue-200 w-full"></div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <Truck className="h-8 w-8 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">Vận chuyển</span>
              </div>
              <div className="hidden md:block border-t-2 border-blue-200 w-full"></div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <ShieldCheck className="h-8 w-8 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">Bán lẻ</span>
              </div>
              <div className="hidden md:block border-t-2 border-blue-200 w-full"></div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-500">Khách hàng</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
