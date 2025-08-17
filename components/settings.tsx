"use client"

import type React from "react"

import { useState, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useSettings, type DateFormat } from "@/components/settings-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { IndianRupee, DollarSign, Euro, Download, Upload, Save, AlertTriangle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function Settings() {
  const { settings, updateSettings, exportData, importData } = useSettings()
  const { toast } = useToast()
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formState, setFormState] = useState({
    currency: settings.currency,
    dateFormat: settings.dateFormat,
    monthlyBudget: settings.monthlyBudget,
    notificationsEnabled: settings.notificationsEnabled,
    darkMode: settings.darkMode,
    language: settings.language,
  })

  const handleSaveSettings = () => {
    updateSettings(formState)
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully",
    })
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      try {
        const success = importData(content)
        if (success) {
          toast({
            title: "Import successful",
            description: "Your data has been imported successfully",
          })
          // Update form state with new settings
          setFormState({
            currency: settings.currency,
            dateFormat: settings.dateFormat,
            monthlyBudget: settings.monthlyBudget,
            notificationsEnabled: settings.notificationsEnabled,
            darkMode: settings.darkMode,
            language: settings.language,
          })
          setIsImportDialogOpen(false)
        } else {
          toast({
            title: "Import failed",
            description: "The file format is invalid",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Import failed",
          description: "An error occurred while importing the data",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  const currencies = [
    { symbol: "₹", name: "Indian Rupee (INR)" },
    { symbol: "$", name: "US Dollar (USD)" },
    { symbol: "€", name: "Euro (EUR)" },
    { symbol: "£", name: "British Pound (GBP)" },
  ]

  const dateFormats = [
    { value: "DD/MM/YYYY" as DateFormat, name: "DD/MM/YYYY (31/12/2023)" },
    { value: "MM/DD/YYYY" as DateFormat, name: "MM/DD/YYYY (12/31/2023)" },
    { value: "YYYY-MM-DD" as DateFormat, name: "YYYY-MM-DD (2023-12-31)" },
  ]

  const languages = [
    { value: "en", name: "English" },
    { value: "hi", name: "Hindi" },
    { value: "ta", name: "Tamil" },
    { value: "te", name: "Telugu" },
  ]

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <Button onClick={handleSaveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Currency & Budget</CardTitle>
                <CardDescription>Configure your currency and monthly budget</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formState.currency}
                    onValueChange={(value) => setFormState({ ...formState, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.symbol} value={currency.symbol}>
                          <div className="flex items-center">
                            {currency.symbol === "₹" && <IndianRupee className="mr-2 h-4 w-4" />}
                            {currency.symbol === "$" && <DollarSign className="mr-2 h-4 w-4" />}
                            {currency.symbol === "€" && <Euro className="mr-2 h-4 w-4" />}
                            {currency.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Monthly Budget</Label>
                  <div className="flex items-center">
                    <span className="bg-muted px-3 py-2 border border-r-0 rounded-l-md">{formState.currency}</span>
                    <Input
                      id="budget"
                      type="number"
                      className="rounded-l-none"
                      value={formState.monthlyBudget}
                      onChange={(e) => setFormState({ ...formState, monthlyBudget: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select
                    value={formState.dateFormat}
                    onValueChange={(value) => setFormState({ ...formState, dateFormat: value as DateFormat })}
                  >
                    <SelectTrigger id="date-format">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      {dateFormats.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={formState.language}
                    onValueChange={(value) => setFormState({ ...formState, language: value })}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language.value} value={language.value}>
                          {language.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configure your notification preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about budget alerts and reminders
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={formState.notificationsEnabled}
                    onCheckedChange={(checked) => setFormState({ ...formState, notificationsEnabled: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Customize the appearance of the application</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Switch between light and dark theme</p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={formState.darkMode}
                    onCheckedChange={(checked) => setFormState({ ...formState, darkMode: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Export and import your expense data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Button variant="outline" onClick={exportData} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>

                  <Button variant="outline" onClick={() => setIsImportDialogOpen(true)} className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Import Data
                  </Button>
                </div>

                <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileChange} />

                <AlertDialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Import Data</AlertDialogTitle>
                      <AlertDialogDescription>
                        Importing data will replace your current expenses, categories, and settings. This action cannot
                        be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex items-center gap-2 py-2 text-amber-500">
                      <AlertTriangle className="h-5 w-5" />
                      <p className="text-sm font-medium">Make sure to export your current data first as a backup.</p>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleImportClick}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
