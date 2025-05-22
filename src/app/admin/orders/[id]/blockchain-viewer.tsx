"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Database } from "lucide-react"

export default function BlockchainViewer({ blocks }: { blocks: any[] }) {
  const [expandedBlock, setExpandedBlock] = useState<number | null>(null)

  const toggleBlock = (blockId: number) => {
    if (expandedBlock === blockId) {
      setExpandedBlock(null)
    } else {
      setExpandedBlock(blockId)
    }
  }

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <Card key={block.block_id} className="overflow-hidden">
          <div
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50"
            onClick={() => toggleBlock(block.block_id)}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Database className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-600">Block #{index + 1}</h3>
                <p className="text-sm text-muted-foreground text-blue-600">
                  {block.step} - {new Date(block.timestamp).toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              {expandedBlock === block.block_id ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {expandedBlock === block.block_id && (
            <CardContent className="border-t pt-4 pb-6 bg-muted/20">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Thông tin giao dịch</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Bước</p>
                      <p className="font-medium">{block.step}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Địa điểm</p>
                      <p className="font-medium">{block.location}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground">Ghi chú</p>
                    <p className="font-medium">{block.note || "Không có ghi chú"}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground">Xác nhận bởi</p>
                    <p className="font-medium">{block.full_name}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Thông tin Block</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Hash</p>
                      <p className="font-mono text-xs bg-muted p-2 rounded overflow-x-auto">{block.hash}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Previous Hash</p>
                      <p className="font-mono text-xs bg-muted p-2 rounded overflow-x-auto">{block.previous_hash}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Timestamp</p>
                      <p className="font-medium">{new Date(block.timestamp).toLocaleString("vi-VN")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
