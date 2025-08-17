"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"

export type Category = {
  id: string
  name: string
  color: string
}

type NewCategory = Omit<Category, "id">

export function useCategories() {
  const { user } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load categories from local storage
  useEffect(() => {
    if (!user) return

    setIsLoading(true)

    try {
      const storedCategories = localStorage.getItem(`categories-${user.id}`)
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories))
      } else {
        // Initialize with default categories if none exist
        const defaultCategories = getDefaultCategories()
        setCategories(defaultCategories)
        localStorage.setItem(`categories-${user.id}`, JSON.stringify(defaultCategories))
      }
    } catch (error) {
      console.error("Error loading categories:", error)
    }

    setIsLoading(false)
  }, [user])

  // Save categories to local storage whenever they change
  useEffect(() => {
    if (!user || isLoading) return

    try {
      localStorage.setItem(`categories-${user.id}`, JSON.stringify(categories))
    } catch (error) {
      console.error("Error saving categories:", error)
    }
  }, [categories, user, isLoading])

  // Add a new category
  const addCategory = (newCategory: NewCategory) => {
    const category: Category = {
      ...newCategory,
      id: crypto.randomUUID(),
    }

    setCategories((prev) => [...prev, category])
  }

  // Update an existing category
  const updateCategory = (id: string, updatedCategory: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((category) => (category.id === id ? { ...category, ...updatedCategory } : category)),
    )
  }

  // Delete a category
  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((category) => category.id !== id))
  }

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    isLoading,
  }
}

// Default categories for new users
function getDefaultCategories(): Category[] {
  return [
    {
      id: "food",
      name: "Food & Dining",
      color: "green",
    },
    {
      id: "transportation",
      name: "Transportation",
      color: "blue",
    },
    {
      id: "utilities",
      name: "Utilities",
      color: "purple",
    },
    {
      id: "entertainment",
      name: "Entertainment",
      color: "pink",
    },
    {
      id: "shopping",
      name: "Shopping",
      color: "orange",
    },
    {
      id: "health",
      name: "Health & Medical",
      color: "red",
    },
    {
      id: "education",
      name: "Education",
      color: "yellow",
    },
    {
      id: "travel",
      name: "Travel",
      color: "teal",
    },
  ]
}
