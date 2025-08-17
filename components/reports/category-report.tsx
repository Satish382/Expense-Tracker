"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Expense } from "@/hooks/use-expenses"
import type { Category } from "@/hooks/use-categories"

interface CategoryReportProps {
  expenses: Expense[]
  categories: Category[]
  year: number
  formatCurrency: (amount: number) => string
}

export function CategoryReport({ expenses, categories, year, formatCurrency }: CategoryReportProps) {
  const [categoryData, setCategoryData] = useState<
    {
      id: string
      name: string
      color: string
      amount: number
      percentage: number
    }[]
  >([])
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    if (!expenses || !categories) return

    // Filter expenses for the selected year
    const yearlyExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getFullYear() === year
    })

    // Calculate total amount
    const total = yearlyExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    setTotalAmount(total)

    // Group by category
    const expensesByCategory: Record<string, number> = {}
    yearlyExpenses.forEach((expense) => {
      if (expensesByCategory[expense.category]) {
        expensesByCategory[expense.category] += expense.amount
      } else {
        expensesByCategory[expense.category] = expense.amount
      }
    })

    // Prepare category data
    const data = Object.entries(expensesByCategory).map(([categoryId, amount]) => {
      const category = categories.find((c) => c.id === categoryId)
      return {
        id: categoryId,
        name: category?.name || "Uncategorized",
        color: category?.color || "gray",
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
      }
    })

    // Sort by amount (highest first)
    data.sort((a, b) => b.amount - a.amount)

    setCategoryData(data)
  }, [expenses, categories, year])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Category Analysis</CardTitle>
          <CardDescription>Expense distribution by category for {year}</CardDescription>
        </CardHeader>
        <CardContent>
          {categoryData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No data available for this year</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-2xl font-bold">Total: {formatCurrency(totalAmount)}</div>

              <div className="space-y-4">
                {categoryData.map((category) => (
                  <div key={category.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full bg-${category.color}-500`}></div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{category.percentage.toFixed(1)}%</span>
                        <span className="font-bold">{formatCurrency(category.amount)}</span>
                      </div>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="pt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                {categoryData.slice(0, 6).map((category) => (
                  <Card key={category.id} className="bg-muted">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full bg-${category.color}-500`}></div>
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <div className="mt-2 text-lg font-bold">{formatCurrency(category.amount)}</div>
                      <div className="text-xs text-muted-foreground">{category.percentage.toFixed(1)}% of total</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
