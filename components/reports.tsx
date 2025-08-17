"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useSettings } from "@/components/settings-provider"
import { useExpenses } from "@/hooks/use-expenses"
import { useCategories } from "@/hooks/use-categories"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MonthlyReport } from "@/components/reports/monthly-report"
import { CategoryReport } from "@/components/reports/category-report"
import { TrendsReport } from "@/components/reports/trends-report"
import { Download, FileText, PieChart, TrendingUp } from "lucide-react"

export function Reports() {
  const { formatCurrency, formatDate } = useSettings()
  const { expenses } = useExpenses()
  const { categories } = useCategories()
  const [reportType, setReportType] = useState("monthly")
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString())

  const years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i
    return { value: year.toString(), label: year.toString() }
  })

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ]

  const handleExportReport = () => {
    // This would generate a PDF or CSV report in a real application
    alert("Report export functionality would be implemented here")
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <Button onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generate Reports</CardTitle>
            <CardDescription>View and analyze your expense data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={reportType} onValueChange={setReportType} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="monthly" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Monthly
                </TabsTrigger>
                <TabsTrigger value="category" className="flex items-center">
                  <PieChart className="mr-2 h-4 w-4" />
                  Category
                </TabsTrigger>
                <TabsTrigger value="trends" className="flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Trends
                </TabsTrigger>
              </TabsList>

              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="w-full sm:w-1/2">
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year.value} value={year.value}>
                          {year.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {reportType === "monthly" && (
                  <div className="w-full sm:w-1/2">
                    <Select value={month} onValueChange={setMonth}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <TabsContent value="monthly" className="mt-6">
                <MonthlyReport
                  expenses={expenses}
                  categories={categories}
                  year={Number.parseInt(year)}
                  month={Number.parseInt(month)}
                  formatCurrency={formatCurrency}
                  formatDate={formatDate}
                />
              </TabsContent>

              <TabsContent value="category" className="mt-6">
                <CategoryReport
                  expenses={expenses}
                  categories={categories}
                  year={Number.parseInt(year)}
                  formatCurrency={formatCurrency}
                />
              </TabsContent>

              <TabsContent value="trends" className="mt-6">
                <TrendsReport expenses={expenses} year={Number.parseInt(year)} formatCurrency={formatCurrency} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
