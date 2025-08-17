"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Expense } from "@/hooks/use-expenses"
import type { Category } from "@/hooks/use-categories"

interface MonthlyReportProps {
  expenses: Expense[]
  categories: Category[]
  year: number
  month: number
  formatCurrency: (amount: number) => string
  formatDate: (date: Date | string) => string
}

export function MonthlyReport({ expenses, categories, year, month, formatCurrency, formatDate }: MonthlyReportProps) {
  const [monthlyExpenses, setMonthlyExpenses] = useState<Expense[]>([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [categoryTotals, setCategoryTotals] = useState<{ id: string; name: string; amount: number; color: string }[]>(
    [],
  )

  useEffect(() => {
    if (!expenses || !categories) return

    // Filter expenses for the selected month and year
    const filtered = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getFullYear() === year && expenseDate.getMonth() + 1 === month
    })

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    setMonthlyExpenses(filtered)

    // Calculate total amount
    const total = filtered.reduce((sum, expense) => sum + expense.amount, 0)
    setTotalAmount(total)

    // Calculate category totals
    const catTotals: Record<string, number> = {}
    filtered.forEach((expense) => {
      if (catTotals[expense.category]) {
        catTotals[expense.category] += expense.amount
      } else {
        catTotals[expense.category] = expense.amount
      }
    })

    const catTotalsArray = Object.entries(catTotals).map(([id, amount]) => {
      const category = categories.find((c) => c.id === id)
      return {
        id,
        name: category?.name || "Uncategorized",
        amount,
        color: category?.color || "gray",
      }
    })

    // Sort by amount (highest first)
    catTotalsArray.sort((a, b) => b.amount - a.amount)

    setCategoryTotals(catTotalsArray)
  }, [expenses, categories, year, month])

  const getCategoryName = (categoryId: string) => {
    const category = categories?.find((c) => c.id === categoryId)
    return category?.name || "Uncategorized"
  }

  const getCategoryColor = (categoryId: string) => {
    const category = categories?.find((c) => c.id === categoryId)
    return category?.color || "gray"
  }

  const getMonthName = (monthNum: number) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return monthNames[monthNum - 1]
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Expenses</CardTitle>
            <CardDescription>
              {getMonthName(month)} {year}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(totalAmount)}</div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Expenses by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryTotals.map((category) => (
                <div key={category.id} className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full bg-${category.color}-500`}></div>
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <span className="font-bold">{formatCurrency(category.amount)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Details</CardTitle>
          <CardDescription>
            All expenses for {getMonthName(month)} {year}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {monthlyExpenses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No expenses found for this period</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{formatDate(expense.date)}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`bg-${getCategoryColor(expense.category)}-100 text-${getCategoryColor(expense.category)}-800 border-${getCategoryColor(expense.category)}-200`}
                      >
                        {getCategoryName(expense.category)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="font-bold text-right">
                    Total
                  </TableCell>
                  <TableCell className="font-bold text-right">{formatCurrency(totalAmount)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
