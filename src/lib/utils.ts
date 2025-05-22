import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getOrdersUserCanProcess(
  orders: any[],
  authorizedSteps: string[],
  supplyChainSteps: string[]
): any[] {
  const stepsBeforeAuthorized = authorizedSteps
    .map((step) => {
      const index = supplyChainSteps.indexOf(step)
      return index > 0 ? supplyChainSteps[index - 1] : null
    })
    .filter((step): step is string => step !== null)
  return orders.filter(order => stepsBeforeAuthorized.includes(order.status))
}

export function groupOrdersByStatus(orders: any[]): Record<string, number> {
  return orders.reduce((acc: Record<string, number>, order: any) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {})
}

