"use client"

import { useEffect, useState } from "react"
import { useExpenses } from "@/hooks/use-expenses"
import { useCategories } from "@/hooks/use-categories"
import { useSettings } from "@/components/settings-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

export function ExpenseSummary() {
  const { expenses } = useExpenses()
  const { categories } = useCategories()
  const { formatCurrency } = useSettings()
  const [period, setPeriod] = useState("month")
  const [summaryData, setSummaryData] = useState<any>({
    total: 0,
    categories: [],
    comparison: 0,
  })

  useEffect(() => {
    if (!expenses || !categories) return

    // Get date range based on period
    const now = new Date()
    let currentPeriodStart: Date
    let previousPeriodStart: Date
    let previousPeriodEnd: Date

    if (period === "week") {
      currentPeriodStart = new Date(now)
      currentPeriodStart.setDate(now.getDate() - 7)

      previousPeriodEnd = new Date(currentPeriodStart)
      previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1)

      previousPeriodStart = new Date(previousPeriodEnd)
      previousPeriodStart.setDate(previousPeriodStart.getDate() - 7)
    } else if (period === "month") {
      currentPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1)

      previousPeriodEnd = new Date(currentPeriodStart)
      previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1)

      previousPeriodStart = new Date(previousPeriodEnd.getFullYear(), previousPeriodEnd.getMonth(), 1)
    } else {
      // year
      currentPeriodStart = new Date(now.getFullYear(), 0, 1)

      previousPeriodEnd = new Date(currentPeriodStart)
      previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1)

      previousPeriodStart = new Date(previousPeriodEnd.getFullYear(), 0, 1)
    }

    // Filter expenses for current period
    const currentPeriodExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= currentPeriodStart && expenseDate <= now
    })

    // Filter expenses for previous period
    const previousPeriodExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= previousPeriodStart && expenseDate <= previousPeriodEnd
    })

    // Calculate totals
    const currentTotal = currentPeriodExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const previousTotal = previousPeriodExpenses.reduce((sum, expense) => sum + expense.amount, 0)

    // Calculate comparison percentage
    let comparisonPercentage = 0
    if (previousTotal > 0) {
      comparisonPercentage = ((currentTotal - previousTotal) / previousTotal) * 100
    }

    // Group current period expenses by category
    const expensesByCategory: Record<string, number> = {}

    currentPeriodExpenses.forEach((expense) => {
      if (expensesByCategory[expense.category]) {
        expensesByCategory[expense.category] += expense.amount
      } else {
        expensesByCategory[expense.category] = expense.amount
      }
    })

    // Prepare category data
    const categoryData = Object.entries(expensesByCategory).map(([categoryId, amount]) => {
      const category = categories.find((c) => c.id === categoryId)
      return {
        id: categoryId,
        name: category?.name || "Uncategorized",
        amount,
        color: category?.color || "gray",
        percentage: (amount / currentTotal) * 100,
      }
    })

    // Sort by amount (descending)
    categoryData.sort((a, b) => b.amount - a.amount)

    setSummaryData({
      total: currentTotal,
      categories: categoryData,
      comparison: comparisonPercentage,
    })
  }, [expenses, categories, period])

  const getPeriodLabel = () => {
    if (period === "week") return "This Week"
    if (period === "month") return "This Month"
    return "This Year"
  }

  return (
    <div className="space-y-4">
      <Tabs value={period} onValueChange={setPeriod} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="year">Year</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
            <CardDescription>{getPeriodLabel()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(summaryData.total)}</div>
            {summaryData.comparison !== 0 && (
              <div className="mt-2 flex items-center text-sm">
                {summaryData.comparison > 0 ? (
                  <div className="text-red-500 flex items-center">
                    <ArrowUpIcon className="mr-1 h-4 w-4" />
                    {Math.abs(summaryData.comparison).toFixed(1)}% higher than previous period
                  </div>
                ) : (
                  <div className="text-green-500 flex items-center">
                    <ArrowDownIcon className="mr-1 h-4 w-4" />
                    {Math.abs(summaryData.comparison).toFixed(1)}% lower than previous period
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>By category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summaryData.categories.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              ) : (
                summaryData.categories.map((category: any) => (
                  <div key={category.id} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full bg-${category.color}-500 mr-2`}></div>
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-sm font-medium">{category.name}</span>
                      <span className="text-sm">{formatCurrency(category.amount)}</span>
                    </div>
                    <div className="w-16 text-right text-xs text-muted-foreground">
                      {category.percentage.toFixed(1)}%
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Spending Trends</CardTitle>
          <CardDescription>Expense distribution over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Spending trends visualization would appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
