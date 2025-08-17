"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { BarChart3, IndianRupee, PieChart, Shield, Settings, FileText } from "lucide-react"

export function LandingPage() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <IndianRupee className="h-6 w-6" />
          <span>ExpenseTracker</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {user ? (
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Take Control of Your Finances
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Track your expenses, set budgets, and gain insights into your spending habits with our intuitive
                    expense tracker. Now with INR support!
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href={user ? "/dashboard" : "/register"}>{user ? "Go to Dashboard" : "Get Started"}</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href={user ? "/dashboard/add" : "/login"}>{user ? "Add Expense" : "Login"}</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full h-80 md:h-96 lg:h-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg opacity-20 blur-xl"></div>
                  <div className="relative bg-white dark:bg-gray-950 border rounded-lg shadow-lg p-6 h-full flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Monthly Summary</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Your spending at a glance</p>
                    </div>
                    <div className="h-40 w-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                      <BarChart3 className="h-24 w-24 text-gray-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Total Spent</p>
                        <p className="text-2xl font-bold">₹12,450</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Budget</p>
                        <p className="text-2xl font-bold">₹20,000</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Features</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Everything you need to manage your personal finances
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Expense Tracking</h3>
                <p className="text-sm text-gray-500 text-center dark:text-gray-400">
                  Log and categorize your expenses to keep track of where your money goes.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                  <PieChart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Visual Reports</h3>
                <p className="text-sm text-gray-500 text-center dark:text-gray-400">
                  See your spending patterns with intuitive charts and graphs.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Secure & Private</h3>
                <p className="text-sm text-gray-500 text-center dark:text-gray-400">
                  Your financial data stays on your device, ensuring maximum privacy.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                  <Settings className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Customizable</h3>
                <p className="text-sm text-gray-500 text-center dark:text-gray-400">
                  Personalize your experience with custom budgets, date formats, and more.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Detailed Reports</h3>
                <p className="text-sm text-gray-500 text-center dark:text-gray-400">
                  Generate comprehensive reports to analyze your spending habits over time.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                  <IndianRupee className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">INR Support</h3>
                <p className="text-sm text-gray-500 text-center dark:text-gray-400">
                  Built with Indian Rupee (₹) as the default currency for local expense tracking.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2023 ExpenseTracker. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
