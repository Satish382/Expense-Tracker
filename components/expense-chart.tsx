"use client"

import { useEffect, useState } from "react"
import { useExpenses } from "@/hooks/use-expenses"
import { useCategories } from "@/hooks/use-categories"
import { useSettings } from "@/components/settings-provider"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ExpenseChart() {
  const { expenses } = useExpenses()
  const { categories } = useCategories()
  const { formatCurrency } = useSettings()
  const [chartData, setChartData] = useState<any[]>([])
  const [period, setPeriod] = useState("week")

  useEffect(() => {
    if (!expenses || !categories) return

    // Get date range based on period
    const now = new Date()
    let startDate: Date

    if (period === "week") {
      startDate = new Date(now)
      startDate.setDate(now.getDate() - 7)
    } else if (period === "month") {
      startDate = new Date(now)
      startDate.setMonth(now.getMonth() - 1)
    } else {
      startDate = new Date(now)
      startDate.setMonth(now.getMonth() - 3)
    }

    // Filter expenses by date range
    const filteredExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= startDate && expenseDate <= now
    })

    // Group expenses by category
    const expensesByCategory: Record<string, number> = {}

    filteredExpenses.forEach((expense) => {
      if (expensesByCategory[expense.category]) {
        expensesByCategory[expense.category] += expense.amount
      } else {
        expensesByCategory[expense.category] = expense.amount
      }
    })

    // Prepare chart data
    const data = Object.entries(expensesByCategory).map(([categoryId, amount]) => {
      const category = categories.find((c) => c.id === categoryId)
      return {
        category: category?.name || "Uncategorized",
        amount,
        color: category?.color || "gray",
      }
    })

    // Sort by amount (descending)
    data.sort((a, b) => b.amount - a.amount)

    setChartData(data)
  }, [expenses, categories, period])

  // Calculate total amount
  const totalAmount = chartData.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="space-y-4">
      <Tabs value={period} onValueChange={setPeriod} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="quarter">Quarter</TabsTrigger>
        </TabsList>
      </Tabs>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No data available for this period</p>
        </div>
      ) : (
        <div className="relative h-[300px] w-full">
          <div className="absolute inset-0 flex items-end">
            {chartData.map((item, index) => {
              const percentage = (item.amount / totalAmount) * 100
              return (
                <div
                  key={index}
                  className="relative flex flex-col items-center justify-end h-full"
                  style={{ width: `${100 / chartData.length}%` }}
                >
                  <div
                    className={`w-full max-w-[50px] rounded-t-md bg-${item.color}-500`}
                    style={{ height: `${Math.max(percentage, 5)}%` }}
                  ></div>
                  <div className="mt-2 text-xs text-center truncate w-full px-1">{item.category}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {chartData.slice(0, 4).map((item, index) => (
          <Card key={index} className="p-3">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full bg-${item.color}-500`}></div>
              <span className="text-sm font-medium truncate">{item.category}</span>
            </div>
            <div className="mt-1 text-lg font-bold">{formatCurrency(item.amount)}</div>
            <div className="text-xs text-muted-foreground">{((item.amount / totalAmount) * 100).toFixed(1)}%</div>
          </Card>
        ))}
      </div>
    </div>
  )
}
