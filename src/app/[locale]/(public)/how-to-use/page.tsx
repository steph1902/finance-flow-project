"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  DollarSign,
  Wallet,
  Target,
  Sparkles,
  ChevronRight,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  MessageSquare,
  Zap,
} from "lucide-react";
import Link from "next/link";

const guides = [
  {
    id: "dashboard",
    title: "Dashboard Overview",
    icon: LayoutDashboard,
    content: (
      <div className="space-y-6">
        <p className="text-neutral-600 leading-relaxed">
          Your dashboard is the command center of your financial life. It
          provides a real-time snapshot of your income, expenses, and savings
          rate.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-neutral-50 border-neutral-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                Net Worth Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-500">
                Monitor your total balance across all accounts. The chart shows
                your financial growth over time.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-neutral-50 border-neutral-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-500">
                Use the "New Transaction" button for instant entry, or "Add
                Budget" to set spending limits.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: "transactions",
    title: "Managing Transactions",
    icon: DollarSign,
    content: (
      <div className="space-y-6">
        <p className="text-neutral-600 leading-relaxed">
          Keep your records accurate by logging every expense and income source.
          FinanceFlow makes this easy and intelligent.
        </p>
        <ul className="space-y-4">
          <li className="flex gap-3">
            <div className="bg-blue-100 p-2 rounded-full h-fit">
              <Search className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-neutral-900">Search & Filter</h4>
              <p className="text-sm text-neutral-500 mt-1">
                Easily find past transactions by keywords, date range, or
                category using the advanced filters.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <div className="bg-purple-100 p-2 rounded-full h-fit">
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-neutral-900">
                AI Categorization
              </h4>
              <p className="text-sm text-neutral-500 mt-1">
                Our AI automatically suggests categories based on your
                description. Just type "Coffee at Starbucks" and we'll tag it as
                "Food & Dining".
              </p>
            </div>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "budgets",
    title: "Smart Budgeting",
    icon: Wallet,
    content: (
      <div className="space-y-6">
        <p className="text-neutral-600 leading-relaxed">
          Stop overspending with dynamic budgets that adapt to your lifestyle.
        </p>
        <div className="space-y-4">
          <div className="border-l-4 border-emerald-500 pl-4 py-1">
            <h4 className="font-medium text-neutral-900">Category Budgets</h4>
            <p className="text-sm text-neutral-500 mt-1">
              Set limits for specific categories like "Groceries" or
              "Entertainment". We'll alert you when you're close to the limit.
            </p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4 py-1">
            <h4 className="font-medium text-neutral-900">Rollover Feature</h4>
            <p className="text-sm text-neutral-500 mt-1">
              Enable "Rollover" to carry forward unused budget to the next
              month, rewarding you for saving.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "ai-features",
    title: "AI Assistant",
    icon: Sparkles,
    content: (
      <div className="space-y-6">
        <p className="text-neutral-600 leading-relaxed">
          FinanceFlow isn't just a tracker; it's a financial advisor in your
          pocket.
        </p>
        <div className="grid gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-500" />
                Chat with Your Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-500 mb-3">
                Ask questions like:
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-neutral-100 rounded-md text-xs font-medium text-neutral-600">
                  "How much did I spend on Uber last month?"
                </span>
                <span className="px-2 py-1 bg-neutral-100 rounded-md text-xs font-medium text-neutral-600">
                  "Can I afford a vacation?"
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="w-4 h-4 text-rose-500" />
                Financial Health Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-500">
                Get a comprehensive analysis of your financial wellness based on
                the "Big 4" audit methodology, tailored for personal finance.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    ),
  },
];

export default function HowToUsePage() {
  const [activeSection, setActiveSection] = useState(guides[0].id);

  return (
    <div className="min-h-screen bg-[#FBFBFB]">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 mb-4 font-serif">
            Master Your Finances
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            A complete guide to getting the most out of FinanceFlow's powerful
            features.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8 lg:gap-12">
          {/* Sidebar Navigation */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="sticky top-24 space-y-1">
              {guides.map((guide) => (
                <button
                  key={guide.id}
                  onClick={() => setActiveSection(guide.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeSection === guide.id
                      ? "bg-white shadow-sm text-neutral-900 font-medium ring-1 ring-neutral-200"
                      : "text-neutral-500 hover:bg-white/50 hover:text-neutral-900"
                  }`}
                >
                  <guide.icon
                    className={`w-5 h-5 ${activeSection === guide.id ? "text-neutral-900" : "text-neutral-400"}`}
                  />
                  {guide.title}
                  {activeSection === guide.id && (
                    <ChevronRight className="w-4 h-4 ml-auto text-neutral-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="md:col-span-8 lg:col-span-9">
            {guides.map(
              (guide) =>
                activeSection === guide.id && (
                  <motion.div
                    key={guide.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-none shadow-soft overflow-hidden">
                      <div className="h-32 bg-gradient-to-r from-neutral-900 to-neutral-800 relative flex items-center px-8">
                        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                        <div className="relative z-10 flex items-center gap-4 text-white">
                          <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                            <guide.icon className="w-8 h-8" />
                          </div>
                          <h2 className="text-2xl font-semibold">
                            {guide.title}
                          </h2>
                        </div>
                      </div>
                      <CardContent className="p-8">{guide.content}</CardContent>
                    </Card>

                    <div className="mt-8 flex justify-end">
                      <Button asChild className="rounded-full">
                        <Link href="/dashboard">
                          Go to Dashboard{" "}
                          <ArrowUpRight className="ml-2 w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
