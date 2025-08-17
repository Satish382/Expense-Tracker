"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useSettings } from "@/components/settings-provider"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExpenseChart } from "@/components/expense-chart"
import { RecentExpenses } from "@/components/recent-expenses"
import { ExpenseSummary } from "@/components/expense-summary"
import { useExpenses } from "@/hooks/use-expenses"
import { ArrowDownIcon, ArrowUpIcon, IndianRupee, CreditCard, Calendar } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function Dashboard() {
  const { user } = useAuth()
  const { expenses, isLoading } = useExpenses()
  const { settings, formatCurrency } = useSettings()
  const [totalSpent, setTotalSpent] = useState(0)
  const [monthlySpent, setMonthlySpent] = useState(0)
  const [weeklySpent, setWeeklySpent] = useState(0)
  const [budgetPercentage, setBudgetPercentage] = useState(0)

  useEffect(() => {
    if (!expenses) return

    // Calculate total spent
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    setTotalSpent(total)

    // Calculate monthly spent (current month)
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const monthlyExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
    })

    const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    setMonthlySpent(monthlyTotal)

    // Calculate budget percentage
    const percentage = (monthlyTotal / settings.monthlyBudget) * 100
    setBudgetPercentage(Math.min(percentage, 100))

    // Calculate weekly spent (last 7 days)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const weeklyExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= oneWeekAgo
    })

    setWeeklySpent(weeklyExpenses.reduce((sum, expense) => sum + expense.amount, 0))
  }, [expenses, settings.monthlyBudget])

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
                  <p className="text-xs text-muted-foreground">All time expenses</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(monthlySpent)}</div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Budget: {formatCurrency(settings.monthlyBudget)}</span>
                      <span>{budgetPercentage.toFixed(0)}%</span>
                    </div>
                    <Progress value={budgetPercentage} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Weekly Expenses</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(weeklySpent)}</div>
                  <p className="text-xs text-muted-foreground">Last 7 days</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
                  {monthlySpent > settings.monthlyBudget ? (
                    <ArrowUpIcon className="h-4 w-4 text-red-500" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-green-500" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {monthlySpent > settings.monthlyBudget ? (
                      <span className="text-red-500">Over Budget</span>
                    ) : (
                      <span className="text-green-500">Under Budget</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {monthlySpent > settings.monthlyBudget ? (
                      <span className="text-red-500">{formatCurrency(monthlySpent - settings.monthlyBudget)} over</span>
                    ) : (
                      <span className="text-green-500">
                        {formatCurrency(settings.monthlyBudget - monthlySpent)} remaining
                      </span>
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Expense Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ExpenseChart />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Expenses</CardTitle>
                  <CardDescription>Your latest transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentExpenses />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <ExpenseSummary />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
