"use client"

import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, X } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale/vi"

export default function BlocksTable({ blocks }: { blocks: any[] }) {
    const [selectedId, setSelectedId] = useState<number | null>(null)

    const toggleDetail = (id: number) => {
        setSelectedId((prev) => (prev === id ? null : id))
    }

    return (
        <div className="relative w-full overflow-auto bg-white rounded-md shadow-sm border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Trạng tháiee</TableHead>
                        <TableHead>Địa điểm</TableHead>
                        <TableHead>Người xác nhận</TableHead>
                        <TableHead>Thời gian</TableHead>
                        <TableHead>Hash</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {blocks.map((block: any, index: number) => (
                        <>
                            <TableRow key={block.block_id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{block.step}</TableCell>
                                <TableCell>{block.location}</TableCell>
                                <TableCell>{block.full_name}</TableCell>
                                <TableCell>
                                    {format(new Date(block.timestamp), "Pp", { locale: vi })}
                                </TableCell>
                                <TableCell>
                                    <div className="text-xs font-mono truncate max-w-[150px]">
                                        {block.hash}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => toggleDetail(block.block_id)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>

                            {selectedId === block.block_id && (
                                <TableRow className="bg-muted/40 transition-all animate-in fade-in duration-200" key={`${block.block_id}-detail`}>
                                    <TableCell colSpan={7} className="relative p-4">
                                        {/* Nút đóng */}
                                        <button
                                            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                                            onClick={() => setSelectedId(null)}
                                        >
                                            <X className="w-4 h-4" />
                                        </button>

                                        <div className="text-xs space-y-1 pr-6">
                                            <p>
                                                <strong>Trạng thái:</strong> {block.step}
                                            </p>
                                            <p>
                                                <strong>Địa điểm:</strong> {block.location}
                                            </p>
                                            <p>
                                                <strong>Ghi chú:</strong> {block.note || "Không có"}
                                            </p>
                                            <p>
                                                <strong>Người dùng:</strong> {block.full_name}
                                            </p>
                                            <p>
                                                <strong>Hash:</strong>{" "}
                                                <code className="break-all">{block.hash}</code>
                                            </p>
                                            <p>
                                                <strong>Previous Hash:</strong>{" "}
                                                <code className="break-all">{block.previous_hash}</code>
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
