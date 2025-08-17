"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"

export type Expense = {
  id: string
  description: string
  amount: number
  category: string
  date: string
  notes?: string
}

type NewExpense = Omit<Expense, "id">

export function useExpenses() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load expenses from local storage
  useEffect(() => {
    if (!user) return

    setIsLoading(true)

    try {
      const storedExpenses = localStorage.getItem(`expenses-${user.id}`)
      if (storedExpenses) {
        setExpenses(JSON.parse(storedExpenses))
      } else {
        // Initialize with sample data if no expenses exist
        const sampleExpenses = getSampleExpenses()
        setExpenses(sampleExpenses)
        localStorage.setItem(`expenses-${user.id}`, JSON.stringify(sampleExpenses))
      }
    } catch (error) {
      console.error("Error loading expenses:", error)
    }

    setIsLoading(false)
  }, [user])

  // Save expenses to local storage whenever they change
  useEffect(() => {
    if (!user || isLoading) return

    try {
      localStorage.setItem(`expenses-${user.id}`, JSON.stringify(expenses))
    } catch (error) {
      console.error("Error saving expenses:", error)
    }
  }, [expenses, user, isLoading])

  // Add a new expense
  const addExpense = (newExpense: NewExpense) => {
    const expense: Expense = {
      ...newExpense,
      id: crypto.randomUUID(),
    }

    setExpenses((prev) => [...prev, expense])
  }

  // Update an existing expense
  const updateExpense = (id: string, updatedExpense: Partial<Expense>) => {
    setExpenses((prev) => prev.map((expense) => (expense.id === id ? { ...expense, ...updatedExpense } : expense)))
  }

  // Delete an expense
  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id))
  }

  return {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    isLoading,
  }
}

// Generate sample expenses for new users
function getSampleExpenses(): Expense[] {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const lastWeek = new Date(today)
  lastWeek.setDate(lastWeek.getDate() - 7)

  const lastMonth = new Date(today)
  lastMonth.setMonth(lastMonth.getMonth() - 1)

  return [
    {
      id: crypto.randomUUID(),
      description: "Grocery shopping",
      amount: 2575,
      category: "food",
      date: yesterday.toISOString(),
      notes: "Weekly grocery run",
    },
    {
      id: crypto.randomUUID(),
      description: "Electricity bill",
      amount: 1850,
      category: "utilities",
      date: lastWeek.toISOString(),
    },
    {
      id: crypto.randomUUID(),
      description: "Movie tickets",
      amount: 600,
      category: "entertainment",
      date: today.toISOString(),
      notes: "Weekend movie with friends",
    },
    {
      id: crypto.randomUUID(),
      description: "Petrol",
      amount: 1200,
      category: "transportation",
      date: yesterday.toISOString(),
    },
    {
      id: crypto.randomUUID(),
      description: "Dinner at restaurant",
      amount: 1450,
      category: "food",
      date: lastWeek.toISOString(),
      notes: "Anniversary dinner",
    },
    {
      id: crypto.randomUUID(),
      description: "Internet subscription",
      amount: 999,
      category: "utilities",
      date: lastMonth.toISOString(),
    },
    {
      id: crypto.randomUUID(),
      description: "Mobile recharge",
      amount: 499,
      category: "utilities",
      date: lastWeek.toISOString(),
    },
    {
      id: crypto.randomUUID(),
      description: "Clothes shopping",
      amount: 3200,
      category: "shopping",
      date: lastMonth.toISOString(),
    },
  ]
}
