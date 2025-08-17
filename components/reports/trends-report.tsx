"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Expense } from "@/hooks/use-expenses"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

interface TrendsReportProps {
  expenses: Expense[]
  year: number
  formatCurrency: (amount: number) => string
}

export function TrendsReport({ expenses, year, formatCurrency }: TrendsReportProps) {
  const [monthlyData, setMonthlyData] = useState<
    {
      month: number
      name: string
      amount: number
      change: number
      isIncrease: boolean
    }[]
  >([])

  useEffect(() => {
    if (!expenses) return

    // Filter expenses for the selected year
    const yearlyExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getFullYear() === year
    })

    // Group by month
    const expensesByMonth: Record<number, number> = {}

    // Initialize all months with 0
    for (let i = 0; i < 12; i++) {
      expensesByMonth[i] = 0
    }

    // Sum expenses by month
    yearlyExpenses.forEach((expense) => {
      const expenseDate = new Date(expense.date)
      const month = expenseDate.getMonth()
      expensesByMonth[month] += expense.amount
    })

    // Prepare monthly data
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

    const data = Object.entries(expensesByMonth).map(([monthStr, amount]) => {
      const month = Number.parseInt(monthStr)
      const prevMonth = month > 0 ? month - 1 : 11
      const prevMonthAmount = expensesByMonth[prevMonth] || 0

      let change = 0
      if (prevMonthAmount > 0) {
        change = ((amount - prevMonthAmount) / prevMonthAmount) * 100
      }

      return {
        month,
        name: monthNames[month],
        amount,
        change: isNaN(change) ? 0 : change,
        isIncrease: amount > prevMonthAmount,
      }
    })

    setMonthlyData(data)
  }, [expenses, year])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
          <CardDescription>Expense trends by month for {year}</CardDescription>
        </CardHeader>
        <CardContent>
          {monthlyData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No data available for this year</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative h-[300px] w-full">
                <div className="absolute inset-0 flex items-end">
                  {monthlyData.map((item) => {
                    const maxAmount = Math.max(...monthlyData.map((d) => d.amount))
                    const percentage = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0

                    return (
                      <div
                        key={item.month}
                        className="relative flex flex-col items-center justify-end h-full"
                        style={{ width: `${100 / monthlyData.length}%` }}
                      >
                        <div
                          className={`w-full max-w-[40px] rounded-t-md ${
                            item.amount > 0 ? "bg-green-500" : "bg-gray-300"
                          }`}
                          style={{ height: `${Math.max(percentage, 5)}%` }}
                        ></div>
                        <div className="mt-2 text-xs text-center truncate w-full px-1">{item.name.substring(0, 3)}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {monthlyData.map((item) => (
                  <Card key={item.month} className="bg-muted">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.name}</span>
                        {item.change !== 0 && (
                          <div
                            className={`flex items-center text-xs ${
                              item.isIncrease ? "text-red-500" : "text-green-500"
                            }`}
                          >
                            {item.isIncrease ? (
                              <ArrowUpIcon className="h-3 w-3 mr-1" />
                            ) : (
                              <ArrowDownIcon className="h-3 w-3 mr-1" />
                            )}
                            {Math.abs(item.change).toFixed(1)}%
                          </div>
                        )}
                      </div>
                      <div className="mt-2 text-lg font-bold">{formatCurrency(item.amount)}</div>
                      {item.change !== 0 && (
                        <div className="text-xs text-muted-foreground">
                          {item.isIncrease ? "Increased" : "Decreased"} from previous month
                        </div>
                      )}
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
