"use client"

import { useEffect, useState } from "react"
import { useExpenses } from "@/hooks/use-expenses"
import { useCategories } from "@/hooks/use-categories"
import { useSettings } from "@/components/settings-provider"
import { Badge } from "@/components/ui/badge"

export function RecentExpenses() {
  const { expenses } = useExpenses()
  const { categories } = useCategories()
  const { formatCurrency, formatDate } = useSettings()
  const [recentExpenses, setRecentExpenses] = useState<any[]>([])

  useEffect(() => {
    if (!expenses) return

    // Sort by date (newest first) and take the first 5
    const sorted = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

    setRecentExpenses(sorted)
  }, [expenses])

  const getCategoryName = (categoryId: string) => {
    const category = categories?.find((c) => c.id === categoryId)
    return category?.name || "Uncategorized"
  }

  const getCategoryColor = (categoryId: string) => {
    const category = categories?.find((c) => c.id === categoryId)
    return category?.color || "gray"
  }

  return (
    <div className="space-y-4">
      {recentExpenses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No recent expenses</p>
        </div>
      ) : (
        recentExpenses.map((expense, index) => (
          <div
            key={expense.id}
            className={`flex items-center justify-between py-3 ${
              index !== recentExpenses.length - 1 ? "border-b" : ""
            }`}
          >
            <div className="flex items-start space-x-3">
              <div
                className={`w-10 h-10 rounded-full bg-${getCategoryColor(expense.category)}-100 flex items-center justify-center text-${getCategoryColor(expense.category)}-700`}
              >
                {getCategoryName(expense.category).charAt(0)}
              </div>
              <div>
                <div className="font-medium">{expense.description}</div>
                <div className="text-xs text-muted-foreground flex items-center space-x-2">
                  <span>{formatDate(expense.date)}</span>
                  <span>•</span>
                  <Badge
                    variant="outline"
                    className={`text-xs bg-${getCategoryColor(expense.category)}-100 text-${getCategoryColor(expense.category)}-800 border-${getCategoryColor(expense.category)}-200`}
                  >
                    {getCategoryName(expense.category)}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="font-bold">{formatCurrency(expense.amount)}</div>
          </div>
        ))
      )}
    </div>
  )
}
