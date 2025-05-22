import { getAllBlocks } from "@/lib/db"
import BlocksTable from "@/components/blocks-table"

export default async function BlocksPage() {
  const result = await getAllBlocks() // fetch tất cả block từ DB
  const blocks = Array.isArray(result) ? result : []

  return (
    <main className="p-6 space-y-6 bg-slate-100">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black pt-4">Blockchain</h1>
          {/* <p className="text-sm text-muted-foreground">Lịch sử block đã ghi nhận trong hệ thống.</p> */}
        </div>
        {/* Có thể thêm nút "Xác minh chuỗi" ở đây */}
      </div>

      <BlocksTable blocks={blocks} />
    </main>
  )
}