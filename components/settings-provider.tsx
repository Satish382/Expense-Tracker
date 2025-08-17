"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"

export type DateFormat = "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD"

export type Settings = {
  currency: string
  dateFormat: DateFormat
  monthlyBudget: number
  notificationsEnabled: boolean
  darkMode: boolean
  language: string
}

type SettingsContextType = {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
  formatCurrency: (amount: number) => string
  formatDate: (date: Date | string) => string
  exportData: () => void
  importData: (data: string) => boolean
}

const defaultSettings: Settings = {
  currency: "₹",
  dateFormat: "DD/MM/YYYY",
  monthlyBudget: 20000,
  notificationsEnabled: true,
  darkMode: false,
  language: "en",
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  // Load settings from local storage
  useEffect(() => {
    if (!user) return

    const storedSettings = localStorage.getItem(`settings-${user.id}`)
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings))
    } else {
      // Initialize with default settings
      localStorage.setItem(`settings-${user.id}`, JSON.stringify(defaultSettings))
    }
  }, [user])

  // Update settings
  const updateSettings = (newSettings: Partial<Settings>) => {
    if (!user) return

    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)
    localStorage.setItem(`settings-${user.id}`, JSON.stringify(updatedSettings))
  }

  // Format currency based on settings
  const formatCurrency = (amount: number) => {
    return `${settings.currency}${amount.toLocaleString("en-IN")}`
  }

  // Format date based on settings
  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date

    switch (settings.dateFormat) {
      case "DD/MM/YYYY":
        return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`
      case "MM/DD/YYYY":
        return `${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getDate().toString().padStart(2, "0")}/${d.getFullYear()}`
      case "YYYY-MM-DD":
        return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`
      default:
        return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`
    }
  }

  // Export all user data
  const exportData = () => {
    if (!user) return

    const userData = {
      expenses: JSON.parse(localStorage.getItem(`expenses-${user.id}`) || "[]"),
      categories: JSON.parse(localStorage.getItem(`categories-${user.id}`) || "[]"),
      settings: settings,
    }

    const dataStr = JSON.stringify(userData)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `expense-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  // Import user data
  const importData = (data: string) => {
    if (!user) return false

    try {
      const parsedData = JSON.parse(data)

      if (!parsedData.expenses || !parsedData.categories || !parsedData.settings) {
        return false
      }

      localStorage.setItem(`expenses-${user.id}`, JSON.stringify(parsedData.expenses))
      localStorage.setItem(`categories-${user.id}`, JSON.stringify(parsedData.categories))

      setSettings(parsedData.settings)
      localStorage.setItem(`settings-${user.id}`, JSON.stringify(parsedData.settings))

      return true
    } catch (error) {
      console.error("Error importing data:", error)
      return false
    }
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        formatCurrency,
        formatDate,
        exportData,
        importData,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
